"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate } from "../../../../utilities/database/schemas/customer.js"
import requiresAuthentication from "../../../../utilities/auth/require-authentication.js";
import { EntityId } from "redis-om";
import customerCardComponent from "./customer-card.js";

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
    const { name, phone, email, street1, street2, zip, city, country } = request.query;

    try {

        let searchQuery = repository.search();

        /* Narrowing the search if a query was provided. */ {
            if (name    && name.trim()    !== "") searchQuery = searchQuery.and('name'   ).matches(name);
            if (phone   && phone.trim()   !== "") searchQuery = searchQuery.and('phone'  ).matches(phone);
            if (email   && email.trim()   !== "") searchQuery = searchQuery.and('email'  ).matches(email);
            if (street1 && street1.trim() !== "") searchQuery = searchQuery.and('street1').matches(street1);
            if (street2 && street2.trim() !== "") searchQuery = searchQuery.and('street2').matches(street2);
            if (zip     && zip.trim()     !== "") searchQuery = searchQuery.and('zip'    ).matches(zip);
            if (city    && city.trim()    !== "") searchQuery = searchQuery.and('city'   ).matches(city);
            if (country && country.trim() !== "") searchQuery = searchQuery.and('country').matches(country);
        }

        const customers = await searchQuery.sortAscending('name').return.all();
              
        /* Returning JSON if it's not an HTMX request. */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(customers)
            );
        }

        return ( /* HTMX */ responds.status(StatusCodes.OK)
            .send(customers.map( (customer) => customerCardComponent(customer)

            ).join(""))
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
    const customer = request.body;

    console.log(`New customer submitted:`, customer);

    try {

        /* Validating JSON object to follow the custom schema */ {
            if (! validate(customer)) return ( responds
                .status(StatusCodes.BAD_REQUEST)
                .type('application/json')
                .send({ 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: customer did not comply to JSON schema.` 
                })
            );
        }
        
        const instance = await repository.save(customer);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.CREATED)
                .send({ 
                    status: StatusCodes.CREATED, 
                    message: `${ReasonPhrases.CREATED}: created customer.`,
                    customer
                })
            );
        }
        
        return ( responds
            .status(StatusCodes.OK)
            .type("text/html")
            .send(customerCardComponent(instance))
        ); 

    } catch ( error ) {
        
        console.error(error);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ 
                    status: StatusCodes.INTERNAL_SERVER_ERROR, 
                    message: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new customer.`,
                    customer
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
