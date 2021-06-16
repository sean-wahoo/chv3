import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Post, User } from "@utils/interfaces";
import * as dotenv from "dotenv";

dotenv.config();

export async function getPosts(req, res) {
    try {
        connection.connect();
        connection.query("SELECT * from posts LIMIT 5", (err, results) => {
            if (err) throw err;
            res.status(200).send(results);
        });
    } catch (error) {
        console.error(error);
    }
}

export async function createPost(req, res) {
    try {
        connection.connect();
        const user = req.user as User;
        const post = req.body as Post;

        if (Object.keys(post).length < 3) {
            return res.status(401).send({ error: "Request malformed!" });
        }

        if (
            !post ||
            !post.title.trim() ||
            !post.content ||
            !post.category.trim()
        ) {
            return res
                .status(401)
                .send({ error: "Please fill out all fields!" });
        }

        const post_id: string = nanoid(12);
        post.post_id = post_id;
        connection.query(
            "INSERT INTO posts (post_id, user_id, title, content, category) VALUES (?, ?, ?, ?, ?)",
            [
                post_id,
                user.user_id,
                post.title.trim(),
                post.content,
                post.category.trim(),
            ],
            (err, results) => {
                if (err) throw err;
                const urlPostTitle: string = post.title
                    .toLowerCase()
                    .split(" ")
                    .join("-");
                res.status(200).send({
                    post,
                    message: "Post created successfully!",
                    link: `${process.env.FRONTEND_URL}/posts/${post_id}/${urlPostTitle}`,
                });
            }
        );
    } catch (error) {
        console.error(error);
    }
}

export async function deletePost(req, res) {
    try {
        const post: Post = req.body.post;
        const user_id: string = req.user.user_id;

        connection.connect();
        connection.query(
            "DELETE FROM posts WHERE user_id = ? AND title = ? AND content = ? AND category = ? LIMIT 4",
            [user_id, post.title, post.content, post.category],
            (err, results) => {
                if (err) throw err;
                return res.send({ message: "Post deleted successfully" });
            }
        );
    } catch (error) {
        console.error(error);
    }
}
