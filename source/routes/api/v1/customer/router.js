"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate } from "../../../../utilities/database/schemas/customer.js"
import requiresAuthentication from "../../../../utilities/auth/require-authentication.js";
import { EntityId } from "redis-om";

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

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const { name, email, phone } = request.query;

    try {

        let searchQuery = repository.search();

        /* Narrowing the search if a query was provided. */ {
            if (name  && name.trim()  !== "") searchQuery = searchQuery.and('name' ).matches(name);
            if (email && email.trim() !== "") searchQuery = searchQuery.and('email').matches(email);
            if (phone && phone.trim() !== "") searchQuery = searchQuery.and('phone').matches(phone);
        }

        const customers = await searchQuery.return.all();
              
        /* Returning JSON if it's not an HTMX request. */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(customers)
            );
        }

        return ( /* HTMX */ responds.status(StatusCodes.OK)
            .send(/*HTML*/`<ul>${customers.map( (customer) => /*HTML*/`
            <li id="customer-${customer[EntityId]}">
                <p>
                    <b>Customer ID</b>: ${customer[EntityId]}<br>
                    <b>Name</b>: ${customer.name}<br>
                    <b>Email</b>: ${customer.email}<br>
                    <b>Phone Number</b>: ${customer.phone}<br>
                    <b>Street 1</b>: ${customer.street1}<br>
                    <b>Street 2</b>: ${customer.street2}<br>
                    <b>zip code</b>: ${customer.zip}<br>
                    <b>city</b>: ${customer.city}<br>
                </p>
                <button hx-delete="/api/v1/customer/by-id/${customer[EntityId]}" hx-trigger="click"
                    hx-target="#customer-${customer[EntityId]}" hx-swap="outerHTML">
                    Delete Customer
                </button>
            </li>`
        ).join("")}</ul>`)
        );

    } catch (error) {

        console.error(error);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .type('application/json')
                .send({ 
                    status: StatusCodes.INTERNAL_SERVER_ERROR, 
                    error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not fetch customers.`,
                })
            );
        }

        return ( responds
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new customer.`)
        ); 
    }
    
});

//` PUT

router.put("/", requiresAuthentication, async (request, responds) => {

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const costumer = request.body;

    console.log(`New customer submitted:`, costumer);

    try {

        /* Validating JSON object to follow the custom schema */ {
            if (! validate(costumer)) return ( responds
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
