import constants from '../../constants.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/**
 * Middleware to check if user is authenticated, and redirect them if they're not.
 */
export default function requiresAuthentication(request, responds, next) {
    
    const isNotHtmxRequest = (request.headers['hx-request'] === undefined);

    if (request.isAuthenticated()) return next();
    if (isNotHtmxRequest) responds.redirect(constants.app.loginPath);

    responds.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
}
