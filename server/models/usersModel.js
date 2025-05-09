import bcrypt from 'bcrypt';
import { executeInTransaction } from '../helpers/executeInTransaction.js';


export const createUser = async (username, email, password) => {

    const callback = async (db) => {

        const password_hash = await bcrypt.hash(password + '', 10);

        const result = await db.query(
            'INSERT INTO users(username, email,password_hash) VALUES($1, $2, $3) RETURNING id, username, email',
            [username, email.toLowerCase(), password_hash]
        );

        await db.query('COMMIT');
        const user = result.rows[0];
        return user;
    };

    return await executeInTransaction(callback);
};

export const getUserByEmail = async (email) => {
    const callback = async (db) => {

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if(result.rows.length > 0){
            await db.query('COMMIT');
            const user = result.rows[0];
            return user;
        } else {
            await db.query('COMMIT');
            return null;
        }
    };

    return await executeInTransaction(callback);
};