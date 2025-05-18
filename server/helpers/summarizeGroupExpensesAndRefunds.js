

const getSummary = (extendedGroup) => {
    const deletedIds = [];
    const pastUsersSummary  = {
        deletedCount: 0,
        spent: 0,
        received: 0,
    }
    const summaryByMemberId = {};
    extendedGroup.members.forEach((member) => {
        summaryByMemberId[member.id] = {
            memberId: member.id,
            memberName: member.username,
            spent: 0,
            received: 0
        }
    });

    let totalMoneySpent = 0;
    let totalMoneyRefund = 0;

    extendedGroup.expenses.forEach((e) => {
        const price = parseFloat(e.price)
        totalMoneySpent += price;
        const memberExists = e.payed_by_user_id in summaryByMemberId;
        if (memberExists) {
            summaryByMemberId[e.payed_by_user_id].spent += price;
        }
        else {
            pastUsersSummary.spent += price;
            if (!deletedIds.find(i => i == e.payed_by_user_id)) {
                deletedIds.push(e.payed_by_user_id);
                pastUsersSummary.deletedCount += 1;
            }
        }
        
    });

    extendedGroup.refunds.forEach((e) => {
        const price = parseFloat(e.price)
        totalMoneyRefund += price;

        const payingMemberExists = e.payed_by_user_id in summaryByMemberId;
        if (payingMemberExists) {
            summaryByMemberId[e.payed_by_user_id].spent += price;
            
        }
        else {
            pastUsersSummary.spent += price;
            if (!deletedIds.find(i => i == e.payed_by_user_id)) {
                deletedIds.push(e.payed_by_user_id);
                pastUsersSummary.deletedCount += 1;
            }
        }

        const receivingMemberExists = e.received_by_user_id in summaryByMemberId;
        if (receivingMemberExists) {
            summaryByMemberId[e.received_by_user_id].received += price;
            
        }
        else {
            pastUsersSummary.received += price;
            if (!deletedIds.find(i => i == e.payed_by_user_id)) {
                deletedIds.push(e.payed_by_user_id);
                pastUsersSummary.deletedCount += 1;
            }
        }
    });

    const totalMembers = extendedGroup.members.length + pastUsersSummary.deletedCount;
    const priceForMember = totalMembers ? totalMoneySpent / totalMembers : 0;

    Object.keys(summaryByMemberId).forEach((memberId) => {
        const memberSummary = summaryByMemberId[memberId];
        memberSummary.userOwed = memberSummary.spent - memberSummary.received - priceForMember;
    });
    return {
        summaryByMemberId,
        groupBalance: totalMoneyRefund - totalMoneySpent + priceForMember,
        totalUsersInGroupHistory: totalMembers
    }
}

const convertToArray = (summaryByMemberId) => {
    // Sorty by user owed, than by name to keep order persistent between executions
    return Object.values(summaryByMemberId).sort((a, b) => {
        if (b.userOwed !== a.userOwed) {
          return b.userOwed - a.userOwed; // Descending by userOwned
        }
        return a.memberId - b.memberId; // Ascending by userId
      });
}

const enrichMembersWithBalanace = (extendedGroup, summaryByMemberId) => {
    extendedGroup.members.forEach((member) => {
        member.balance = summaryByMemberId[member.id]?.userOwed || 0;
    });
}


export const summarizeGroupExpensesAndRefunds = (extendedGroup, currentUserId) => {
    const {summaryByMemberId, groupBalance, totalUsersInGroupHistory} = getSummary(extendedGroup);
    const currentUserSummary = {...summaryByMemberId[currentUserId]};
    enrichMembersWithBalanace(extendedGroup, summaryByMemberId);

    const orderedSummaries = convertToArray(summaryByMemberId);
    const requiredPayments = [];
    let lastUsedLatestIndex = orderedSummaries.length - 1;

    for (let userIndex = 0; userIndex < orderedSummaries.length; userIndex++) {
        const currentSummary = orderedSummaries[userIndex];

        if (currentSummary.userOwed == 0) break;

        while (currentSummary.userOwed > 0) {
            const summaryOfUserThatMaybeOwesMoney = orderedSummaries[lastUsedLatestIndex];
            if (summaryOfUserThatMaybeOwesMoney.userOwed < 0) {
                if (summaryOfUserThatMaybeOwesMoney.userOwed + currentSummary.userOwed < 0) {
                    requiredPayments.push({
                        fromUserId: summaryOfUserThatMaybeOwesMoney.memberId,
                        fromUserName: summaryOfUserThatMaybeOwesMoney.memberName,
                        toUserId: currentSummary.memberId,
                        toUserName: currentSummary.memberName,
                        price: currentSummary.userOwed,
                        currency: 'USD'
                    });
                    summaryOfUserThatMaybeOwesMoney.userOwed += currentSummary.userOwed;
                    currentSummary.userOwed = 0;
                }
                else {
                    requiredPayments.push({
                        fromUserId: summaryOfUserThatMaybeOwesMoney.memberId,
                        fromUserName: summaryOfUserThatMaybeOwesMoney.memberName,
                        toUserId: currentSummary.memberId,
                        toUserName: currentSummary.memberName,
                        price: -summaryOfUserThatMaybeOwesMoney.userOwed,
                        currency: 'USD'
                    });
                    currentSummary.userOwed += summaryOfUserThatMaybeOwesMoney.userOwed;
                    summaryOfUserThatMaybeOwesMoney.userOwed = 0;
                    lastUsedLatestIndex --;
                    if (lastUsedLatestIndex < 0) {
                        console.error(`Unable to resolve payments for group: ${extendedGroup.id}`)
                        break;
                    }
                }
            }
        }
    }

    return {
        totalUsersInGroupHistory,
        groupBalance,
        currentUserBalance: currentUserSummary.userOwed,
        needToPay: requiredPayments.filter((p) => p.fromUserId == currentUserId),
        needToReceive: requiredPayments.filter((p) => p.toUserId == currentUserId),
    }
}