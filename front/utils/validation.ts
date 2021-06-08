import Filter from "bad-words";

export function checkPasswordStrength(password: string) {
    const specialCharCheck: RegExp = /[!@#$%^&*(),.?":{}|<>]/g;
    const uppercaseCheck: RegExp = /[A-Z]/g;
    const lowercaseCheck: RegExp = /[a-z]/g;
    const letterCheck: RegExp = /[0-9]/g;

    const check1 = password.length >= 8;
    const check2 = specialCharCheck.test(password);
    const check3 = uppercaseCheck.test(password);
    const check4 = lowercaseCheck.test(password);
    const check5 = letterCheck.test(password);

    let checks = [check1, check2, check3, check4, check5];

    const passes = checks.filter((check) => check === true);

    if (passes.length < 3) return { message: "Too weak!", pass: false };
    else if (passes.length < 5)
        return { message: "Little better...", pass: false };
    else return { message: "Alrighty!", pass: true };
}

export function checkConfirmPasswordMatchesPassword(
    password: string,
    confirmPassword: string
) {
    if (password === confirmPassword)
        return { message: "Matches!", pass: true };
    else return { message: "Doesn't match!", pass: false };
}

export function checkThatUsernameIsAllowed(username: string) {
    if (username.length > 5) {
        const filter = new Filter();
        filter.addWords("fucki", "fuki");
        if (filter.isProfane(username))
            return { message: "Nice words only!", pass: false };
        else return { message: "That's better!", pass: true };
    } else return { message: "Not long enough!", pass: false };
}

export function checkThatEmailIsAllowed(email: string) {
    const emailCheck: RegExp =
        /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
    if (emailCheck.test(email))
        return { message: "Correct shape!", pass: true };
    else return { message: "That's not an email!", pass: false };
}
