import React, { useState, createRef } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import GoogleLogin from "react-google-login";
import { googleSignInSuccess, googleSignInFailed } from "@utils/auth";
const axios = require("axios").default;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
import Loading from "@utils/loading";

export default function Login(props: any) {
    console.log(`props: ${JSON.stringify(props)}`);
    const router = useRouter();
    const [errors, setErrors] = useState("");
    const usernameOrEmailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();
    const [cookie, setCookie] = useCookies(["session"]);
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");

    if (process.browser && props.auth.isAuth) {
        router.push("/");
    }

    const usernameOrEmailHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setUsernameOrEmail(e.currentTarget.value);
    };

    const passwordHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    const onLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setUsernameOrEmail(usernameOrEmailRef.current!.value);
        setPassword(passwordRef.current!.value);

        if (usernameOrEmail.length > 0 && password.length > 0) {
            axios
                .post(`${BACKEND_URL}/login`, {
                    usernameOrEmail,
                    password,
                })
                .then((res: any) => {
                    if (res.data.error) {
                        const newError: string = res.data.error;
                        console.log("wow haha");
                        setErrors(newError);
                    } else {
                        setCookie("session", res.data.token, {
                            path: "/",
                            sameSite: true,
                        });
                        router.push("/");
                    }
                })
                .catch((err: any) => {
                    let errorMessage: string;
                    if ((errorMessage = err.response.data.error))
                        setErrors(errorMessage);
                    // console.log("wait actually here");
                    // console.log(JSON.stringify(Object.keys(err.response.data)));
                    // console.log(err.response.data.error);
                });
        }
    };

    console.log(CLIENT_ID);

    return props.auth.isAuth ? (
        <Loading />
    ) : (
        <div className="w-full min-h-screen bg-white flex flex-row items-center justify-center">
            <Head>
                <script
                    src="https://apis.google.com/js/platform.js"
                    async
                    defer
                ></script>
                <meta name="google-signin-client_id" content={CLIENT_ID}></meta>
            </Head>
            <div className="absolute top-0 left-0 w-auto bg-indigo-600 shadow-xl">
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 177 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M88 32.5C88 42.165 80.165 50 70.5 50H53V32.5C53 22.835 60.835 15 70.5 15C80.165 15 88 22.835 88 32.5Z"
                        fill="#C7D2FE"
                    />
                    <path
                        d="M88 67.5C88 57.835 95.835 50 105.5 50H123V67.5C123 77.165 115.165 85 105.5 85C95.835 85 88 77.165 88 67.5Z"
                        fill="#C7D2FE"
                    />
                    <path
                        d="M53 67.5C53 77.165 60.835 85 70.5 85H88V67.5C88 57.835 80.165 50 70.5 50C60.835 50 53 57.835 53 67.5Z"
                        fill="#C7D2FE"
                    />
                    <path
                        d="M123 32.5C123 22.835 115.165 15 105.5 15H88V32.5C88 42.165 95.835 50 105.5 50C115.165 50 123 42.165 123 32.5Z"
                        fill="#C7D2FE"
                    />
                </svg>
            </div>
            <div className="bg-white rounded-lg h-auto items-center justify-center md:justify-evenly flex flex-col 2xl:w-1/5 lg:w-2/5 w-1/2 p-6">
                <div className="flex flex-col w-full">
                    <h1 className="font-work-sans text-center 2xl:text-6xl xl:text-5xl text-4xl text-indigo-800">
                        Log in
                    </h1>
                    {errors.length > 0 && (
                        <div className="mx-auto my-4 mb-2 text-sm flex flex-row p-2 rounded-lg bg-red-50 border border-red-400 text-red-400 justify-evenly items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-1 box-content"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {errors}
                        </div>
                    )}
                    <h4 className="text-indigo-900 opacity-50 font-semibold mt-2 text-center">
                        Welcome back to ConnectHigh!
                    </h4>
                </div>

                <form
                    className="mt-4 flex flex-col h-auto md:w-full"
                    onSubmit={onLoginSubmit}
                >
                    <input
                        ref={usernameOrEmailRef}
                        autoComplete="off"
                        required
                        name="usernameOrEmail"
                        type="text"
                        className="placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-700 my-2 bg-gray-200 p-4 rounded-lg"
                        placeholder="Email or Username"
                        onInput={usernameOrEmailHandler}
                    />
                    <input
                        ref={passwordRef}
                        autoComplete="off"
                        required
                        name="password"
                        type="password"
                        className="placeholder-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-700 my-2 bg-gray-200 p-4 rounded-lg"
                        placeholder="Password"
                        onInput={passwordHandler}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-700 text-gray-50 font-work-sans font-semibold text-3xl py-2 w-auto rounded-lg mt-4 mb-2 hover:bg-indigo-800 hover:shadow-lg transition"
                    >
                        Log in
                    </button>
                    <h6 className="font-work-sans font-bold text-gray-500 text-center 2xl:text-4xl xl:text-3xl text-2xl">
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
                        If you don't have an account, you can{" "}
                        <a
                            className="text-indigo-400 hover:underline"
                            href="/register"
                        >
                            create one here!
                        </a>
                    </h4>
                </form>
            </div>
        </div>
    );
}
