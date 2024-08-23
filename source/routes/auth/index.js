import constants from '../../constants.js';

const protectedPathsRouter = express.Router();

/**
 * Middleware to check if user is authenticated, and redirect them if they're not.
 */
function requiresAuthentication(request, responds, next) {
    if (request.isAuthenticated()) return next();
    responds.redirect(constants.app.loginPath);
}

protectedPathsRouter.get('/dashboard', requiresAuthentication, (request, responds) => {
    responds.send(/*html*/`
        <html>
            <head>
                <title>dashboard</title>
            </head>
            <body>
                <h1>dashboard</h1>
                <p>
                    Hello ${request.user.name}, welcome to your dashboard!
                </p>
                <h2>Fake Data</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Suscipit rem inventore saepe asperiores similique expedita 
                    cumque magnam voluptas amet velit neque quis officia commodi 
                    harum impedit explicabo, rerum provident eius.
                </p>
            </body>
        </html>`
    );
});

protectedPathsRouter.get('/profile', requiresAuthentication, (request, responds) => {
    const user = request.user;
    console.log(user);
    responds.send(/*html*/`
        <html>
            <head>
                <title>User Profile</title>
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

export default protectedPathsRouter;
