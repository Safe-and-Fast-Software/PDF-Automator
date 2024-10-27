"use-strict";

import 'module-alias/register.js'
import pdfmake from 'pdfmake';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import express from 'express';
const app = express();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Configuring Sessions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

import session from 'express-session';
import RedisStore from "connect-redis"
import client from "#source/utilities/database/client.js"
import getEnvironmentVariable from '#source/environmentVariable.js';
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

import passport from '#source/utilities/auth/passport.js';
app.use(passport.initialize());
app.use(passport.session());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Request Logger ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import requestLogger from '#source/utilities/logging/requestLogger.js'
app.use(requestLogger);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Static directory ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import requiresAuthentication from '#source/utilities/auth/require-authentication.js';
app.use('/private', requiresAuthentication, express.static('private'));
app.use(express.static("public"));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Getting Request Params and Body ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Setting the Rendering Engine ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

app.set('view engine', 'ejs');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as rootRouter } from './routes/router.js';
app.use("/", rootRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import handleError from '#source/utilities/errors/error-handeling.js';
app.use(handleError);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import fs from 'fs';
app.listen(80, () => {

  if (process.env.NODE_ENV === "development") console.warn(
    `[WARNING] Server running in ${process.env.NODE_ENV} mode. ` +
    `Do *NOT* run this in production as it contains the ability to ignore all authentication to help test. ` +
    `Running this as production means API is complete exposed if the right headers are supplied.`
  );
  
  const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  console.log(`Server running version ${version} in ${process.env.NODE_ENV} mode on port 80.`);
});
