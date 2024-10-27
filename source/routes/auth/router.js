"use-strict";

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import passport from '#source/utilities/auth/passport.js';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

const oauthMiddleware = passport.authenticate('oauth2', { 
  failureRedirect: '/auth/failure', 
  scope: ['profile', 'email'] 
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get("/login", passport.authenticate('oauth2'));

router.get("/callback", oauthMiddleware, (request, responds) => { 
  return responds.redirect('/profile'); 
});

router.get('/logout', (request, responds) => {
  request.session.destroy(error => {
    if (! error) return responds.redirect('/');
    console.error(error);
    return ( responds
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .type("text/html")
      .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: Failed to log you out.`)
    );
  });
});

router.get('/failure', (request, responds) => {
  return ( responds
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .type("text/html")
    .send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: Failed to log you in.`)
  );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
