import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { connection } from "@utils/connection";
import { Friendship } from "@utils/interfaces";

dotenv.config();

export function protectedMiddleware(req, res, next) {
    try {
        const SESSION_SECRET = process.env.SESSION_SECRET;
        const token: string = req.headers.authorization.split("Bearer ")[1];
        let data;
        if ((data = jwt.verify(token, SESSION_SECRET))) {
            req.user = data.data;
            next();
        } else {
            return res.status(403).send({ error: "jwt failed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(403).send(error);
    }
}

export function friendMiddleware(req, res, next) {
    try {
        const logged_in_user_id: string = req.user.user_id;
        const other_user_id: string = req.query.user_id;

        console.log(logged_in_user_id, other_user_id);

        if (logged_in_user_id !== other_user_id) {
            connection.connect();
            connection.query(
                "SELECT friendship_id, status, send_user_id, recieve_user_id, created_at, updated_at FROM friends WHERE (send_user_id = ? AND recieve_user_id = ?) OR (recieve_user_id = ? AND send_user_id = ?)",
                [
                    logged_in_user_id,
                    other_user_id,
                    logged_in_user_id,
                    other_user_id,
                ],
                (err, results: any) => {
                    if (err) throw err;
                    if (results.length === 0) {
                        return res
                            .status(403)
                            .send({ error: "Friendship not found!" });
                    }
                    const friendship: Friendship = {
                        friendship_id: results[0].friendship_id,
                        send_user_id: results[0].send_user_id,
                        recieve_user_id: results[0].recieve_user_id,
                        logged_in_user_id,
                        other_user_id,
                        status: results[0].status,
                        updated_at: results[0].updated_at,
                        created_at: results[0].created_at,
                    };

                    req.friendship = friendship;
                    next();
                }
            );
        } else {
            res.status(404).send({
                error: "Whatever you did was not allowed. Stop!",
            });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(403)
            .send({ message: "Friendship couldn't be verified!", error });
    }
}
