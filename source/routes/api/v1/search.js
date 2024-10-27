"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { repository, redisSchema, convert } from "#source/utilities/database/schemas/all.js";
import { EntityId } from "redis-om";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function searchMiddleware(request, responds, next) {

  const sortBy = request.query["sort-by"]; 
  const sortDirection = request.query["sort-direction"];
  const fromIndex = request.query["from-index"];
  const tillIndex = request.query["till-index"];

  /* Checking the validity of the sort parameters provided */ {
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
    ); else if (sortDirection && sortDirection !== 'ASC' && sortDirection !== 'DESC' ) return ( responds 
      .status(StatusCodes.BAD_REQUEST)
      .type("text/html")
      .send(
        `${ReasonPhrases.BAD_REQUEST}: You provided 'sort-direction' parameter, but if the ` +
        `'sort-direction' parameter is provided, then it must be either 'ASC', or 'DESC'. However, ` +
        `the sorting direction of '${sortDirection}' was provided. Please change to either 'ASC', or ` +
        `'DESC'.`
      )
    );
  }

  /* Checking the validity of the from and till index parameters provided */ {
    if (fromIndex !== undefined && tillIndex === undefined) return ( responds 
      .status(StatusCodes.BAD_REQUEST)
      .type("text/html")
      .send(
        `${ReasonPhrases.BAD_REQUEST}: You provided 'from-index' parameter, but if the 'from-index' parameter ` +
        `is provided, then the 'till-index' is also required, however it was missing. Please also provide the ` +
        `'till-index' parameter. This must be an integer larger then 'from-index'.`
      )
    ); else if (fromIndex === undefined && tillIndex !== undefined) return ( responds 
      .status(StatusCodes.BAD_REQUEST)
      .type("text/html")
      .send(
        `${ReasonPhrases.BAD_REQUEST}: You provided 'till-index' parameter, but if the ` +
        `'till-index' parameter is provided, then the 'from-index' is also required, however it was missing. ` + 
        `Please also provide the 'from-index' parameter. This must be an integer smaller then 'till-index'.`
      )
    ); else if ( ( fromIndex && fromIndex < 0 ) && ( tillIndex && tillIndex > 0 ) ) return ( responds 
      .status(StatusCodes.BAD_REQUEST)
      .type("text/html")
      .send(
        `${ReasonPhrases.BAD_REQUEST}: You provided 'from-index' (${fromIndex}), ` +
        `and 'till-index' (${tillIndex}) parameter, but 'from-index' must be strictly smaller then 'till-index'. ` +
        `However this wasn't the case. Please provide a 'from-index' such that it's smaller then 'till-index'.`
      )
    ); 
  }
  
  /* Checking if not mutually exclusive parameters were provided. */ {
    if ( 
      ( sortBy    !== undefined && fromIndex                  !== undefined ) ||
      ( sortBy    !== undefined && request.query["get-count"] !== undefined ) ||
      ( fromIndex !== undefined && request.query["get-count"] !== undefined )
    ) return ( responds 
      .status(StatusCodes.BAD_REQUEST)
      .type("text/html")
      .send(
        `${ReasonPhrases.BAD_REQUEST}: The parameters 'sort-by', 'till-index', and 'get-count' are exclusive. ` +
        `You can only provide one of these. However you provided at least two of them. Please use at ` +
        `most one of these.`
      )
    );
  }

  return next();
}

export async function search(request, responds) {

  const isNotAnHtmxRequest = (request.headers["hx-request"] === undefined);
  const { type } = request.params;
  
  const sortBy = request.query["sort-by"]; 
  const sortDirection = request.query["sort-direction"];
  const fromIndex = request.query["from-index"];
  const tillIndex = request.query["till-index"];

  try {

    let searchQuery = repository[type].search();
    /* Narrowing the search if a query was provided. */ {
      for (const [key, value] of Object.entries(request.query)) {

        /* Skipping special keys, or empty values. */ {
          if ( !value || value === "") continue;
          if (key === "sort-by") continue; 
          if (key === "sort-direction") continue; 
          if (key === "from-index") continue; 
          if (key === "till-index") continue; 
          if (key === "get-count") continue; 
        }

        /* Checking if such a key exists */ {
          if (redisSchema[type]?.[key]?.type === undefined) {

            const errorResponds = {
              status: StatusCodes.BAD_REQUEST,
              error: `${ReasonPhrases.BAD_REQUEST}: You provided a JSON body with an unrecognised the '${key}'. `
            };

            if (isNotAnHtmxRequest) return ( responds 
              .status(errorResponds.status)
              .type("application/json")
              .send(errorResponds)
            ); else return ( responds
              .status(errorResponds.status)
              .type("text/html")
              .send(errorResponds.error)
            );
          } 
        }

        /* if everything checks out we add it to the search query */ {
          if (redisSchema[type]?.[key]?.type === "text") searchQuery = searchQuery.and(key).matches(value); 
          else searchQuery = searchQuery.and(key).equals(value); 
        }
      };
    }

    let searchResults;
    /* Applying special parameters and searching the database */ {
      if (sortBy !== undefined && sortDirection !== undefined) searchQuery = searchQuery.sortBy(sortBy, sortDirection); 
      if (fromIndex !== undefined && tillIndex !== undefined) searchResults = await searchQuery.page(fromIndex, tillIndex);

      else if (request.query["get-count"] !== undefined) searchResults = await searchQuery.count();
      else searchResults = await searchQuery.return.all()
    }

    /* Returning JSON if it's not an HTMX request. */ {
      if (isNotAnHtmxRequest) return ( responds
        .status(StatusCodes.OK)
        .type('application/json')
        .send((() => { // add the ID to all items in the list
          if (Array.isArray(searchResults)) {
            for ( const item in searchResults ) searchResults[item].id = searchResults[item][EntityId]
            return searchResults;
          } else return { total : searchResults };
        })())
      );
    }

    /* Returning HTML in all other cases. */ {
      return ( responds
        .status(StatusCodes.OK)
        .type('text/html')
        .send((await Promise.all(
          searchResults.map(async searchResultEntry => await convert[type].toHTML(searchResultEntry))
        )).join(""))
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
