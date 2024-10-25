"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import requiresAuthentication from "#source/utilities/auth/require-authentication.js";
import { EntityId } from "redis-om";

import { repository, validate, jsonSchema, redisSchema, convert } from "#source/utilities/database/schemas/all.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { Router } from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** Ensures that the type provided is valid. */
async function ensureValidType(request, responds, next) {
    if ( request             === undefined ) throw new Error("API.ensureValidType().pre violated: request is undefined");
    if ( request.params      === undefined ) throw new Error("API.ensureValidType().pre violated: request.params is undefined");
    if ( request.params.type === undefined ) throw new Error("API.ensureValidType().pre violated: request.params.type is undefined");
    if ( responds            === undefined ) throw new Error("API.ensureValidType().pre violated: responds is undefined");
    if ( repository[request.params.type] === undefined ) return ( responds
        .status(StatusCodes.BAD_REQUEST)
        .type('application/json')
        .send(`${ReasonPhrases.BAD_REQUEST}: The type \"${request.params.type}\" does not exist.`)
    );

    return next();
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get("/", (request, responds) => {

    const apiSpecs = ({
        status: StatusCodes.OK,
        message: `${ReasonPhrases.OK}: these are all the Version 1 API routes, their purpose, and details.`,
        paths: [
            {
                path: "/",
                method: "GET",
                description: "Gets this help message",
                input: "None",
                parameters: "None",
                authentication: "optional",
                output: "JSON"
            },
            {
                path: "/${type}/all",
                method: "GET",
                description: "Gets all instances of ${type} in the database filtering by parameters.",
                input: "Parameters",
                parameters: "any attributes that ${type} has, plus 'sort-by'.",
                authentication: "required",
                output: "JSON, or HTML"
            },
            {
                path: "/${type}/",
                method: "PUT",
                description: "Creates a new instance of ${type}.",
                input: "JSON",
                parameters: "None",
                authentication: "required",
                output: "JSON, or HTML"
            },
            {
                path: "/${type}/by-id/${id}",
                method: "GET",
                description: "Gets the instance of ${type} in the database with id: ${id}.",
                input: "None",
                parameters: "None",
                authentication: "required",
                output: "JSON, or HTML"
            },
            {
                path: "/${type}/by-id/${id}",
                method: "POST",
                description: "Updates the instance of ${type} in the database with id: ${id} to the request body.",
                input: "JSON",
                parameters: "None",
                authentication: "required",
                output: "JSON, or HTML"
            },
            {
                path: "/${type}/by-id/${id}",
                method: "DELETE",
                description: "Deletes the instance of ${type} in the database with id: ${id}.",
                input: "None",
                parameters: "None",
                authentication: "required",
                output: "JSON, or HTML"
            },
        ]
    });

    return ( responds
        .status(apiSpecs.status)
        .type('application/json')
        .send(apiSpecs)
    );
});

//`------------------------------------------------------ GET ------------------------------------------------------`//

router.get("/:type/all", requiresAuthentication, ensureValidType, async (request, responds) => {

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const { type } = request.params;
    
    try {

        /* Checking the validity of the parameters provided*/ {
            const sortBy = request.query["sort-by"];
            const sortDirection = request.query["sort-direction"];
            if ( sortBy !== undefined && sortDirection === undefined ) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type("text/html")
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: You provided 'sort-by' parameter, but if the 'sort-by' parameter ` +
                    `is provided, then the 'sort-direction' is also required, however it was missing. Please also ` +
                    `provide the 'sort-direction' parameter. This must be either 'ASC', or 'DESC'.`
                )
            ); else if ( sortBy === undefined && sortDirection !== undefined ) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type("text/html")
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: You provided 'sort-direction' parameter, but if the ` +
                    `'sort-direction' parameter is provided, then the 'sort-by' is also required, however it ` +
                    `was missing. Please also provide the 'sort-by' parameter. This must be one field in ${type}.`
                )
            ); else if ( sortDirection && sortDirection !== 'ASC' && sortDirection !== 'DESC' ) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type("text/html")
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: You provided 'sort-direction' parameter, but if the ` +
                    `'sort-direction' parameter is provided, then it must be either 'ASC', or 'DESC'. However, ` +
                    `the sorting direction of '${sortDirection}' was provided. Please change to either 'ASC', or ` +
                    `'DESC'.`
                )
            ); else if (request.query["min"] !== undefined && request.query["max"] === undefined) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type("text/html")
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: You provided 'min' parameter, but if the 'min' parameter ` +
                    `is provided, then the 'max' is also required, however it was missing. Please also provide the ` +
                    `'max' parameter. This must be an integer larger then 'min'.`
                )
            ); else if (request.query["min"] === undefined && request.query["max"] !== undefined) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type("text/html")
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: You provided 'max' parameter, but if the ` +
                    `'max' parameter is provided, then the 'min' is also required, however it was missing. ` + 
                    `Please also provide the 'min' parameter. This must be an integer smaller then 'max'.`
                )
            ); else if ( request.query["min"] >= request.query["max"] ) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type("text/html")
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: You provided 'min' (${request.query["min"]}), ` +
                    `and 'max' (${request.query["max"]}) parameter, but 'min' must be strictly smaller then 'max'. ` +
                    `However this wasn't the case. Please provide a 'min' such that it's smaller then 'max'.`
                )
            ); else if ( 
                ( sortBy               !== undefined && request.query["min"]       !== undefined ) ||
                ( sortBy               !== undefined && request.query["get-count"] !== undefined ) ||
                ( request.query["min"] !== undefined && request.query["get-count"] !== undefined )
            ) return ( responds 
                .status(StatusCodes.BAD_REQUEST)
                .type()
                .send(
                    `${ReasonPhrases.BAD_REQUEST}: The parameters 'sort-by', 'max', and 'get-count' are exclusive. ` +
                    `You can only provide one of these. However you provided at least two of them. Please use at ` +
                    `most one of these.`
                )
            );
        }

        let searchQuery = repository[type].search();
        /* Narrowing the search if a query was provided. */ {
          for (const [key, value] of Object.entries(request.query)) {

                /* Skipping special keys, or empty values. */ {
                    if ( !value || value === "") continue;
                    if (key === "sort-by") continue; 
                    if (key === "sort-direction") continue; 
                    if (key === "max") continue; 
                    if (key === "min") continue; 
                    if (key === "get-count") continue; 
                }

                if (redisSchema[type]?.[key]?.type === undefined) return ( responds 
                    .status(StatusCodes.BAD_REQUEST)
                    .type("text/html")
                    .send(`${ReasonPhrases.BAD_REQUEST}: You provided a JSON body with an unrecognised the '${key}'. `)
                );

                if (redisSchema[type]?.[key]?.type === "text") searchQuery = searchQuery.and(key).matches(value); 
                else searchQuery = searchQuery.and(key).equals(value); 
            };
        }

        let searchResults;
        /* Applying special parameters and searching the database */ {
            if (request.query["sort-by"] !== undefined && request.query["sort-direction"] !== undefined)
                searchQuery = searchQuery.sortBy(request.query["sort-by"], request.query["sort-direction"]); 
            if (request.query["min"] !== undefined && request.query["max"] !== undefined) 
                searchResults = await searchQuery.page(request.query.min, request.query.max);
            else if (request.query["get-count"] !== undefined) searchResults = await searchQuery.count();
            else searchResults = await searchQuery.return.all()
        }
        
        /* Returning JSON if it's not an HTMX request. */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(searchResults)
            );
        }

        /* Returning HTML in all other cases. */ {
            return ( responds
                .status(StatusCodes.OK)
                .type('text/html')
                .send(searchResults.map( searchResultEntry => convert[type].toHTML(searchResultEntry) ).join(""))
            );
        }

    } catch (error) { console.error(error);
        
        // TODO add a regex that checks if the error was because of a non existent field in the database.
        // if this is true, return a BAD_REQUEST responds saying the field was illegal.

        const errorResponds = { 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not fetch ${type}, an unknown error occurred.`,
        };

        /* Giving a JSON error responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(errorResponds.status)
                .type('application/json')
                .send(errorResponds)
            );
        }

        /* Giving an HTML error responds in all other cases. */ {
            return ( responds
                .status(errorResponds.status)
                .type('text/html')
                .send(errorResponds.error)
            ); 
        }
    }
});

router.get("/:type/by-id/:id", requiresAuthentication, ensureValidType, async (request, responds) => {

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const { type, id } = request.params;

    try {

        const searchResult = await repository[type].fetch(id);
        
        /* Returning a 404 if no entry with that ID exists. */ {
            if ( Object.keys(searchResult).length === 0 ) {
                
                const errorResponds = {
                    status: StatusCodes.NOT_FOUND,
                    error: `${ReasonPhrases.NOT_FOUND}: no ${type} with ID \"${id}\".`
                };

                if (isNotAnHtmxRequest) return ( responds
                    .status(errorResponds.status)
                    .type('application/json')
                    .send(errorResponds)
                ); else return ( responds
                    .status(errorResponds.status)
                    .type('text/html')
                    .send(errorResponds.error)
                );
            }
        }

        /* Returning JSON if it's not an HTMX request. */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.OK)
                .type('application/json')
                .send(searchResult)
            );
        }

        /* Returning HTML in all other cases. */ {
            return ( responds
                .status(StatusCodes.OK)
                .type('text/html')
                .send(convert[type].toHTML(searchResult))
            );
        }

    } catch (error) { console.error(error);
        
        const errorResponds = { 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not fetch ${type} ${id}, an unknown error occurred.`,
        };

        /* Giving a JSON error responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(errorResponds.status)
                .type('application/json')
                .send(errorResponds)
            );
        }

        /* Giving an HTML error responds in all other cases. */ {
            return ( responds
                .status(errorResponds.status)
                .type('text/html')
                .send(errorResponds.error)
            ); 
        }
    }
});

//`------------------------------------------------------ PUT ------------------------------------------------------`//

router.put("/:type/", requiresAuthentication, ensureValidType, async (request, responds) => {

    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const { type } = request.params;

    try {

        /* Validating JSON object to follow the custom schema */ {
            if (! validate[type](request.body)) return ( responds
                .status(StatusCodes.BAD_REQUEST)
                .type('application/json')
                .send({ 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: body did not comply to JSON schema of ${type}.` 
                })
            );
        }
        
        const instance = await repository[type].save(request.body);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.CREATED)
                .type('application/json')
                .send({ 
                    status: StatusCodes.CREATED, 
                    message: `${ReasonPhrases.CREATED}: created new ${type}.`,
                    id: instance[EntityId],
                    instance
                })
            );
        }
        
        /* In all other cases return HTML */ {
            return ( responds
                .status(StatusCodes.OK)
                .type("text/html")
                .send(convert[type].toHTML(instance))
            );
        } 

    } catch ( error ) { console.error(error);

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ 
                    status: StatusCodes.INTERNAL_SERVER_ERROR, 
                    message: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new ${type}.`,
                    customer
                })
            );
        }

        /* In all other cases return HTML */ {
            return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not create new ${type}.`)
            ); 
        }
    }
});

//`------------------------------------------------------ POST -----------------------------------------------------`//

router.post("/:type/by-id/:id", requiresAuthentication, ensureValidType, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const { type, id } = request.params;

    try {
        
        /* Validating JSON object to follow the custom schema */ {
            if (! validate[type](request.body)) {

                const errorResponds = { 
                    status: StatusCodes.BAD_REQUEST, 
                    error: `${ReasonPhrases.BAD_REQUEST}: ${type} did not comply to JSON schema.` 
                };

                if (isNotAnHtmxRequest) return ( responds
                    .status(errorResponds.status)
                    .type('application/json')
                    .send(errorResponds)
                ); else return ( responds
                    .status(errorResponds.status)
                    .type('text/html')
                    .send(errorResponds.error)
                );
            }
        }
        
        await repository[type].save(id, request.body);
        
        const successResponds = {
            status: StatusCodes.OK, 
            message: `${ReasonPhrases.OK}: Successfully updated ${type} with ${id}.`
        };

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(successResponds.status)
                .type('application/json')
                .send(successResponds)
            );
        }
        
        /* Returning HTML in all other cases. */ {
            return ( responds
                .status(successResponds.status)
                .type("text/html")
                .send(successResponds.message)
            ); 
        }

    } catch ( error ) { console.error(error);

        const errorResponds = { 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not update ${type} ${id}, an unknown error occurred.`
        };

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(errorResponds.status)
                .type('application/json')
                .send(errorResponds)
            );
        }

        /* Returning HTML in all other cases. */ {
            return ( responds
                .status(errorResponds.status)
                .type("text/html")
                .send(errorResponds.error)
            ); 
        }
    }
});

//`----------------------------------------------------- DELETE ----------------------------------------------------`//

router.delete("/:type/by-id/:id", requiresAuthentication, ensureValidType, async (request, responds) => {
    
    const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
    const { type, id } = request.params;    
    
    try { await repository[type].remove(id);
        
        const successResponds = { 
            status: StatusCodes.OK, 
            message: `${ReasonPhrases.OK}: Successfully deleted ${type} ${id}.`
        };

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(successResponds.status)
                .type('application/json')
                .send(successResponds)
            );
        }

        /* In all other cases return HTML */ {
            return ( responds
                .status(successResponds.status)
                .type("text/html")
                .send(successResponds.message)
            ); 
        }

    } catch ( error ) { console.error(error);

        const errorResponds = { 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: could not delete ${type} ${id}, an unknown error occurred.`
        };

        /* Giving a JSON responds if it's not an HTMX request */ {
            if (isNotAnHtmxRequest) return ( responds
                .status(errorResponds.status)
                .type('application/json')
                .send(errorResponds)
            );
        }

        /* In all other cases return HTML */ {
            return ( responds
                .status(errorResponds.status)
                .type("text/html")
                .send(errorResponds.error)
            ); 
        }
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
