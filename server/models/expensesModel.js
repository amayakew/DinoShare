import { executeInTransaction } from "../helpers/executeInTransaction.js";

export const addExpense = async(group_id, member_id, name, currency, price) => {
    const callback = async (db) => {

        const result = await db.query(
            'INSERT INTO group_expenses(group_id, member_id, name, currency, price) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [group_id, member_id, name, currency, price]
        );

        await db.query('COMMIT');
        const expense = result.rows[0];
        return expense;
    };

    return await executeInTransaction(callback);
};

export const addRefund = async(group_id, member_id, receiving_member_id, currency, price) => {
    const callback = async (db) => {
        
        const result = await db.query(
            'INSERT INTO group_refunds(group_id, member_id, receiving_member_id, currency, price) VALUES ($1, $2, $3, $4, $5) Returning *',
            [group_id, member_id, receiving_member_id, currency, price]
        ); 

        await db.query('COMMIT');
        const refund = result.rows[0];
        return refund;
    };

    return await executeInTransaction(callback);
};