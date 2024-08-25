"use-strict";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
const rootRouter = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//// import authRouter from "./auth/auth-router.js"
//// rootRouter.use("/auth", authRouter);

import apiRouter from "./api/api-router.js"
rootRouter.use("/api", apiRouter);

import profileRouter from "./profile/profile-router.js"
rootRouter.use("/profile", profileRouter);

import authRouter from "./auth/auth-router.js";
rootRouter.use("/auth", authRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

rootRouter.get('/', (request, responds) => {
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

export default rootRouter;
