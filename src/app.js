import express from 'express';
import pdfmake from 'pdfmake';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

import constants from './constants.js';
import apiRoutes from './routes/api/index.js'
import protectedPathsRouter from './routes/auth/index.js';
import requestLogger from './logging/requestLogger.js'
import logger from './logging/logger.js';
import login from './routes/auth/login.js';
import path from 'path';
import { dirname } from 'path';
import FileStore from 'session-file-store';

const FileStoreInstance = FileStore(session);

const app = express();
const publicDirectoryPath = 'public';
const sessionConfig = {
    store: new FileStoreInstance({
        path: './sessions', 
    }),
    secret: constants.app.session.secret, 
    resave: false, 
    saveUninitialized: true 
};

app.use(express.static(publicDirectoryPath));
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
        responds.send(
            `
            <head>
                <title>Home - PDF Automator</title>
            </head>
            <body>
                <h1>
                    PDF Automator
                </h1>
                <p>
                    Hello ${request.user.name},
                </p>
                <p>
                    Welcome to PDF Automator. To get started got to the <a href="/dashboard">dashboard</a>.
                    if you need to learn how this works, you can go to the <a href="/help">help page</a>. 
                    To see your profile click <a href="/profile">here</a>.
                </p>
            </body>
            `
        );
    } else {
        responds.send(
            `
            <head>
                <title>Home - PDF Automator</title>
            </head>
            <body>
                <h1>
                    PDF Automator
                </h1>
                <p>
                    Hello there!
                </p>
                <p>
                    Welcome to PDF Automator. To get started, <a href="/auth/login">login with OAuth</a> first.
                    If you need to learn how this works, you can go to the <a href="/help">help page</a>. 
                </p>
            </body>
            `
        );
    }
});

app.use('/api', apiRoutes);
app.use('/', protectedPathsRouter);

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
