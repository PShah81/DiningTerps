import webscrapeData from "./webscrape.js";
import fs from "fs";

let date = new Date();
date.setDate(date.getDate() + 6);
date = date.toLocaleDateString();
webscrapeData(date).then((data)=>{
    fs.writeFile('output.json', JSON.stringify(data), ()=>{
        console.log('hi')
    });
});