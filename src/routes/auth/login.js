import axios from 'axios';
import constants from '../../constants.js';

export default async function login(accessToken, refreshToken, profile, done) {
    try {
        
        const response = await axios.get(`${constants.oauth.urls.userinfo}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const userProfile = response.data;

        /* Checking the user's information*/ {
            if (! userProfile.name) throw new Error(`Username is not truthy: ${userProfile.name}`);
            if (! userProfile.email) throw new Error(`email is not truthy: ${userProfile.email}`);
            if (! userProfile.groups) throw new Error(`email is not truthy: ${userProfile.groups}`);
            if (! userProfile.preferred_username) throw new Error(
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
                throw new Error(
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