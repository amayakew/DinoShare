import { useState } from "react";
import { Modal, IconButton, Box, TextField, MenuItem, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { addExpense } from "../../features/expensesSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { getAllGroups } from "../../features/groupsSlice";

const currencies = [
    {
      value: 'USD',
      label: '$',
    },
];

type AddExpensesModalProps = {
    groupId: number | undefined;
};

const AddExpensesModal = ({groupId}: AddExpensesModalProps) => {
    const [modalState, setModalState] = useState(false);
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [price, setPrice] = useState(0);

    const dispatch = useDispatch<AppDispatch>();

    const handleClick = async() => {
        if (groupId === undefined) return;

        const result = await dispatch(addExpense({ group_id: groupId, name, currency, price}));
        if (addExpense.fulfilled.match(result)) {
            await dispatch(getAllGroups());
            setModalState(false);
        };
    };

    return (
        <>
            <IconButton
                    onClick={() => setModalState(true)}
                    sx={{
                        backgroundColor: 'primary.main', 
                        '&:hover': {backgroundColor: 'primary.dark'},
                        color: 'white', 
                        float: 'right'
                    }}
                >
                    <Add/>
            </IconButton>
            <Modal
                open = {modalState}
                onClose={() => setModalState(false)}    
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '25%',
                        bgcolor: 'primary.light',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5
                    }}
                >
                    <TextField label="Enter expense title" variant="standard" value={name} onChange={(e) => setName(e.target.value)}/>
                    <Box sx={{display: 'flex', gap: 5, alignItems: 'center'}}>
                        <TextField
                            select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Enter sum" variant="standard" value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
                    </Box>
                    <Button
                        onClick={handleClick}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'black',
                            width: '30%',
                            alignSelf: 'center'
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default AddExpensesModal;