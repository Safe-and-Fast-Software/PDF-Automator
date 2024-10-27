"use-strict";

import { repository } from "#source/utilities/database/schemas/all.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** Ensures that the type provided is valid. */
export default async function ensureValidType(request, responds, next) {
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
