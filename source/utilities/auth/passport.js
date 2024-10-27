
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import handleLogin from '#source/utilities/auth/handle-login.js';
import passport from 'passport';
import constants from '#source/constants.js';
import axios from 'axios';
import getEnvironmentVariable from '#source/environmentVariable.js';
import { repository } from '#source/utilities/database/schemas/user.js';

const url = new URL(getEnvironmentVariable("OAUTH_CONFIGURATION_URL"));
const response = await axios.get(url);
export const oAuthConfiguration = await response.data;

const oAuth2Strategy = new OAuth2Strategy({
  authorizationURL: oAuthConfiguration.authorization_endpoint,
  tokenURL: oAuthConfiguration.token_endpoint,
  clientID: getEnvironmentVariable("OAUTH_CLIENT_ID"),
  clientSecret: getEnvironmentVariable("OAUTH_CLIENT_SECRET"),
  callbackURL: `${constants.app.url}/auth/callback`
}, handleLogin);

passport.use(oAuth2Strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await repository.fetch(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;