import dotenv from 'dotenv/config';

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
export function getEnvironmentVariable(name, defaultValue=undefined) {

    const value = process.env[name];
    const environmentVariableIsNotSet = ( value === null || value === undefined || value === "" );

    if (environmentVariableIsNotSet && defaultValue === undefined) throw new EnvironmentVariableNotSetError(name);

    return value || defaultValue;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CONSTANTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

const constants = {
    app : {
        port : getEnvironmentVariable("PORT", 80),
        url: (() => {
            const APP_URL = getEnvironmentVariable("APP_URL");
            const urlObj = new URL(APP_URL);
            if (urlObj.pathname !== null && urlObj.undefined !== null && urlObj.pathname !== "/") throw new TypeError(
                `APP_URL cannot have a path, however the path: "${urlObj.pathname}" was provided`
            );
            return APP_URL;
        })(),
        callbackPath : "/auth/callback",
        loginPath : "/auth/login",
        session : {
            secret : getEnvironmentVariable("SESSION_SECRET")
        },
        log : {
            directory : getEnvironmentVariable("LOG_DIRECTORY", "./logs"),
            level: "info"
        }
    },
    oauth : {
        urls: {
            authorization: getEnvironmentVariable("OAUTH_AUTHORIZATION_URL"),
            token: getEnvironmentVariable("OAUTH_TOKEN_URL"),
        },
        client: {
            id: getEnvironmentVariable("OAUTH_CLIENT_ID"),
            secret: getEnvironmentVariable("OAUTH_CLIENT_SECRET")
        }
    },
};

console.log("Constants:", constants);

export default constants; 
