export type Refund = {
    payed_by_user_id: number;
    payed_by_user_name: string;
    received_by_user_id: number;
    received_by_user_name: string;
    price: string;
    currency: string;
    created_at: string;
};

export const isRefund = (item: any): item is Refund => {
    return [
        'payed_by_user_id',
        'payed_by_user_name',
        'received_by_user_id',
        'received_by_user_name',
        'price',
        'currency',
        'created_at'
    ].every((prop) => prop in item);
};