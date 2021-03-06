import { RegisterUser, LoginUser, User, GoogleUser } from "@utils/interfaces";
import { connection } from "@utils/connection";
import { registerValidation, loginValidation } from "@utils/validation";
import { createSessionToken, updateSessionToken } from "@utils/session";
import bcrypt = require("bcrypt");
import * as jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import * as dotenv from "dotenv";
dotenv.config();
const SESSION_SECRET: string = process.env.SESSION_SECRET;

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
            "SELECT username, email, isGoogle FROM users WHERE username = ?",
            [user.username],
            (error, results: any) => {
                if (error) throw error;

                // if (results[0].length > 0) {
                //     if (results[0])
                // }

                if (results.length === 0) {
                    connection.query(
                        "SELECT email, isGoogle FROM users WHERE email = ?",
                        [user.email],
                        (error, results: any) => {
                            if (error) throw error;

                            if (results.length === 0) {
                                bcrypt.hash(
                                    user.password,
                                    saltRounds,
                                    (err, hash) => {
                                        if (err) throw err;
                                        const user_id = nanoid();
                                        connection.query(
                                            "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)",
                                            [
                                                user_id,
                                                user.username,
                                                user.email,
                                                hash,
                                            ],
                                            (err) => {
                                                if (err) throw err;
                                                const token =
                                                    createSessionToken({
                                                        user_id,
                                                        username: user.username,
                                                        email: user.email,
                                                    });
                                                return res.status(200).send({
                                                    user: {
                                                        user_id,
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
        connection.connect();
        if (!req.body) return res.status(401).send({ error: "Empty request" });
        const user = req.body as LoginUser;

        const validated = loginValidation(user);

        if (validated.passes < 1)
            return res.status(404).send({ error: validated.errors });

        connection.query(
            "SELECT user_id, username, email, password, isGoogle FROM users WHERE username = ? OR email = ?",
            [user.usernameOrEmail, user.usernameOrEmail],
            (err, results: any) => {
                if (err) throw err;
                if (results.length < 1) {
                    return res.status(403).send({
                        error: "User not found!",
                    });
                }
                if (results[0].isGoogle === 1) {
                    return res.status(403).send({
                        error: "This email already in use!",
                    });
                }
                bcrypt.compare(
                    user.password,
                    results[0].password,
                    (err, result) => {
                        if (err) throw err;
                        if (result === true) {
                            const token = createSessionToken({
                                user_id: results[0].user_id,
                                username: results[0].username,
                                email: results[0].email,
                            });
                            res.status(200).send({
                                user: {
                                    user_id: results[0].user_id,
                                    username: results[0].username,
                                    email: results[0].email,
                                },
                                token,
                                message: "User logged in successfully!",
                            });
                        } else {
                            return res
                                .status(403)
                                .send({ error: "Incorrect password!" });
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
    try {
        const SESSION_SECRET = process.env.SESSION_SECRET;

        connection.connect();
        const token: string = req.headers.authorization.split("Bearer ")[1];
        let data: any;
        if ((data = jwt.verify(token, SESSION_SECRET))) {
            connection.query(
                "SELECT user_id, username, email FROM users WHERE user_id = ?",
                [data.data.user_id],
                (err, results: any) => {
                    if (err) throw err;

                    if (results.length > 0) {
                        updateSessionToken(
                            {
                                user_id: results[0].user_id,
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
                                        user_id: results[0].user_id,
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

export function deleteUser(req, res) {
    try {
        connection.connect();
        const token: string = req.headers.authorization.split("Bearer ")[1];

        const decodedUser: any = jwt.verify(token, SESSION_SECRET);

        const user_id = decodedUser.data.user_id;
        console.log(decodedUser.data.user_id);
        connection.query(
            "DELETE FROM users WHERE user_id = ?",
            [user_id],
            (err, results) => {
                if (err) throw err;
                console.log(user_id);
                return res
                    .status(200)
                    .send({ message: "User successfully deleted" });
            }
        );
    } catch (error) {
        console.error(error);
    }
}

export function googleSignIn(req, res) {
    try {
        const googleUser = req.body as GoogleUser;

        connection.connect();
        connection.query(
            "SELECT user_id, email, isGoogle from users WHERE email = ?",
            [googleUser.email],
            (err, results: any) => {
                if (err) throw err;
                if (results.length > 0) {
                    if (results[0].isGoogle === 0 && results[0].email !== "") {
                        return res.status(403).send({
                            error: "Email already in use!",
                        });
                    }
                    googleUser.user_id = results[0].user_id;
                    const token = createSessionToken(googleUser);
                    return res.send({
                        user: {
                            user_id: results[0].user_id,
                            username: results[0].username,
                            email: results[0].email,
                        },
                        token,
                        message: "User logged in successfully",
                    });
                }

                const user_id = nanoid();
                connection.query(
                    "INSERT INTO users (user_id, username, email, isGoogle) VALUES (?, ?, ?, ?)",
                    [user_id, googleUser.username, googleUser.email, 1],
                    (err, results) => {
                        if (err) throw err;
                        googleUser.user_id = user_id;
                        const token = createSessionToken(googleUser);
                        return res.send({
                            user: {
                                user_id,
                                username: googleUser.username,
                                email: googleUser.email,
                            },
                            token,
                            message: "User logged in successfully",
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        return res.send(error);
    }
}
