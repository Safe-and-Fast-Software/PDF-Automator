"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function specifications(request, responds) {

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
            method: "PUT",
            description: "Creates an instance of ${type} in the database with id: ${id}.",
            input: "JSON|parameters",
            parameters: "All attributes that ${type} has, unless a JSON body is provided.",
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
};
