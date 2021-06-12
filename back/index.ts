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
import {
    getCommentsForPost,
    createComment,
    getCommentsByUser,
    getRepliesToComment,
} from "@routes/comments";
import {
    getUsersLikes,
    likeComment,
    likePost,
    unlikePostOrComment,
} from "@routes/likes";
import {
    acceptFriendRequest,
    declineFriendRequest,
    getUsersFriends,
    sendFriendRequest,
    removeFriend,
} from "@routes/friends";

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

/// AUTH ///
app.post("/register", registerRoute);
app.post("/login", loginRoute);
app.get("/verifyAuth", verifyAuth);
app.post("/googleSignIn", googleSignIn);
app.delete("/deleteUser", deleteUser);

/// POSTS ///
app.get("/getPosts", getPosts);
app.post("/createPost", protectedMiddleware, createPost);

/// COMMENTS ///
app.get("/getCommentsForPost", getCommentsForPost);
app.post("/createComment", protectedMiddleware, createComment);
app.get("/getCommentsByUser", getCommentsByUser);
app.get("/getRepliesToComment", getRepliesToComment);

/// LIKES ///
app.get("/getUsersLikes", getUsersLikes);
app.get("/likePost", protectedMiddleware, likePost);
app.get("/likeComment", protectedMiddleware, likeComment);
app.delete("/unlikePostOrComment", protectedMiddleware, unlikePostOrComment);

/// FRIENDS ///
app.get("/getUsersFriends", getUsersFriends);
app.get("/sendFriendRequest", protectedMiddleware, sendFriendRequest);
app.get("/acceptFriendRequest", protectedMiddleware, acceptFriendRequest);
app.delete("/declineFriendRequest", protectedMiddleware, declineFriendRequest);
app.delete("/removeFriend", protectedMiddleware, removeFriend);

app.listen(port, () => {
    console.log(`⚡️⚡️⚡️ backend server is up on ${address}:${port}!`);
});
