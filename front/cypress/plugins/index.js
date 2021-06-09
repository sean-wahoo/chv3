/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
import * as dotenv from "dotenv";
const { GoogleSocialLogin } = require("cypress-social-logins").plugins;

dotenv.config();
module.exports = (on, config) => {
    config.env.googleClientId = process.env.GOOGLE_CLIENT_ID;
    config.env.googleClientSecret = process.env.GOOGLE_SECRET_ID;
    config.env.googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    config.env.googleUsername = process.env.GOOGLE_TEST_ACCOUNT_EMAIL;
    config.env.googlePassword = process.env.GOOGLE_TEST_ACCOUNT_PASSWORD;
    config.env.googleLoginUrl = "http://dev.seanreichel.com/login";
    config.env.googleCookieName = "session";

    on("task", {
        GoogleSocialLogin: GoogleSocialLogin,
    });

    return config;
};
