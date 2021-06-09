import * as jwt from "jsonwebtoken";
import { User } from "@utils/interfaces";
import * as dotenv from "dotenv";
import { connection } from "@utils/connection";
import { RowDataPacket } from "mysql2";

dotenv.config();
const SESSION_SECRET: string = process.env.SESSION_SECRET;

/**
 * Creates a session token on login or register
 * @param user - user data object to be saved on the client
 * @returns JSON web token to be saved in cookie in browser
 */
export function createSessionToken(user: User) {
    try {
        return jwt.sign(
            { data: user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
            SESSION_SECRET
        );
    } catch (error) {
        console.error;
    }
}

/**
 * Updates the session token if the old one is close to expiring or user data is updated
 * @param user user data object to be saved on the client
 * @param token ALREADY EXISTING/VALID token to allow extension/updated user data
 * @returns JSON web token to be saved in cookie in browser
 */
export function updateSessionToken(
    user: User,
    token: string,
    callback: (token?: string, err?: Error) => void
) {
    try {
        if (jwt.verify(token, SESSION_SECRET)) {
            connection.connect();
            connection.query(
                "SELECT id, username, email FROM users WHERE id = ?",
                [user.user_id],
                (err: Error, results: RowDataPacket[]) => {
                    if (err) throw err;
                    if (results.length < 1) {
                        throw new Error("Not quite sure what went wrong!");
                    } else {
                        const token = jwt.sign(
                            {
                                data: {
                                    user_id: results[0].user_id,
                                    username: results[0].email,
                                    email: results[0].email,
                                },
                                exp:
                                    Math.floor(Date.now() / 1000) +
                                    60 * 60 * 24,
                            },
                            SESSION_SECRET
                        );
                        return callback(token);
                    }
                }
            );
        } else {
            return callback("", new Error("token_verification_error"));
        }
    } catch (error) {
        console.error;
        return callback("", new Error(error.message));
    }
}
