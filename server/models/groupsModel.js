import { executeInTransaction } from "../helpers/executeInTransaction.js";

export const getGroups = async (owner_id) => {
    const callback = async (db) => {

        const result = await db.query(
            'SELECT * FROM groups WHERE owner_id = $1',
            [owner_id]
        );
        const groups = result.rows;
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