import { config } from "@utils/connection";
import { nanoid } from "nanoid";
import * as mysql from "mysql2/promise";

export async function getUsersLikes(req, res) {
    try {
        const connection = await mysql.createConnection(config);
        const user_id = req.query.user_id;

        const [usersLikes] = await connection.execute(
            "SELECT like_id, post_id, comment_id, created_at FROM likes WHERE user_id = ?",
            [user_id]
        );
        connection.destroy();
        return res.send(usersLikes);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function likePost(req, res) {
    try {
        const user_id = req.user.user_id;
        const post_id = req.query.post_id;
        const like_id = nanoid(12);

        if (!post_id || post_id.length === 0) {
            return res.status(400).send({ error: "Please provide a post id" });
        }

        const connection = await mysql.createConnection(config);

        const [post]: any[] = await connection.execute(
            "SELECT * FROM posts WHERE post_id = ?",
            [post_id]
        );

        if (post.length === 0) {
            return res
                .status(400)
                .send({ error: "Please provide a valid post id" });
        }

        const [isPostLiked]: any[] = await connection.execute(
            "SELECT * from likes WHERE user_id = ? AND post_id = ?",
            [user_id, post_id]
        );
        if (isPostLiked.length !== 0) {
            return res.status(400).send({ error: "Post already liked" });
        }
        await connection.execute(
            "INSERT INTO likes (like_id, user_id, post_id) VALUES (?, ?, ?)",
            [like_id, user_id, post_id]
        );
        connection.destroy();
        return res.send({
            like_id,
            message: `Post ${post_id} liked!`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function likeComment(req, res) {
    try {
        const user_id = req.user.user_id;
        const comment_id = req.query.comment_id;
        const like_id = nanoid(12);

        if (!comment_id || comment_id.length === 0) {
            return res
                .status(400)
                .send({ error: "Please provide a comment id" });
        }

        const connection = await mysql.createConnection(config);

        const [comment]: any[] = await connection.execute(
            "SELECT * FROM comments WHERE comment_id = ?",
            [comment_id]
        );
        if (comment.length === 0) {
            return res
                .status(400)
                .send({ error: "Please provide a valid comment id" });
        }

        const [isCommentLiked]: any[] = await connection.execute(
            "SELECT * from likes WHERE user_id = ? AND comment_id = ?",
            [user_id, comment_id]
        );

        if (isCommentLiked.length !== 0) {
            return res.status(400).send({ error: "Comment already liked" });
        }
        await connection.execute(
            "INSERT INTO likes (like_id, user_id, comment_id) VALUES (?, ?, ?)",
            [like_id, user_id, comment_id]
        );
        connection.destroy();
        return res.send({
            like_id,
            message: `Comment ${comment_id} liked!`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function unlikePostOrComment(req, res) {
    try {
        const like_id = req.query.like_id;
        const user_id = req.user.user_id;

        const connection = await mysql.createConnection(config);

        await connection.execute(
            "DELETE FROM likes WHERE like_id = ? AND user_id = ?",
            [like_id, user_id]
        );
        connection.destroy();
        return res.send({
            message: `Post or comment with like_id ${like_id} unliked!`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
