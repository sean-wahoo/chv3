import { config } from "@utils/connection";
import * as mysql from "mysql2/promise";

export async function getNotifications(req, res) {
    try {
        const user_id = req.user.user_id;
        const connection = await mysql.createConnection(config);

        const [notifications]: any[] = await connection.execute(
            "SELECT notification_id, notification_text, notification_link, notification_type, created_at, user_id FROM notifications WHERE user_id = ?",
            [user_id]
        );
        if (notifications.length === 0) {
            return res.status(200).send({ message: "No notifications found!" });
        }
        connection.destroy();
        return res.send(notifications);
    } catch (error) {
        console.error(error);
        return res.json(error.message);
    }
}

export async function clearOneNotification(req, res) {
    try {
        const user_id = req.user.user_id;
        const notification_id = req.query.notification_id;

        if (!notification_id || notification_id.length === 0) {
            return res
                .status(400)
                .send({ error: "Please provide a notification id" });
        }
        const connection = await mysql.createConnection(config);

        const [notification]: any[] = await connection.execute(
            "SELECT notification_id FROM notifications WHERE notification_id = ?",
            [notification_id]
        );
        if (notification.length === 0) {
            return res.status(400).send({
                error: "Please provide a valid notification id",
            });
        }
        await connection.execute(
            "DELETE FROM notifications WHERE notification_id = ? AND user_id = ?",
            [notification_id, user_id]
        );
        connection.destroy();
        return res.send({ message: "Notification cleared!" });
    } catch (error) {
        console.error(error);
        return res.json(error.message);
    }
}

export async function clearAllNotifications(req, res) {
    try {
        const user_id = req.user.user_id;

        const connection = await mysql.createConnection(config);

        await connection.execute(
            "DELETE FROM notifications WHERE user_id = ?",
            [user_id]
        );
        connection.destroy();
        return res.send({ message: "Notifications cleared!" });
    } catch (error) {
        console.error(error);
        return res.json(error.message);
    }
}
