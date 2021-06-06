import { createContext, useContext, useState } from "react";

const UserContext = createContext({});

export type userContextType = {
    isAuth: boolean;
    user?: {
        id: string;
        username: string;
        email: string;
    };
};

export const useUserData: () => any = () => {
    return useContext(UserContext);
};

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
