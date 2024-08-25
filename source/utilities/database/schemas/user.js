import { Schema, Repository } from 'redis-om';
import client from '../client.js';
import Ajv from 'ajv';

const redisSchema = new Schema("customer", {
    name:        { type: 'string',   caseSensitive: false },
    phoneNumber: { type: 'string',   caseSensitive: false },
    email:       { type: 'string',   caseSensitive: false },
    street1:     { type: 'string',   caseSensitive: false },
    street2:     { type: 'string',   caseSensitive: false },
    city:        { type: 'string',   caseSensitive: false },
    postalCode:  { type: 'string',   caseSensitive: false },
    country:     { type: 'string',   caseSensitive: false },
    apiTokenIDs: { type: 'string[]', caseSensitive: false },
}, { dataStructure: 'JSON' });

/** The JSON schema that every Customer should be in. */
export const jsonSchema = Object.freeze({
    type: 'object',
    required: [ "name", "phoneNumber", "email", "street1", "street2", "city", "postalCode", "country" ],
    additionalProperties: false,
    properties: {
        name:        { type: "string" },
        phoneNumber: { type: "string" },
        email:       { type: "string" },
        street1:     { type: "string" },
        street2:     { type: "string" },
        city:        { type: "string" },
        postalCode:  { type: "string" },
        country:     { type: "string" },
        apiTokenIDs: { type: "array", "items": { "type": "string" } },
    }
});

const ajv = new Ajv();

/** Validates a JSON object to the Customer Schema. */
export const validate = (ajv.compile(jsonSchema));

/** The repository in which all customers will be stored. */
export const repository = new Repository(redisSchema, client);

await repository.createIndex();
