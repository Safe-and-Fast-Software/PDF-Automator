import { Schema, Repository } from 'redis-om';
import client from '#source/utilities/database/client.js';
import Ajv from 'ajv';

const redisSchema = new Schema("user", {
    name:        { type: 'text',   caseSensitive: false },
    phone:       { type: 'text',   caseSensitive: false },
    email:       { type: 'text',   caseSensitive: false },
    street1:     { type: 'text',   caseSensitive: false },
    street2:     { type: 'text',   caseSensitive: false },
    city:        { type: 'text',   caseSensitive: false },
    postalCode:  { type: 'text',   caseSensitive: false },
    country:     { type: 'text',   caseSensitive: false },
    apiTokenIDs: { type: 'string[]', caseSensitive: false },
}, { dataStructure: 'JSON' });

/** The JSON schema that every Customer should be in. */
export const jsonSchema = Object.freeze({
    type: 'object',
    required: [ "name", "phone", "email", "street1", "street2", "city", "zip", "country" ],
    additionalProperties: false,
    properties: {
        name:        { type: "string" },
        phone:       { type: "string" },
        email:       { type: "string" },
        street1:     { type: "string" },
        street2:     { type: "string" },
        city:        { type: "string" },
        zip:         { type: "string" },
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
