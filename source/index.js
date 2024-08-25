import pdfmake from 'pdfmake';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import express, { response } from 'express';
const app = express();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Request Logger ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import requestLogger from './utilities/logging/requestLogger.js'
app.use(requestLogger);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Public directory ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const publicDirectoryPath = 'public';
app.use(express.static(publicDirectoryPath));

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Configuring Passport ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Private directory ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import requiresAuthentication from './utilities/auth/require-authentication.js';
const privateDirectoryPath = 'private';
app.use('/private', requiresAuthentication, express.static(privateDirectoryPath));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import rootRouter from './routes/root-router.js';
app.use("/", rootRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import handleError from './utilities/errors/error-handeling.js';
app.use(handleError);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

app.listen(80, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port 80, and accessible at \"${constants.app.url}\".`
    );
});
