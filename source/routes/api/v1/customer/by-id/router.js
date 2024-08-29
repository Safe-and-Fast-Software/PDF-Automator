"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import requiresAuthentication from "../../../../../utilities/auth/require-authentication.js";
import { repository, validate } from "../../../../../utilities/database/schemas/customer.js";
import customerCardComponent from "../customer-card.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function logInteraction(request) {
    console.debug(`[API-V1] ${request.method} request for customer with id: \"${request.params.id}\".`);
}

function serverMessageComponent(message) {
    return (/*HTML*/`
        <span class="transition-opacity duration-500 opacity-100">
            ${message}
        </span>
    `);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//` GET

router.get("/:id", requiresAuthentication, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const id = request.params.id;
    
    logInteraction(request);
    
    try {
        
        const customer = await repository.fetch(id);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(customer)
            );
        }
            
        return ( responds
            .status(StatusCodes.OK)
            .type("text/html")
            .send(customerCardComponent(customer))
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
            .type("text/html")
            .send(serverMessageComponent(
                `${ReasonPhrases.INTERNAL_SERVER_ERROR}: an error occurred getting the customer.`
            ))
        ); 
    }
});

//` POST

router.post("/:id", requiresAuthentication, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const id = request.params.id;
    const updatedCustomer = request.body;
    
    logInteraction(request);

    try {
        
        /* Validating JSON object to follow the custom schema */ {
            if (! validate(updatedCustomer)) return ( request
                .status(StatusCodes.BAD_REQUEST)
                .type('application/json')
                .send({ 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: customer did not comply to JSON schema.` 
                })
            );
        }
        
        await repository.save(id, updatedCustomer);
        
        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send({ status: StatusCodes.OK, message: ReasonPhrases.OK })
            );
        }
        
        return ( responds
            .status(StatusCodes.OK)
            .type("text/html")
            .send(serverMessageComponent("Successfully updated customer!"))
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
            .type("text/html")
            .send(serverMessageComponent(
                `${ReasonPhrases.INTERNAL_SERVER_ERROR}: an error occurred updating the customer.`
            ))
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
                    message: `${ReasonPhrases.OK}: customer with id ${id} deleted Successfully.`
                })
            );
        }

        return ( responds // HTMX responds
            .status(StatusCodes.OK)
            .type("text/html")
            .send(serverMessageComponent(`${ReasonPhrases.OK}: Successfully deleted customer!`))
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
            .type("text/html")
            .send(serverMessageComponent(
                `${ReasonPhrases.INTERNAL_SERVER_ERROR}: An error occurred deleting the customer.`
            ))
        ); 
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
