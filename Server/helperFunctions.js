async function returnFavoritesAvailable(uuid, pool)
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
    
    // let date = new Date().toLocaleDateString('en-US', {timeZone: 'America/New_York'});
    let date = "3/15/2023";
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
    return responseObject;
}

export default returnFavoritesAvailable;