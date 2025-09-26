const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rbac_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

module.exports = db;
