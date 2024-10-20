"use-strict";

import constants from "#source/constants.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as customerRouter } from "#source/routes/api/v1/customer/router.js";
router.use("/customer", customerRouter);

import { router as userRouter } from "#source/routes/api/v1/user/router.js"
router.use("/user", userRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', (request, responds) => {
    responds.send(/*html*/`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API</title>
            </head>
            <body>
                <h1>API V1 endpoint</h1>
                <p>
                    This is the first generation API endpoint. 
                    if a newer standard becomes available you'll be able to access it at <code>/api/v2</code>.
                    To learn more about the API, you take a look at the 
                    <a href="${constants.github.link}">github repository</a> to see the source code.
                </p>                    
            </body>
        </html>
    `);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
