import express = require("express");
import { registerRoute, loginRoute, verifyAuth } from "@routes/auth";
import * as dotenv from "dotenv";
import cors = require("cors");

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const options: cors.CorsOptions = {
    origin: [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://localhost:5000",
        "http://localhost:5000",
    ],
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded());

app.post("/register", registerRoute);
app.post("/login", loginRoute);
app.get("/verifyAuth", verifyAuth);

app.listen(port, () => {
    console.log(`⚡️⚡️⚡️ backend server is up on port ${port}!`);
});
