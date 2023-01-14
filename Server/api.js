import webscrapeData from './webscrape.js';
import express from 'express';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = 
{
    key: 
    fs.readFileSync("./config/cert.key"),
    cert:
    fs.readFileSync("./config/cert.crt")
};

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.get('/menu', (req, res) => {
    let date = req.query.date;
    webscrapeData(date).then((data)=>{
        res.json(data);
    })
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

// https.createServer(options, app).listen(3080, () => {
//     console.log(`Hello world app listening on port 3080!`)
// })