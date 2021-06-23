import { config } from "@utils/connection";
import * as mysql from "mysql2/promise";
import { User, RegisterUser, LoginUser } from "@utils/interfaces";

/**
 * Checks database to see if username is in use
 * @param email User's email
 * @returns object stating whether the validation passed and an error message if any
 */
export async function checkIfEmailIsInUse(email: string) {
    try {
        const connection = await mysql.createConnection(config);
        const [isEmailTaken]: any[] = await connection.execute(
            "SELECT email FROM users WHERE email = ?",
            [email]
        );
        if (isEmailTaken.length > 0) {
            return {
                passed: false,
                error: "A user with that email already exists",
            };
        }
        return { passed: true, error: "null" };
    } catch (error) {
        console.error;
    }
}

/**
 * Checks database to see if username is in use
 * @param username - User's username
 * @returns object stating whether the validation passed and an error message if any
 */
export async function checkIfUsernameIsInUse(username: string) {
    try {
        const connection = await mysql.createConnection(config);
        const [isUsernameTaken]: any[] = await connection.execute(
            "SELECT `username` FROM `users` WHERE `username` = ?",
            [username]
        );
        if (isUsernameTaken.length > 0) {
            return {
                passed: false,
                error: "A user with that email already exists",
            };
        }
        return { passed: true, error: "null" };
    } catch (error) {
        console.error;
    }
}

/**
 * Makes sure that the user's password meets the requirements
 * @param password - User's password
 * @returns object stating whether the validation passed and an error message if any
 */
function checkThatPasswordMeetsRequirements(password: string) {
    try {
        const pattern = new RegExp(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}"
        );
        if (pattern.test(password)) {
            return { passed: true, error: null };
        } else {
            return {
                passed: false,
                error: "Password does not meet requirements.",
            };
        }
    } catch (error) {
        console.error;
    }
}

/**
 * Makes sure that the user's passwords are the same
 * @param password1 - User's password
 * @param password2 - User's confirmed password
 * @returns object stating whether the validation passed and an error message if any
 */
function checkThatPasswordsAreTheSame(password1: string, password2: string) {
    try {
        if (password1 === password2) return { passed: true, error: null };
        else return { passed: false, error: "Passwords do not match" };
    } catch (error) {
        console.error;
    }
}

/**
 * Makes sure that the user object in the register request is shaped correctly
 * @param user User object
 * @returns object stating whether the validation passed and an error message if any
 */
function checkThatUserRegisterObjectHasCorrectProperties(user: User) {
    if ("usernameOrEmail" in user) {
        return { passed: false, error: "Login Request sent?" };
    }
    if (
        "username" in user &&
        "email" in user &&
        "password" in user &&
        "confirmPassword" in user
    ) {
        return { passed: true, error: null };
    } else {
        return { passed: false, error: "Malformed request" };
    }
}

/**
 * Makes sure that the user object in the login request is shaped correctly
 * @param user User object
 * @returns object stating whether the validation passed and an error message if any
 */
function checkThatUserLoginObjectHasCorrectProperties(user: User) {
    if ("username" in user || "email" in user || "confirmPassword" in user) {
        return { passed: false, error: "Register Request sent?" };
    }
    if ("usernameOrEmail" in user && "password" in user) {
        return { passed: true, error: null };
    } else {
        return { passed: false, error: "Malformed request" };
    }
}

/**
 * Runs checks on user object to make sure user input meets registration requirements
 * @param user User object
 * @returns object with number of passes and list of errors if any
 */
export function registerValidation(user: RegisterUser) {
    try {
        let passes: number = 0;
        let errors: string[] = [];
        const check1 = checkThatPasswordMeetsRequirements(user.password);
        const check2 = checkThatPasswordsAreTheSame(
            user.password,
            user.confirmPassword
        );
        const check3 = checkThatUserRegisterObjectHasCorrectProperties(user);

        const checks = [check1, check2, check3];

        checks.forEach((check: any) => {
            if (check.passed) passes++;
            if (check.error) errors.push(check.error);
        });

        return { passes, errors };
    } catch (error) {
        console.error;
    }
}

/**
 * Runs checks on user object to make sure user input meets login requirements
 * @param user User object
 * @returns object with number of passes and list of errors if any
 */
export function loginValidation(user: LoginUser) {
    try {
        let passes: number = 0;
        let errors: string[] = [];
        const check1 = checkThatUserLoginObjectHasCorrectProperties(user);
        const checks = [check1];

        checks.forEach((check) => {
            if (check.passed) passes++;
            if (check.error) errors.push(check.error);
        });

        return { passes, errors };
    } catch (error) {
        console.error;
    }
}
