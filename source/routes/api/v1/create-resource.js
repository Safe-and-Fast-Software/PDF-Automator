import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, validate, convert } from "#source/utilities/database/schemas/all.js";
import { EntityId } from "redis-om";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export async function createResource(request, responds) {

  const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
  const { type, id } = request.params;

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
      
      let instance;
      /* Saving the instance either with a provided ID or without one */ {
          if (!id) instance = await repository[type].save(request.body);
          else instance = await repository[type].save(id, request.body);  
      }
      
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
}