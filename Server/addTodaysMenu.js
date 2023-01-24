import {CronJob} from 'cron';
import * as dotenv from 'dotenv';
dotenv.config()
import webscrapeData from './webscrape.js';
import mysql from 'mysql2/promise';

let job = new CronJob(
	'0 0 * * * *',
	function() {
        let pool = mysql.createPool({
            connectionLimit: 100, 
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        dailyDataScript(new Date().toLocaleDateString())
	},
	null,
	true,
	'America/New_York'
);

async function dailyDataScript(date)
{
    let data = await webscrapeData(date);
    console.log(data);
    await addToDatabase(data, pool);
    data = await getIds(data, pool);
    await updateMenu(data, pool, date);
    console.log('FR FINISHED')
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
        console.log(diningHall)
        for(let j=0; j< Object.keys(menu[diningHall]).length; j++)
        {
            mealTime = Object.keys(menu[diningHall])[j];
            console.log(mealTime)
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
        console.log(itemName)
        if(itemAllergyArr === undefined)
        {
            itemAllergyArr = [];
        }
        await addNewEntries(con, itemName, itemAllergyArr, itemData);
    }
    console.log("Section Finished")
    con.release();
}

function getIds(menu, pool)
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
                promiseArr.push(getIdForFood(menu, diningHall, mealTime, sectionName, pool));
            }
        }
    }        
    return Promise.all(promiseArr).then(()=>{
        return menu;
    })
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
                    itemData["id"] = result[0][i].food_id;
                    break;
                }
            }
           
        }
        else
        {
            itemData["id"] = result[0][0].food_id;
        }
        
    }
    console.log('finished');
    con.release();
}