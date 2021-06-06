import { createContext, useContext, useState } from "react";

// doesn't seem terribly necessary right now, but should be later.

const UserContext = createContext({});

/**
 * object representing user context
 */
export type userContextType = {
    isAuth: boolean;
    user?: {
        id: string;
        username: string;
        email: string;
    };
};

/**
 * @returns user context object
 */
export const useUserData: () => any = () => {
    return useContext(UserContext);
};

/**
 * wrapper allowing children to recieve user data context
 * @param props jsx object properties
 * @returns context wrapper
 */
export function ContextWrapper(props: any) {
    const [userData, setUserData] = useState({ ...props.appFileUserData });

    const updateUserData = (newContext: userContextType) => {
        return setUserData(newContext);
    };

    const value = { userData, updateUserData };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}
