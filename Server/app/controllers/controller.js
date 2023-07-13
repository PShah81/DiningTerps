import {validate as isUUID} from 'uuid';

async function modifySettings(uuid, setting, operation, modification, pool)
{
    let newEntry = false;
    let result = await returnSettings(uuid, pool);
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
async function getSettings(uuid, res, pool, returnSettings)
{
    let result = await returnSettings(uuid, pool);
    if(result === null)
    {
        res.send({});
    }
    else
    {
        res.send(result);
    }
    
}
async function returnSettings(uuid, pool)
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
async function addOrDeleteFavorites(operation, uuid, food_id, res, pool)
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
async function retrieveDatabase(res, pool)
{
    try
    {
        let sql = "SELECT * FROM food_database";
        let results = await pool.query(sql);
        if(results[0] === undefined)
        {
            throw new Error("query result was not in the proper format");
        }
        let foodArr = results[0];
        res.status(200).send(foodArr);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send([]);
    }
   
}
async function retrieveTodaysMenu(res, pool)
{
    try
    {
        //get menu for today
        let sql = "SELECT menuJson FROM menus WHERE menuDate = ?";
        let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
        let results = await pool.query(sql, [date]);
        if(results[0] === undefined || results[0][0] === undefined || results[0][0].menuJson === undefined)
        {
            throw new Error("query result was not in the proper format");
        }

        //query is formatted this way
        let menu = results[0][0].menuJson;

        //remformatting json so that the keys are in order of Breakfast, Lunch, Dinner
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
        console.log('sending menu');
        res.status(200).json(menu);
    }
    catch(err)
    {
        console.error(err.message);
        console.log('sending menu');
        res.status(500).json({});
    }
    
    
}

//This function gets an array of ids of the favorite foods for a user
async function getFavoriteFoodIds(uuid, pool)
{
    try
    {
        if(!isUUID(uuid))
        {
            throw new Error("invalid uuid");
        }
        let getFavoritesSql = "SELECT food_id FROM favorites WHERE uuid = ?";
        let result = await pool.query(getFavoritesSql, [uuid]);
        if(!Array.isArray(result[0]))
        {
            throw new Error("invalid query result");
        }
        //the first index of the array has the actual data
        //the other indicies have details about the columns
        let arrOfIdObjects = result[0];
        let favoriteFoodIds = [];
        for(let i=0; i<arrOfIdObjects.length; i++)
        {
            //looks like this because each food id comes in the form of an object with key food_id
            favoriteFoodIds.push(arrOfIdObjects[i]['food_id']);
        }
        return favoriteFoodIds;
    }
    catch(err)
    {
        console.error(err.message);
        return [];
    }
    
}
async function returnFavoritesAvailable(uuid, pool, getFavoriteFoodIds)
{
    try
    {
        //get the favorite foods' ids
        let favoriteFoodIds = await getFavoriteFoodIds(uuid, pool);
        if(!Array.isArray(favoriteFoodIds))
        {
            throw new Error('Favorite food array is not valid');
        }

        //get menu for today
        let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
        let getMenuSql = "SELECT menuJson FROM menus WHERE menuDate = ?";
        let menuResults = await pool.query(getMenuSql, [date]);
        if(menuResults[0] == undefined || menuResults[0][0] == undefined || menuResults[0][0].menuJson == undefined)
        {
            throw new Error('menuResults is not in the proper format');
        }

        //query is formatted this way
        let menu = menuResults[0][0].menuJson;

        //remformatting json so that the keys are in order of Breakfast, Lunch, Dinner
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

        //finding the position of each favorite food in the dining hall
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
                        //If this items food id is in the favoriteFoodIds array, then add it to favorites available
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
        return responseObject;
    }
    catch(err)
    {
        console.error(err.message);
        let responseObject = {};
        responseObject["favoritesAvailable"] = {};
        responseObject["favoriteFoodIds"]  = [];
        return responseObject;
    }
    
}
async function getFavoritesAvailable(uuid, res, pool, returnFavoritesAvailable, getFavoriteFoodIds)
{
    let responseObject = await returnFavoritesAvailable(uuid, pool, getFavoriteFoodIds);
    res.send(responseObject);
}
export {modifySettings, getSettings, returnSettings, getFavoritesAvailable, addOrDeleteFavorites, 
    retrieveDatabase, retrieveTodaysMenu, returnFavoritesAvailable, getFavoriteFoodIds}