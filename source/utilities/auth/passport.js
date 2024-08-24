
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import handleLogin from './handle-login.js';
import passport from 'passport';
import constants from '../../constants.js';

const oAuth2Strategy = new OAuth2Strategy({
    authorizationURL: constants.oauth.urls.authorization,
    tokenURL: constants.oauth.urls.token,
    clientID: constants.oauth.client.id,
    clientSecret: constants.oauth.client.secret,
    callbackURL: `${constants.app.url}${constants.app.callbackPath}`
}, handleLogin);

passport.use(oAuth2Strategy);

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

export default passport;