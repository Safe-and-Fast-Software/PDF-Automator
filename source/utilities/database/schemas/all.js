// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//` repository (databases) of the different types.
import { repository as templateRepository } from "#source/utilities/database/schemas/template.js"
import { repository as documentRepository } from "#source/utilities/database/schemas/document.js"
import { repository as customerRepository } from "#source/utilities/database/schemas/customer.js"
import { repository as     userRepository } from "#source/utilities/database/schemas/user.js"
export const repository = Object.freeze({
  "template": templateRepository,
  "document": documentRepository,
  "customer": customerRepository,
  "user"    :     userRepository
});

//` Validate request bodies for different types.
import { validate as validateTemplate } from "#source/utilities/database/schemas/template.js"
import { validate as validateDocument } from "#source/utilities/database/schemas/document.js"
import { validate as validateCustomer } from "#source/utilities/database/schemas/customer.js"
import { validate as validateUser     } from "#source/utilities/database/schemas/user.js"

export const validate = Object.freeze({
  "template": validateTemplate,
  "document": validateDocument,
  "customer": validateCustomer,
  "user"    : validateUser
});

//` Different JSON schemas for each type
import { jsonSchema as templateJsonSchema } from "#source/utilities/database/schemas/template.js"
import { jsonSchema as documentJsonSchema } from "#source/utilities/database/schemas/document.js"
import { jsonSchema as customerJsonSchema } from "#source/utilities/database/schemas/customer.js"
import { jsonSchema as     userJsonSchema } from "#source/utilities/database/schemas/user.js"
export const jsonSchema = Object.freeze({
  "template": templateJsonSchema,
  "document": documentJsonSchema,
  "customer": customerJsonSchema,
  "user"    :     userJsonSchema
});

//` Different redis schemas for each type
import { redisSchema as templateRedisSchema } from "#source/utilities/database/schemas/template.js"
import { redisSchema as documentRedisSchema } from "#source/utilities/database/schemas/document.js"
import { redisSchema as customerRedisSchema } from "#source/utilities/database/schemas/customer.js"
import { redisSchema as     userRedisSchema } from "#source/utilities/database/schemas/user.js"
export const redisSchema = Object.freeze({
  "template": templateRedisSchema,
  "document": documentRedisSchema,
  "customer": customerRedisSchema,
  "user"    :     userRedisSchema
});

//` Convert to HTML for different types.
import customerCardComponent from "#source/utilities/responds/components/cards/customer-card.js";
import documentCardComponent from "#source/utilities/responds/components/cards/document-card.js";
import templateCardComponent from "#source/utilities/responds/components/cards/template-card.js";
export const convert = Object.freeze({
  "template": { toHTML: async instance => templateCardComponent(instance) },
  "document": { toHTML: async instance => documentCardComponent(instance) },
  "customer": { toHTML: async instance => customerCardComponent(instance) },
  "user":     { toHTML: async instance => `[user(${instance?.name})]` },
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
