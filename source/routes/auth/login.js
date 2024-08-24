import axios from 'axios';
import constants from '../../constants.js';

/** A general login error. */
export class LoginError extends Error {
    constructor(message) {
        super(message);
        this.code = 500
        Error.captureStackTrace(this, this.constructor);
    }
}

/** For when the user is not part of the required group. */
export class NotPartOfAuthorizedGroupError extends LoginError {
    constructor(message) {
        super(message);
        this.code = 403
        Error.captureStackTrace(this, this.constructor);
    }
}

/** For when there's missing information. */
export class MissingInformationLoginError extends LoginError {
    constructor(message) {
        super(message);
        this.code = 406
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 
 */
async function getUserData(accessToken) {
    try {
        
        const response = await axios.get(`${constants.oauth.urls.userinfo}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        return await response.data;

    } catch (error) {
        throw new LoginError("Couldn't get the user information.");
    }
}

export default async function login(accessToken, refreshToken, profile, done) {
    try {
               
        const userProfile = await getUserData(accessToken);
        console.debug("Profile:", userProfile);

        /* Checking the user's information*/ {
            if (! userProfile.name) throw new MissingInformationLoginError(`Username is not truthy: ${userProfile.name}`);
            if (! userProfile.email) throw new MissingInformationLoginError(`email is not truthy: ${userProfile.email}`);
            if (! userProfile.groups) throw new MissingInformationLoginError(`email is not truthy: ${userProfile.groups}`);
            if (! userProfile.preferred_username) throw new MissingInformationLoginError(
                `preferred_username is not truthy: ${userProfile.preferred_username}`
            );   
        }

        const user = {
            accessToken,
            refreshToken,
            name: userProfile.name,
            email: userProfile.email,
            username: userProfile.preferred_username,
        };

        /* Checking if the group is correct */{
            const requiredGroup = constants.oauth.requiredGroup;
            console.log("requiredGroup", requiredGroup);
            const requiredGroupIsDefined = (
                requiredGroup !== null && 
                requiredGroup !== "" && 
                requiredGroup !== undefined);
            if (! userProfile.groups.includes(requiredGroup) && requiredGroupIsDefined) {
                throw new NotPartOfAuthorizedGroupError(
                    `The user (${userProfile.name}) is not in the group: \"${requiredGroup}\", when this is required. `
                    + `The user is part of the following groups: ${userProfile.groups}, but not \"${requiredGroup}\".`
                );
            }
        }

        return done(null, user);

    } catch (error) {
        return done(error);
    }
}