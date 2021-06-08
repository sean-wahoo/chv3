import Cookies from "universal-cookie";
const axios = require("axios").default;

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * verifies user token if token is valid
 * @param token session token or nothing if user has no token
 * @returns authorized user data or nothing if not authorized
 */
export const verifyTokenHoc = async (token: string | undefined) => {
    const cookies = new Cookies();
    try {
        if (token && token.length > 0) {
            const payload = await axios.get(
                `${NEXT_PUBLIC_BACKEND_URL}/verifyAuth`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            if (!payload) throw new Error("payload error");
            if ("name" in payload && payload.name === "TokenExpiredError") {
                throw new Error("jwt expired");
            }
            if ("user" in payload.data && payload.data.isAuth) {
                if (
                    "id" in payload.data.user &&
                    "username" in payload.data.user &&
                    "email" in payload.data.user
                ) {
                    return payload.data.user;
                } else {
                    cookies.remove("session");
                    throw new Error("payload malformed 2");
                }
            } else {
                cookies.remove("session");
                throw new Error("payload malformed 1");
            }
        }
    } catch (error) {
        if (error.message === "jwt expired") {
            cookies.remove("session");
            return undefined;
        }
    }
};
