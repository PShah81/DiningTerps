import { Expo } from 'expo-server-sdk';
import {CronJob} from 'cron';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config()
import returnFavoritesAvailable from './helperFunctions.js';
let expo = new Expo();

let job = new CronJob(
	'0 0 7 * * *',
    function()
    {
        let pool = mysql.createPool({
            connectionLimit: 100, 
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        processAllUUIDs(pool);
    },
    null,
	true,
	'America/New_York'
);

async function processAllUUIDs(pool)
{
    let con = await pool.getConnection();
    let getFavoritesSql = "SELECT * FROM settings WHERE pushToken IS NOT NULL";
    let result = await con.query(getFavoritesSql);
    let arrayOfUUIDs = result[0];
    let messages = [];
    con.release();
    for(let i=0; i<arrayOfUUIDs.length;i++)
    {
        let message = await processFavoritesAvailable(arrayOfUUIDs[i].uuid);
        if(message != null)
        {
            messages.push({
                to: arrayOfUUIDs[i].pushToken,
                sound: 'default',
                body: message,
                data: { withSome: 'data' }
            });
        }
    }
    expo.sendPushNotificationsAsync(messages);
    pool.end();
}

async function processFavoritesAvailable(uuid)
{
    let responseObject = await returnFavoritesAvailable(uuid, pool);
    let favoritesAvailable = responseObject["favoritesAvailable"];
    let messageArr = [];
    let message = "The ";
    for(let i=0; i<Object.keys(favoritesAvailable).length; i++)
    {
        let diningHall = Object.keys(favoritesAvailable)[i];
        for(let j=0; j<Object.keys(favoritesAvailable[diningHall]).length; j++)
        {
            let mealTime = Object.keys(favoritesAvailable[diningHall])[j];
            for(let k=0; k<Object.keys(favoritesAvailable[diningHall][mealTime]).length; k++)
            {
                let itemName = Object.keys(favoritesAvailable[diningHall][mealTime])[k];
                if(messageArr.indexOf(itemName) === -1)
                {
                    messageArr.push(itemName);
                }
            }
        }
    }
    if(messageArr.length < 3)
    {
        if(messageArr.length === 2)
        {
            message += messageArr[0] + " and " + messageArr[1]; 
        }
        else if(messageArr.length === 1)
        {
            message += messageArr[0];
        }
        else
        {
            return null;
        }
    }
    else
    {
        message += messageArr[0] + ", " + messageArr[1] + ', and more'; 
        // for(let i=0; i<messageArr.length; i++)
        // {
        //     if(i===0)
        //     {
        //         message += messageArr[i];
        //     }
        //     else if(i === messageArr.length - 1)
        //     {
        //         message += ", and " + messageArr[i];
        //     }
        //     else
        //     {
        //         message += ", " + messageArr[i];
        //     }
        // }
    }
    
    if(messageArr.length > 1)
    {
        message += " are";
    }
    else
    {
        message += " is";
    }
    message += " in the dining halls today!";
    return message;
}


