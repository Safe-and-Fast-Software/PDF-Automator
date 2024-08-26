import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/**
 * Middleware to check if user is authenticated, and redirect them if they're not.
 */
export default function requiresAuthentication(request, responds, next) {
    
    // if it's authenticated, then there's no issue and we move on.
    if (request.isAuthenticated()) return next();

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

    console.warn(`Unauthenticated request to ${request.method} at ${request.originalUrl}.`)

    /* If it's not a background request made by HTMX, then redirect them to login instead. */ {
        const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
        if (isNotAnHtmxRequest) return ( responds
            .status(StatusCodes.UNAUTHORIZED)
            .redirect("/auth/login")
        );
    }

    return ( responds // else mention they're unauthorized
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED)
    );
}
