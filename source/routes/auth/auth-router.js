"use-strict";

import { StatusCodes } from 'http-status-codes';
import passport from '../../utilities/auth/passport.js';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
const authRouter = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// None

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

authRouter.get("/login", passport.authenticate('oauth2'));

authRouter.get("/callback", passport.authenticate('oauth2', 
    { failureRedirect: '/auth/failure', scope: ['profile', 'email'] }), 
    (request, responds) => { return responds.redirect('/profile'); }
);

authRouter.get('/logout', (request, responds) => {
    request.session.destroy(error => {
        
        if (! error) return responds.redirect('/');

        console.error(error);
        return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Failed to log you out.');
    });
});

authRouter.get('/failure', (request, responds) => {
    return responds.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Failed to log you in');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export default authRouter;