const mysql = require('mysql2');
const misConfiguraciones = require("./../config/config.json");

const db = mysql.createConnection(misConfiguraciones.database);


db.connect((err) => {
    if (err) {
        console.log("Error conectando a la base de datos:", err);
    } else {
        console.log("Base de datos conectada");
    }
});


module.exports = db;
