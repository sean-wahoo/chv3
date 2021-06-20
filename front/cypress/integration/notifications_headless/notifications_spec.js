import * as dotenv from "dotenv";

dotenv.config();

describe("Notifications", () => {
    let testuser1;
    let testuser2;
    let user1_token;
    let user2_token;
    let user1_notifications = [];
    let user2_notifications = [];
    let random_notification_id;
    let beforeClearLength;
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
                // ! CREATING NOTIFICATION DATA
                //* notifications for testuser2
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
                });
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
                });
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
                });
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
                });
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

                //* notifications for testuser1
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/sendFriendRequest",
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
                        "Request sent successfully!"
                    );
                    expect(response.body).to.have.property("friendship_id");
                });
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/declineFriendRequest",
                    qs: { user_id: testuser2.user_id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Friend request declined!"
                    );
                });
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/sendFriendRequest",
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
                        "Request sent successfully!"
                    );
                    expect(response.body).to.have.property("friendship_id");
                });
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/declineFriendRequest",
                    qs: { user_id: testuser2.user_id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Friend request declined!"
                    );
                });
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/sendFriendRequest",
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
                        "Request sent successfully!"
                    );
                    expect(response.body).to.have.property("friendship_id");
                });
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/declineFriendRequest",
                    qs: { user_id: testuser2.user_id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Friend request declined!"
                    );
                });
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/sendFriendRequest",
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
                        "Request sent successfully!"
                    );
                    expect(response.body).to.have.property("friendship_id");
                });
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/declineFriendRequest",
                    qs: { user_id: testuser2.user_id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Friend request declined!"
                    );
                });
            });
        });
    });
    describe("Find all notifications", () => {
        it("should find user 1's notifications", () => {
            cy.request({
                method: "GET",
                url: "http://back.seanreichel.com/getNotifications",
                headers: {
                    Authorization: `Bearer ${user1_token}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                assert.isArray(response.body);
                response.body.forEach((notification) => {
                    expect(notification).to.have.property("notification_id");
                    expect(notification).to.have.property("notification_text");
                    expect(notification).to.have.property("notification_link");
                    expect(notification).to.have.property("notification_type");
                    expect(notification).to.have.property("created_at");
                    expect(notification).to.have.property(
                        "user_id",
                        testuser1.user_id
                    );
                });
                expect(response.body.length).to.be.at.least(4);
                user1_notifications = response.body;
            });
        });
        it("should find user 2's notifications", () => {
            cy.request({
                method: "GET",
                url: "http://back.seanreichel.com/getNotifications",
                headers: {
                    Authorization: `Bearer ${user2_token}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                assert.isArray(response.body);
                response.body.forEach((notification) => {
                    expect(notification).to.have.property("notification_id");
                    expect(notification).to.have.property("notification_text");
                    expect(notification).to.have.property("notification_link");
                    expect(notification).to.have.property("notification_type");
                    expect(notification).to.have.property("created_at");
                    expect(notification).to.have.property(
                        "user_id",
                        testuser2.user_id
                    );
                });
                expect(response.body.length).to.be.at.least(4);
                user2_notifications = response.body;
                beforeClearLength = user2_notifications.length;
                random_notification_id = response.body[0].notification_id;
            });
        });
        it("user 1's notifications must not be the same as user 2's", () => {
            expect(user1_notifications).to.not.eq(user2_notifications);
        });
    });
    describe("Clear one notification", () => {
        describe("Clear one failing", () => {
            it("should fail on no notification_id", () => {
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/clearOneNotification",
                    headers: {
                        Authorization: `Bearer ${user2_token}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property(
                        "error",
                        "Please provide a notification id"
                    );
                });
            });
            it("should fail on invalid notification_id", () => {
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/clearOneNotification",
                    headers: {
                        Authorization: `Bearer ${user2_token}`,
                    },
                    qs: { notification_id: "haha garbage notification id" },
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property(
                        "error",
                        "Please provide a valid notification id"
                    );
                });
            });
        });
        describe("Clear one passing", () => {
            it("should successfully delete one notification", () => {
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/clearOneNotification",
                    headers: {
                        Authorization: `Bearer ${user2_token}`,
                    },
                    qs: { notification_id: random_notification_id },
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "Notification cleared!"
                    );
                });
            });

            it("should find one less notification", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getNotifications",
                    headers: {
                        Authorization: `Bearer ${user2_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    assert.isArray(response.body);
                    response.body.forEach((notification) => {
                        expect(notification).to.have.property(
                            "notification_id"
                        );
                        expect(notification).to.have.property(
                            "notification_text"
                        );
                        expect(notification).to.have.property(
                            "notification_link"
                        );
                        expect(notification).to.have.property(
                            "notification_type"
                        );
                        expect(notification).to.have.property("created_at");
                        expect(notification).to.have.property(
                            "user_id",
                            testuser2.user_id
                        );
                    });
                    expect(response.body.length).to.equal(
                        beforeClearLength - 1
                    );
                });
            });
        });
    });
    describe("Clear all notifications", () => {
        it("should clear user 1's notifications", () => {
            cy.request({
                method: "DELETE",
                url: "http://back.seanreichel.com/clearAllNotifications",
                headers: { Authorization: `Bearer ${user1_token}` },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property(
                    "message",
                    "Notifications cleared!"
                );
            });
        });
        it("should clear user 2's notifications", () => {
            cy.request({
                method: "DELETE",
                url: "http://back.seanreichel.com/clearAllNotifications",
                headers: { Authorization: `Bearer ${user2_token}` },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property(
                    "message",
                    "Notifications cleared!"
                );
            });
        });
        describe("Check that notifications are gone", () => {
            it("should have cleared user 1's notifications", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getNotifications",
                    headers: {
                        Authorization: `Bearer ${user1_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "No notifications found!"
                    );
                });
            });
            it("should have cleared user 1's notifications", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getNotifications",
                    headers: {
                        Authorization: `Bearer ${user2_token}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        "No notifications found!"
                    );
                });
            });
        });
    });
});
