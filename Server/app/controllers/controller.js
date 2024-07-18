import {validate as isUUID} from 'uuid';

async function modifySettings(uuid, res, setting, operation, modification, pool, returnSettings)
{
    try 
    {
        //message to res.send
        let message = "Success";
        //Check If Params are valid
        if(!isUUID(uuid))
        {
            throw new TypeError("Invalid UUID");
        }
        if(setting != "pushToken" && setting != "favoriteSections")
        {
            throw new TypeError("Not a valid Setting");
        }
        else if(setting === "pushToken" && modification != null && (typeof modification != "string" || !(modification.startsWith('ExponentPushToken'))))
        {
            throw new TypeError("Not a valid PushToken");
        }
        else if(setting === "favoriteSections" &&  typeof modification != "string")
        {
            throw new TypeError("Not a valid modification");
        }
        // Must check setting isn't pushToken because pushToken has its own different operations
        else if(setting != "pushToken" && operation != "add" && operation != "delete")
        {
            throw new TypeError("Not a valid Operation");
        }

        // First we try to figure out if this is a newEntry for the uuid 
        let newEntry = false;
        let result = await returnSettings(uuid, pool);
        if(result === null)
        {
            newEntry = true;
        }
        //We want to different things for if the setting is related to the sections vs the pushToken
        if(setting === "favoriteSections")
        {
            let oldSetting;
            let newSetting;
            if(newEntry)
            {
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
                }
                else
                {
                    message = "Nothing to delete";
                }
                newSetting = oldSetting;
            }
            else if(operation === "add")
            {
                if(oldSetting.indexOf(modification) === -1)
                {
                    newSetting = [...oldSetting, modification];
                }
                else
                {
                    return "Nothing to add";
                }
            }
            let postSql;
            if(newEntry)
            {
                postSql = "INSERT INTO settings (uuid, favoriteSections, pushToken) VALUES (?,?,?)";
                await pool.query(postSql, [uuid, JSON.stringify(newSetting), null]);
            }
            else
            {
                postSql = "UPDATE settings SET favoriteSections = ? WHERE uuid = ?";
                await pool.query(postSql, [JSON.stringify(newSetting), uuid]);
            }
            
        }
        else if(setting === "pushToken")
        {
            let postSql;
            if(newEntry)
            {
                postSql = "INSERT INTO settings (uuid, favoriteSections, pushToken) VALUES (?,?,?)";
                await pool.query(postSql, [uuid, JSON.stringify([]), modification]);
            }
            else
            {
                if(modification != result[setting])
                {
                    postSql = "UPDATE settings SET pushToken = ? WHERE uuid = ?";
                    await pool.query(postSql, [modification, uuid]);
                }
            }
        }
        res.status(200).send(message);
    }
    catch(err)
    {
        console.error(err.message);
        if(err instanceof TypeError)
        {
            res.status(400).send("Failure");
        }
        else
        {
            res.status(500).send("Failure");
        }
        
    }
}
async function getSettings(uuid, res, pool, returnSettings)
{
    let result = await returnSettings(uuid, pool);
    if(result === null)
    {
        res.status(200).send({});
    }
    else
    {
        res.status(200).send(result);
    }
    
}
async function returnSettings(uuid, pool)
{
    try
    {
        if(!isUUID(uuid))
        {
            throw new Error("invalid uuid");
        }
        let getSettingsSql = "SELECT * FROM settings WHERE uuid = ?";
        let result = await pool.query(getSettingsSql, [uuid]);
        if(!Array.isArray(result[0]))
        {
            throw new Error("query result is not in the proper format");
        }
        if(result[0].length === 0)
        {
            return null;
        }
        else
        {
            return result[0][0];
        }
    }
    catch(err)
    {
        console.error(err.message);
        return null;
    }
    
}
async function addOrDeleteFavorites(operation, uuid, food_id, res, pool)
{
    try
    {
        if(!isUUID(uuid))
        {
            throw new Error("invalid uuid");
        }
        if(operation === "add")
        {
            let alreadyThereSql = "SELECT * FROM favorites WHERE food_id = ? AND uuid = ?";
            let result = await pool.query(alreadyThereSql, [food_id, uuid]);
            if(!Array.isArray(result[0]))
            {
                throw new Error("query result not in proper format");
            }
            if(result[0].length === 0)
            {
                let sql = "INSERT INTO favorites (food_id, uuid) VALUES (?,?)";
                await pool.query(sql, [food_id, uuid]);
                console.log('added');
            }
        }
        else if(operation === "delete")
        {
            let sql = "DELETE FROM favorites WHERE food_id = ? AND uuid = ?";
            await pool.query(sql, [food_id, uuid]);
            console.log('deleted');
        }
        res.status(200).send("Success");
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Error");
    }
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