import {retrieveTodaysMenu, retrieveDatabase, addOrDeleteFavorites, 
    getFavoritesAvailable, modifySettings, getSettings, returnSettings,
    returnFavoritesAvailable, getFavoriteFoodIds} from '../controllers/controller.js';
function routes(app, pool)
{
    app.get('/menu', (req, res) => {
        retrieveTodaysMenu(res, pool);
    });
    
    app.get('/database', (req, res) =>{
        retrieveDatabase(res, pool);
    })
    
    app.post('/favorites/:operation', (req, res)=>{
        let {operation} = req.params;
        let {uuid, food_id} = req.body;
        addOrDeleteFavorites(operation, uuid, food_id, res, pool);
    })
    
    app.get('/favoritesavailable/:uuid', (req, res)=>{
        let uuid = req.params.uuid;
        getFavoritesAvailable(uuid, res, pool, returnFavoritesAvailable, getFavoriteFoodIds);
    })
    
    app.post('/settings/:setting/:operation', (req, res)=>{
        let {setting, operation} = req.params;
        let {uuid, modification} = req.body;
        modifySettings(uuid, res, setting, operation, modification, pool, returnSettings);
    })
    
    app.get('/settings/:uuid', (req,res)=>{
        let uuid = req.params.uuid;
        getSettings(uuid, res, pool, returnSettings);
    })
    
    app.get('/', (req, res)=>{
        res.send("Support Website")
    })
    
    app.get('/privacypolicy', (req,res)=>{
        res.send("Privacy Policy");
    })
    
    app.get('/termsofservice', (req, res)=>{
        res.send("TOS");
    })
}


export default routes
