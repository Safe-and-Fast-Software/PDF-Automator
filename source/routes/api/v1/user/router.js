"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate } from "../../../../utilities/database/schemas/user.js"
import requiresAuthentication from "../../../../utilities/auth/require-authentication.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { Router } from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as byIdRouter } from "./by-id/router.js"
router.use("/by-id", byIdRouter);

import { router as byNameRouter } from "./by-name/router.js"
router.use("/by-name", byNameRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//` GET

router.get("/all", requiresAuthentication, async (request, responds) => {
    const users = await repository.search().return.all();
    responds.send(users);
});

//` PUT

router.put("/", requiresAuthentication, async (request, responds) => {

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const user = request.body;

    console.log(`New user submitted:`, user);

    try {
                
        /* Validating JSON object to follows the schema */ {
            if (! validate(user)) return ( request
                .status(StatusCodes.BAD_REQUEST)
                .type('application/json')
                .send({ 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: did not comply to JSON schema.` 
                })
            );
        }
        
        await repository.save(user);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.CREATED)
                .send({ 
                    status: StatusCodes.CREATED, 
                    message: `${ReasonPhrases.CREATED}: created user.`,
                    user
                })
            );
        }
        
        return ( responds
            .status(StatusCodes.OK)
            .send(`Successfully created user!`)
        ); 

    } catch ( error ) {
        
        console.error(error);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ 
                    status: StatusCodes.INTERNAL_SERVER_ERROR, 
                    message: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new user.`,
                    user
                })
            );
        }

        return ( responds
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new user.`)
        ); 
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
