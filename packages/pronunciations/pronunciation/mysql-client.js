const mysql = require('mysql2/promise');
const DATABASE_URL = process.env.DATABASE_URL;

module.exports = mysql.createConnection(DATABASE_URL);