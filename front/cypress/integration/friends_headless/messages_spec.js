import * as dotenv from "dotenv";

dotenv.config();

describe("Messages", () => {
    let testuser1;
    let testuser2;
    let testuser3;
    let user1_token;
    let user2_token;
    let user3_token;

    before(() => {
        cy.fixture("auth/pass/testuser1.json").then((testuser1_json) => {
            cy.request({
                method: "POST",
                url: "http://back.seanreichel.com/login",
                body: { ...testuser1_json },
            }).then((response) => {
                expect(response.status).to.eq(200);
                testuser1 = response.body.user;
                user1_token = response.body.token;

                expect(testuser1).to.have.property("user_id");
                expect(testuser1).to.have.property("username");
                expect(testuser1.username).to.eq("testuser1");
                expect(testuser1).to.have.property("email");
                expect(testuser1.email).to.eq("testing@email.com");
            });
        });
        cy.fixture("auth/pass/testuser2.json").then((testuser2_json) => {
            cy.request({
                method: "POST",
                url: "http://back.seanreichel.com/login",
                body: { ...testuser2_json },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("user");

                testuser2 = response.body.user;
                user2_token = response.body.token;

                expect(testuser2).to.have.property("user_id");
                expect(testuser2).to.have.property("username");
                expect(testuser2.username).to.eq("testuser2");
                expect(testuser2).to.have.property("email");
                expect(testuser2.email).to.eq("testing2@email.com");
            });
        });
        cy.fixture("auth/pass/testuser3.json").then((testuser3_json) => {
            cy.request({
                method: "POST",
                url: "http://back.seanreichel.com/login",
                body: { ...testuser3_json },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("user");

                testuser3 = response.body.user;
                user3_token = response.body.token;

                expect(testuser3).to.have.property("user_id");
                expect(testuser3).to.have.property("username");
                expect(testuser3.username).to.eq("testuser3");
                expect(testuser3).to.have.property("email");
                expect(testuser3.email).to.eq("testing3@email.com");
            });
        });
    });

    describe("Sending messages", () => {
        describe("Failing sending", () => {
            describe("Friend middleware errors", () => {
                it("should fail friend middleware if no friend id is provided", () => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/getMessages",
                        headers: {
                            Authorization: `Bearer ${user1_token}`,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(403);
                        expect(response.body).to.have.property(
                            "error",
                            "Please provide a user id for your friend!"
                        );
                    });
                });
                it("should fail on both users being the same", () => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/getMessages",
                        headers: {
                            Authorization: `Bearer ${user1_token}`,
                        },
                        qs: { user_id: testuser1.user_id },
                    }).then((response) => {
                        expect(response.status).to.eq(404);
                        expect(response.body).to.have.property(
                            "error",
                            "You can't be friends with yourself!"
                        );
                    });
                });
                it("should fail on no friendship", () => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/getMessages",
                        headers: {
                            Authorization: `Bearer ${user1_token}`,
                        },
                        qs: {
                            user_id:
                                "dummy id, doesnt matter that it isnt valid",
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(403);
                        expect(response.body).to.have.property(
                            "error",
                            "Friendship not found!"
                        );
                    });
                });
                it("should fail on not accepted friend request", () => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/getMessages",
                        headers: {
                            Authorization: `Bearer ${user1_token}`,
                        },
                        qs: {
                            user_id: testuser3.user_id,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(403);
                        expect(response.body).to.have.property(
                            "error",
                            "Friendship not found!"
                        );
                    });
                });
            });
            describe("Bad logic", () => {
                it("should fail send on missing content key", () => {
                    cy.request({
                        method: "POST",
                        url: "http://back.seanreichel.com/sendMessage",
                        headers: {
                            Authorization: `Bearer ${user3_token}`,
                        },
                        failOnStatusCode: false,
                        qs: { user_id: testuser2.user_id },
                        body: {},
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                        expect(response.body).to.have.property(
                            "error",
                            "Please provide a message!"
                        );
                    });
                });
                it("should fail send on empty content", () => {
                    cy.request({
                        method: "POST",
                        url: "http://back.seanreichel.com/sendMessage",
                        headers: {
                            Authorization: `Bearer ${user3_token}`,
                        },
                        failOnStatusCode: false,
                        qs: { user_id: testuser2.user_id },
                        body: { content: "" },
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                        expect(response.body).to.have.property(
                            "error",
                            "Please provide a message!"
                        );
                    });
                });
                it("should fail send on content being just spaces or newlines", () => {
                    cy.request({
                        method: "POST",
                        url: "http://back.seanreichel.com/sendMessage",
                        headers: {
                            Authorization: `Bearer ${user3_token}`,
                        },
                        failOnStatusCode: false,
                        qs: { user_id: testuser2.user_id },
                        body: { content: "                      " },
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                        expect(response.body).to.have.property(
                            "error",
                            "Please provide a message!"
                        );
                    });
                });
            });
        });
        describe("Pass sending", () => {
            let message_id;
            it("should send a message to the other user", () => {
                cy.request({
                    method: "POST",
                    url: "http://back.seanreichel.com/sendMessage",
                    headers: {
                        Authorization: `Bearer ${user3_token}`,
                    },

                    qs: { user_id: testuser2.user_id },
                    body: { content: "here is a pretty radical message" },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Message sent successfully!"
                    );
                    expect(response.body).to.have.property("message_id");
                    message_id = response.body.message_id;
                });
            });
            it("should find the message", () => {
                let message_ids = [];
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getMessages",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { user_id: testuser3.user_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    assert.isArray(response.body);
                    response.body.forEach((message) => {
                        message_ids.push(message.message_id);
                    });
                    expect(message_id).to.be.oneOf(message_ids);
                });
            });
        });
    });
    describe("Marking messages as read", () => {
        let read_statuses = [];
        describe("Read passing", () => {
            it("should update messages as read", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/updateReadMessages",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { user_id: testuser3.user_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Messages have been read!"
                    );
                });
            });
            it("verify messages are set as read", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getMessages",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { user_id: testuser3.user_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    assert.isArray(response.body);
                    response.body.forEach((message) => {
                        read_statuses.push(message.is_read);
                    });

                    expect(0).to.not.be.oneOf(read_statuses);
                });
            });
        });
    });
});
