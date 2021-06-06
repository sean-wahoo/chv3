import { RegisterUser, LoginUser, User } from "@utils/interfaces";
import { connection } from "@utils/connection";
import { registerValidation, loginValidation } from "@utils/validation";
import { createSessionToken, updateSessionToken } from "@utils/session";
import bcrypt = require("bcrypt");
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

/**
 * Route for handling user registration
 * @param req Request Object
 * @param res Response Object
 * @returns Response Status
 */
export async function registerRoute(req, res) {
    try {
        const saltRounds = 10;

        connection.connect();

        if (!req.body) return res.status(401).send({ error: "Empty request" });
        const user = req.body as RegisterUser;
        const validated = registerValidation(user);

        if (validated.passes < 3)
            return res.status(404).send({ error: validated.errors });

        connection.query(
            "SELECT `username` FROM `users` WHERE `username` = ?",
            [user.username],
            (error, results: any) => {
                if (error) throw error;
                if (results.length === 0) {
                    connection.query(
                        "SELECT email FROM users WHERE email = ?",
                        [user.email],
                        (error, results: any) => {
                            if (error) throw error;
                            if (results.length === 0) {
                                bcrypt.hash(
                                    user.password,
                                    saltRounds,
                                    (err, hash) => {
                                        if (err) throw err;
                                        const id = uuidv4();
                                        connection.query(
                                            "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
                                            [
                                                id,
                                                user.username,
                                                user.email,
                                                hash,
                                            ],
                                            (err) => {
                                                if (err) throw err;
                                                const token =
                                                    createSessionToken({
                                                        id: id,
                                                        username: user.username,
                                                        email: user.email,
                                                    });
                                                return res.status(200).send({
                                                    user: {
                                                        id: id,
                                                        username: user.username,
                                                        email: user.email,
                                                    },
                                                    token: token,
                                                    message:
                                                        "User successfully registered!",
                                                });
                                            }
                                        );
                                    }
                                );
                            } else {
                                return res.status(404).send({
                                    error: "That email is already in use!",
                                });
                            }
                        }
                    );
                } else {
                    return res.status(404).send({
                        error: "That username is already in use!",
                    });
                }
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

/**
 * Route for handling user login
 * @param req Request Object
 * @param res Response Object
 * @returns Response Status
 */
export function loginRoute(req, res) {
    try {
        console.log("nice");
        connection.connect();
        if (!req.body) return res.status(401).send({ error: "Empty request" });
        const user = req.body as LoginUser;

        const validated = loginValidation(user);

        if (validated.passes < 1)
            return res.status(404).send({ error: validated.errors });

        connection.query(
            "SELECT id, username, email, password FROM users WHERE username = ? OR email = ?",
            [user.usernameOrEmail, user.usernameOrEmail],
            (err, results) => {
                if (err) throw err;
                if (results[0].length < 1)
                    throw new Error("User doesn't exist");
                bcrypt.compare(
                    user.password,
                    results[0].password,
                    (err, result) => {
                        if (err) throw err;
                        if (result === true) {
                            const token = createSessionToken({
                                id: results[0].id,
                                username: results[0].username,
                                email: results[0].email,
                            });
                            res.status(200).send({
                                user: {
                                    id: results[0].id,
                                    username: results[0].username,
                                    email: results[0].email,
                                },
                                token,
                                message: "User logged in successfully!",
                            });
                        }
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

/**
 * Route to verify user token
 * @param req Request object
 * @param res Response object
 * @returns Response status
 */
export function verifyAuth(req, res) {
    console.log("verifyAuth");

    try {
        const SESSION_SECRET = process.env.SESSION_SECRET;

        connection.connect();
        const token: string = req.headers.authorization.split("Bearer ")[1];
        let data: any;
        if ((data = jwt.verify(token, SESSION_SECRET))) {
            connection.query(
                "SELECT id, username, email FROM users WHERE id = ?",
                [data.data.id],
                (err, results: any) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        updateSessionToken(
                            {
                                id: results[0].id,
                                username: results[0].username,
                                email: results[0].email,
                            },
                            token,
                            (newToken, err) => {
                                if (err) throw err;
                                const payload = {
                                    isAuth: true,
                                    token: newToken,
                                    user: {
                                        id: results[0].id,
                                        username: results[0].username,
                                        email: results[0].email,
                                    },
                                };
                                return res.send(payload);
                            }
                        );
                    } else {
                        throw new Error("Not quite sure what went wrong!");
                    }
                }
            );
        } else {
            throw new Error("token_verify_failed");
        }
    } catch (error) {
        console.error(error);
        if (error.message === "jwt expired") console.log("it expired");
        return res.send(error);
    }
}
