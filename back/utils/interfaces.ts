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
    created_at?: string;
}

export interface DetailedPost extends Post {
    num_comments: number;
    num_likes: number;
}

export interface Comment {
    comment_id?: string;
    user_id: string;
    post_id: string;
    is_reply: boolean;
    reply_id: string | null;
    content: string;
    created_at?: string;
}

export interface DetailedComment extends Comment {
    num_likes: number;
    num_replies: number;
}
