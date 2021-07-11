import { connection } from "@utils/connection";
import { nanoid } from "nanoid";

export async function getNotifications(req, res) {
    try {
        const user_id = req.user.user_id;
        connection.connect();
        connection.query(
            "SELECT notification_id, notification_text, notification_link, notification_type, created_at, user_id FROM notifications WHERE user_id = ?",
            [user_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length === 0) {
                    return res
                        .status(200)
                        .send({ message: "No notifications found!" });
                }
                return res.send(results);
            }
        );
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
        connection.connect();
        connection.query(
            "SELECT notification_id FROM notifications WHERE notification_id = ?",
            [notification_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length === 0) {
                    return res.status(400).send({
                        error: "Please provide a valid notification id",
                    });
                }
                connection.query(
                    "DELETE FROM notifications WHERE notification_id = ? AND user_id = ?",
                    [notification_id, user_id],
                    (err, results) => {
                        if (err) throw err;
                        return res.send({ message: "Notification cleared!" });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        return res.json(error.message);
    }
}

export async function clearAllNotifications(req, res) {
    try {
        const user_id = req.user.user_id;

        connection.connect();
        connection.query(
            "DELETE FROM notifications WHERE user_id = ?",
            [user_id],
            (err, results) => {
                if (err) throw err;
                return res.send({ message: "Notifications cleared!" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.json(error.message);
    }
}
