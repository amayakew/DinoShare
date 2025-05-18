import { executeInTransaction } from "../helpers/executeInTransaction.js";

export const getGroups = async (member_id) => {
    const callback = async (db) => {
        const result = await db.query(
            `SELECT groups.id, groups.name, groups.description, groups.created_at, groups.owner_id 
                FROM groupmembers LEFT JOIN groups
                ON groupmembers.group_id = groups.id
                WHERE groupmembers.member_id = $1;
            `,
            [member_id]
        );

        const groups = result.rows;
        return groups;
    };

    return await executeInTransaction(callback);
};

export const getExtendedGroups = async (owner_id) => {
    const groups = await getGroups(owner_id);
    const callback = async (db) => {
        for (const groupIndex in groups) {
            const group = groups[groupIndex];
            await extendGroup(db, group);
        };
        return groups;
    };

    return await executeInTransaction(callback);
};

export const addGroupWithMembers = async(owner_id, name, description, members_ids) => {
    const callback = async (db) => {

        const result = await db.query(
            'INSERT INTO groups(owner_id, name, description) VALUES($1, $2, $3) RETURNING *',
            [owner_id, name, description]
        );
        const group = result.rows[0];
        const group_id = group.id;
        const membersWithOwner = [...members_ids, owner_id];
        for (const member_id in membersWithOwner) {
            const result = await db.query(
                'INSERT INTO groupmembers(group_id, member_id) VALUES($1, $2)',
                [group_id, membersWithOwner[member_id]]
            );
        };
        
        await db.query('COMMIT');

        return group;
    };

    return await executeInTransaction(callback);
};

export const getGroupById = async(group_id) => {
    const callback = async(db) => {
        const result = await db.query(
            'SELECT * FROM groups WHERE id = $1', [group_id]
        );
        
        await db.query('COMMIT');

        const group = result.rows[0];
        await extendGroup(db, group);
        return group;
    };

    return await executeInTransaction(callback);
};

export const deleteGroup = async(group_id) => {
    const callback = async(db) => {
        await db.query(
            'DELETE FROM groupmembers WHERE group_id = $1', [group_id]
        );
        await db.query(
            'DELETE FROM group_expenses WHERE group_id = $1', [group_id]
        );
        await db.query(
            'DELETE FROM group_refunds WHERE group_id = $1', [group_id]
        );
        await db.query(
            'DELETE FROM groups WHERE id = $1', [group_id]
        );

        await db.query('COMMIT');
    };

    return await executeInTransaction(callback);
}; 

export const deleteGroupMember = async (groupId, memberId) => {
    const callback = async(db) => {
        await db.query(
            'DELETE FROM groupmembers WHERE group_id = $1 and member_id = $2', [groupId, memberId]
        );

        await db.query('COMMIT');
    };

    return await executeInTransaction(callback);
};

const extendGroup = async (db, group) => {
    const ownerResult = await db.query('SELECT id, username, email FROM users WHERE id = $1', [group.owner_id]);
    group.owner = ownerResult.rows[0];

    const membersResult = await db.query(`SELECT users.id, users.username, users.email
        FROM groupmembers LEFT JOIN users
        ON groupmembers.member_id = users.id
        where groupmembers.group_id = $1`, [group.id]);

    group.members = membersResult.rows;

    const expensesResult = await db.query(`
        SELECT
            users.id as payed_by_user_id,
            users.username as payed_by_user_name,
            group_expenses.name,
            group_expenses.price,
            group_expenses.currency,
            group_expenses.created_at
        FROM group_expenses
        LEFT JOIN users ON group_expenses.member_id = users.id
        WHERE group_expenses.group_id = $1
        ORDER BY group_expenses.created_at desc
            `, [group.id]);
    group.expenses = expensesResult.rows;

    const refundsResult = await db.query(`
        SELECT
            paying_user.id AS payed_by_user_id,
            paying_user.username AS payed_by_user_name,
            receiving_user.id AS received_by_user_id,
            receiving_user.username AS received_by_user_name,
            group_refunds.price,
            group_refunds.currency,
            group_refunds.created_at
        FROM group_refunds
        LEFT JOIN users AS paying_user ON group_refunds.member_id = paying_user.id
        LEFT JOIN users AS receiving_user ON group_refunds.receiving_member_id = receiving_user.id
        WHERE group_refunds.group_id = $1
        ORDER BY group_refunds.created_at DESC;
        `, [group.id]);
        
    group.refunds = refundsResult.rows;
};