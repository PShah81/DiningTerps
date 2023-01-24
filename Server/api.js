import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';

let pool = mysql.createPool({
    connectionLimit: 100, 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const app = express();
const port = 3000;


app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.get('/menu', (req, res) => {
    retrieveTodaysMenu(pool, res);
});

app.get('/database', (req, res) =>{
    retrieveDatabase(pool, res);
})


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

async function retrieveDatabase(pool, res)
{
    let con = await pool.getConnection();
    let sql = "SELECT * FROM food_database";
    let results = await con.query(sql);
    con.release();
    let foodArr = results[0];
    console.log(foodArr.length)
    res.send(foodArr);
}
async function retrieveTodaysMenu(pool, res)
{
    let con = await pool.getConnection();
    let sql = "SELECT menuJson FROM menus WHERE menuDate = ?";
    let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
    let results = await con.query(sql, [date]);
    con.release();
    let menu = results[0][0].menuJson;

    for(let i=0; i< Object.keys(menu).length; i++)
    {
        let diningHall = Object.keys(menu)[i];
        if(Object.keys(menu[diningHall]).length === 3)
        {
            menu[diningHall] = Object.assign({Breakfast: null, Lunch: null, Dinner: null}, menu[diningHall])
        }
        else
        {
            menu[diningHall] = Object.assign({Brunch: null, Dinner: null}, menu[diningHall])
        }   
    }   
    console.log('sending')
    res.json(menu)
}