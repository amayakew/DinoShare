import { ListItemText } from "@mui/material";
import type { Refund } from "../../models/Refund";

type RefundItemProps = {
    refund: Refund;
    currentUserId: number;
};

const RefundItem = ({refund, currentUserId}: RefundItemProps) => {
    const payed_by = currentUserId == refund.payed_by_user_id ? 'you' : refund.payed_by_user_name;
    const received_by = currentUserId == refund.received_by_user_id ? 'you' : refund.received_by_user_name;

    return (
        <ListItemText secondary={`${payed_by} payed ${received_by} ${refund.price}`}/>
    );
};

export default RefundItem;