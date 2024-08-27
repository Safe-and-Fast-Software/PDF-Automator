"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import handleNonHtmxRequestBySendingBaseDocument from "../utilities/responds/htmx/handle-non-htmx-request-by-sending-base-document.js";
import constants from "../constants.js";

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
        .render("pages/home", { sourceCodeURL: constants.github.link })
    );
});

router.get("/session", (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("application/json")
        .send({ user: { ...request.user}, session: { ...request.session } })
    );
});

router.get("/health-check", (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .send(ReasonPhrases.OK)
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
