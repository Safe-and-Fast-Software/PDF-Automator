"use-strict";

import requiresAuthentication from "../../utilities/auth/require-authentication.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', requiresAuthentication, (request, responds) => {
    const user = request.user;
    responds.send(/*html*/`
        <!DOCTYPE html>
        <html>
            <head>
                <title>User Profile - PDF Automator</title>
            </head>
            <body>
                <h1>User Profile</h1>
                <p>
                    This is all the application has saved about you. 
                    If you want to change anything you'll have to contact your Oauth provider.
                </p>    
                <u>
                    ${user.name?/*html*/`<li><b>Full Name</b>: ${user.name}</li>`:``}
                    ${user.email?/*html*/`<li><b>eMail</b>: ${user.email}</li>`:``}
                    ${user.username?/*html*/`<li><b>Username</b>: ${user.username}</li>`:``}
                </u> 
            </body>
        </html>`
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
