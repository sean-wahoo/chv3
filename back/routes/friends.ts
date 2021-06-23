import { config } from "@utils/connection";
import { nanoid } from "nanoid";
import * as mysql from "mysql2/promise";

export async function getUsersFriends(req, res) {
    try {
        const user_id = req.query.user_id;
        const connection = await mysql.createConnection(config);

        const [usersFriends]: any[] = await connection.execute(
            "SELECT friendship_id, send_user_id, recieve_user_id, status, updated_at FROM friends WHERE status = 'accepted' AND send_user_id = ? OR status = 'accepted' AND recieve_user_id = ?",
            [user_id, user_id]
        );
        return res.send(usersFriends);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

export async function getUsersFriendRequests(req, res) {
    try {
        const user_id = req.user.user_id;
        const connection = await mysql.createConnection(config);

        const [friendRequests]: any[] = await connection.execute(
            "SELECT friendship_id, send_user_id, created_at FROM friends WHERE send_user_id = ? AND status = 'pending'",
            [user_id]
        );

        if (friendRequests.length === 0) {
            return res.send({
                message: "You don't have any friend requests!",
            });
        }
        return res.send(friendRequests);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const send_user_id = req.user.user_id;
        const recieve_user_id = req.query.user_id;

        if (send_user_id === recieve_user_id) {
            return res.status(400).send({
                error: "You can't send a friend request to yourself!",
            });
        }

        const connection = await mysql.createConnection(config);

        const [userToReceiveRequest]: any[] = await connection.execute(
            "SELECT * from users WHERE user_id = ?",
            [recieve_user_id]
        );
        if (userToReceiveRequest.length === 0) {
            return res.status(400).send({ error: "User doesn't exist!" });
        }

        const [friendshipData]: any[] = await connection.execute(
            "SELECT send_user_id, recieve_user_id, status FROM friends WHERE send_user_id = ? AND recieve_user_id = ? OR recieve_user_id = ? AND send_user_id = ?",
            [send_user_id, recieve_user_id, send_user_id, recieve_user_id]
        );

        if (
            friendshipData.length !== 0 &&
            friendshipData[0].status === "accepted"
        ) {
            return res.status(400).send({
                error: "You are already friends with this user!",
            });
        }
        if (
            friendshipData.length !== 0 &&
            friendshipData[0].status === "pending"
        ) {
            return res.status(400).send({
                error: "You already sent a friend request to this user!",
            });
        }
        const friendship_id = nanoid(12);

        await connection.execute(
            "INSERT INTO friends (friendship_id, send_user_id, recieve_user_id) VALUES (?, ?, ?)",
            [friendship_id, send_user_id, recieve_user_id]
        );
        return res.send({
            friendship_id,
            message: "Request sent successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const recieve_user_id = req.user.user_id;
        const send_user_id = req.query.user_id;
        const connection = await mysql.createConnection(config);

        const [friendshipData]: any[] = await connection.execute(
            "SELECT friendship_id, status FROM friends WHERE send_user_id = ? AND recieve_user_id = ?",
            [send_user_id, recieve_user_id]
        );

        if (friendshipData.length === 0) {
            return res.status(400).send({
                error: "There is no friend request to accept!",
            });
        }
        if (friendshipData[0].status === "accepted") {
            return res
                .status(400)
                .send({ error: "Friend request already accepted!" });
        }

        const friendship_id = friendshipData[0].friendship_id;
        await connection.execute(
            "UPDATE friends SET status = 'accepted' WHERE friendship_id = ?",
            [friendship_id]
        );
        return res.send({
            message: "Friend request accepted!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function declineFriendRequest(req, res) {
    try {
        const recieve_user_id = req.user.user_id;
        const send_user_id = req.query.user_id;
        const connection = await mysql.createConnection(config);

        const [friendshipData]: any[] = await connection.execute(
            "SELECT friendship_id, status FROM friends WHERE send_user_id = ? AND recieve_user_id = ?",
            [send_user_id, recieve_user_id]
        );
        if (friendshipData.length === 0) {
            return res.status(400).send({
                error: "There is no friend request to decline!",
            });
        }
        if (friendshipData[0].status === "accepted") {
            return res
                .status(400)
                .send({ error: "Friend request already accepted!" });
        }
        const friendship_id = friendshipData[0].friendship_id;
        await connection.execute(
            "DELETE FROM friends WHERE friendship_id = ? AND status = 'pending'",
            [friendship_id]
        );
        return res.send({
            message: "Friend request declined!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function removeFriend(req, res) {
    try {
        const remover_user_id = req.user.user_id;
        const removed_user_id = req.query.user_id;

        const connection = await mysql.createConnection(config);

        const [friendshipData]: any[] = await connection.execute(
            "SELECT friendship_id FROM friends WHERE status = 'accepted' AND send_user_id = ? AND recieve_user_id = ? OR status = 'accepted' AND send_user_id = ? AND recieve_user_id = ?",
            [remover_user_id, removed_user_id, removed_user_id, remover_user_id]
        );
        if (friendshipData.length === 0) {
            return res
                .status(400)
                .send({ error: "You aren't friends with this user!" });
        }

        await connection.execute(
            "DELETE FROM friends WHERE friendship_id = ?",
            [friendshipData[0].friendship_id]
        );

        return res.send({
            message: "Friendship successfully removed!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
