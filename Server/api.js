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

app.post('/notifications/:operation', (req, res)=>{
    let {operation} = req.params;
    let {uuid, food_id} = req.body;
    addOrDeleteNotifications(operation, uuid, food_id, res)

})

app.get('/notificationslist/:uuid', (req, res)=>{
    let uuid = req.params.uuid;
    getNotificationsList(uuid, res);
})

app.get('/notificationsavailable/:uuid', (req, res)=>{
    let uuid = req.params.uuid;
    getNotificationsAvailable(uuid, res);
})

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

async function getNotificationsAvailable(uuid, res)
{
    let con = await pool.getConnection();
    let getNotificationsSql = "SELECT food_id FROM notifications WHERE uuid = ?";
    let result = await con.query(getNotificationsSql, [uuid]);
    let arrOfIdObjects = result[0];
    let notificationFoodIds = [];
    for(let i=0; i<arrOfIdObjects.length; i++)
    {
        notificationFoodIds.push(arrOfIdObjects[i]['food_id']);
    }
    
    let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
    let getMenuSql = "SELECT menuJson FROM menus WHERE menuDate = ?";
    let menuResults = await con.query(getMenuSql, [date]);
    let menu = menuResults[0][0].menuJson;
    con.release();
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

    let diningHall;
    let mealTime;
    let sectionName;
    let itemName;
    let notificationsAvailable = {};
    for(let i=0; i< Object.keys(menu).length; i++)
    {
        diningHall = Object.keys(menu)[i];
        if(notificationsAvailable[diningHall] === undefined)
        {
            notificationsAvailable[diningHall] = {};
        }
        for(let j=0; j< Object.keys(menu[diningHall]).length; j++)
        {
            mealTime = Object.keys(menu[diningHall])[j];
            if(notificationsAvailable[diningHall][mealTime] === undefined)
            {
                notificationsAvailable[diningHall][mealTime] = {};
            }
            for(let k=0; k< Object.keys(menu[diningHall][mealTime]).length; k++)
            {
                sectionName = Object.keys(menu[diningHall][mealTime])[k];
                for(let l=0; l< Object.keys(menu[diningHall][mealTime][sectionName]).length; l++)
                {
                    itemName = Object.keys(menu[diningHall][mealTime][sectionName])[l];
                    if(notificationFoodIds.indexOf(menu[diningHall][mealTime][sectionName][itemName]["food_id"]) != -1)
                    {
                        notificationsAvailable[diningHall][mealTime][itemName] = menu[diningHall][mealTime][sectionName][itemName];
                    };
                }
            }
        }
    }  
    res.send(notificationsAvailable);
}
async function getNotificationsList(uuid, res)
{
    let con = await pool.getConnection();
    let sql = "SELECT * FROM food_database INNER JOIN notifications ON food_database.food_id = notifications.food_id WHERE notifications.uuid = ?";
    let results = await con.query(sql, [uuid]);
    let notificationList = results[0];
    
    let getNotificationIdsSql = "SELECT food_id FROM notifications WHERE uuid = ?";
    let result = await con.query(getNotificationIdsSql, [uuid]);
    let arrOfIdObjects = result[0];
    let notificationFoodIds = [];
    for(let i=0; i<arrOfIdObjects.length; i++)
    {
        notificationFoodIds.push(arrOfIdObjects[i]['food_id']);
    }

    let responseObject = {};
    responseObject["notificationsList"] = notificationList;
    responseObject["notificationFoodIds"]  = notificationFoodIds;
    con.release();
    res.send(responseObject);
}

async function addOrDeleteNotifications(operation, uuid, food_id, res)
{
    let con = await pool.getConnection();
    if(operation === "add")
    {
        
        let alreadyThereSql = "SELECT * FROM notifications WHERE food_id = ? AND uuid = ?";
        let result = await con.query(alreadyThereSql, [food_id, uuid]);
        if(result[0].length === 0)
        {
            let sql = "INSERT INTO notifications (food_id, uuid) VALUES (?,?)";
            await con.query(sql, [food_id, uuid]);
            console.log('added');
        }
        con.release();
    }
    else if(operation === "delete")
    {
        console.log('deleted');
        let sql = "DELETE FROM notifications WHERE food_id = ? AND uuid = ?";
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