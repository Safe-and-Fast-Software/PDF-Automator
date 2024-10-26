"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate, convert } from "#source/utilities/database/schemas/all.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//`------------------------------------------------------ GET ------------------------------------------------------`//

/** 
 * Gets a resource of a certain type by their ID.
 */
export async function getByID(request, responds) {

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
              .send((await convert[type].toHTML(searchResult)))
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
};

//`------------------------------------------------------ POST -----------------------------------------------------`//

/** 
 * Updates a resource of a certain type by their ID.
 */
export async function postByID(request, responds) {
    
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
          message: `${ReasonPhrases.OK}: Successfully updated ${type} with ID: ${id}.`
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
};

//`----------------------------------------------------- DELETE ----------------------------------------------------`//

/** 
 * Deletes a resource of a certain type by their ID.
 */
export async function deleteByID(request, responds) {
    
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
};
