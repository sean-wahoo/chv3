import Logo from "@utils/logo";
import { useState, useRef } from "react";
import { logout } from "@utils/auth";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import Link from "next/link";

export default function Navbar(props: any) {
    const [toggle, setToggle] = useState(false);
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

    const dropdownRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const toggleRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const mobileDropdown = () => (
        <>
            <aside
                className={`${
                    !toggle ? "translate-x-mobileMenuTranslate " : ""
                } transform fixed transition h-screen z-20 shadow-md  text-black dark:text-white bg-white dark:bg-black flex flex-col right-0 p-6 text-xl w-3/5`}
                ref={dropdownRef}
                id="mobile_menu"
            >
                <h1 className="text-2xl mb-2">{props.user_data.username}</h1>

                <ul>
                    <li className="my-2 flex flex-row items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Profile
                    </li>
                    <li className="my-2 flex flex-row items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        Notifications
                    </li>
                    <li className="my-2 flex flex-row items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Friends
                    </li>
                    <li
                        id="logout"
                        onClick={logout}
                        className="cursor-pointer my-2 text-red-500 flex flex-row items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Logout
                    </li>
                </ul>
            </aside>
            {toggle && (
                <div
                    id="darken_overlay"
                    className="transition-all fixed min-w-screen w-full min-h-screen h-full bg-gray-400 dark:bg-black opacity-50"
                ></div>
            )}
        </>
    );
    const dropdown = toggle ? (
        <div
            id="desktop_menu"
            className="z-20 fixed text-black dark:text-white bg-white dark:bg-postBlockDark border border-lightBorder dark:border-black flex flex-col right-0 m-4 p-6 text-xl mt-20"
        >
            <h1 className="text-2xl mb-2">{props.user_data.username}</h1>
            desktop
            <ul>
                <li className="my-2">Profile</li>
                <li className="my-2">Notifications</li>
                <li className="my-2">Friends</li>
                <li
                    id="logout"
                    onClick={logout}
                    className="cursor-pointer my-2 text-red-500"
                >
                    Logout
                </li>
            </ul>
        </div>
    ) : null;

    useEffect(() => {
        document.addEventListener("mousedown", (e) => {
            if (dropdownRef.current && toggleRef.current) {
                if (!dropdownRef.current.contains(e.target as Node)) {
                    setToggle(false);
                }
            }
        });
    }, []);

    if (process.browser) {
        if (toggle && isMobile) document.body.style.overflowY = "hidden";
        else document.body.style.overflowY = "auto";
    }

    return (
        <>
            <nav className="bg-white fixed dark:bg-postBlockDark flex flex-row w-full text-purpleNav text-2xl items-center p-2">
                <Link href="/" passHref>
                    <div className="flex flex-row items-center ">
                        <Logo className="cursor-pointer fill-current m-2" />

                        <h1 className="cursor-pointer text-gray-600 dark:text-white">
                            ConnectHigh
                        </h1>
                    </div>
                </Link>
                <h1
                    onClick={() => setToggle(!toggle)}
                    ref={toggleRef}
                    className="cursor-pointer mr-4 ml-auto text-gray-600 dark:text-white"
                >
                    {props.user_data.username}
                </h1>
            </nav>
            {isMobile ? mobileDropdown() : dropdown}
        </>
    );
}

export function MobileBottomNav(props: any) {
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

    return isMobile ? (
        <nav className="bg-white fixed bottom-0 dark:bg-postBlockDark flex flex-row justify-around items-center w-full text-purpleNav text-2xl items-center p-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
            <Link href="/">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-9 w-9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            </Link>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </nav>
    ) : (
        <></>
    );
}
