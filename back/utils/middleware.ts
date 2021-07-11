import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { config } from "@utils/connection";
import * as mysql from "mysql2/promise";
import { Friendship } from "@utils/interfaces";

dotenv.config();

export function protectedMiddleware(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(403).send({ error: "No auth header!" });
        }
        if (!req.headers.authorization.includes("Bearer")) {
            return res.status(403).send({ error: "Malformed auth header!" });
        }
        if (req.headers.authorization.split("Bearer ").length !== 2) {
            return res.status(403).send({ error: "No auth token!" });
        }
        const SESSION_SECRET = process.env.SESSION_SECRET;
        const token: string = req.headers.authorization.split("Bearer ")[1];
        let data;
        if ((data = jwt.verify(token, SESSION_SECRET))) {
            req.user = data.data;
            return next();
        }

        return res.status(403).send({ error: "JWT failed!" });
    } catch (error) {
        console.error(error);
        return res.status(403).send(error);
    }
}

export async function friendMiddleware(req, res, next) {
    try {
        const logged_in_user_id: string = req.user.user_id;
        const other_user_id: string = req.query.user_id;

        if (!other_user_id || other_user_id.length === 0) {
            return res
                .status(403)
                .send({ error: "Please provide a user id for your friend!" });
        }

        if (logged_in_user_id === other_user_id) {
            return res.status(404).send({
                error: "You can't be friends with yourself!",
            });
        }

        const connection = await mysql.createConnection(config);

        const [doesFriendshipExist]: any[] = await connection.execute(
            "SELECT friendship_id, status, send_user_id, recieve_user_id, created_at, updated_at FROM friends WHERE (send_user_id = ? AND recieve_user_id = ? AND status = 'accepted') OR (recieve_user_id = ? AND send_user_id = ? AND status = 'accepted')",
            [logged_in_user_id, other_user_id, logged_in_user_id, other_user_id]
        );

        if (doesFriendshipExist.length === 0) {
            return res.status(403).send({ error: "Friendship not found!" });
        }

        const friendship: Friendship = {
            friendship_id: doesFriendshipExist[0].friendship_id,
            send_user_id: doesFriendshipExist[0].send_user_id,
            recieve_user_id: doesFriendshipExist[0].recieve_user_id,
            logged_in_user_id,
            other_user_id,
            status: doesFriendshipExist[0].status,
            updated_at: doesFriendshipExist[0].updated_at,
            created_at: doesFriendshipExist[0].created_at,
        };

        req.friendship = friendship;
        connection.destroy();
        return next();
    } catch (error) {
        console.error(error);
        return res
            .status(403)
            .send({ message: "Friendship couldn't be verified!", error });
    }
}
