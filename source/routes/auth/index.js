import express from 'express';
import passport from 'passport';
import constants from '../../constants.js';

const protectedPathsRouter = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(request, responds, next) {
    if (request.isAuthenticated()) return next();
    responds.redirect(constants.app.loginPath);
}

protectedPathsRouter.get('/dashboard', isAuthenticated, (request, responds) => {
    responds.send(`Hello ${request.user.name}, welcome to your dashboard!`);
});

protectedPathsRouter.get('/profile', isAuthenticated, (request, responds) => {
    const user = request.user;
    console.log(user);
    responds.send(
        `<h1>User Profile</h1>` +
        "This is all the application knows about you. " +
        "If you want to change anything you'll have to contact your Oauth provider." +
        "<br><ul>" +
        `<li><b>Full Name</b>: ${user.name}</li>` +
        `<li><b>email</b>: ${user.email}</li>` +
        `<li><b>username</b>: ${user.username}</li>` +
        "</ul>"
    );
});

export default protectedPathsRouter;
