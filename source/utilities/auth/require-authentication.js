import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/**
 * Middleware to check if user is authenticated, and redirect them if they're not.
 */
export default function requiresAuthentication(request, responds, next) {
    
    /* Under the right headers and development mode, ignore authorization completely */ {
        const ignoreAuthorizationHeader = request.headers["x-ignore-authorization-for-this-request"];
        const requestToIgnoreAuthorization = ignoreAuthorizationHeader === "yes";
        const environmentIsDevelopment = (process.env.NODE_ENV === "development");
        if (requestToIgnoreAuthorization && environmentIsDevelopment) {
            console.warn(
                `[WARNING] using development headers to IGNORE authorization to: ` +
                `${request.method}: ${request.originalUrl}`
            );
            return next();
        }
    }

    /* disallowing HTMX unauthorized requests */ {
        if (request.headers['hx-request']) return responds.status(StatusCodes.BAD_REQUEST)
            .send(`${ReasonPhrases.BAD_REQUEST}: Not an HTMX endpoint.`);
    }
    
    if (request.isAuthenticated()) return next();

    console.log(`Unauthenticated request to ${request.method} at ${request.originalUrl}.`)
    return responds.status(StatusCodes.UNAUTHORIZED).redirect("/auth/login");
}
