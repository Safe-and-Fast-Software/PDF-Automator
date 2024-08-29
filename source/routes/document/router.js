"use-strict";

import { StatusCodes } from "http-status-codes";
import requiresAuthentication from "../../utilities/auth/require-authentication.js";
import loadBaseFirst from "../../utilities/responds/load-base-first.js";


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get("/", requiresAuthentication, loadBaseFirst, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <section id="actions">
                <form class="inline-menu">
                    <input class="inline-menu" type="radio" id="action1" name="action" 
                        hx-trigger="click" hx-get="/document/htmx/search-document" hx-target="#action-segment" checked>
                    <label class="inline-menu" for="action1">Search Documents</label>
                    <input class="inline-menu" type="radio" id="action2" name="action" 
                        hx-trigger="click" hx-get="/document/htmx/create-new-document" hx-target="#action-segment">
                    <label class="inline-menu" for="action2">Create Document</label>
                    <input class="inline-menu" type="radio" id="action3" name="action" 
                        hx-trigger="click" hx-get="/document/htmx/search-template" hx-target="#action-segment">
                    <label class="inline-menu" for="action3">Search Template</label>
                    <input class="inline-menu" type="radio" id="action4" name="action" 
                        hx-trigger="click" hx-get="/document/htmx/create-new-template" hx-target="#action-segment">
                    <label class="inline-menu" for="action4">Create Template</label>
                </form>
            </section>
            <div class="w-full border border-gray-300 rounded-lg my-3 p-3">
                <section id="information">
                    <h1 class="mt-0">Documents</h1>
                    <p>
                        Documents are things you can sent to customers. You can <a>create a template</a>, 
                        then <a>create a new document</a>, and after a preview, sent it to the customer.
                        You can sent a given template as many times as you want. So all you have to do is 
                        set it up once, and then bare the fruits.
                    </p>
                </section>
                <section id="action-segment" hx-get="/document/htmx/search-document" hx-trigger="load">

                </section>
            </div>
            <section id="content">
                Loading Documents...
            </section>
        `)
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  HTMX end Points  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import htmxOnlyEndpoint from "../../utilities/responds/htmx-only-endpoint.js";

router.get("/htmx/search-document", requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Searching a new Document</h3>
            <p>
                search document
            </p>
        `)
    );
});

router.get("/htmx/create-new-document", requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Creating a new Document</h3>
            <p>
                Create a document action.
            </p>
        `)
    );
});

router.get("/htmx/search-template", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Searching a Template</h3>
            <p>
                Search a template action
            </p>
        `)
    );
});


router.get("/htmx/create-new-template", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Creating a new Template</h3>
            <p>
                Create a template action.
            </p>  
        `)
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
