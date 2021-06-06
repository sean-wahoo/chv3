import { verifyTokenHoc } from "@utils/protected";
import Cookies from "universal-cookie";
import Router from "next/router";

export function logout() {
    const cookies = new Cookies();
    cookies.remove("session");
    return Router.push("/login");
}

export async function clientAuth() {}

export async function serverAuth(token: string) {
    if (token && token.length > 0) {
        const payload = await verifyTokenHoc(token);
        console.log(`serverAuth - payload: ${JSON.stringify(payload)}`);
        return payload;
    }
    return undefined;
}
