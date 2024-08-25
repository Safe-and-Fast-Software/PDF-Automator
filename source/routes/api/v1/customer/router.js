"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate } from "../../../../utilities/database/schemas/customer.js"
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
    const customers = await repository.search().return.all();
    responds.send(customers);
});

//` PUT

router.put("/", requiresAuthentication, async (request, responds) => {

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const costumer = request.body;

    console.log(`New customer submitted:`, costumer);

    try {

        /* Validating JSON object to follow the custom schema */ {
            if (! validate(costumer)) return ( request
                .status(StatusCodes.BAD_REQUEST)
                .type('application/json')
                .send({ 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: customer did not comply to JSON schema.` 
                })
            );
        }
        
        await repository.save(costumer);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.CREATED)
                .send({ 
                    status: StatusCodes.CREATED, 
                    message: `${ReasonPhrases.CREATED}: created customer.`,
                    costumer
                })
            );
        }
        
        return ( responds
            .status(StatusCodes.OK)
            .send(`Successfully created customer!`)
        ); 

    } catch ( error ) {
        
        console.error(error);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ 
                    status: StatusCodes.INTERNAL_SERVER_ERROR, 
                    message: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new customer.`,
                    costumer
                })
            );
        }

        return ( responds
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new customer.`)
        ); 
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
