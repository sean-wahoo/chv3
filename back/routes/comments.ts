import { config } from "@utils/connection";
import { nanoid } from "nanoid";
import { Comment, User } from "@utils/interfaces";
import * as mysql from "mysql2/promise";

export async function getCommentsForPost(req, res) {
    try {
        const connection = await mysql.createConnection(config);
        const post_id = req.query.post_id;

        const parseReplies = async (comment: any) => {
            if (!comment.is_reply) comment.reply_id = null;
            const [nestedCommentData]: any[] = await connection.execute(
                "SELECT users.username, comments.comment_id, comments.post_id, comments.user_id, comments.is_reply, comments.reply_id, comments.content, comments.num_likes, comments.num_replies, comments.created_at FROM comments LEFT JOIN users ON comments.user_id = users.user_id WHERE comments.reply_id = ? ORDER BY(comments.num_likes + comments.num_replies) DESC",
                [comment.comment_id]
            );

            if (nestedCommentData.length === 0) {
                return {
                    comment_id: comment.comment_id,
                    username: comment.username,
                    user_id: comment.user_id,
                    content: comment.content,
                    post_id: comment.post_id,
                    is_reply: comment.is_reply,
                    reply_id: comment.reply_id || null,
                    num_likes: comment.num_likes,
                    num_replies: comment.num_replies,
                };
            }
            const replies = await Promise.all(
                nestedCommentData.map(async (comment) => {
                    return await parseReplies(comment);
                })
            );
            return {
                comment_id: comment.comment_id,
                username: comment.username,
                user_id: comment.user_id,
                content: comment.content,
                post_id: comment.post_id,
                is_reply: comment.is_reply,
                reply_id: comment.reply_id || null,
                num_likes: comment.num_likes,
                num_replies: comment.num_replies,
                replies,
            };
        };

        const [commentData]: any[] = await connection.execute(
            "SELECT users.username, comments.comment_id, comments.post_id, comments.user_id, comments.is_reply, comments.reply_id, comments.content, comments.num_likes, comments.num_replies, comments.created_at FROM comments LEFT JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = ? AND is_reply = false ORDER BY(comments.num_likes + comments.num_replies) DESC",
            [post_id]
        );

        if (commentData.length > 0) {
            const comments = await Promise.all(
                commentData.map(async (comment) => {
                    return await parseReplies(comment);
                })
            );
            connection.destroy();
            return res.send(comments);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function createComment(req, res) {
    try {
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

        const connection = await mysql.createConnection(config);
        const [findPost]: any[] = await connection.execute(
            "SELECT * from posts WHERE post_id = ?",
            [comment.post_id]
        );

        if (findPost.length === 0) {
            return res.status(404).send({ error: "Post not found!" });
        }
        if (!comment.is_reply) comment.reply_id = null;
        const comment_id = nanoid(12);
        await connection.execute(
            "INSERT INTO comments (comment_id, user_id, post_id, is_reply, reply_id, content) VALUES (?, ?, ?, ?, ?, ?)",

            [
                comment_id,
                user.user_id,
                comment.post_id,
                !!comment.is_reply,
                comment.reply_id,
                comment.content,
            ]
        );

        if (!comment.is_reply) {
            comment.comment_id = comment_id;
            return res.status(200).send({
                comment_id,
                comment,
                message: "Comment created successfully!",
            });
        }

        await connection.execute(
            "UPDATE comments, (SELECT COUNT(*) AS comment_count FROM comments WHERE reply_id = ?) AS replies SET comments.num_replies = replies.comment_count WHERE comments.comment_id = ?",
            [comment.reply_id, comment.reply_id]
        );
        comment.comment_id = comment_id;
        connection.destroy();
        return res.status(200).send({
            comment_id,
            comment,
            message: "Comment created successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function getCommentsByUser(req, res) {
    try {
        const connection = await mysql.createConnection(config);
        const user_id = req.query.user_id;

        const [commentsByUser]: any[] = await connection.execute(
            "SELECT comment_id, post_id, is_reply, reply_id, content, num_likes, num_replies, created_at FROM comments WHERE user_id = ?",
            [user_id]
        );
        connection.destroy();
        return res.send(commentsByUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function getRepliesToComment(req, res) {
    try {
        const connection = await mysql.createConnection(config);
        const comment_id = req.query.comment_id;

        const [repliesToComment]: any[] = await connection.execute(
            "SELECT comment_id, user_id, post_id, is_reply, reply_id, content, num_likes, num_replies, created_at FROM comments WHERE reply_id = ?",
            [comment_id]
        );

        if (repliesToComment.length === 0) {
            return res.send({ message: "No replies!" });
        }
        connection.destroy();
        return res.status(200).send(repliesToComment);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function deleteComment(req, res) {
    try {
        const user_id: string = req.user.user_id;
        const comment_id = req.body.comment.comment_id;

        const connection = await mysql.createConnection(config);

        await connection.execute(
            "DELETE FROM comments WHERE comment_id = ? AND user_id = ?",
            [comment_id, user_id]
        );
        connection.destroy();
        return res.send({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.send(error);
    }
}
