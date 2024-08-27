"use-strict";

import { StatusCodes } from "http-status-codes";
import requiresAuthentication from "../../utilities/auth/require-authentication.js";
import handleNonHtmxRequestBySendingBaseDocument from "../../utilities/responds/htmx/handle-non-htmx-request-by-sending-base-document.js";
import { EntityId } from "redis-om";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', requiresAuthentication, handleNonHtmxRequestBySendingBaseDocument, (request, responds) => {
    console.log("PROFILE: request.user", request.user);
    console.log("PROFILE: request.session.passport.user", request.session.passport.user);
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .render("pages/profile", {
            user: { ...request.user, id: request.session.passport.user}
        })
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
