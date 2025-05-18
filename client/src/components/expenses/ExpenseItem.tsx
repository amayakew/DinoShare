import { Box, Typography, ListItemText } from "@mui/material";
import type { Expense } from "../../models/Expense";

type ExpenseItemProps = {
    expense: Expense;
    isCurrentUser: boolean;
    totalMembers: number;
};

const ExpenseItem = ({expense, isCurrentUser, totalMembers}: ExpenseItemProps) => {
    const color = isCurrentUser ? 'green' : 'red';
    const text = isCurrentUser ? 'I lent' : 'I owe';
    const price = isCurrentUser ? expense.price - (expense.price / totalMembers) : expense.price / totalMembers;

    const payed_by = isCurrentUser ? 'you' : expense.payed_by_user_name;
    
    return (
        <>
            <ListItemText primary={expense.name} secondary={`${payed_by} payed ${expense.price}`}/>
            <Box                     
                sx={{
                    textAlign: "center",
                    mr: 2,
                    py: 0.5,
                }}
            >
                <Typography sx={{color}} variant="body1">{text} {price.toFixed(2)}</Typography>
            </Box>
        </>
    );
};

export default ExpenseItem;