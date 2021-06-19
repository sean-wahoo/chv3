import * as dotenv from "dotenv";

dotenv.config();

describe("Likes", () => {
    let testuser1;
    let testuser2;
    let user1_token;
    let user2_token;
    let post_data;
    let comment_data;
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
                expect(testuser1).to.have.property("username", "testuser1");
                expect(testuser1).to.have.property(
                    "email",
                    "testing@email.com"
                );
            });
        });
        cy.fixture("auth/pass/testuser2.json").then((testuser2_json) => {
            cy.request({
                method: "POST",
                url: "http://back.seanreichel.com/login",
                body: { ...testuser2_json },
            }).then((response) => {
                expect(response.status).to.eq(200);
                testuser2 = response.body.user;
                user2_token = response.body.token;
                expect(testuser2).to.have.property("user_id");
                expect(testuser2).to.have.property("username", "testuser2");
                expect(testuser2).to.have.property(
                    "email",
                    "testing2@email.com"
                );
            });
        });
        cy.fixture("posts/pass/post1.json").then((post_data_json) => {
            cy.request({
                method: "POST",
                url: "http://back.seanreichel.com/createPost",
                headers: { Authorization: `Bearer ${user1_token}` },
                body: { ...post_data_json },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.post).to.exist;
                post_data = response.body.post;
            });
        });
        cy.fixture("comments/on_post/pass/comment1.json").then(
            (comment_data_json) => {
                cy.request({
                    method: "POST",
                    url: "http://back.seanreichel.com/createComment",
                    headers: { Authorization: `Bearer ${user1_token}` },
                    body: { ...comment_data_json },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.comment).to.exist;
                    comment_data = response.body.comment;
                });
            }
        );
    });
    after(() => {
        cy.request({
            method: "DELETE",
            url: "http://back.seanreichel.com/deletePost",
            body: { post: post_data },
            headers: { Authorization: `Bearer ${user1_token}` },
        }).then((response) => {
            expect(response.status).to.eq(200);
            cy.log(response);
            expect(response.body).to.have.property(
                "message",
                "Post deleted successfully"
            );
        });
    });

    describe("Liking a post", () => {
        describe("Like failing", () => {
            describe("Malformed request", () => {
                describe("No post_id", () => {
                    it("should fail on no parameter at all", () => {
                        cy.request({
                            method: "GET",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/likePost",
                            headers: { Authorization: `Bearer ${user2_token}` },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "Please provide a post id"
                            );
                        });
                    });
                    it("should fail on empty post_id parameter", () => {
                        cy.request({
                            method: "GET",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/likePost",
                            headers: { Authorization: `Bearer ${user2_token}` },
                            qs: { post_id: "" },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "Please provide a post id"
                            );
                        });
                    });
                });
                describe("Incorrect values", () => {
                    it("should fail on invalid post_id", () => {
                        cy.request({
                            method: "GET",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/likePost",
                            headers: { Authorization: `Bearer ${user2_token}` },
                            qs: { post_id: "haha not a real id" },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "Please provide a valid post id"
                            );
                        });
                    });
                });
            });
            describe("Bad logic", () => {
                let like_id;
                before(() => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/likePost",
                        headers: { Authorization: `Bearer ${user2_token}` },
                        qs: { post_id: post_data.post_id },
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property("like_id");
                        like_id = response.body.like_id;
                        expect(response.body).to.have.property(
                            "message",
                            `Post ${post_data.post_id} liked!`
                        );
                    });
                });
                after(() => {
                    cy.request({
                        method: "DELETE",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/unlikePostOrComment",
                        headers: { Authorization: `Bearer ${user2_token}` },
                        qs: { like_id },
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property(
                            "message",
                            `Post or comment with like_id ${like_id} unliked!`
                        );
                    });
                });
                it("should fail if post is already liked", () => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/likePost",
                        headers: { Authorization: `Bearer ${user2_token}` },
                        qs: { post_id: post_data.post_id },
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                        expect(response.body).to.have.property(
                            "error",
                            "Post already liked"
                        );
                    });
                });
            });
        });
        describe("Like passing", () => {
            let like_id;
            after(() => {
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/unlikePostOrComment",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { like_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        `Post or comment with like_id ${like_id} unliked!`
                    );
                });
            });
            it("should like a post", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/likePost",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { post_id: post_data.post_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property("like_id");
                    like_id = response.body.like_id;
                    expect(response.body).to.have.property(
                        "message",
                        `Post ${post_data.post_id} liked!`
                    );
                });
            });
            it("should find like", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getUsersLikes",
                    qs: { user_id: testuser2.user_id },
                }).then((response) => {
                    let like_ids = [];
                    expect(response.status).to.eq(200);
                    assert.isArray(response.body);
                    response.body.forEach((like) => {
                        like_ids.push(like.like_id);
                    });
                    expect(like_id).to.be.oneOf(like_ids);
                });
            });
        });
    });
    describe("Liking a comment", () => {
        describe("Like failing", () => {
            describe("Malformed request", () => {
                describe("No comment_id", () => {
                    it("should fail on no parameter at all", () => {
                        cy.request({
                            method: "GET",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/likeComment",
                            headers: { Authorization: `Bearer ${user2_token}` },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "Please provide a comment id"
                            );
                        });
                    });
                    it("should fail on empty comment_id parameter", () => {
                        cy.request({
                            method: "GET",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/likeComment",
                            headers: { Authorization: `Bearer ${user2_token}` },
                            qs: { comment_id: "" },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "Please provide a comment id"
                            );
                        });
                    });
                });
                describe("Incorrect values", () => {
                    it("should fail on invalid comment_id", () => {
                        cy.request({
                            method: "GET",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/likeComment",
                            headers: { Authorization: `Bearer ${user2_token}` },
                            qs: { comment_id: "haha not a real id" },
                        }).then((response) => {
                            expect(response.status).to.eq(400);
                            expect(response.body).to.have.property(
                                "error",
                                "Please provide a valid comment id"
                            );
                        });
                    });
                });
            });
            describe("Bad logic", () => {
                let like_id;
                before(() => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/likeComment",
                        headers: { Authorization: `Bearer ${user2_token}` },
                        qs: { comment_id: comment_data.comment_id },
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property("like_id");
                        like_id = response.body.like_id;
                        expect(response.body).to.have.property(
                            "message",
                            `Comment ${comment_data.comment_id} liked!`
                        );
                    });
                });
                after(() => {
                    cy.request({
                        method: "DELETE",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/unlikePostOrComment",
                        headers: { Authorization: `Bearer ${user2_token}` },
                        qs: { like_id },
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property(
                            "message",
                            `Post or comment with like_id ${like_id} unliked!`
                        );
                    });
                });
                it("should fail if post is already liked", () => {
                    cy.request({
                        method: "GET",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/likeComment",
                        headers: { Authorization: `Bearer ${user2_token}` },
                        qs: { comment_id: comment_data.comment_id },
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                        expect(response.body).to.have.property(
                            "error",
                            "Comment already liked"
                        );
                    });
                });
            });
        });
        describe("Like passing", () => {
            let like_id;
            after(() => {
                cy.request({
                    method: "DELETE",
                    url: "http://back.seanreichel.com/unlikePostOrComment",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { like_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property(
                        "message",
                        `Post or comment with like_id ${like_id} unliked!`
                    );
                });
            });
            it("should like a comment", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/likeComment",
                    headers: { Authorization: `Bearer ${user2_token}` },
                    qs: { comment_id: comment_data.comment_id },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property("like_id");
                    like_id = response.body.like_id;
                    expect(response.body).to.have.property(
                        "message",
                        `Comment ${comment_data.comment_id} liked!`
                    );
                });
            });
            it("should find like", () => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getUsersLikes",
                    qs: { user_id: testuser2.user_id },
                }).then((response) => {
                    let like_ids = [];
                    expect(response.status).to.eq(200);
                    assert.isArray(response.body);
                    response.body.forEach((like) => {
                        like_ids.push(like.like_id);
                    });
                    expect(like_id).to.be.oneOf(like_ids);
                });
            });
        });
    });
});
