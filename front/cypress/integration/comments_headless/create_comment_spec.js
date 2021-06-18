import * as dotenv from "dotenv";

dotenv.config();

describe("Comments", () => {
    let user;
    let token;
    let comment_id_for_delete;
    let reply_id_for_delete;

    before(() => {
        cy.fixture("auth/pass/testuser1.json").then((testuser1) => {
            cy.request({
                method: "POST",
                url: "http://back.seanreichel.com/login",
                body: { ...testuser1 },
            }).then((response) => {
                expect(response.status).to.eq(200);
                user = response.body.user;
                token = response.body.token;

                expect(user).to.have.property("user_id");
                expect(user).to.have.property("username");
                expect(user.username).to.eq("testuser1");
                expect(user).to.have.property("email");
                expect(user.email).to.eq("testing@email.com");
            });
        });
    });

    after(() => {
        cy.request({
            method: "DELETE",
            url: "http://back.seanreichel.com/deleteComment",
            body: {
                comment: {
                    comment_id: comment_id_for_delete,
                },
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(() => {
            cy.request({
                method: "DELETE",
                url: "http://back.seanreichel.com/deleteComment",
                body: {
                    comment: {
                        comment_id: reply_id_for_delete,
                    },
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                expect(response).to.exist;
            });
        });
    });

    describe("Comment on post", () => {
        describe("Comment Failing", () => {
            describe("should not post with empty request/missing keys", () => {
                it("empty request", () => {
                    cy.request({
                        method: "POST",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/createComment",
                        body: {},
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }).then((response) => {
                        expect(response).to.exist;
                        expect(response.status).to.eq(401);
                        expect(response.body.error).to.eq("Request malformed!");
                    });
                });
            });
            describe("should not comment with any empty fields", () => {
                it("empty post_id", () => {
                    cy.fixture("comments/on_post/fail/emptyfields_1.json").then(
                        (comment_data) => {
                            cy.request({
                                method: "POST",
                                failOnStatusCode: false,
                                url: "http://back.seanreichel.com/createComment",
                                body: { ...comment_data },
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            }).then((response) => {
                                expect(response).to.exist;
                                expect(response.status).to.eq(401);
                                expect(response.body.error).to.eq(
                                    "Please fill out all fields!"
                                );
                            });
                        }
                    );
                });
                it("empty content", () => {
                    cy.fixture("comments/on_post/fail/emptyfields_2.json").then(
                        (comment_data) => {
                            cy.request({
                                method: "POST",
                                failOnStatusCode: false,
                                url: "http://back.seanreichel.com/createComment",
                                body: { ...comment_data },
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            }).then((response) => {
                                expect(response).to.exist;
                                expect(response.status).to.eq(401);
                                expect(response.body.error).to.eq(
                                    "Please fill out all fields!"
                                );
                            });
                        }
                    );
                });
                describe("should not post without token in header", () => {
                    it("empty auth header", () => {
                        cy.fixture("comments/on_post/pass/comment1.json").then(
                            (comment_data) => {
                                cy.request({
                                    method: "POST",
                                    failOnStatusCode: false,
                                    url: "http://back.seanreichel.com/createComment",
                                    body: { ...comment_data },
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }).then((response) => {
                                    expect(response).to.exist;
                                    expect(response.status).to.eq(403);
                                    cy.log(response);
                                    expect(response.body.error).to.eq(
                                        "No auth header!"
                                    );
                                });
                            }
                        );
                    });
                    it("no auth token", () => {
                        cy.fixture("comments/on_post/pass/comment1.json").then(
                            (comment_data) => {
                                cy.request({
                                    method: "POST",
                                    failOnStatusCode: false,
                                    url: "http://back.seanreichel.com/createComment",
                                    body: { ...comment_data },
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer  ",
                                    },
                                }).then((response) => {
                                    expect(response).to.exist;
                                    expect(response.status).to.eq(403);
                                    cy.log(response);
                                    expect(response.body.error).to.eq(
                                        "No auth token!"
                                    );
                                });
                            }
                        );
                    });
                });
                it("should fail on invalid post id", () => {
                    cy.fixture(
                        "comments/on_post/fail/invalid_post_id.json"
                    ).then((comment_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createComment",
                            body: { ...comment_data },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            expect(response).to.exist;
                            expect(response.status).to.eq(404);
                            cy.log(response);
                            expect(response.body.error).to.eq(
                                "Post not found!"
                            );
                        });
                    });
                });
            });
        });
        describe("Comment Passing", () => {
            it("should create a new comment", () => {
                cy.fixture("comments/on_post/pass/comment1.json").then(
                    (comment_data) => {
                        cy.request({
                            method: "POST",
                            url: "http://back.seanreichel.com/createComment",
                            body: { ...comment_data },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            expect(response).to.exist;
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property(
                                "comment_id"
                            );

                            expect(response.body).to.have.property("message");
                            expect(response.body.message).to.eq(
                                "Comment created successfully!"
                            );
                            comment_id_for_delete = response.body.comment_id;
                        });
                    }
                );
            });
            it("should find new comment", () => {
                cy.fixture("comments/on_post/pass/comment1.json").then(
                    (comment_data) => {
                        cy.request({
                            method: "GET",
                            url: "http://back.seanreichel.com/getCommentsForPost",
                            qs: { post_id: comment_data.post_id },
                        }).then((response) => {
                            let comment_ids = [];
                            response.body.forEach((comment) => {
                                comment_ids.push(comment.comment_id);
                            });
                            expect(comment_id_for_delete).to.be.oneOf(
                                comment_ids
                            );
                        });
                    }
                );
            });
        });
    });

    describe("Reply to comment", () => {
        describe("Reply Failing", () => {
            describe("should not post with any empty fields", () => {
                it("empty post_id", () => {
                    cy.fixture(
                        "comments/on_comment/fail/emptyfields_1.json"
                    ).then((comment_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createComment",
                            body: { ...comment_data },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            expect(response).to.exist;
                            expect(response.status).to.eq(401);
                            expect(response.body.error).to.eq(
                                "Please fill out all fields!"
                            );
                        });
                    });
                });

                it("empty content", () => {
                    cy.fixture(
                        "comments/on_comment/fail/emptyfields_2.json"
                    ).then((comment_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createComment",
                            body: { ...comment_data },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            expect(response).to.exist;
                            expect(response.status).to.eq(401);
                            expect(response.body.error).to.eq(
                                "Please fill out all fields!"
                            );
                        });
                    });
                });
                describe("should not post without token in header", () => {
                    it("empty auth header", () => {
                        cy.fixture("comments/on_comment/pass/reply1.json").then(
                            (comment_data) => {
                                comment_data.reply_id = comment_id_for_delete;
                                cy.request({
                                    method: "POST",
                                    failOnStatusCode: false,
                                    url: "http://back.seanreichel.com/createComment",
                                    body: { ...comment_data },
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }).then((response) => {
                                    expect(response).to.exist;
                                    expect(response.status).to.eq(403);
                                    cy.log(response);
                                    expect(response.body.error).to.eq(
                                        "No auth header!"
                                    );
                                });
                            }
                        );
                    });
                    it("no auth token", () => {
                        cy.fixture("comments/on_comment/pass/reply1.json").then(
                            (comment_data) => {
                                comment_data.reply_id = comment_id_for_delete;
                                cy.request({
                                    method: "POST",
                                    failOnStatusCode: false,
                                    url: "http://back.seanreichel.com/createComment",
                                    body: { ...comment_data },
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer  ",
                                    },
                                }).then((response) => {
                                    expect(response).to.exist;
                                    expect(response.status).to.eq(403);
                                    cy.log(response);
                                    expect(response.body.error).to.eq(
                                        "No auth token!"
                                    );
                                });
                            }
                        );
                    });
                });
                it("should fail on invalid post id", () => {
                    cy.fixture(
                        "comments/on_comment/fail/invalid_post_id.json"
                    ).then((comment_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createComment",
                            body: { ...comment_data },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            expect(response).to.exist;
                            expect(response.status).to.eq(404);
                            cy.log(response);
                            expect(response.body.error).to.eq(
                                "Post not found!"
                            );
                        });
                    });
                });
            });
        });
        describe("Reply Passing", () => {
            it("should create a new reply", () => {
                cy.fixture("comments/on_comment/pass/reply1.json").then(
                    (comment_data) => {
                        comment_data.reply_id = comment_id_for_delete;
                        cy.request({
                            method: "POST",
                            url: "http://back.seanreichel.com/createComment",
                            body: { ...comment_data },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            expect(response).to.exist;
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property(
                                "comment_id"
                            );

                            expect(response.body).to.have.property("message");
                            expect(response.body.message).to.eq(
                                "Comment created successfully!"
                            );
                            reply_id_for_delete = response.body.comment_id;
                        });
                    }
                );
            });
            it("should find new comment", () => {
                cy.fixture("comments/on_comment/pass/reply1.json").then(() => {
                    cy.request({
                        method: "GET",
                        url: "http://back.seanreichel.com/getRepliesToComment",
                        qs: { comment_id: comment_id_for_delete },
                    }).then((response) => {
                        let reply_ids = [];
                        response.body.forEach((reply) => {
                            reply_ids.push(reply.comment_id);
                        });
                        expect(reply_id_for_delete).to.be.oneOf(reply_ids);
                    });
                });
            });
        });
    });
});
