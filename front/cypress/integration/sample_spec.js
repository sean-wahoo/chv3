describe("Authentication", () => {
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

    describe("Successful Login", () => {
        Cypress.Cookies.defaults({
            preserve: /session|remeber/,
        });
        it("Should successfully login with email/username and password", () => {
            cy.reload();
            cy.get("[id=usernameOrEmail]").clear().type("sean2");
            cy.get("[id=password]").clear().type("Qwey7676@");
            cy.get("[id=loginForm]").submit();
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
                        expect(response.body.user).to.have.property("id");
                        expect(response.body.user).to.have.property("username");
                        expect(response.body.user).to.have.property("email");
                    });
                });
        });
    });
});
