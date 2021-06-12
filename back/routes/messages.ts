import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Message, User } from "@utils/interfaces";

export async function getMessages(req, res) {
    try {
        const friendship = req.friendship;
        connection.connect();
        connection.query(
            "SELECT message_id, content, is_read, created_at FROM messages WHERE friendship_id = ? ORDER BY created_at DESC",
            [friendship.friendship_id],
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

export async function sendMessage(req, res) {
    try {
        const content = req.body.content;
        const { friendship_id, logged_in_user_id, other_user_id } =
            req.friendship;
        const message_id = nanoid(18);

        connection.connect();

        connection.query(
            "INSERT INTO messages (message_id, friendship_id, send_user_id, recieve_user_id, content) VALUES (?, ?, ?, ?, ?)",
            [
                message_id,
                friendship_id,
                logged_in_user_id,
                other_user_id,
                content,
            ],
            (err, results) => {
                if (err) throw err;
                return res.send({ message: "Message sent successfully!" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function updateReadMessages(req, res) {
    try {
        const { friendship_id, logged_in_user_id, other_user_id } =
            req.friendship;
        connection.connect();
        connection.query(
            "UPDATE messages SET is_read = true WHERE friendship_id = ? AND recieve_user_id = ? AND send_user_id = ?",
            [friendship_id, logged_in_user_id, other_user_id],
            (err, results) => {
                if (err) throw err;
                return res.send({ message: "Messages have been read!" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
