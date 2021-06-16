import * as dotenv from "dotenv";

dotenv.config();

describe("Create Post", () => {
    let user;
    let token;

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
            // cy.getCookie("session")
            //     .should("exist")
            //     .then((c) => {
            //         cookie = c.token;
            //     });
        });
    });
    after(() => {
        cy.fixture("posts/pass/post1.json").then((post_data) => {
            cy.request({
                method: "DELETE",
                url: "http://back.seanreichel.com/deletePost",
                body: {
                    post: {
                        title: post_data.title,
                        content: post_data.content,
                        category: post_data.category,
                    },
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        });
    });
    describe("Post Failing", () => {
        describe("should not post with empty request/missing keys", () => {
            it("empty request", () => {
                cy.request({
                    method: "POST",
                    failOnStatusCode: false,
                    url: "http://back.seanreichel.com/createPost",
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
        describe("should not post with any empty fields", () => {
            it("empty title", () => {
                cy.fixture("posts/fail/emptyfields_1.json").then(
                    (post_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createPost",
                            body: { ...post_data },
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
                cy.fixture("posts/fail/emptyfields_2.json").then(
                    (post_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createPost",
                            body: { ...post_data },
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
            it("empty category", () => {
                cy.fixture("posts/fail/emptyfields_2.json").then(
                    (post_data) => {
                        cy.request({
                            method: "POST",
                            failOnStatusCode: false,
                            url: "http://back.seanreichel.com/createPost",
                            body: { ...post_data },
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
        });
        describe("should not post without token in header", () => {
            it("empty auth header", () => {
                cy.fixture("posts/pass/post1.json").then((post_data) => {
                    cy.request({
                        method: "POST",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/createPost",
                        body: { ...post_data },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then((response) => {
                        expect(response).to.exist;
                        expect(response.status).to.eq(403);
                        cy.log(response);
                        expect(response.body.error).to.eq("No auth header!");
                    });
                });
            });
            it("no auth token", () => {
                cy.fixture("posts/pass/post1.json").then((post_data) => {
                    cy.request({
                        method: "POST",
                        failOnStatusCode: false,
                        url: "http://back.seanreichel.com/createPost",
                        body: { ...post_data },
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer  ",
                        },
                    }).then((response) => {
                        expect(response).to.exist;
                        expect(response.status).to.eq(403);
                        cy.log(response);
                        expect(response.body.error).to.eq("No auth token!");
                    });
                });
            });
        });
    });

    describe("Post Passing", () => {
        it("should create a new post", () => {
            cy.fixture("posts/pass/post1.json").then((post_data) => {
                cy.request({
                    method: "POST",
                    url: "http://back.seanreichel.com/createPost",
                    body: { ...post_data },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => {
                    expect(response).to.exist;
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property("post");
                    expect(response.body).to.have.property("message");
                    expect(response.body).to.have.property("link");
                    expect(response.body.message).to.eq(
                        "Post created successfully!"
                    );
                });
            });
        });
        it("should find new post", () => {
            cy.fixture("posts/pass/post1.json").then((post_data) => {
                cy.request({
                    method: "GET",
                    url: "http://back.seanreichel.com/getPosts",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((response) => {
                    const valid_posts = response.body.filter((post) => {
                        return (
                            post.title === post_data.title &&
                            post.content === post_data.content &&
                            post.category === post_data.category &&
                            post.user_id === user.user_id
                        );
                    });

                    expect(valid_posts).to.have.length.of.at.least(1);
                });
            });
        });
    });
});
