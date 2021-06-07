export interface User {
    id?: string;
    username: string;
    email: string;
}

export interface GoogleUser {
    id?: string;
    username: string;
    email: string;
}

export interface RegisterUser extends User {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginUser extends User {
    usernameOrEmail: string;
    password: string;
}
