import { config } from "@utils/connection";
import * as mysql from "mysql2/promise";
import { nanoid } from "nanoid";
import { Message, User } from "@utils/interfaces";

export async function getMessages(req, res) {
    try {
        const friendship = req.friendship;
        const connection = await mysql.createConnection(config);

        const [messages]: any[] = await connection.execute(
            "SELECT message_id, content, is_read, created_at FROM messages WHERE friendship_id = ? ORDER BY created_at DESC",
            [friendship.friendship_id]
        );
        return res.send(messages);
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

        if (!content || content.trim().length === 0) {
            return res.status(401).send({ error: "Please provide a message!" });
        }

        const connection = await mysql.createConnection(config);
        await connection.execute(
            "INSERT INTO messages (message_id, friendship_id, send_user_id, recieve_user_id, content) VALUES (?, ?, ?, ?, ?)",
            [
                message_id,
                friendship_id,
                logged_in_user_id,
                other_user_id,
                content,
            ]
        );
        return res.send({
            message_id,
            message: "Message sent successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function updateReadMessages(req, res) {
    try {
        const { friendship_id, logged_in_user_id, other_user_id } =
            req.friendship;
        const connection = await mysql.createConnection(config);

        await connection.execute(
            "UPDATE messages SET is_read = true WHERE friendship_id = ? AND recieve_user_id = ? AND send_user_id = ?",
            [friendship_id, logged_in_user_id, other_user_id]
        );
        return res.send({ message: "Messages have been read!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
