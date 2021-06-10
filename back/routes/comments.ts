import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Comment, User } from "@utils/interfaces";
import * as dotenv from "dotenv";

export async function getCommentsForPost(req, res) {
    try {
        connection.connect();
        const post_id = req.body.post_id;

        connection.query(
            "SELECT comment_id, user_id, is_reply, reply_id, content, num_likes, num_replies, created_at FROM comments WHERE post_id = ?",
            [post_id],
            (err, results) => {
                if (err) throw err;
                console.log(results);
                return res.status(200).send(results);
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function createComment(req, res) {
    try {
        connection.connect();
        const user = req.user as User;
        const comment = req.body as Comment;

        connection.query(
            "INSERT INTO comments (comment_id, user_id, post_id, is_reply, reply_id, content) VALUES (?, ?, ?, ?, ?, ?)",
            [
                comment.comment_id,
                user.user_id,
                comment.post_id,
                comment.is_reply,
                comment.reply_id,
                comment.content,
            ],
            (err, results) => {
                if (err) throw err;
                console.log(results);
                return res.status(200).send({
                    message: "Comment created successfully!",
                });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
