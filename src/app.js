import express from 'express';
import pdfmake from 'pdfmake';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

import constants from './constants.js';
import apiRoutes from './routes/api/index.js'
import requestLogger from './logging/requestLogger.js'
import logger from './logging/logger.js';

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
    },
    function (accessToken, refreshToken, profile, done) {
        
        logger.debug(
            `Login with:` +
            `\n\t- accessToken: ${accessToken}, ` + 
            `\n\t- refreshToken: ${refreshToken}, `+ 
            `\n\t- profile: ${profile},` +
            `\n\t- done: ${done}`
        );

        // Here, you should store the user profile in your database
        // For simplicity, we're just passing the profile through

        return done(null, profile);
    })
);

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

// Define routes
app.get(constants.app.loginPath, (request, responds) => {
    
    const query = (
        "response_type=code&" +
        `client_id=${constants.oauth.client.id}&` +
        `redirect_uri=${constants.app.url}${constants.app.callbackPath}&` +
        "scope=profile" // Add required scopes here
    );

    responds.redirect(`${constants.oauth.urls.authorization}?${query}`);
});

app.get(
    constants.app.callbackPath, 
    passport.authenticate('oauth2', { failureRedirect: '/' }), 
    (request, responds) => { responds.redirect('/'); }
);

app.get('/', (request, responds) => {
    if (request.isAuthenticated()) {
        responds.send(`Hello ${request.user.name}`);
    } else {
        responds.send(`You're not logged in. Please <a href="/auth/login">login with OAuth</a>.`);
    }
});

app.use('/api', apiRoutes);
// app.use('/', authRoutes);

app.listen(constants.app.port, () => {
    console.log(`Server running on ${constants.app.url}`);
});
