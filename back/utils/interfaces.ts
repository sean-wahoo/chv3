export interface User {
    user_id?: string;
    username: string;
    email: string;
}

export interface GoogleUser {
    user_id?: string;
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

export interface Post {
    post_id?: string;
    title: string;
    content: string;
    category: string;
}

export interface DetailedPost extends Post {
    num_comments: number;
    num_likes: number;
}
