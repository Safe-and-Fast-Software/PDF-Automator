"use-strict";

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
    (request, responds) => { responds.redirect('/profile'); }
);

authRouter.get('/logout', (request, responds) => {
    request.session.destroy(error => {
        
        if (! error) return responds.redirect('/');

        console.error(error);
        return responds.status(500).send('Failed to log you out.');
    });
});

authRouter.get('/failure', (request, responds) => {
    return responds.status(500).send('Failed to log you in');
});



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export default authRouter;