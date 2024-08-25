
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import handleLogin from './handle-login.js';
import passport from 'passport';
import constants from '../../constants.js';
import axios from 'axios';
import getEnvironmentVariable from '../../environmentVariable.js';

const url = new URL(getEnvironmentVariable("OAUTH_CONFIGURATION_URL"));
const response = await axios.get(url);
const oAuthConfiguration = await response.data;
const oAuth2Strategy = new OAuth2Strategy({
    authorizationURL: oAuthConfiguration.authorization_endpoint,
    tokenURL: oAuthConfiguration.token_endpoint,
    clientID: getEnvironmentVariable("OAUTH_CLIENT_ID"),
    clientSecret: getEnvironmentVariable("OAUTH_CLIENT_SECRET"),
    callbackURL: `${constants.app.url}/auth/callback}`
}, handleLogin);

passport.use(oAuth2Strategy);

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

export default passport;