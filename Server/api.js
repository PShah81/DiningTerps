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
    modifySettings(uuid, setting, operation, modification, res);

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
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));


async function modifySettings(uuid, setting, operation, modification, res)
{
    let oldSetting;
    let newSetting;
    let newEntry = false;
    let result = await returnSettings(uuid);
    if(result != null)
    {
        oldSetting = result[setting];
    } 
    else
    {
        newEntry = true;
        oldSetting = [];
    }
    if(operation === "delete")
    {
        if(oldSetting.indexOf(modification) != -1)
        {
            oldSetting.splice(oldSetting.indexOf(modification), 1);
            newSetting = oldSetting;
        }
    }
    else if(operation === "add")
    {
        if(oldSetting.indexOf(modification) === -1)
        {
            newSetting = [...oldSetting, modification];
        }
    }
    let con = await pool.getConnection();
    let postSql;
    if(setting === "collapsedSections")
    {
        if(newEntry)
        {
            postSql = "INSERT INTO settings (uuid, collapsedSections, favoriteSections) VALUES (?,?,?)";
            await con.query(postSql, [uuid, JSON.stringify(newSetting), JSON.stringify([])]);
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
            postSql = "INSERT INTO settings (uuid, collapsedSections, favoriteSections) VALUES (?,?,?)";
            await con.query(postSql, [uuid, JSON.stringify([]), JSON.stringify(newSetting)]);
        }
        else
        {
            postSql = "UPDATE settings SET favoriteSections = ? WHERE uuid = ?";
            await con.query(postSql, [JSON.stringify(newSetting), uuid]);
        }
    }
    res.send("Success");
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
    let con = await pool.getConnection();
    let getFavoritesSql = "SELECT food_id FROM notifications WHERE uuid = ?";
    let result = await con.query(getFavoritesSql, [uuid]);
    let arrOfIdObjects = result[0];
    let favoriteFoodIds = [];
    for(let i=0; i<arrOfIdObjects.length; i++)
    {
        favoriteFoodIds.push(arrOfIdObjects[i]['food_id']);
    }
    
    let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
    let getMenuSql = "SELECT menuJson FROM menus WHERE menuDate = ?";
    let menuResults = await con.query(getMenuSql, [date]);
    if(menuResults[0][0] === undefined)
    {
        res.send({})
        return;
    }
    let menu = menuResults[0][0].menuJson;
    con.release();
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

    let diningHall;
    let mealTime;
    let sectionName;
    let itemName;
    let favoritesAvailable = {};
    for(let i=0; i< Object.keys(menu).length; i++)
    {
        diningHall = Object.keys(menu)[i];
        if(favoritesAvailable[diningHall] === undefined)
        {
            favoritesAvailable[diningHall] = {};
        }
        for(let j=0; j< Object.keys(menu[diningHall]).length; j++)
        {
            mealTime = Object.keys(menu[diningHall])[j];
            if(favoritesAvailable[diningHall][mealTime] === undefined)
            {
                favoritesAvailable[diningHall][mealTime] = {};
            }
            for(let k=0; k< Object.keys(menu[diningHall][mealTime]).length; k++)
            {
                sectionName = Object.keys(menu[diningHall][mealTime])[k];
                for(let l=0; l< Object.keys(menu[diningHall][mealTime][sectionName]).length; l++)
                {
                    itemName = Object.keys(menu[diningHall][mealTime][sectionName])[l];
                    if(favoriteFoodIds.indexOf(menu[diningHall][mealTime][sectionName][itemName]["food_id"]) != -1)
                    {
                        favoritesAvailable[diningHall][mealTime][itemName] = menu[diningHall][mealTime][sectionName][itemName];
                    };
                }
            }
        }
    }  
    let responseObject = {};
    responseObject["favoritesAvailable"] = favoritesAvailable;
    responseObject["favoriteFoodIds"]  = favoriteFoodIds;
    res.send(responseObject);
}

async function addOrDeleteFavorites(operation, uuid, food_id, res)
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
