import { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { addRefund } from "../../features/expensesSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { getAllGroups } from "../../features/groupsSlice";
import type { GroupExtended } from "../../models/GroupExtended";

type AddExpensesModalProps = {
   selectedGroup: GroupExtended | undefined
};

const SettleUpModal = ({selectedGroup}: AddExpensesModalProps) => {
    const [modalState, setModalState] = useState(false);
    const requiredPayments = selectedGroup?.financeSummary.needToPay;
    const hasRequiredPayments = requiredPayments?.length || 0 > 0;

    const dispatch = useDispatch<AppDispatch>();

    const handleClick = async(receiving_member_id: number, currency: string, price: number) => {
        if (selectedGroup?.id === undefined) return;

        const result = await dispatch(addRefund({ group_id: selectedGroup.id, receiving_member_id, currency, price}));
        if (addRefund.fulfilled.match(result)) {
            await dispatch(getAllGroups());
            setModalState(false);
        };
    };

    return (
        <>
            <Button variant="contained" onClick={() => setModalState(true)} sx={{padding: '3px 7px'}}>
                Settle Up
            </Button>
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
                    {!hasRequiredPayments && <Typography>{"Looks like you owe nothing :)"}</Typography>}
                    {hasRequiredPayments && requiredPayments?.map((p) => {
                        return (
                            <Box>
                                <Typography>You owe {p.toUserName} {p.price.toFixed(2)}{p.currency} </Typography>
                                <Button
                                    onClick={() => handleClick(p.toUserId, p.currency, p.price)}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'black',
                                        width: '30%',
                                        alignSelf: 'center'
                                    }}
                                >
                                    Settle Up
                                </Button>
                            </Box>
                        )
                    })}
                </Box>
            </Modal>
        </>
    );
};

export default SettleUpModal;