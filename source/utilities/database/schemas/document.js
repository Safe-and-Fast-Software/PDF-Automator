"use-strict";

import { Schema, Repository } from 'redis-om';
import client from '#source/utilities/database/client.js';
import Ajv from 'ajv';

export const redisSchema = Object.freeze({
  userID:      { type: 'string' },
  customerID:  { type: 'string' },
  templateID:  { type: 'string' },
  dateCreated: { type: 'date'   }
});

/** The JSON schema that every Customer should be in. */
export const jsonSchema = Object.freeze({
  type: 'object',
  required: [ "userID", "customerID", "templateID", "dateCreated" ],
  additionalProperties: false,
  properties: {
    userID:      { type: 'string' },
    customerID:  { type: 'string' },
    templateID:  { type: 'string' },
    dateCreated: { type: "string", format: "date-time" }
  }
});

const ajv = new Ajv();
ajv.addFormat("date-time", {
  type: "string",
  validate: date => {
    const dateRegex = ( /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i );
    const result = dateRegex.test(date);
    return result;
  },
});

/** Validates a JSON object to the Customer Schema. */
export const validate = (ajv.compile(jsonSchema));

/** The repository in which all customers will be stored. */
export const repository = new Repository(new Schema("document", redisSchema, { dataStructure: 'JSON' }), client);

await repository.createIndex();
