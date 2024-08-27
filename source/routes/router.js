"use-strict";

import { StatusCodes } from "http-status-codes";
import handleNonHtmxRequestBySendingBaseDocument from "../utilities/responds/htmx/handle-non-htmx-request-by-sending-base-document.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as apiRouter} from "./api/router.js"
router.use("/api", apiRouter);

import { router as authRouter} from "./auth/router.js";
router.use("/auth", authRouter);

import { router as newRouter} from "./new/router.js"
router.use("/new", newRouter);

import { router as profileRouter} from "./profile/router.js"
router.use("/profile", profileRouter);

import { router as searchRouter} from "./search/router.js"
router.use("/search", searchRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', handleNonHtmxRequestBySendingBaseDocument, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send("this is the home page")
    );
});

router.get("/session", (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        // .type("text/html")
        .send({ user: { ...request.user}, session: { ...request.session } })
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
