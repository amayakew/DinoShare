import { List, Box, Typography, ListItem} from "@mui/material";
import AddExpensesModal from "./AddExpensesModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useParams } from "react-router-dom";
import { isExpense, type Expense } from "../../models/Expense";
import type { Refund } from "../../models/Refund";
import ExpenseItem from "./ExpenseItem";
import { isRefund } from "../../models/Refund";
import RefundItem from "./RefundItem";
import SettleUpModal from "./SettleUpModal";


const ExpensesDetailsForGroup = () => {
    const {groups} = useSelector((state: RootState) => state.groups);
    const {user} = useSelector((state: RootState) => state.users);
    const { id } = useParams<{ id: string }>();
    const selectedGroup = groups?.find(group => group.id == Number(id));
    const totalMembers = selectedGroup?.financeSummary?.totalUsersInGroupHistory
    
    const groupExpenses = selectedGroup?.expenses || [];
    const groupRefunds = selectedGroup?.refunds || [];
    const transactionsHistory: (Expense | Refund)[] = [...groupExpenses, ...groupRefunds].sort((a,b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
   

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'center', gap: 1}}>
                <AddExpensesModal groupId={selectedGroup?.id}/>
                <SettleUpModal selectedGroup={selectedGroup}/>   
            </Box>
            <List sx={{bgcolor: 'background.paper', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center'}}>
                {transactionsHistory?.map(transaction => {
                    const createExpenseDate = transaction.created_at;
                    const month: string = createExpenseDate ? new Date(createExpenseDate).toLocaleString("en-US", { month: "short" }) : "Date not available";
                    const day: string = createExpenseDate ? new Date(createExpenseDate).toLocaleString("en-US", { day: "2-digit" }) : "Date not available";
                    const isCurrentUserExpense = user?.id == transaction.payed_by_user_id;
                    return (
                        <ListItem key={transaction.payed_by_user_id + transaction.created_at} sx={{width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'primary.main'}}>
                            <Box sx={{display: 'flex'}}>
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        mr: 2,
                                        py: 0.5,
                                    }}
                                >
                                    <Typography variant="body1">
                                        {month}
                                    </Typography>
                                    <Typography variant="body1">{day}</Typography>
                                </Box>
                            </Box>
                            {isExpense(transaction) && <ExpenseItem expense = {transaction} isCurrentUser = {isCurrentUserExpense} totalMembers={totalMembers || 0}/>}
                            {isRefund(transaction) && <RefundItem refund = {transaction} currentUserId = {user?.id || -1}/>}
                        </ListItem>
                    )
                })}
            </List>
        </>
    );
};

export default ExpensesDetailsForGroup;