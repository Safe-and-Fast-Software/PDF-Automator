import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, redisSchema, convert } from "#source/utilities/database/schemas/all.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export async function search(request, responds) {

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
}
