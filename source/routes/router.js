"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import constants from "#source/constants.js";
import requiresAuthentication from "#source/utilities/auth/require-authentication.js";
import loadBaseFirst from "#source/utilities/responds/load-base-first.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sub-Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { router as apiRouter } from "#source/routes/api/router.js";
router.use("/api", apiRouter);

import { router as authRouter } from "#source/routes/auth/router.js";
router.use("/auth", authRouter);

import { router as customerRouter } from "#source/routes/customer/router.js";
router.use("/customer", customerRouter);

import { router as documentRouter } from "#source/routes/document/router.js";
router.use("/document", documentRouter);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { repository as userRepository } from "#source/utilities/database/schemas/user.js";
import { repository as customerRepository } from "#source/utilities/database/schemas/customer.js";
router.get('/', loadBaseFirst, async (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        // .render("pages/home", { sourceCodeURL: constants.github.link })
        .send(/*HTML*/`
            <section id="summary" class="border border-gray-300 rounded-lg p-3">
                <h1 class="mt-0">PDF Automator</h1>
                <p>
                    PDF Automator is an <a class="default" href="${constants.github.link}">open source</a>, and free 
                    PDF creation software created, used, and maintained by <a class="default" 
                    href="https://safs.nl">SAFS</a>. It's free to self host or you can of course ask us to host it
                    for you by <a class="default" href="https://redirects.safs.nl/contact">reaching out</a>.
                </p>
            </section>
            <div class="md:grid grid-cols-3 gap-4 mt-4">
                <section id="what-is-it-for" class="border border-gray-300 rounded-lg p-3">
                    <h2 class="mt-0 text-center">What is it for?</h2>
                    <p>
                        PDF Automator is used for creating PDFs with your logo, contact information, and that of your 
                        customers, all automagically. All you have to do is sent a request to the API endpoint, or use
                        the web GUI to create it.
                    </p>
                </section>
                <section id="who-is-it-for" class="border border-gray-300 rounded-lg p-3">
                    <h2 class="mt-0 text-center">Who is it for?</h2>
                    <p>
                        PDF Automator is for small business, who don't want to pay for invoice, contracting software. 
                        That's why I created this. (Also because it seemed like a fun summer project to make.)
                    </p>
                </section>
                <section id="want-to-see-more" class="border border-gray-300 rounded-lg p-3">
                    <h2 class="mt-0 text-center">Want to see more?</h2>
                    <p>
                        There is are some pictures of the program as well as instructions on how to host it yourself
                        included in the <a class="default" href="${constants.github.link}">repository</a>, all for 
                        free.
                    </p>
                </section>
            </div>
            <section id="fun-facts" class="border border-gray-300 rounded-lg p-3 mt-4">
                <h3 class="mt-0">Fun Facts</h3>
                <p>
                    Here are some metrics of the application:
                </p>
                <table class="mt-3">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Emails sent</td>
                            <td><!-- TODO : implement --></td>
                        </tr>
                        <tr>
                            <td>Users in database</td>
                            <td>${(await userRepository.search().return.count())}</td>
                        </tr>
                        <tr>
                            <td>Customers in database</td>
                            <td>${(await customerRepository.search().return.count())}</td>
                        </tr>
                        <tr>
                            <td>Documents in database</td>
                            <td>${/*(await customerRepository.search().return.count())*/""}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        `)
    );
}); 

router.get("/session", (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("application/json")
        .send({ user: { ...request.user}, session: { ...request.session } })
    );
});

router.get("/health-check", (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(ReasonPhrases.OK)
    );
});

import profilePage, { profileFormComponent } from "#source/routes/profile-page.js";
router.get('/profile', requiresAuthentication, loadBaseFirst, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(profilePage(request))
    );
});

import htmxOnlyEndpoint from "#source/utilities/responds/htmx-only-endpoint.js";
router.get('/profile/htmx/form', htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {     
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(profileFormComponent(request))
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
