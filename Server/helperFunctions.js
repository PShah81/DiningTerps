import {validate as isUUID} from 'uuid';
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

export {returnFavoritesAvailable, getFavoriteFoodIds};