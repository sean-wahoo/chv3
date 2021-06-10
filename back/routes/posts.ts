import { connection } from "@utils/connection";
import { v4 as uuidv4 } from "uuid";
import { Post } from "@utils/interfaces";
import * as dotenv from "dotenv";

export async function getPosts(req, res) {
    try {
        const post = req.body as Post;
        console.log(post);
    } catch (error) {
        console.error(error);
    }
}
