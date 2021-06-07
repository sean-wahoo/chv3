import { verifyTokenHoc } from "@utils/protected";
import Cookies from "universal-cookie";
import Router from "next/router";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
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
        // console.log(`serverAuth - payload: ${JSON.stringify(payload)}`);
        return payload;
    }
    return undefined;
}

export async function googleSignInSuccess(response: any) {
    console.log(`success: ${JSON.stringify(response.getBasicProfile())}`)
    const profile = response.getBasicProfile();
    const username = profile.getName()
    const email = profile.getEmail()
    const cookies = new Cookies();

    axios.post(`${BACKEND_URL}/googleSignIn`, { username, email }).then(payload => {
        cookies.set("session", payload.data.token, {
            path: "/",
            sameSite: true,
        });
        Router.push("/");
    }).catch(error => console.error(error))
    

}

export async function googleSignInFailed(response: any) {
    console.log(`failed: ${JSON.stringify(response)}`)
}
