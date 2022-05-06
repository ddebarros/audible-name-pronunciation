const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

module.exports = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});