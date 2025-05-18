import type { Group } from "./Group";
import type { Expense } from "./Expense";
import type { UserWithBalance } from "./UserWithBalance.ts";
import type { Refund } from "./Refund";

export type GroupExtended = Group & {
    owner: UserWithBalance;
    members: UserWithBalance[];
    expenses: Expense[];
    financeSummary: FinanceSummary;
    refunds: Refund[];
    
};

export type FinanceSummary = {
    groupBalance: number;
    currentUserBalance: number;
    needToPay: Transaction[];
    needToReceive: Transaction[];
    totalUsersInGroupHistory: number;
};

export type Transaction = {
    fromUserId: any;
    fromUserName: any;
    toUserId: any;
    toUserName: any;
    price: any;
    currency: string;
};
