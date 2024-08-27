"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate } from "../../../../../utilities/database/schemas/user.js";
import requiresAuthentication from "../../../../../utilities/auth/require-authentication.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function logInteraction(request) {
    console.debug(`[API-V1] ${request.method} request for user with id: \"${request.params.id}\".`);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//` GET

router.get("/:id", requiresAuthentication, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const id = request.params.id;
    
    logInteraction(request);
    
    try {
        
        const user = await repository.fetch(id);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(user)
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
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: an error occurred getting the user.`)
        ); 
    }
});

//` POST

router.post("/:id", requiresAuthentication, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const id = request.params.id;
    const updatedUser = request.body;
    
    logInteraction(request);

    try {
        
        /* Validating JSON object to follow the custom schema */ {
            if (! validate(updatedUser)) return ( request
                .status(StatusCodes.BAD_REQUEST)
                .type('application/json')
                .send({ 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: user did not comply to JSON schema.` 
                })
            );
        }

        await repository.save(id, updatedUser);
        
        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send({ status: StatusCodes.OK, message: ReasonPhrases.OK })
            );
        }
        
        return ( responds
            .status(StatusCodes.OK)
            .send(`Successfully updated user!`)
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
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: an error occurred updating the user.`)
        ); 
    }
});
  
//` DELETE

router.delete("/:id", requiresAuthentication, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const id = request.params.id;    
    
    logInteraction(request);

    try {

        await repository.remove(id);
        
        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds.status(StatusCodes.OK)
                .type('application/json')
                .send({ 
                    status: StatusCodes.OK, 
                    message: `${ReasonPhrases.OK}: user with id ${id} deleted Successfully.`
                })
            );
        }

        return ( responds // HTMX responds
            .status(StatusCodes.OK)
            .send(`${StatusCodes.OK}: Successfully deleted user!`)
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
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: An error occurred deleting the user.`)
        ); 
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
