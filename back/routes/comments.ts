import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Comment, User } from "@utils/interfaces";
import * as dotenv from "dotenv";

export async function getCommentsForPost(req, res) {
    try {
        connection.connect();
        const post_id = req.query.post_id;

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

        if (Object.keys(comment).length < 2) {
            return res.status(401).send({ error: "Request malformed!" });
        }

        if (
            !comment ||
            !comment.post_id ||
            !comment.content ||
            comment.is_reply === null
        ) {
            return res
                .status(401)
                .send({ error: "Please fill out all fields!" });
        }

        //! MAKE SURE THE is_reply FIELD GETS CHANGED FROM NULLISH TO FALSEY

        connection.query(
            "SELECT * from posts WHERE post_id = ?",
            [comment.post_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length > 0) {
                    const comment_id = nanoid(12);
                    connection.query(
                        "INSERT INTO comments (comment_id, user_id, post_id, is_reply, reply_id, content) VALUES (?, ?, ?, ?, ?, ?)",

                        [
                            comment_id,
                            user.user_id,
                            comment.post_id,
                            !!comment.is_reply,
                            comment.reply_id,
                            comment.content,
                        ],
                        (err, results) => {
                            if (err) throw err;
                            if (!comment.reply_id) {
                                comment.comment_id = comment_id;
                                return res.status(200).send({
                                    comment_id,
                                    comment,
                                    message: "Comment created successfully!",
                                });
                            }
                            connection.query(
                                "UPDATE comments, (SELECT COUNT(*) AS comment_count FROM comments WHERE reply_id = ?) AS replies SET comments.num_replies = replies.comment_count WHERE comments.comment_id = ?",
                                [comment.reply_id, comment.reply_id],
                                (err, results) => {
                                    if (err) throw err;
                                    comment.comment_id = comment_id;
                                    return res.status(200).send({
                                        comment_id,
                                        comment,
                                        message:
                                            "Comment created successfully!",
                                    });
                                }
                            );
                        }
                    );
                } else
                    return res.status(404).send({ error: "Post not found!" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function getCommentsByUser(req, res) {
    try {
        connection.connect();
        const user_id = req.query.user_id;

        connection.query(
            "SELECT comment_id, post_id, is_reply, reply_id, content, num_likes, num_replies, created_at FROM comments WHERE user_id = ?",
            [user_id],
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

export async function getRepliesToComment(req, res) {
    try {
        connection.connect();
        const comment_id = req.query.comment_id;

        connection.query(
            "SELECT comment_id, user_id, post_id, is_reply, reply_id, content, num_likes, num_replies, created_at FROM comments WHERE reply_id = ?",
            [comment_id],
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

export async function deleteComment(req, res) {
    try {
        const user_id: string = req.user.user_id;
        const comment_id = req.body.comment.comment_id;

        connection.connect();
        connection.query(
            "DELETE FROM comments WHERE comment_id = ? AND user_id = ?",
            [comment_id, user_id],
            (err, results) => {
                if (err) throw err;
                return res.send({ message: "Comment deleted successfully" });
            }
        );
    } catch (error) {
        return res.send(error);
    }
}
