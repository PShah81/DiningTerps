import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import mysql from 'mysql2/promise';
import createServer from './createServer.js';
const pool = mysql.createPool({
    connectionLimit: 100, 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
const port = 3000;

let app = createServer(pool);

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));