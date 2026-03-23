const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
});

const pool = db.promise();

async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL pool connected successfully");
        connection.release();
    } catch (error) {
        console.error("MySQL pool connection failed:", error.message);
    }
}

module.exports = db;
module.exports.pool = pool;
module.exports.testDbConnection = testDbConnection;