import { config } from "@utils/connection";
import { nanoid } from "nanoid";
import { Post, User } from "@utils/interfaces";
import * as dotenv from "dotenv";
import * as mysql from "mysql2/promise";

dotenv.config();

export async function getPosts(req, res) {
    try {
        const connection = await mysql.createConnection(config);
        const [posts]: any[] = await connection.execute(
            "SELECT posts.*, users.username from posts LEFT JOIN users ON posts.user_id = users.user_id ORDER BY created_at DESC LIMIT 8"
        );
        return res.send(posts);
    } catch (error) {
        console.error(error);
    }
}

export async function getPostById(req, res) {
    try {
        const connection = await mysql.createConnection(config);
        const post_id = req.query.post_id;

        const [post]: any[] = await connection.execute(
            "SELECT posts.*, users.username from posts LEFT JOIN users ON posts.user_id = users.user_id WHERE posts.post_id = ? ",
            [post_id]
        );
        if (post.length === 0) {
            return res.status(404).send({ error: "Post not found!" });
        }
        connection.destroy();
        return res.send(post[0]);
    } catch (error) {
        console.error(error);
    }
}

export async function createPost(req, res) {
    try {
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
        const connection = await mysql.createConnection(config);
        await connection.execute(
            "INSERT INTO posts (post_id, user_id, title, content, category) VALUES (?, ?, ?, ?, ?)",
            [
                post_id,
                user.user_id,
                post.title.trim(),
                post.content,
                post.category.trim(),
            ]
        );

        const urlPostTitle: string = post.title
            .toLowerCase()
            .split(" ")
            .join("-");
        connection.destroy();
        return res.status(200).send({
            post,
            message: "Post created successfully!",
            link: `${process.env.FRONTEND_URL}/posts/${post_id}/${urlPostTitle}`,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function deletePost(req, res) {
    try {
        const post: Post = req.body.post;
        const user_id: string = req.user.user_id;

        const connection = await mysql.createConnection(config);
        await connection.execute(
            "DELETE FROM posts WHERE post_id = ? AND user_id = ?",
            [post.post_id, user_id]
        );
        connection.destroy();
        return res.send({ message: "Post deleted successfully" });
    } catch (error) {
        return res.json(error.message);
    }
}
