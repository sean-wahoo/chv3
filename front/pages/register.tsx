import React, { useState, createRef } from "react";
import Loading from "@utils/loading";
import Cookies from "universal-cookie";
import GoogleLogin from "react-google-login";
import { googleSignInSuccess, googleSignInFailed } from "@utils/auth";
import { useRouter } from "next/router";

const axios = require("axios").default;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const cookies = new Cookies();

export default function Register(props: any) {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (process.browser && props.auth.isAuth) {
        router.push("/");
    }

    const usernameRef = createRef<HTMLInputElement>();
    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();
    const confirmPasswordRef = createRef<HTMLInputElement>();

    const usernameHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    };
    const emailHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };
    const passwordHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };
    const confirmPasswordHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
    };

    const onRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setUsername(usernameRef.current!.value);
        setEmail(emailRef.current!.value);
        setPassword(passwordRef.current!.value);
        setConfirmPassword(confirmPasswordRef.current!.value);
        if (
            username.length > 0 &&
            email.length > 0 &&
            password.length > 0 &&
            confirmPassword.length > 0
        ) {
            axios
                .post(`${BACKEND_URL}/register`, {
                    username,
                    email,
                    password,
                    confirmPassword,
                })
                .then((res: any) => {
                    cookies.set("session", res.data.token, { path: "/" });
                    router.push("/");
                })
                .catch(console.error);
        }
    };

    return props.auth.isAuth ? (
        <Loading />
    ) : (
        <div className="w-full min-h-screen bg-white flex flex-row items-center justify-center">
            <div className="bg-white rounded-lg h-auto items-center justify-center md:justify-evenly flex flex-col 2xl:w-1/5 lg:w-2/5 w-1/2 p-6">
                <div className="flex flex-col w-full max-h-screen">
                    <h1 className="font-work-sans text-center 2xl:text-6xl xl:text-5xl text-4xl text-indigo-800">
                        Sign up
                    </h1>
                    <h4 className="text-indigo-900 opacity-50 font-semibold mt-2 text-center">
                        Welcome to ConnectHigh!
                    </h4>
                    {/* <h4 className="text-gray-500 mb-2 lg:text-left text-center">
                        If you already have an account, you can{" "}
                        <a
                            className="text-indigo-400 hover:underline"
                            href="/login"
                        >
                            log in here!
                        </a>
                    </h4> */}
                </div>

                <form
                    className="mt-4 flex flex-col h-auto md:w-full"
                    onSubmit={onRegisterSubmit}
                >
                    <div className="flex flex-col w-full">
                        <input
                            autoComplete="off"
                            ref={usernameRef}
                            required
                            type="text"
                            placeholder="Name"
                            className="transition focus:outline-none focus:ring-2 focus:ring-indigo-700 my-2 bg-gray-100 p-4 rounded-lg"
                            onInput={usernameHandler}
                        />
                        <input
                            autoComplete="off"
                            ref={emailRef}
                            type="email"
                            required
                            placeholder="Email"
                            className="transition focus:outline-none focus:ring-2 focus:ring-indigo-700 my-2 bg-gray-100 p-4 rounded-lg"
                            onInput={emailHandler}
                        />
                        <input
                            autoComplete="off"
                            ref={passwordRef}
                            type="password"
                            required
                            placeholder="Password"
                            className="transition focus:outline-none focus:ring-2 focus:ring-indigo-700 my-2 bg-gray-100 p-4 rounded-lg"
                            onInput={passwordHandler}
                        />
                        <input
                            autoComplete="off"
                            ref={confirmPasswordRef}
                            type="password"
                            required
                            placeholder="Password (again)"
                            className="transition focus:outline-none focus:ring-2 focus:ring-indigo-700 my-2 bg-gray-100 p-4 rounded-lg"
                            onInput={confirmPasswordHandler}
                        />
                        <button
                            type="submit"
                            className="bg-indigo-700 text-gray-50 font-work-sans font-semibold text-3xl py-2 w-auto rounded-lg mt-4 mb-2 hover:bg-indigo-800 hover:shadow-lg transition"
                        >
                            Sign up
                        </button>
                        <h6 className="font-work-sans font-bold text-gray-500 text-center text-4xl">
                            Or
                        </h6>
                        <GoogleLogin
                            clientId={
                                "170260512759-1eqtqc221on5s0ou2kcu8akln2hlvpr8.apps.googleusercontent.com"
                            }
                            className="my-2 border-2 border-indigo-700"
                            buttonText="Sign In with Google"
                            onSuccess={googleSignInSuccess}
                            onFailure={googleSignInFailed}
                            cookiePolicy={"single_host_origin"}
                        />
                        <h4 className="text-gray-500 my-2 lg:text-left text-center">
                            If you already have an account, you can{" "}
                            <a
                                className="text-indigo-400 hover:underline"
                                href="/login"
                            >
                                log in here!
                            </a>
                        </h4>
                    </div>
                </form>
            </div>
        </div>
    );
}
