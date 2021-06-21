import React, { useState, createRef } from "react";
import Loading from "@utils/loading";
import Cookies from "universal-cookie";
import GoogleLogin from "react-google-login";
import { googleSignInSuccess, googleSignInFailed } from "@utils/auth";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import {
    checkThatUsernameIsAllowed,
    checkThatEmailIsAllowed,
    checkPasswordStrength,
    checkConfirmPasswordMatchesPassword,
} from "@utils/validation";

const axios = require("axios").default;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Register(props: any) {
    const router = useRouter();
    const [errors, setErrors] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({ message: "" });
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [usernameSettings, setUsernameSettings] = useState({
        focusRing: "",
        symbol: null,
        pass: false,
    });
    const [emailSettings, setEmailSettings] = useState({
        focusRing: "",
        symbol: null,
        pass: false,
    });
    const [passwordSettings, setPasswordSettings] = useState({
        focusRing: "",
        symbol: null,
        pass: false,
    });
    const [confirmPasswordSettings, setConfirmPasswordSettings] = useState({
        focusRing: "",
        symbol: null,
        pass: false,
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [cookie, setCookie] = useCookies(["session"]);

    if (process.browser && props.auth.isAuth) {
        router.push("/");
    }

    const usernameRef = createRef<HTMLInputElement>();
    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();
    const confirmPasswordRef = createRef<HTMLInputElement>();

    const usernameHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const isAllowed = checkThatUsernameIsAllowed(e.currentTarget.value);
        console.log(isAllowed.message);
        switch (isAllowed.message) {
            case "Nice words only!":
                console.log(e.currentTarget.value);
                setUsernameSettings({
                    focusRing: "ring-2 focus:ring-4 ring-red-400",
                    symbol: null,
                    pass: isAllowed.pass,
                });
                break;
            case "Not long enough!":
                console.log(e.currentTarget.value);
                setUsernameSettings({
                    focusRing: "ring-2 focus:ring-4 ring-red-400",
                    symbol: null,
                    pass: isAllowed.pass,
                });
                break;
            case "That's better!":
                setUsernameSettings({
                    focusRing: "ring-2 focus:ring-4 ring-green-400",
                    symbol: null,
                    pass: isAllowed.pass,
                });
                break;
        }
        setUsername(e.currentTarget.value);
    };
    const emailHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const emailAllowed = checkThatEmailIsAllowed(e.currentTarget.value);
        switch (emailAllowed.message) {
            case "Correct shape!":
                setEmailSettings({
                    focusRing: "ring-2 focus:ring-4 ring-green-400",
                    symbol: null,
                    pass: emailAllowed.pass,
                });
                break;
            case "That's not an email!":
                setEmailSettings({
                    focusRing: "ring-2 focus:ring-4 ring-red-400",
                    symbol: null,
                    pass: emailAllowed.pass,
                });
                break;
        }
        setEmail(e.currentTarget.value);
    };
    const passwordHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const strengthMessage = checkPasswordStrength(e.currentTarget.value);
        setPasswordStrength(strengthMessage);
        switch (strengthMessage.message) {
            case "Too weak!":
                setPasswordSettings({
                    focusRing: "ring-2 focus:ring-4 ring-red-400",
                    symbol: null,
                    pass: strengthMessage.pass,
                });
                break;
            case "Little better...":
                setPasswordSettings({
                    focusRing: "ring-2 focus:ring-4 ring-yellow-400",
                    symbol: null,
                    pass: strengthMessage.pass,
                });
                break;
            case "Alrighty!":
                setPasswordSettings({
                    focusRing: "ring-2 focus:ring-4 ring-green-400",
                    symbol: null,
                    pass: strengthMessage.pass,
                });
                break;
        }
        setPassword(e.currentTarget.value);
    };
    const confirmPasswordHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const matchMessage = checkConfirmPasswordMatchesPassword(
            password,
            e.currentTarget.value
        );
        switch (matchMessage.message) {
            case "Matches!":
                setConfirmPasswordSettings({
                    focusRing: "ring-2 focus:ring-4 ring-green-400",
                    symbol: null,
                    pass: matchMessage.pass,
                });
                break;
            case "Doesn't match!":
                setConfirmPasswordSettings({
                    focusRing: "ring-2 focus:ring-4 ring-red-400",
                    symbol: null,
                    pass: matchMessage.pass,
                });
                break;
        }
        setConfirmPassword(e.currentTarget.value);
    };

    const onRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            usernameSettings.pass &&
            emailSettings.pass &&
            passwordSettings.pass &&
            confirmPasswordSettings.pass
        ) {
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
                        console.log(err);
                    });
            }
        } else {
            console.log("not all passed!");
            return { message: "nothing" };
        }
    };

    return props.auth.isAuth ? (
        <Loading />
    ) : (
        <div className="w-full min-h-screen bg-white flex flex-row items-center justify-center">
            <div className="bg-white rounded-lg h-auto items-center justify-center md:justify-evenly flex flex-col 2xl:w-1/5 lg:w-2/5 w-1/2 p-6">
                <div className="flex flex-col w-full max-h-screen">
                    <h1 className="font-work-sans font-bold text-center 2xl:text-6xl xl:text-5xl text-4xl text-indigo-800">
                        Sign up
                    </h1>
                    {errors.length > 0 && (
                        <div
                            id="registerError"
                            className="mx-auto my-4 mb-2 text-sm flex flex-row p-2 rounded-lg bg-red-50 border border-red-400 text-red-400 justify-evenly items-center"
                        >
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
                    id="registerForm"
                >
                    <div className="flex flex-col w-full">
                        <input
                            autoComplete="off"
                            ref={usernameRef}
                            required
                            type="text"
                            id="username"
                            placeholder="Username"
                            className={`transition focus:outline-none focus:ring-2 my-2 bg-gray-100 p-4 rounded-lg ${usernameSettings.focusRing}`}
                            onInput={usernameHandler}
                        />
                        <input
                            autoComplete="off"
                            ref={emailRef}
                            type="email"
                            required
                            id="email"
                            placeholder="Email"
                            className={`transition focus:outline-none focus:ring-2  my-2 bg-gray-100 p-4 rounded-lg ${emailSettings.focusRing}`}
                            onInput={emailHandler}
                        />
                        <input
                            autoComplete="off"
                            ref={passwordRef}
                            type="password"
                            required
                            id="password"
                            placeholder="Password"
                            className={`transition focus:outline-none focus:ring-2 my-2 bg-gray-100 p-4 rounded-lg ${passwordSettings.focusRing}`}
                            onInput={passwordHandler}
                        />
                        <input
                            autoComplete="off"
                            ref={confirmPasswordRef}
                            type="password"
                            required
                            id="confirmPassword"
                            placeholder="Password (again)"
                            className={`transition focus:outline-none focus:ring-2 my-2 bg-gray-100 p-4 rounded-lg ${confirmPasswordSettings.focusRing}`}
                            onInput={confirmPasswordHandler}
                        />
                        <button
                            type="submit"
                            id="register"
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
