import axios from 'axios';
import constants from '#source/constants.js';
import { oAuthConfiguration } from '#source/utilities/auth/passport.js';

import LoginError from '#source/utilities/auth/errors/login-error.js';
import MissingInformationLoginError from '#source/utilities/auth/errors/missing-information-error.js';
import NotPartOfAuthorizedGroupError from '#source/utilities/auth/errors/not-part-of-authorized-group-error.js';

import { repository as userRepository } from "#source/utilities/database/schemas/user.js";
import { EntityId } from 'redis-om';

/** Fetches the user's information from the user info end point or throws an error if that fails. */
async function getUserData(accessToken) {
  try {
    
    const response = await axios.get(new URL(oAuthConfiguration.userinfo_endpoint), {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
      
    return await response.data;

  } catch (error) {
    console.error(error);
    throw new LoginError("Couldn't get the user information.");
  }
}

async function initializeUserWithDataBase(user) {

  const id = user.sub;
  /* Checking if the user has a truthy identifier */ {
    if (! id) throw new MissingInformationLoginError(
      `User identifier is not truthy: ${id}, identifier is required.`
    );
  }
  
  const userFromDataBase = await userRepository.fetch(id);

  console.debug("userFromDataBase:", userFromDataBase);

  userFromDataBase.name  = ( userFromDataBase.name  ? userFromDataBase.name  : user.name  );
  userFromDataBase.email = ( userFromDataBase.email ? userFromDataBase.email : user.email );

  const savedUser = await userRepository.save(id, userFromDataBase);

  return savedUser;
}

export default async function handleLogin(accessToken, refreshToken, profile, done) {

  try {
      
    const userProfile = await getUserData(accessToken);
    const user = await initializeUserWithDataBase(userProfile);

    /* Checking if the group is correct */{
      const requiredGroup = constants.oauth.requiredGroup;
      console.log("requiredGroup", requiredGroup);
      const requiredGroupIsDefined = (
        requiredGroup !== null && 
        requiredGroup !== "" && 
        requiredGroup !== undefined);
      if (! userProfile.groups.includes(requiredGroup) && requiredGroupIsDefined) {
        throw new NotPartOfAuthorizedGroupError(
          `The user (${userProfile.name}) is not in the group: \"${requiredGroup}\", ` + 
          `when this is required. The user is part of the following groups: ` + 
          `${userProfile.groups.join(", ")}. Which does not contain the required group \"${requiredGroup}\".`
        );
      }
    }

    const result = { ...user, id: user[EntityId], accessToken, refreshToken };
    return done(null, result);

  } catch (error) {
    console.error(error);
    return done(error);
  }
}