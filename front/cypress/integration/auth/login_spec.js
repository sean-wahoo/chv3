import * as dotenv from "dotenv";

dotenv.config();

describe("Login", () => {
    it("Successfully opens site", () => {
        cy.visit("http://dev.seanreichel.com/");
    });
    before(() => cy.clearCookie("session"));
    it("Should be the /login page", () => {
        cy.url().should("eq", "http://dev.seanreichel.com/login");
    });
    it("Should have no session cookie", () => {
        cy.getCookie("session").should("not.exist");
    });
    describe("Login failing", () => {
        it("Should fail login on empty form", () => {
            // cy.get("[id=usernameOrEmail]").type('')
            cy.get("[id=loginForm]").submit();
        });
        it("Should try and fail a login with non-existant user data", () => {
            cy.get("[id=usernameOrEmail]").type("asdf");
            cy.get("[id=password]").type("asdf");
            cy.get("[id=loginForm]").submit();
            cy.get("[id=loginError]").contains("User not found!");
        });
        it("Should try and fail a login with an incorrect password", () => {
            cy.reload();
            cy.get("[id=usernameOrEmail]").clear().type("sean2");
            cy.get("[id=password]").clear().type("password");
            cy.get("[id=loginForm]").submit();
            cy.get("[id=loginError]").contains("Incorrect password");
        });
    });

    describe("Successful Login", () => {
        Cypress.Cookies.defaults({
            preserve: /session|remeber/,
        });
        it("Should successfully login with email/username and password", () => {
            cy.reload();
            cy.get("[id=usernameOrEmail]").clear().type("sean2");
            cy.get("[id=password]").clear().type("Qwey7676@");
            cy.get("[id=loginForm]").submit();
            cy.wait(2000);
            cy.url().should("eq", "http://dev.seanreichel.com/");
        });
        it("Should have generated a valid session token on login", () => {
            cy.getCookie("session")
                .should("exist")
                .then((c) => {
                    const cookie = c;
                    cy.request({
                        url: "http://back.seanreichel.com/verifyAuth",
                        headers: {
                            Authorization: `Bearer ${cookie.value}`,
                        },
                    }).should((response) => {
                        expect(response.body).to.have.property("isAuth", true);
                        expect(response.body).to.have.property("token");
                        expect(response.body).to.have.property("user");
                        expect(response.body.user).to.have.property("user_id");
                        expect(response.body.user).to.have.property("username");
                        expect(response.body.user).to.have.property("email");
                    });
                });
        });
        it("Should redirect to /login and destroy the cookie on logout", () => {
            cy.getCookie("session").should("exist");
            cy.get("[id=logout]").click();
            cy.getCookie("session").should("not.exist");
        });
    });
    // lots of stinky issues with this one, might just leave it up to fate
    //
    // describe("Google Auth", () => {
    //     it("Should log in Google user", () => {
    //         // cy.loginByGoogleApi();
    //         // cy.get(".googleLogin").click();
    //         // cy.get("[id=identifierId").type(process.env.GOOGLE_TEST_ACCOUNT_EMAIL);
    //         // cy.get("")
    //         const username = Cypress.env("googleUsername");
    //         const password = Cypress.env("googlePassword");
    //         const loginUrl = Cypress.env("googleLoginUrl");
    //         const cookieName = Cypress.env("googleCookieName");
    //         const socialLoginOptions = {
    //             username,
    //             password,
    //             loginUrl,
    //             headless: false,
    //             logs: true,
    //             preLoginSelector: "[id=usernameOrEmail]",
    //             loginSelector: "[type='button']",
    //             postLoginSelector: "[id='logout']",
    //         };
    //         return cy
    //             .task("GoogleSocialLogin", socialLoginOptions)
    //             .then(({ cookies }) => {
    //                 cy.clearCookies();

    //                 const cookie = cookies
    //                     .filter((cookie) => cookie.name === cookieName)
    //                     .pop();
    //                 if (cookie) {
    //                     cy.setCookie(cookie.name, cookie.value, {
    //                         domain: cookie.domain,
    //                         expiry: cookie.expires,
    //                         httpOnly: cookie.httpOnly,
    //                         path: cookie.path,
    //                         secure: cookie.secure,
    //                     });
    //                     Cypress.Cookies.defaults({
    //                         preserve: cookieName,
    //                     });
    //                 }
    //             });
    //     });
    // });
});
