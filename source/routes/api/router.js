"use-strict";

import constants from "#source/constants.js";
import { StatusCodes } from "http-status-codes";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as apiV1Router } from "#source/routes/api/v1/router.js"
router.use("/v1", apiV1Router);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', (request, responds) => {
  return ( responds
    .status(StatusCodes.OK)
    .type("text/html")
    .send(/*html*/`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API</title>
        </head>
        <body>
          <h1>API endpoint</h1>
          <p>
              This is the API endpoint. This is where the application makes requests. You must have some sort of
              authentication to access most of these endpoints. To learn more about the API take a look at the
              <a href="${constants.github.link}">github repository</a> to see the source code.
          </p>                    
        </body>
    </html>`
  ));
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
