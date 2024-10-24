"use-strict";

import { Schema, Repository } from 'redis-om';
import client from '#source/utilities/database/client.js';
import Ajv from 'ajv';

export const redisSchema = Object.freeze({
    name:        { type: 'text', caseSensitive: false, textSearch: true, sortable: true },
    createdBy:   { type: "string"                                                       },
    dateCreated: { type: 'date'                                                         }
});

/** The JSON schema that every Customer should be in. */
export const jsonSchema = Object.freeze({
    type: 'object',
    required: [ "name", "createdBy", "dateCreated" ],
    additionalProperties: false,
    properties: {
        name:        { type: 'string' },
        createdBy:   { type: 'string' },
        dateCreated: { type: "string", format: "date-time" }
    }
});

const ajv = new Ajv();

ajv.addFormat("date-time", {
  type: "string",
  validate: date => (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})?$/.test(date)),
});

console.log("YES");

/** Validates a JSON object to the Customer Schema. */
export const validate = (ajv.compile(jsonSchema));

/** The repository in which all customers will be stored. */
export const repository = new Repository( new Schema("template", redisSchema, { dataStructure: 'JSON' }), client);

await repository.createIndex();
