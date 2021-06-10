import { connection } from "@utils/connection";
import { nanoid } from "nanoid";
import { Post, User } from "@utils/interfaces";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.SESSION_SECRET;

export async function getPosts(req, res) {
    try {
        connection.connect();
        connection.query("SELECT * from posts LIMIT 5", (err, results) => {
            if (err) throw err;
            console.log(results);
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

        const post_id: string = nanoid(12);
        connection.query(
            "INSERT INTO posts (post_id, user_id, title, content, category) VALUES (?, ?, ?, ?, ?)",
            [post_id, user.user_id, post.title, post.content, post.category],
            (err, results) => {
                if (err) throw err;
                console.log(results);
                res.status(200).send({
                    message: "Post created successfully",
                    link: `${process.env.FRONTEND_URL}/posts/${post_id}`,
                });
            }
        );
    } catch (error) {
        console.error(error);
    }
}
