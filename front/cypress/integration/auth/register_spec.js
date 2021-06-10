describe("Registration", () => {
    it("Should successfully navigate to /register", () => {
        cy.visit("http://dev.seanreichel.com/register");
        cy.url().should("eq", "http://dev.seanreichel.com/register");
        cy.getCookie("session").should("not.exist");
    });
    describe("Registration failing", () => {
        beforeEach(() => {
            cy.visit("http://dev.seanreichel.com/register");
        });
        it("Should fail register on empty form", () => {
            cy.get("[id=registerForm]").submit();
            cy.getCookie("session").should("not.exist");
            cy.url().should("eq", "http://dev.seanreichel.com/register");
            cy.get("[id=username]").should("have.attr", "required");
            cy.get("[id=email]").should("have.attr", "required");
            cy.get("[id=password]").should("have.attr", "required");
            cy.get("[id=confirmPassword]").should("have.attr", "required");
        });
        it("Should fail on email in use", () => {
            cy.get("[id=username]").type("fake_username");
            cy.get("[id=email").type("trumpinson@gmail.com");
            cy.get("[id=password]").type("P@$$w0rd");
            cy.get("[id=confirmPassword]").type("P@$$w0rd");
            cy.get("[id=registerForm]").submit();
            cy.wait(2000);
            cy.get("[id=registerError]").contains(
                "That email is already in use!"
            );
        });
        it("Should fail on email linked to Google account", () => {
            cy.get("[id=username]").type("fake_username");
            cy.get("[id=email").type("trumpinson@gmail.com");
            cy.get("[id=password]").type("P@$$w0rd");
            cy.get("[id=confirmPassword]").type("P@$$w0rd");
            cy.get("[id=registerForm]").submit();
            cy.wait(2000);
            cy.get("[id=registerError]").contains(
                "That email is already in use!"
            );
        });
    });
    describe("Registration success", () => {
        Cypress.Cookies.defaults({
            preserve: /session|remember/,
        });
        it("Should successfully create a user", () => {
            cy.visit("http://dev.seanreichel.com/register");
            cy.get("[id=username]").type("fake_username");
            cy.get("[id=email").type("test@email69.com");
            cy.get("[id=password]").type("P@$$w0rd");
            cy.get("[id=confirmPassword]").type("P@$$w0rd");
            cy.get("[id=registerForm]").submit();
            cy.wait(2000);
            cy.url().should("eq", "http://dev.seanreichel.com/");
            cy.getCookie("session").should("exist");
        });

        it("Should successfully delete a user", () => {
            cy.getCookie("session")
                .should("exist")
                .then((c) => {
                    cy.get("[id=logout]").click();
                    cy.url().should("eq", "http://dev.seanreichel.com/login");
                    cy.getCookie("session").should("not.exist");
                    const cookie = c;
                    console.log(cookie);
                    cy.request({
                        url: "http://back.seanreichel.com/deleteUser",
                        headers: {
                            Authorization: `Bearer ${cookie.value}`,
                        },
                        method: "DELETE",
                    }).should((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property(
                            "message",
                            "User successfully deleted"
                        );
                    });
                });
        });
    });
});
