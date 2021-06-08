import {
    checkThatUsernameIsAllowed,
    checkThatEmailIsAllowed,
    checkPasswordStrength,
    checkConfirmPasswordMatchesPassword,
} from "../utils/validation";

type TestValidation = {
    message: string;
    pass: boolean;
};

describe("registration", () => {
    const profaneUsernamesArr = [
        "111fuck111",
        "111shit111",
        "111ass111",
        "111cunt111",
        "111pussy111",
        "111bitch111",
        "111damn111",
        "111dammit111",
        "111goddammit111",
    ];

    const shortUsernames = ["i", "am", "too", "dang", "short"];

    const badEmails = [
        "email",
        "email@address",
        "@address.com",
        "email.com",
        "email@email.",
    ];

    const badPasswords = [
        "12345678",
        "qwerty",
        "password",
        "p4ssw0rd",
        "P4ssW0rd",
    ];

    const badPasswordCombos = [
        [
            ["password", "p4ssw0rd"],
            ["PassWord", "passWord"],
            ["P4$$W0Rd", "passyword"],
        ],
    ];

    it("should disallow common profanity in usernames", () => {
        profaneUsernamesArr.forEach((name) => {
            const result: TestValidation = checkThatUsernameIsAllowed(name);
            expect(result.pass).toBe(false);
        });
    });

    it("should disallow usernames too short", () => {
        shortUsernames.forEach((name) => {
            const result: TestValidation = checkThatUsernameIsAllowed(name);
            expect(result.pass).toBe(false);
        });
    });

    it("should disallow emails shaped incorrectly", () => {
        badEmails.forEach((email) => {
            const result: TestValidation = checkThatEmailIsAllowed(email);
            expect(result.pass).toBe(false);
        });
    });

    it("should disallow passwords not meeting requirements", () => {
        badPasswords.forEach((password) => {
            const result: TestValidation = checkPasswordStrength(password);
            expect(result.pass).toBe(false);
        });
    });

    it("should disallow passwords not being the same", () => {
        badPasswords.forEach((passwordCombo) => {
            expect(passwordCombo[0] === passwordCombo[1]).toBe(false);
        });
    });
});
