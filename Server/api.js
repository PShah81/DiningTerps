import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import {getFavoriteFoodIds, returnFavoritesAvailable} from './helperFunctions.js';

const pool = mysql.createPool({
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

app.post('/favorites/:operation', (req, res)=>{
    let {operation} = req.params;
    let {uuid, food_id} = req.body;
    addOrDeleteFavorites(operation, uuid, food_id, res)
})

app.get('/favoritesavailable/:uuid', (req, res)=>{
    let uuid = req.params.uuid;
    getFavoritesAvailable(uuid, res);
})

app.post('/settings/:setting/:operation', (req, res)=>{
    let {setting, operation} = req.params;
    let {uuid, modification} = req.body;
    let resString = modifySettings(uuid, setting, operation, modification);
    res.send(resString);
})

app.get('/settings/:uuid', (req,res)=>{
    let uuid = req.params.uuid;
    getSettings(uuid, res);
})

app.get('/', (req, res)=>{
    res.send("Support Website")
})

app.get('/privacypolicy', (req,res)=>{
    res.send("Privacy Policy");
})

app.get('/termsofservics', (req, res)=>{
    res.send("TOS");
})
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

async function modifySettings(uuid, setting, operation, modification)
{
    let newEntry = false;
    let result = await returnSettings(uuid);
    if(result === null)
    {
        newEntry = true;
    }
    if(setting === "collapsedSections" || setting === "favoriteSections")
    {
        let oldSetting;
        let newSetting;
        let validOperation;
        if(newEntry)
        {
            console.log("Weird new entry");
            oldSetting = [];
        }
        else
        {
            oldSetting = result[setting];
        }
        if(operation === "delete")
        {
            if(oldSetting.indexOf(modification) != -1)
            {
                oldSetting.splice(oldSetting.indexOf(modification), 1);
                newSetting = oldSetting;
            }
            else
            {
                return "Doesn't Exist";
            }
        }
        else if(operation === "add")
        {
            if(oldSetting.indexOf(modification) === -1)
            {
                newSetting = [...oldSetting, modification];
            }
            else
            {
                return "Already Exists";
            }
        }
        else
        {
            return "Invalid operation";
        }
        let con = await pool.getConnection();
        let postSql;
        if(setting === "collapsedSections")
        {
            if(newEntry)
            {
                postSql = "INSERT INTO settings (uuid, collapsedSections, favoriteSections, pushToken) VALUES (?,?,?,?)";
                await con.query(postSql, [uuid, JSON.stringify(newSetting), JSON.stringify([]), null]);
            }
            else
            {
                postSql = "UPDATE settings SET collapsedSections = ? WHERE uuid = ?";
                await con.query(postSql, [JSON.stringify(newSetting), uuid]);
            }
            
        }
        else if(setting === "favoriteSections")
        {
            if(newEntry)
            {
                postSql = "INSERT INTO settings (uuid, collapsedSections, favoriteSections, pushToken) VALUES (?,?,?,?)";
                await con.query(postSql, [uuid, JSON.stringify([]), JSON.stringify(newSetting), null]);
            }
            else
            {
                postSql = "UPDATE settings SET favoriteSections = ? WHERE uuid = ?";
                await con.query(postSql, [JSON.stringify(newSetting), uuid]);
            }
        }
        con.release();
        return "Success";
    }
    else if(setting === "pushToken")
    {
        let con = await pool.getConnection();
        let postSql;
        if(newEntry)
        {
            postSql = "INSERT INTO settings (uuid, collapsedSections, favoriteSections, pushToken) VALUES (?,?,?,?)";
            await con.query(postSql, [uuid, JSON.stringify([]), JSON.stringify([]), modification]);
        }
        else
        {
            if(modification != result[setting])
            {
                postSql = "UPDATE settings SET pushToken = ? WHERE uuid = ?";
                await con.query(postSql, [modification, uuid]);
            }
        }
        con.release();
        return "Success";
    }
    else
    {
        return "This setting doesn't exist";
    }
}
async function getSettings(uuid, res)
{
    let result = await returnSettings(uuid);
    if(result === null)
    {
        res.send({});
    }
    else
    {
        res.send(result);
    }
    
}
async function returnSettings(uuid)
{
    let con = await pool.getConnection();
    let getSettingsSql = "SELECT * FROM settings WHERE uuid = ?";
    let result = await con.query(getSettingsSql, [uuid]);
    con.release();
    if(result[0].length === 0)
    {
        return null;
    }
    else
    {
        return result[0][0];
    }
}
async function getFavoritesAvailable(uuid, res)
{
    let responseObject = await returnFavoritesAvailable(uuid, pool, getFavoriteFoodIds);
    res.send(responseObject);
}

async function addOrDeleteFavorites(operation, uuid, food_id, res)
{
    let con = await pool.getConnection();
    if(operation === "add")
    {
        
        let alreadyThereSql = "SELECT * FROM favorites WHERE food_id = ? AND uuid = ?";
        let result = await con.query(alreadyThereSql, [food_id, uuid]);
        if(result[0].length === 0)
        {
            let sql = "INSERT INTO favorites (food_id, uuid) VALUES (?,?)";
            await con.query(sql, [food_id, uuid]);
            console.log('added');
        }
        con.release();
    }
    else if(operation === "delete")
    {
        console.log('deleted');
        let sql = "DELETE FROM favorites WHERE food_id = ? AND uuid = ?";
        await con.query(sql, [food_id, uuid]);
        con.release();
    }
    res.send("Success");
}  
async function retrieveDatabase(pool, res)
{
    let con = await pool.getConnection();
    let sql = "SELECT * FROM food_database";
    let results = await con.query(sql);
    con.release();
    let foodArr = results[0];
    res.send(foodArr);
}
async function retrieveTodaysMenu(pool, res)
{
    let con = await pool.getConnection();
    let sql = "SELECT menuJson FROM menus WHERE menuDate = ?";
    let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
    let results = await con.query(sql, [date]);
    if(results[0][0] === undefined)
    {
        res.send({});
        return;
    }
    con.release();
    let menu = results[0][0].menuJson;
    for(let i=0; i< Object.keys(menu).length; i++)
    {
        let diningHall = Object.keys(menu)[i];
        if(Object.keys(menu[diningHall]).length === 3)
        {
            menu[diningHall] = Object.assign({Breakfast: null, Lunch: null, Dinner: null}, menu[diningHall])
        }
        else if(Object.keys(menu[diningHall]).length === 2)
        {
            menu[diningHall] = Object.assign({Brunch: null, Dinner: null}, menu[diningHall])
        }   
    }
    console.log('sending');
    res.json(menu);
}
