
"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository } from "../../../../../utilities/database/schemas/customer.js";
import requiresAuthentication from "../../../../../utilities/auth/require-authentication.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function logInteraction(request) {
    console.debug(`[API-V1] ${request.method} request for customer with name: \"${request.params.name}\".`);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//` GET

router.get("/:name", requiresAuthentication, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const name = request.params.name;
    
    logInteraction(request);

    try {

        const customer = (await repository.search()
            .where("name").is.equalTo(name)
            .return.first()
        );

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(customer)
            );
        }
            
        return ( responds
            .status(StatusCodes.BAD_REQUEST)
            .send(`${ReasonPhrases.BAD_REQUEST}: Not implemented as an HTMX endpoint yet.`)
        );

    } catch ( error ) {
        
        console.error(error);
            
        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .type('application/json')
                .send({ 
                    status: StatusCodes.INTERNAL_SERVER_ERROR, 
                    error: ReasonPhrases.INTERNAL_SERVER_ERROR 
                })
            );
        }

        return ( responds // HTMX responds
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: an error occurred getting the customer.`)
        ); 
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
