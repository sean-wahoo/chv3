import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

export function protectedMiddleware(req, res, next) {
    try {
        const SESSION_SECRET = process.env.SESSION_SECRET;
        const token: string = req.headers.authorization.split("Bearer ")[1];
        let data;
        if ((data = jwt.verify(token, SESSION_SECRET))) {
            req.user = data.data;
            next();
        } else {
            return res.status(403).send({ error: "jwt failed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).send(error);
    }
}
