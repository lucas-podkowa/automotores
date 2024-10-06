const mysql = require('mysql2/promise');
const config = require("./config.json");


//const mysql = require('mysql2');
// const db = mysql.createConnection(config.database);

// db.connect((err) => {
//     if (err) {
//         console.log("Error conectando a la base de datos:", err);
//     } else {
//         console.log("Base de datos conectada");
//     }
// });

const db = mysql.createPool(config.database);

module.exports = db;
