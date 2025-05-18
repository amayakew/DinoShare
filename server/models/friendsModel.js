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

export const addFriend = async(user_id, friend_id) => {
    const callback = async (db) => {

        const result = await db.query(
            'INSERT INTO friends(user_id, friend_id) VALUES($1, $2) RETURNING *',
        [user_id, friend_id]
        );

        await db.query('COMMIT');
        const friend = result.rows[0];
        return friend;
    };

    return await executeInTransaction(callback);
};

export const deleteFriend = async(user_id, friend_id) => {
    const callback = async(db) => {
        await db.query(
            'DELETE FROM friends WHERE user_id = $1 AND friend_id = $2', [user_id, friend_id]
        );

        await db.query('COMMIT');
    };

    return await executeInTransaction(callback);
}; 