import * as mysql from "mysql2/promise";
import bluebird from "bluebird";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * @type {object}
 * configuration for mysql connection
 */
export const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    Promise: bluebird,
};
