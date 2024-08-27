"use-strict";

import { StatusCodes } from "http-status-codes";
import requiresAuthentication from "../../utilities/auth/require-authentication.js";
import handleNonHtmxRequestBySendingBaseDocument from "../../utilities/responds/htmx/handle-non-htmx-request-by-sending-base-document.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', requiresAuthentication, handleNonHtmxRequestBySendingBaseDocument, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .render("pages/search", {
            // None ...
        })
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
