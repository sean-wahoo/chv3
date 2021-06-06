import { verifyTokenHoc } from "@utils/protected";
import Cookies from "universal-cookie";
import Router from "next/router";

/**
 * Logs out user
 * @returns void
 */
export function logout() {
    const cookies = new Cookies();
    cookies.remove("session");
    return Router.push("/login");
}

// export async function clientAuth() {}

/**
 * 
 * @param token user's session token
 * @returns user data payload or nothing, indicating unauthorized
 */
export async function serverAuth(token: string) {
    if (token && token.length > 0) {
        const payload = await verifyTokenHoc(token);
        console.log(`serverAuth - payload: ${JSON.stringify(payload)}`);
        return payload;
    }
    return undefined;
}
