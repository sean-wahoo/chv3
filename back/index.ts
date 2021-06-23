import express = require("express");
import ip = require("ip");
import {
    registerRoute,
    loginRoute,
    verifyAuth,
    googleSignIn,
    deleteUser,
} from "@routes/auth";
import { createPost, deletePost, getPostById, getPosts } from "@routes/posts";
import { friendMiddleware, protectedMiddleware } from "@utils/middleware";
import * as dotenv from "dotenv";
import * as cors from "cors";
import {
    getCommentsForPost,
    createComment,
    getCommentsByUser,
    getRepliesToComment,
    deleteComment,
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
    getUsersFriendRequests,
} from "@routes/friends";
import { getMessages, sendMessage, updateReadMessages } from "@routes/messages";
import {
    clearAllNotifications,
    clearOneNotification,
    getNotifications,
} from "@routes/notifications";

const address = ip?.address();

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
app.get("/getPost", getPostById);
app.post("/createPost", protectedMiddleware, createPost);
app.delete("/deletePost", protectedMiddleware, deletePost);

/// COMMENTS ///
app.get("/getCommentsForPost", getCommentsForPost);
app.post("/createComment", protectedMiddleware, createComment);
app.get("/getCommentsByUser", getCommentsByUser);
app.get("/getRepliesToComment", getRepliesToComment);
app.delete("/deleteComment", protectedMiddleware, deleteComment);

/// LIKES ///
app.get("/getUsersLikes", getUsersLikes);
app.get("/likePost", protectedMiddleware, likePost);
app.get("/likeComment", protectedMiddleware, likeComment);
app.delete("/unlikePostOrComment", protectedMiddleware, unlikePostOrComment);

/// FRIENDS ///
app.get("/getUsersFriends", getUsersFriends);
app.get("/getUsersFriendRequests", protectedMiddleware, getUsersFriendRequests);
app.get("/sendFriendRequest", protectedMiddleware, sendFriendRequest);
app.get("/acceptFriendRequest", protectedMiddleware, acceptFriendRequest);
app.delete("/declineFriendRequest", protectedMiddleware, declineFriendRequest);
app.delete("/removeFriend", protectedMiddleware, removeFriend);

/// CHAT ///
app.get("/getMessages", protectedMiddleware, friendMiddleware, getMessages);
app.post("/sendMessage", protectedMiddleware, friendMiddleware, sendMessage);
app.get(
    "/updateReadMessages",
    protectedMiddleware,
    friendMiddleware,
    updateReadMessages
);

/// NOTIFICATIONS ///
app.get("/getNotifications", protectedMiddleware, getNotifications);
app.delete("/clearOneNotification", protectedMiddleware, clearOneNotification);
app.delete(
    "/clearAllNotifications",
    protectedMiddleware,
    clearAllNotifications
);

app.listen(port, () => {
    console.log(`⚡️⚡️⚡️ backend server is up on ${address}:${port}!`);
});
