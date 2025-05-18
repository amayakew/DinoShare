import { addExpense, addRefund } from "../models/expensesModel.js";

export const addNewExpense = async(req,res) => {
    const member_id = req.token.userId;
    const {group_id, name, currency, price} = req.body;

    if (!member_id) {
        return res.status(400).json({message: 'User id is missing or invalid.'});
    };

    if (!group_id || !name || !currency || !price) {
        return res.status(400).json({ message: 'Group_id, name, currency and price are required' });
    };

    try {
        const newExpense = await addExpense(group_id, member_id, name, currency, price);
        res.status(201).json({newExpense});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};

export const addNewRefund = async(req,res) => {
    const member_id = req.token.userId;
    const {group_id, receiving_member_id, currency, price} = req.body;

    if (!member_id) {
        return res.status(400).json({message: 'User id is missing or invalid.'});
    };

    if (!group_id || !receiving_member_id || !currency || !price) {
        return res.status(400).json({ message: 'Group_id, name, currency and price are required' });
    };

    try {
        const newRefund = await addRefund(group_id, member_id, receiving_member_id, currency, price);
        res.status(201).json({newRefund});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};