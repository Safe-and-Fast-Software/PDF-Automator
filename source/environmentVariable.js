/** 
 * A class for throwing exceptions when environment variables are not set.
 */
export class EnvironmentVariableNotSetError extends Error {
    constructor(variableName) {

        const message = `Environment variable '${variableName}' is not set.`;
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Gets an environment variable with the provided name.
 * 
 * @param { String } name the name of the variable.
 * @param { String | undefined } defaultValue the default value if the environment variable is not set. Throws an error if both are not set.
 * 
 * @returns the environment variable with the provided name
 */
export default function getEnvironmentVariable(name, defaultValue=undefined) {

    const value = process.env[name];
    const environmentVariableIsNotSet = ( value === null || value === undefined || value === "" );

    if (environmentVariableIsNotSet && defaultValue === undefined) throw new EnvironmentVariableNotSetError(name);

    return value || defaultValue;
}
