import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Like, User } from "@utils/interfaces";

export async function getUsersLikes(req, res) {
    try {
        connection.connect();
        const user_id = req.query.user_id;

        connection.query(
            "SELECT like_id, post_id, comment_id, created_at FROM likes WHERE user_id = ?",
            [user_id],
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

export async function likePost(req, res) {
    try {
        connection.connect();
        const user_id = req.user.user_id;
        const post_id = req.query.post_id;
        const like_id = nanoid(12);

        if (!post_id || post_id.length === 0) {
            return res.status(400).send({ error: "Please provide a post id" });
        }

        connection.query(
            "SELECT * FROM posts WHERE post_id = ?",
            [post_id],
            (err, results: any) => {
                if (err) throw err;
                if (results.length === 0) {
                    return res
                        .status(400)
                        .send({ error: "Please provide a valid post id" });
                }
                connection.query(
                    "INSERT INTO likes (like_id, user_id, post_id) VALUES (?, ?, ?)",
                    [like_id, user_id, post_id],
                    (err, results) => {
                        if (err) throw err;
                        return res.send({ message: `Post ${post_id} liked!` });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function likeComment(req, res) {
    try {
        connection.connect();
        const user_id = req.user.user_id;
        const comment_id = req.query.comment_id;
        const like_id = nanoid(12);

        if (!comment_id || comment_id.length === 0) {
            return res
                .status(400)
                .send({ error: "Please provide a comment id" });
        }
        console.log(user_id);
        connection.query(
            "INSERT INTO likes (like_id, user_id, comment_id) VALUES (?, ?, ?)",
            [like_id, user_id, comment_id],
            (err, results) => {
                if (err) throw err;
                return res.send({ message: `Comment ${comment_id} liked!` });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function unlikePostOrComment(req, res) {
    try {
        const like_id = req.query.like_id;
        const user_id = req.user.user_id;

        connection.connect();
        connection.query(
            "DELETE FROM likes WHERE like_id = ? AND user_id = ?",
            [like_id, user_id],
            (err, results) => {
                if (err) throw err;
                return res.send({
                    message: `Post or comment with like_id ${like_id} unliked!`,
                });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
