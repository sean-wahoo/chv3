import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Friendship, User } from "@utils/interfaces";

export async function getUsersFriends(req, res) {
    try {
        const user_id = req.query.user_id;
        connection.connect();
        connection.query(
            "SELECT friendship_id, send_user_id, recieve_user_id, status, updated_at FROM friends WHERE status = 'accepted' AND send_user_id = ? OR status = 'accepted' ANDrecieve_user_id = ?",
            [user_id, user_id],
            (err, results) => {
                if (err) throw err;
                return res.send(results);
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const send_user_id = req.user.user_id;
        const recieve_user_id = req.query.user_id;
        connection.connect();
        connection.query(
            "SELECT send_user_id, recieve_user_id, status FROM friends WHERE send_user_id = ? AND recieve_user_id = ? OR recieve_user_id = ? AND send_user_id = ?",
            [send_user_id, recieve_user_id, send_user_id, recieve_user_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length > 0) {
                    if (results[0].status === "accepted") {
                        return res.status(400).send({
                            error: "You are already friends with this user!",
                        });
                    } else if (results[0].status === "pending") {
                        return res.status(400).send({
                            error: "You already sent a friend request to this user!",
                        });
                    } else {
                        return res.status(500).send(results);
                    }
                }
                const friendship_id = nanoid(12);

                connection.query(
                    "INSERT INTO friends (friendship_id, send_user_id, recieve_user_id) VALUES (?, ?, ?)",
                    [friendship_id, send_user_id, recieve_user_id],
                    (err, results) => {
                        if (err) throw err;
                        return res.send({
                            message: "Request sent successfully!",
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const recieve_user_id = req.user.user_id;
        const send_user_id = req.query.user_id;
        connection.connect();

        connection.query(
            "SELECT friendship_id, status FROM friends WHERE send_user_id = ? AND recieve_user_id = ?",
            [send_user_id, recieve_user_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length !== 1) {
                    return res.status(500).send({
                        error: "There is no friend request to accept!",
                    });
                }
                if (results[0].status === "accepted") {
                    return res
                        .status(400)
                        .send({ error: "Friend request already accepted!" });
                }
                if (results[0].status === "pending") {
                    const friendship_id = results[0].friendship_id;
                    connection.query(
                        "UPDATE friends SET status = 'accepted' WHERE friendship_id = ?",
                        [friendship_id],
                        (err, results) => {
                            if (err) throw err;
                            return res.send({
                                message: "Friend request accepted!",
                            });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function declineFriendRequest(req, res) {
    try {
        const recieve_user_id = req.user.user_id;
        const send_user_id = req.query.user_id;
        connection.connect();

        connection.query(
            "SELECT friendship_id, status FROM friends WHERE send_user_id = ? AND recieve_user_id = ?",
            [send_user_id, recieve_user_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length !== 1) {
                    return res.status(500).send({
                        error: "There is no friend request to decline!",
                    });
                }
                if (results[0].status === "accepted") {
                    return res
                        .status(400)
                        .send({ error: "Friend request already accepted!" });
                }
                if (results[0].status === "pending") {
                    const friendship_id = results[0].friendship_id;
                    connection.query(
                        "DELETE FROM friends WHERE friendship_id = ? AND status = 'pending'",
                        [friendship_id],
                        (err, results) => {
                            if (err) throw err;
                            return res.send({
                                message: "Friend request declined!",
                            });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function removeFriend(req, res) {
    try {
        const remover_user_id = req.user.user_id;
        const removed_user_id = req.query.user_id;

        connection.connect();
        connection.query(
            "SELECT friendship_id FROM friends WHERE status = 'accepted' AND send_user_id = ? AND recieve_user_id = ? OR status = 'accepted' AND send_user_id = ? AND recieve_user_id = ?",
            [
                remover_user_id,
                removed_user_id,
                removed_user_id,
                remover_user_id,
            ],
            (err, results: any) => {
                if (err) throw err;
                if (results.length === 0) {
                    return res
                        .status(400)
                        .send({ error: "You aren't friends with this user!" });
                }
                connection.query(
                    "DELETE FROM friends WHERE friendship_id = ?",
                    [results[0].friendship_id],
                    (err, results) => {
                        if (err) throw err;
                        return res.send({
                            message: "Friendship successfully removed!",
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
