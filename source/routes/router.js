"use-strict";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as apiRouter} from "./api/router.js"
router.use("/api", apiRouter);

import { router as authRouter} from "./auth/router.js";
router.use("/auth", authRouter);

import { router as profileRouter} from "./profile/router.js"
router.use("/profile", profileRouter);

import { router as searchRouter} from "./search/router.js"
router.use("/search", searchRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', (request, responds) => {
    if (request.isAuthenticated()) {
        responds.send(/*html*/`
            <!DOCTYPE html>
            <head>
                <title>Home - PDF Automator</title>
            </head>
            <body>
                <h1>
                    PDF Automator
                </h1>
                <p>
                    Hello ${request.user.name},
                </p>
                <p>
                    Welcome to PDF Automator. To get started got to the <a href="/profile/dashboard">dashboard</a>.
                    if you need to learn how this works, you can go to the <a href="/help">help page</a>. 
                    To see your profile click <a href="/profile">here</a>.
                </p>
            </body>`
        );
    } else {
        responds.send(/*html*/`
            <!DOCTYPE html>
            <head>
                <title>Home - PDF Automator</title>
            </head>
            <body>
                <h1>
                    PDF Automator
                </h1>
                <p>
                    Hello there!
                </p>
                <p>
                    Welcome to PDF Automator. To get started, <a href="/auth/login">login with OAuth</a> first.
                    If you need to learn how this works, you can go to the <a href="/help">help page</a>. 
                </p>
            </body>`
        );
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
