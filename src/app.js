import express from 'express';
import pdfmake from 'pdfmake';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

import constants from './constants.js';
import apiRoutes from './routes/api/index.js'
import requestLogger from './logging/requestLogger.js'
import logger from './logging/logger.js';
import login from './routes/auth/login.js';

const app = express();
const sessionConfig = {
    secret: constants.app.session.secret, 
    resave: false, 
    saveUninitialized: true 
};

app.use(requestLogger);
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy(
    {
        authorizationURL: constants.oauth.urls.authorization,
        tokenURL: constants.oauth.urls.token,
        clientID: constants.oauth.client.id,
        clientSecret: constants.oauth.client.secret,
        callbackURL: `${constants.app.url}${constants.app.callbackPath}`
    }, login)
);

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

app.get(constants.app.loginPath, passport.authenticate('oauth2'));
app.get(constants.app.callbackPath, passport.authenticate(
    'oauth2', 
    { failureRedirect: '/', scope: ['profile', 'email'] }), 
    (request, responds) => { responds.redirect('/'); }
);

app.get('/', (request, responds) => {
    if (request.isAuthenticated()) {
        responds.send(`Hello ${request.user.name}`);
    } else {
        responds.send(`You're not logged in.<br>Please <a href="/auth/login">login with OAuth</a>.`);
    }
});

app.use('/api', apiRoutes);
// app.use('/', authRoutes);

app.use((error, request, responds, next) => {
    console.error(error);
    const respondsCode = error.status || 500
    responds.status(respondsCode).json({
        error: {
            message: error.message || 'Internal Server Error',
            status: respondsCode,
        }
    });
});

app.listen(constants.app.port, () => {
    console.log(`Server running on ${constants.app.url}`);
});
