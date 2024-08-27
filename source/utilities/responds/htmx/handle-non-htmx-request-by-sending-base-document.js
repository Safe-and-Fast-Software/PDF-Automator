import { StatusCodes } from "http-status-codes";

/** sends the document base first if it's a request that wasn't made by HTMX. */
export default function handleNonHtmxRequestBySendingBaseDocument(request, responds, next) {

    /* Sending the base document first if it's not an HTMX request for a partial */ {
        if (request.headers["hx-request"] === undefined) return ( responds
            .status(StatusCodes.OK)
            .type("text/html")
            .render("main.ejs", { 
                user: request.user, 
                originalUrl: request.originalUrl 
            })
        );
    }

    return next();
}