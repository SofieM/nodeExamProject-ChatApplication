var mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected...");
    } else {
        console.log("Error connecting database...");
    }
});
module.exports = connection;