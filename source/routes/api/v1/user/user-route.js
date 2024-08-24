import { Router, json } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import userRepository, { User } from "../../../../utilities/database/schemas/users.js"

/** The router for `/api/v1/user`. */
const userApiRoutes = Router();

//` Creates a user from a JSON object.
userApiRoutes.put("/", (request, responds) => {

    const isHtmxRequest = (request.headers["hx-request"] !== undefined);

    try {

        console.debug("PUT at api/v1/user:", request.body);
        const user = User.create(request.body);
        
        if (isHtmxRequest) responds.status(StatusCodes.OK).send(`Successfully created user!`); 
        else responds.status(StatusCodes.CREATED).send({ 
            status: StatusCodes.CREATED, 
            message: ReasonPhrases.CREATED
        });

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) responds.status(StatusCodes.NO_CONTENT).send(`An error occurred creating the user.`); 
        else responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});


userApiRoutes.get("/", async (request, responds) => {
    const users = await userRepository.search().return.all();
    responds.send(users);
});

//` Gets a user from an ID and returns the JSON data.
userApiRoutes.get("/:id", (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const id = request.params.id;
    
    try {

        const user = User.get(id);
        
        if (isHtmxRequest) responds.status(StatusCodes.OK).send(`Successfully updated user!`); 
        else responds.status(StatusCodes.OK).send(user);

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) responds.status(StatusCodes.NO_CONTENT).send(`An error occurred getting the user.`); 
        else responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});

//` Updates a given user from its ID with the new Body.
userApiRoutes.post("/:id", async (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const userID = request.params.id;
    
    try {

        const userData = request.body;
        User.update(userID, userData);
        
        if (isHtmxRequest) responds.status(StatusCodes.OK).send(`Successfully updated user!`); 
        else responds.status(StatusCodes.OK).send({ 
            status: StatusCodes.OK, 
            message: ReasonPhrases.OK
        });

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) responds.status(StatusCodes.NO_CONTENT).send(`An error occurred updating the user.`); 
        else responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});
  
//` Deletes a given user from its ID.
userApiRoutes.delete("/:id", async (request, responds) => {
    
    const isHtmxRequest = (request.headers["hx-request"] !== undefined);
    const id = request.params.id;    
    
    try {

        User.delete(id);
        
        if (isHtmxRequest) responds.status(StatusCodes.NO_CONTENT).send(`Successfully deleted user!`); 
        else responds.status(StatusCodes.NO_CONTENT).send({ 
            status: StatusCodes.NO_CONTENT, 
            message: ReasonPhrases.NO_CONTENT
        });

    } catch ( error ) {
        
        console.error(error);

        if (isHtmxRequest) responds.status(StatusCodes.NO_CONTENT).send(`An error occurred deleting the user.`); 
        else responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
});

export default userApiRoutes;
