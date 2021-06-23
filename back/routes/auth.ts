import { RegisterUser, LoginUser, User, GoogleUser } from "@utils/interfaces";
import { config } from "@utils/connection";
import * as mysql from "mysql2/promise";
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
        /**
         * @type {number}
         * used to create password hash
         */
        const saltRounds = 10;

        /**
         * @type {mysql.Connection}
         * connection object for mysql queries
         */
        const connection = await mysql.createConnection(config);

        if (!req.body) return res.status(401).send({ error: "Empty request" });

        /**
         * @type {User}
         * user data object to describe request body
         */
        const user = req.body as RegisterUser;

        /**
         * @type {object}
         * dictates what checks the users data has passed or failed
         */
        const validated = registerValidation(user);

        if (validated.passes < 3)
            return res.status(404).send({ error: validated.errors });

        /**
         * @type {RowDataPacket[] | []}
         * result from query for users with a given username
         */
        const [usersWithUsername]: any[] = await connection.execute(
            "SELECT username, email, isGoogle FROM users WHERE username = ?",
            [user.username]
        );

        if (usersWithUsername.length > 0) {
            return res.status(404).send({
                error: "That username is already in use!",
            });
        }

        const [usersWithEmail]: any[] = await connection.execute(
            "SELECT email, isGoogle FROM users WHERE email = ?",
            [user.email]
        );

        if (usersWithEmail.length > 0) {
            return res.status(404).send({
                error: "That email is already in use!",
            });
        }

        /**
         * @type {string}
         * password hash to take the place of the user's actual password
         */
        const hash = await bcrypt.hash(user.password, saltRounds);

        /**
         * @type {string}
         * unique identifier for user
         */
        const user_id = nanoid();
        connection.execute(
            "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)",
            [user_id, user.username, user.email, hash]
        );

        /**
         * @type {string}
         * session identifying token to be stored on the users browser
         *
         * contains user data
         */
        const token = createSessionToken({
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
            message: "User successfully registered!",
        });
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
export async function loginRoute(req, res) {
    try {
        if (!req.body) return res.status(401).send({ error: "Empty request" });

        /**
         * @type {User}
         * user data object to describe request body
         */
        const user = req.body as LoginUser;

        /**
         * @type {object}
         * dictates what checks the users data has passed or failed
         */
        const validated = loginValidation(user);

        if (validated.passes < 1)
            return res.status(404).send({ error: validated.errors });

        /**
         * @type {mysql.Connection}
         * connection object for mysql queries
         */
        const connection = await mysql.createConnection(config);

        const [doesUserExist]: any[] = await connection.execute(
            "SELECT user_id, username, email, password, isGoogle FROM users WHERE username = ? OR email = ?",
            [user.usernameOrEmail, user.usernameOrEmail]
        );

        if (doesUserExist.length === 0) {
            return res.status(403).send({
                error: "User not found!",
            });
        }
        if (doesUserExist[0].isGoogle === true) {
            return res.status(403).send({
                error: "This email already in use!",
            });
        }

        /**
         * @type {boolean}
         * whether or not the user's password is correct
         */
        const match = await bcrypt.compare(
            user.password,
            doesUserExist[0].password
        );

        if (!match) {
            return res.status(403).send({ error: "Incorrect password!" });
        }

        /**
         * @type {string}
         * session identifying token to be stored on the users browser
         *
         * contains user data
         */
        const token = createSessionToken({
            user_id: doesUserExist[0].user_id,
            username: doesUserExist[0].username,
            email: doesUserExist[0].email,
        });
        res.status(200).send({
            user: {
                user_id: doesUserExist[0].user_id,
                username: doesUserExist[0].username,
                email: doesUserExist[0].email,
            },
            token,
            message: "User logged in successfully!",
        });
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
export async function verifyAuth(req, res) {
    try {
        /**
         * @type {string}
         * secret used by jwt to create a session token and verify it on the server
         */
        const SESSION_SECRET = process.env.SESSION_SECRET;

        /**
         * @type {string}
         * session identifying token to be stored on the users browser
         *
         * contains user data
         */
        const token: string = req.headers.authorization.split("Bearer ")[1];

        /**
         * @type {string | undefined}
         * placeholder variable to put the decoded jwt data into
         */
        let data: any;
        if ((data = jwt.verify(token, SESSION_SECRET))) {
            /**
             * @type {mysql.Connection}
             * connection object for mysql queries
             */
            const connection = await mysql.createConnection(config);
            const [verifiedUser]: any[] = await connection.execute(
                "SELECT user_id, username, email FROM users WHERE user_id = ?",
                [data.data.user_id]
            );

            if (verifiedUser.length === 0) {
                throw new Error("Not quite sure what went wrong!");
            }

            /**
             * @type {string}
             * updated session token with updated user data
             */
            const newToken = await updateSessionToken(
                {
                    user_id: verifiedUser[0].user_id,
                    username: verifiedUser[0].username,
                    email: verifiedUser[0].email,
                },
                token
            );

            /**
             * @type {object}
             * data to be returned after verifying a user is authenticated
             */
            const payload = {
                isAuth: true,
                token: newToken,
                user: {
                    user_id: verifiedUser[0].user_id,
                    username: verifiedUser[0].username,
                    email: verifiedUser[0].email,
                },
            };
            return res.send(payload);
        } else {
            throw new Error("token_verify_failed");
        }
    } catch (error) {
        console.error(error);
        // TODO: fix this
        if (error.message === "jwt expired") console.log("it expired");
        return res.send(error);
    }
}

/**
 * Route to delete a user
 * @internal NOT TO BE USED BY NORMAL USERS
 * @param req Request object
 * @param res Response object
 * @returns Response status
 */
export async function deleteUser(req, res) {
    try {
        /**
         * @type {mysql.Connection}
         * connection object for mysql queries
         */
        const connection = await mysql.createConnection(config);

        /**
         * @type {string}
         * session identifying token to be stored on the users browser
         *
         * contains user data
         */
        const token: string = req.headers.authorization.split("Bearer ")[1];

        /**
         * @type {object}
         * decoded user data from successful token verification
         */
        const decodedUser: any = jwt.verify(token, SESSION_SECRET);

        /**
         * @type {string}
         * user id from {decodedUser} variable
         */
        const user_id = decodedUser.data.user_id;
        await connection.execute("DELETE FROM users WHERE user_id = ?", [
            user_id,
        ]);
        return res.status(200).send({ message: "User successfully deleted" });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Route to register or log in a user with Google auth
 * @param req Request object
 * @param res Response object
 * @returns Response status
 */
export async function googleSignIn(req, res) {
    try {
        /**
         * @type {GoogleUser}
         * google user data object to describe request body
         */
        const googleUser = req.body as GoogleUser;

        /**
         * @type {mysql.Connection}
         * connection object for mysql queries
         */
        const connection = await mysql.createConnection(config);

        const [doesGoogleUserExist]: any[] = await connection.execute(
            "SELECT user_id, email, isGoogle from users WHERE email = ?",
            [googleUser.email]
        );
        if (doesGoogleUserExist.length === 0) {
            if (
                !doesGoogleUserExist[0].isGoogle &&
                doesGoogleUserExist[0].email.length > 0
            ) {
                return res.status(403).send({
                    error: "Email already in use!",
                });
            }
            googleUser.user_id = doesGoogleUserExist[0].user_id;

            /**
             * @type {string}
             * session identifying token to be stored on the users browser
             *
             * contains user data
             */
            const token = createSessionToken(googleUser);
            return res.send({
                user: {
                    user_id: doesGoogleUserExist[0].user_id,
                    username: doesGoogleUserExist[0].username,
                    email: doesGoogleUserExist[0].email,
                },
                token,
                message: "User logged in successfully",
            });
        }

        /**
         * @type {string}
         * uniquely generated user id
         */
        const user_id: string = nanoid();
        await connection.execute(
            "INSERT INTO users (user_id, username, email, isGoogle) VALUES (?, ?, ?, ?)",
            [user_id, googleUser.username, googleUser.email, true]
        );

        /**
         * @type {string}
         * session identifying token to be stored on the users browser
         *
         * contains user data
         */
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
    } catch (error) {
        console.error(error);
        return res.send(error);
    }
}
