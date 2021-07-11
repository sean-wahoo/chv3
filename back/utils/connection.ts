import * as mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * mysql database connection object
 */
export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});
