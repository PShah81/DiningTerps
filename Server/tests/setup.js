import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config()

beforeAll(()=>{
    const pool = mysql.createPool({
        connectionLimit: 100, 
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    global.pool = pool;
})

afterAll(async ()=>{
    await global.pool.end();
})


export default undefined;