export type Expense = {
    payed_by_user_id: number;
    payed_by_user_name: string;
    name: string;
    price: number;
    currency: string;
    created_at: string;
};

export const isExpense = (item: any): item is Expense => {
    return [
        'payed_by_user_id',
        'payed_by_user_name',
        'name',
        'price',
        'currency',
        'created_at'
    ].every((prop) => prop in item);
};