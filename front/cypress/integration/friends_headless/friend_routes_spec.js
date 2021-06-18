import * as dotenv from "dotenv";

dotenv.config();

describe("Friends", () => {
    let testuser1;
    let user1_token;
    let testuser2;
    let user2_token;

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
    });

    // after(() => {
    //     cy.request({
    //         method: "DELETE",
    //         url: "http://back.seanreichel.com/removeFriend",
    //         headers: {
    //             Authorization: `Bearer ${user1_token}`,
    //         },
    //         qs: { user_id: testuser2.user_id },
    //     }).then((response) => {
    //         expect(response.status).to.eq(200);
    //         expect(response.body).to.have.property(
    //             "message",
    //             "Friendship successfully removed!"
    //         );
    //     });
    // });

    describe("Send friend request", () => {
        describe("Request failing", () => {
            describe("Missing data", () => {
                it("should fail on unauthorized", () => {
                    cy.request({
                        method: "GET",
                        url: "http://back.seanreichel.com/sendFriendRequest",
                        failOnStatusCode: false,
                        qs: { user_id: testuser2.user_id },
                    }).then((response) => {
                        expect(response.status).to.eq(403);
                        expect(response.body).to.have.property(
                            "error",
                            "No auth header!"
                        );
                    });
                });
                it("should fail on nonexistant recipient user id", () => {
                    cy.request({
                        method: "GET",
                        url: "http://back.seanreichel.com/sendFriendRequest",
                        failOnStatusCode: false,
                        qs: { user_id: "lolhaha" },
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user1_token}`,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                        expect(response.body).to.have.property(
                            "error",
                            "User doesn't exist!"
                        );
                        // expect(response.status).to.eq(403);
                        // expect(response.body).to.have.property(
                        //     "error",
                        //     "No auth header!"
                        // );
                    });
                });
                describe("failing tests on existing valid request", () => {
                    before(() => {
                        cy.request({
                            method: "GET",
                            url: "http://back.seanreichel.com/sendFriendRequest",
                            failOnStatusCode: false,
                            qs: { user_id: testuser2.user_id },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user1_token}`,
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property(
                                "message",
                                "Request sent successfully!"
                            );
                            expect(response.body).to.have.property(
                                "friendship_id"
                            );
                        });
                    });
                    after(() => {
                        cy.request({
                            method: "DELETE",
                            url: "http://back.seanreichel.com/declineFriendRequest",
                            failOnStatusCode: false,
                            qs: { user_id: testuser1.user_id },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user2_token}`,
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property(
                                "message",
                                "Friend request declined!"
                            );
                        });
                    });
                    it("should fail if request already exists", () => {
                        cy.request({
                            method: "GET",
                            url: "http://back.seanreichel.com/sendFriendRequest",
                            failOnStatusCode: false,
                            qs: { user_id: testuser2.user_id },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user1_token}`,
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "You already sent a friend request to this user!"
                            );
                        });
                    });
                    it("should fail on an attempt by user who sent request to accept it", () => {
                        cy.request({
                            method: "GET",
                            url: "http://back.seanreichel.com/acceptFriendRequest",
                            failOnStatusCode: false,
                            qs: { user_id: testuser2.user_id },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user1_token}`,
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "There is no friend request to accept!"
                            );
                        });
                    });
                    it("should fail on an attempt by user who sent request to decline it", () => {
                        cy.request({
                            method: "DELETE",
                            url: "http://back.seanreichel.com/declineFriendRequest",
                            failOnStatusCode: false,
                            qs: { user_id: testuser2.user_id },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user1_token}`,
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "There is no friend request to decline!"
                            );
                        });
                    });
                });
                it("should fail to accept nonexistant request", () => {
                    cy.request({
                        method: "GET",
                        url: "http://back.seanreichel.com/acceptFriendRequest",
                        failOnStatusCode: false,
                        qs: { user_id: testuser2.user_id },
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user1_token}`,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                        expect(response.body).to.have.property(
                            "error",
                            "There is no friend request to accept!"
                        );
                    });
                });
                it("should fail to decline nonexistant request", () => {
                    cy.request({
                        method: "DELETE",
                        url: "http://back.seanreichel.com/declineFriendRequest",
                        failOnStatusCode: false,
                        qs: { user_id: testuser2.user_id },
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user1_token}`,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                        expect(response.body).to.have.property(
                            "error",
                            "There is no friend request to decline!"
                        );
                    });
                });
            });
        });
        describe("Request passing", () => {
            let friendship_id;
            after(() => {
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/declineFriendRequest",
                    qs: { user_id: testuser1.user_id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user2_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Friend request declined!"
                    );
                });
            });
            it("should send a valid friend request", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/sendFriendRequest",
                    failOnStatusCode: false,
                    qs: { user_id: testuser2.user_id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Request sent successfully!"
                    );
                    expect(response.body).to.have.property("friendship_id");
                    friendship_id = response.body.friendship_id;
                });
            });
            it("should find friend request", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getUsersFriendRequests",
                    headers: { Authorization: `Bearer ${user1_token}` },
                }).then((response) => {
                    let friendship_ids = [];
                    assert.isArray(response.body);

                    response.body.forEach((requests) => {
                        friendship_ids.push(requests.friendship_id);
                    });
                    expect(friendship_id).to.be.oneOf(friendship_ids);
                });
            });
        });
    });
});
