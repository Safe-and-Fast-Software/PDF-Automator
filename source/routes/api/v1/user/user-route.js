"use-strict";

import { Router, json } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import userRepository, { User } from "../../../../utilities/database/schemas/users.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** The router for `/api/v1/user`. */
const userApiRoutes = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//` Creates a user from a JSON object.
userApiRoutes.put("/", (request, responds) => {

    const isHtmxRequest = (request.headers["hx-request"] !== undefined);

    try {

        const user = User.create(request.body);
        
        if (isHtmxRequest) return responds.status(StatusCodes.OK)
            .send(`Successfully created user!`); 

        return responds.status(StatusCodes.CREATED).send({ 
            status: StatusCodes.CREATED, 
            message: ReasonPhrases.CREATED,
            user
        });

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) return responds.status(StatusCodes.NO_CONTENT)
            .send(`An error occurred creating the user.`); 
        
        return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});


userApiRoutes.get("/", async (request, responds) => {
    const users = await userRepository.search().return.all();
    responds.send(users);
});


//` Gets a user from a name and returns the JSON data.
userApiRoutes.get("/by-name/:name", async (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const name = request.params.name;
    
    console.debug(`[API] ${request.method} request for user with name: \"${name}\".`);

    try {

        if (isHtmxRequest) return responds.status(StatusCodes.BAD_REQUEST)
            .send(`${ReasonPhrases.BAD_REQUEST}: Not an HTMX endpoint.`);

        const user = await userRepository.search().where("name").is.equalTo(name).return.first();
        
        return responds.status(StatusCodes.OK).send(user);

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) return responds.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`An error occurred getting the user.`); 

        return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});

//` Gets a user from an ID and returns the JSON data.
userApiRoutes.get("/by-id/:id", async (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const id = request.params.id;
    
    console.debug(`[API] ${request.method} request for user with id: \"${id}\".`);
    
    try {

        if (isHtmxRequest) return responds.status(StatusCodes.BAD_REQUEST)
            .send(`${ReasonPhrases.BAD_REQUEST}: Not an HTMX endpoint.`);

        const user = await userRepository.fetch(id);
        
        return responds.status(StatusCodes.OK).send(user);

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) return responds.status(StatusCodes.BAD_REQUEST)
            .send(`${ReasonPhrases.BAD_REQUEST}: Not an HTMX endpoint.`);
            
        else return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});

//` Updates a given user from its ID with the new Body.
userApiRoutes.post("/by-id/:id", async (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const userID = request.params.id;
    
    try {

        const userData = request.body;
        User.update(userID, userData);
        
        if (isHtmxRequest) return responds.status(StatusCodes.OK).send(`Successfully updated user!`); 
        else return responds.status(StatusCodes.OK).send({ 
            status: StatusCodes.OK, 
            message: ReasonPhrases.OK
        });

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) return responds.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`An error occurred updating the user.`); 
        else return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});
  
//` Deletes a given user from its ID.
userApiRoutes.delete("/by-id/:id", async (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const id = request.params.id;    
    
    try {

        User.delete(id);
        
        if (isHtmxRequest) return responds.status(StatusCodes.NO_CONTENT).send(`Successfully deleted user!`); 
        else return responds.status(StatusCodes.NO_CONTENT).send({ 
            status: StatusCodes.NO_CONTENT, 
            message: ReasonPhrases.NO_CONTENT
        });

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) return responds.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(`An error occurred deleting the user.`); 
        
        return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export default userApiRoutes;
