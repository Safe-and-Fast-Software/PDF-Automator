import { EntityId, InvalidInput, Schema, Repository } from 'redis-om';
import client from '../client.js';

/** The schema every user is going to follow */
const userSchema = new Schema('user', {

    name: { type: 'string' },
    email: { type: 'string' },
    apiTokenIDs: { type: 'string[]' },

}, {
    dataStructure: 'JSON'
});

/** The redis repository for users. */
const userRepository = new Repository(userSchema, client);
await userRepository.createIndex();
export default userRepository;

/** The class representation of a user. */
export class User {

    name = null;
    email = null;
    apiTokenIDs = null;


    constructor(options) {

        /* Checking the type of the input. */ {
            const typeOfInput = typeof options;
            if (typeOfInput !== "object") throw new InvalidInput(
                `Input is of type: \"${typeOfInput}\", instead of expected type: \"object\".`
            );
        }
        
        const { name, email, apiTokenIDs } = options;

        /* Checking and initializing the first name field */ {
            checkForExpectedType(name, "name", "string", true);
            this.name = name;
        }

        /* Checking and initializing the email field */ {
            checkForExpectedType(email, "email", "string", true);
            this.email = email;
        }

        /* Checking and initializing the API tokens field */ {
            if (! Array.isArray(apiTokenIDs)) throw new InvalidInput(
                `API token IDs is of type: ${typeof apiTokenIDs}, instead of expected type: array of strings.`);
            this.apiTokenIDs = apiTokenIDs;
        }
        
        const repository = userRepository.save({ name, email, apiTokenIDs })
            .catch((error) => console.error);
        
        console.log(repository[EntityId]);

    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Methods  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

    /** Creates a new User object. */
    static create(options) { return (new User(options)); }
    
    /** Gets a user for their given ID. */
    static async get(id) { return await userRepository.fetch(id); }
    
    /** Deletes a user for their given ID. */
    static async delete(id) { return await userRepository.remove(id); }
    
    /** Updates a user for a given ID, and the new data. */
    static async update(id, userData) { 

        const user = User.get(id);
        Object.keys(userData).forEach(key => {
            if (userData[key] === undefined) {
                userData[key] = user[key];
            }
        });

        userData.id = user.id;

        return await userRepository.save(user);
    }
}

/** Checks if a variable is of a certain type, and throws an error if not. */
function checkForExpectedType(variable, variableName, expectedType, allowNull=false) {
    
    if (variable === null && allowNull === true) return;

    const actualType = (typeof variable)
    if (actualType !== expectedType) throw new InvalidInput(`
        Types do not match! 
        Variable: \"${variableName}\" is of type: \"${actualType}\", 
        instead of expected type: \"${expectedType}\".
    `);
}