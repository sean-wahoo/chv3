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

    const passes = checks.map((check) => check === true);

    if (passes.length < 2) return { message: "Too weak!" };
    if (passes.length < 4) return { message: "Little better..." };
    return { message: "Alrighty!" };
}
