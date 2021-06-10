import express = require("express");
import ip = require("ip");
import {
    registerRoute,
    loginRoute,
    verifyAuth,
    googleSignIn,
    deleteUser,
} from "@routes/auth";
import { createPost, getPosts } from "@routes/posts";
import { protectedMiddleware } from "@utils/middleware";
import * as dotenv from "dotenv";
import cors = require("cors");

const address = ip.address();

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const options: cors.CorsOptions = {
    origin: [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://localhost:5000",
        "http://localhost:5000",
        "http://dev.seanreichel.com",
        "https://dev.seanreichel.com",
        "*",
    ],
};
app.use(express.json());
app.use(express.urlencoded());

app.use(cors(options));

// app.options("*", cors(options))
app.post("/register", registerRoute);
app.post("/login", loginRoute);
app.get("/verifyAuth", verifyAuth);
app.post("/googleSignIn", googleSignIn);
app.delete("/deleteUser", deleteUser);
app.get("/getPosts", getPosts);
app.post("/createPost", protectedMiddleware, createPost);

app.listen(port, () => {
    console.log(`⚡️⚡️⚡️ backend server is up on ${address}:${port}!`);
});
