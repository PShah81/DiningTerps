import {CronJob} from 'cron';
import * as dotenv from 'dotenv';
dotenv.config({path: "../../.env"});
import webscrapeData from './webscrape.js';
import mysql from 'mysql2/promise';


let pool = mysql.createPool({
    connectionLimit: 100, 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York', day: "2-digit", month: "2-digit", year: "numeric"});
dailyDataScript(date, pool);


async function dailyDataScript(date, pool)
{
    let data = await webscrapeData(date);
    await addToDatabase(data, pool);
    data = await getIds(data, pool);
    await updateMenu(data, pool, date);
    pool.end();
    console.log('FINISHED');
    
}

async function updateMenu(menu, pool, date)
{
    let con = await pool.getConnection();
    let sql = "SELECT * FROM menus WHERE menuDate = ?";
    let result = await con.query(sql, [date]);
    if(result[0].length === 0)
    {
        let insertSql = "INSERT INTO menus (menuDate, menuJson) VALUES (?,?)";
        await con.query(insertSql, [date, JSON.stringify(menu)]);
    }
    con.release();
}

async function addToDatabase(menu, pool)
{
    let diningHall;
    let mealTime;
    let sectionName;
    for(let i=0; i< Object.keys(menu).length; i++)
    {
        diningHall = Object.keys(menu)[i];
        for(let j=0; j< Object.keys(menu[diningHall]).length; j++)
        {
            mealTime = Object.keys(menu[diningHall])[j];
            for(let k=0; k< Object.keys(menu[diningHall][mealTime]).length; k++)
            {
                sectionName = Object.keys(menu[diningHall][mealTime])[k];
                await processSection(menu, diningHall, mealTime, sectionName, pool);
            }
        }
    }            
}

async function addNewEntries(con, itemName, itemAllergyArr, itemData)
{
    let sql = "SELECT * FROM food_database WHERE foodname= ?";
    let result = await con.query(sql, [itemName]);
    if(result[0].length != 0) 
    {
        let addToDatabase = true;
        for(let i=0; i<result[0].length; i++)
        {
            let sameFood = true;
            for(let l=0; l<itemAllergyArr.length; l++)
            {
                if(result[0][i].foodallergies.includes(itemAllergyArr[l]) === false)
                {
                    sameFood = false;
                }
            }
            if(sameFood === true)
            {
                addToDatabase = false;
                break;
            }
        }
        if(addToDatabase === true)
        {
            let insertSql = "INSERT INTO food_database (foodname, foodallergies, fooddata) VALUES (?, ?, ?)";
            await con.query(insertSql, [itemName, JSON.stringify(itemAllergyArr), JSON.stringify(itemData)]);
        }
    }
    else
    {
        let insertSql = "INSERT INTO food_database (foodname, foodallergies, fooddata) VALUES (?, ?, ?)";
        await con.query(insertSql, [itemName, JSON.stringify(itemAllergyArr), JSON.stringify(itemData)]);
    }
}


async function processSection(menu, diningHall, mealTime, sectionName, pool)
{
    const con = await pool.getConnection();
    for(let l=0; l< Object.keys(menu[diningHall][mealTime][sectionName]).length; l++)
    {
        let itemName = Object.keys(menu[diningHall][mealTime][sectionName])[l];
        let itemAllergyArr = menu[diningHall][mealTime][sectionName][itemName]["itemAllergyArr"];
        let itemData =  menu[diningHall][mealTime][sectionName][itemName];
        if(itemAllergyArr === undefined)
        {
            itemAllergyArr = [];
        }
        await addNewEntries(con, itemName, itemAllergyArr, itemData);
    }
    con.release();
}

async function getIds(menu, pool)
{
    let diningHall;
    let mealTime;
    let sectionName;
    let promiseArr = [];
    for(let i=0; i< Object.keys(menu).length; i++)
    {
        diningHall = Object.keys(menu)[i];
        for(let j=0; j< Object.keys(menu[diningHall]).length; j++)
        {
            mealTime = Object.keys(menu[diningHall])[j];
            for(let k=0; k< Object.keys(menu[diningHall][mealTime]).length; k++)
            {
                sectionName = Object.keys(menu[diningHall][mealTime])[k];
                await getIdForFood(menu, diningHall, mealTime, sectionName, pool);
            }
        }
    }
    return menu;
}

async function getIdForFood(menu, diningHall, mealTime, sectionName, pool)
{
    const con = await pool.getConnection();
    for(let l=0; l< Object.keys(menu[diningHall][mealTime][sectionName]).length; l++)
    {
        let itemName = Object.keys(menu[diningHall][mealTime][sectionName])[l];
        let itemAllergyArr = menu[diningHall][mealTime][sectionName][itemName]["itemAllergyArr"];
        let itemData =  menu[diningHall][mealTime][sectionName][itemName];
        if(itemAllergyArr === undefined)
        {
            itemAllergyArr = [];
        }
        let sql = "SELECT * FROM food_database WHERE foodname= ?";
        let result = await con.query(sql, [itemName]);
        if(result[0].length > 1)
        {
            for(let i=0; i<result[0].length; i++)
            {
                let sameFood = true;
                for(let l=0; l<itemAllergyArr.length; l++)
                {
                    if(result[0][i].foodallergies.includes(itemAllergyArr[l]) === false)
                    {
                        sameFood = false;
                    }
                }
                if(sameFood === true)
                {
                    itemData["food_id"] = result[0][i].food_id;
                    break;
                }
            }
           
        }
        else
        {
            itemData["food_id"] = result[0][0].food_id;
        }
        
    }
    con.release();
}

async function getAvailableFoods(menu, pool)
{
    let diningHall;
    let mealTime;
    let sectionName;
    for(let i=0; i< Object.keys(menu).length; i++)
    {
        diningHall = Object.keys(menu)[i];
        for(let j=0; j< Object.keys(menu[diningHall]).length; j++)
        {
            mealTime = Object.keys(menu[diningHall])[j];
            for(let k=0; k< Object.keys(menu[diningHall][mealTime]).length; k++)
            {
                sectionName = Object.keys(menu[diningHall][mealTime])[k];
                await updateAvailableFoodJSON(menu, diningHall, mealTime, sectionName, pool)
            }
        }
    }  
}

async function updateAvailableFoodJSON(menu, diningHall, mealTime, sectionName, pool)
{
    const con = await pool.getConnection();
    for(let l=0; l< Object.keys(menu[diningHall][mealTime][sectionName]).length; l++)
    {
        let itemName = Object.keys(menu[diningHall][mealTime][sectionName])[l];
        let itemData = menu[diningHall][mealTime][sectionName][itemName];
        let itemId = itemData["id"];
        let sql = "SELECT foodJson FROM availableFoods WHERE food_id = ?";
        let result = await con.query(sql, [itemId]);
        let foodJson;
        if(result[0].length === 0)
        {
            foodJson = {};
            foodJson[diningHall] = {};
            foodJson[diningHall][mealTime] = {};
            foodJson[diningHall][mealTime][itemName] = itemData;
            let newSql = "INSERT INTO availableFoods (food_id, foodJson) VALUES (?, ?) ";
            await con.query(newSql, [itemId, JSON.stringify(foodJson)]);
        }
        else
        {
            let foodJson = result[0][0].foodJson;
            if(foodJson[diningHall] === undefined)
            {
                foodJson[diningHall] = {};
            }
            if(foodJson[diningHall][mealTime] === undefined)
            {
                foodJson[diningHall][mealTime] = {};
            }
            foodJson[diningHall][mealTime][itemName] = itemData;
            let updateSql = "UPDATE availableFoods SET foodJSON= ? WHERE food_id= ? "
            await con.query(updateSql, [JSON.stringify(foodJson), itemId]);
        }
        
    }
    con.release();
}