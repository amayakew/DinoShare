import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DB_URL,
    port: process.env.DB_PORT,
    ssl: process.env.LOCAL_DB == 'true' ? undefined: { rejectUnauthorized: false }
});