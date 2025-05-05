import { pool } from "../config/db.js";

export const executeInTransaction = async (callBack) => {
    const db = await pool.connect();

    try {
        await db.query('BEGIN');
        return await callBack(db)
    } catch (e) {
        await db.query('ROLLBACK');
        console.error(e);
        throw e;
    } finally {
        db.release();
    }
};