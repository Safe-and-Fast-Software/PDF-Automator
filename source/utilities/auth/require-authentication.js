import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/**
 * Middleware to check if user is authenticated, and redirect them if they're not.
 */
export default function requiresAuthentication(request, responds, next) {
    
    /* disallowing HTMX unauthorized requests */ {
        if (request.headers['hx-request']) return responds.status(StatusCodes.BAD_REQUEST)
            .send(ReasonPhrases.BAD_REQUEST);
    }
    
    if (request.isAuthenticated()) return next();

    return responds.status(StatusCodes.UNAUTHORIZED).redirect("/auth/login");
}
