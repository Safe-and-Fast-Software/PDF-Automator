import pdfmake from 'pdfmake';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import express, { response } from 'express';
const app = express();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Request Logger ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import requestLogger from './utilities/logging/requestLogger.js'
app.use(requestLogger);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Static directory ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import requiresAuthentication from './utilities/auth/require-authentication.js';
app.use('/private', requiresAuthentication, express.static('private'));
app.use(express.static("public"));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Configuring Sessions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

import session from 'express-session';
import RedisStore from "connect-redis"
import client from "./utilities/database/client.js"
import constants from './constants.js';
import getEnvironmentVariable from './environmentVariable.js';
app.use(session({
    store : new RedisStore({
        client: client,
        prefix: "session:",
    }),
    secret: getEnvironmentVariable("SESSION_SECRET"), 
    failureRedirect: '/',
    resave: false, 
    saveUninitialized: true 
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Configuring Passport ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

import passport from './utilities/auth/passport.js';
app.use(passport.initialize());
app.use(passport.session());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Getting Request Params and Body ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as rootRouter } from './routes/router.js';
app.use("/", rootRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import handleError from './utilities/errors/error-handeling.js';
app.use(handleError);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

app.listen(80, () => {

    if (process.env.NODE_ENV === "development") console.warn(
        `[WARNING] Server running in ${process.env.NODE_ENV} mode. ` +
        `Do *NOT* run this in production as it contains the ability to ignore all authentication to help test. ` +
        `Running this as production means API is complete exposed if the right headers are supplied.`
    );
    
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port 80, and accessible at \"${constants.app.url}\".`
    );
});
