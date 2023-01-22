import cronJob from 'cron';
import * as dotenv from 'dotenv';
dotenv.config()
import webscrapeData from './webscrape.js';
import mysql from 'mysql';

let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



webscrapeData(new Date().toLocaleDateString()).then((data)=>{
    con.connect(function(err) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        let sql = "INSERT INTO menus (menuDate, menuJson) VALUES (?,?)";
        con.query(sql, [new Date().toLocaleDateString(), JSON.stringify(data)], function (err, result) {
            if (err) throw err;
            con.end();
        });
        console.log('Connected to the MySQL server.');
    });
})
// let job = new CronJob(
// 	'0 * * * * *',
// 	function() {
        
          
// 		console.log('You will see this message every second');
// 	},
// 	null,
// 	true,
// 	'America/New_York'
// );