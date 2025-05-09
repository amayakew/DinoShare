import { executeInTransaction } from "../helpers/executeInTransaction.js";

export const getFriends = async (user_id) => {
    const callback = async (db) => {

        const result = await db.query(
            'SELECT users.id, users.username, users.email FROM friends LEFT JOIN users ON friends.friend_id = users.id WHERE friends.user_id = $1',
            [user_id]
        );
        const friends = result.rows;
        return friends;
    };

    return await executeInTransaction(callback);
};