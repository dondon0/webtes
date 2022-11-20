const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost', /*or ip address of server*/
    user: 'root',
    password: '',
    database: 'cafe',
});

db.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log("MySQL Connected");
    }
});

module.exports = db;