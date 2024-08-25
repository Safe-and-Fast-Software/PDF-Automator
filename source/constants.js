import dotenv from 'dotenv/config';
import getEnvironmentVariable from './environmentVariable.js';

const constants = {
    github : { link : "https://github.com/Safe-and-Fast-Software/PDF-Automator" },
    app : {
        url: (() => {
            const APP_URL = getEnvironmentVariable("APP_URL");
            const urlObj = new URL(APP_URL);
            if (urlObj.pathname !== null && urlObj.undefined !== null && urlObj.pathname !== "/") throw new TypeError(
                `APP_URL cannot have a path, however the path: "${urlObj.pathname}" was provided`
            );
            return urlObj.origin;
        })(),
    },
    oauth : {
        requiredGroup: getEnvironmentVariable("OAUTH_GROUP", null)
    },
};

Object.freeze(constants);
export default constants; 
