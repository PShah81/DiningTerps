import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './app/routes/endpoints.js';

function createServer(pool)
{
    const app = express();


    app.use(cors());
    
    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    
    
    app.use(function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    })
    
    routes(app, pool);
    return app;
}

export default createServer;