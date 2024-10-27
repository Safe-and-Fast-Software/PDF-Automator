"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import requiresAuthentication from "#source/utilities/auth/require-authentication.js";
import loadBaseFirst from "#source/utilities/responds/load-base-first.js";

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
            <div class="w-full border border-gray-300 rounded-lg mt-3 p-3">
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
            <section id="content" class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 mt-4">
                Loading...
            </section>
        `)
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  HTMX end Points  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import htmxOnlyEndpoint from "#source/utilities/responds/htmx-only-endpoint.js";

//`----------------------------------------------------- SEARCH ----------------------------------------------------`//

router.get("/htmx/search-document", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Searching a new Document</h3>
            <p>
                search document
            </p>
            <div hx-target="#content" hx-get="/api/v1/document/all" hx-trigger="load"></div>
        `)
    );
});

//`----------------------------------------------------- CREATE ----------------------------------------------------`//

import { EntityId } from "redis-om";
router.get("/htmx/create-new-document", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Creating a new Document</h3>
            <p>
                Using the following form you can create documents. Just select a template, and a customer, and then 
                the template will automatically be filled in with both information from you and the customer.
            </p>
            <form hx-put="/api/v1/document" hx-trigger="submit" class="relative flex flex-col mt-3" id="document-creation"
                hx-target="#content" hx-swap="afterbegin">
                <div class="form-group flex-grow">
                    <!-- Customer -->
                    <label for="new-document-customer-select" class="default">Customer:</label>
                    <select id="new-document-customer-select" class="default" name="customerID" required>
                        <option value="" disabled selected hidden>Select an option</option>
                        <optgroup label="Customers" hx-trigger="load" hx-target="this"
                            hx-get="/document/htmx/create-new-document/options/customer">
                        </optgroup>
                    </select>
                    <!-- Template -->
                    <label for="new-document-template-select" class="default">Template:</label>
                    <select id="new-document-template-select" class="default" name="templateID" required>
                        <option value="" disabled selected hidden>Select an option</option>
                        <optgroup label="Templates" hx-target="this"
                            hx-trigger="load" hx-get="/document/htmx/create-new-document/options/template">
                        </optgroup>
                    </select>
                </div>
                <div class="grid grid-cols-1 w-full mt-auto"> 
                    <div class="flex justify-center mt-6">
                        <button type="submit" class="default confirm">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path class="fill-inherit" d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                            Create
                        </button> 
                    </div>
                </div>
            </form>
            <div hx-target="#content" hx-get="/api/v1/document/all" hx-trigger="load"></div>
        `)
    );
});

import { repository as customerRepository } from "#source/utilities/database/schemas/customer.js";
router.get("/htmx/create-new-document/options/customer", htmxOnlyEndpoint, requiresAuthentication, async (request, responds) => {
    
    try {

        let respondsHTML = "";
        /* Getting all the customers, and creating options out of them */ {
            const customers = await customerRepository.search().sortAscending("name").return.all();
            for ( const index in customers ) respondsHTML = (respondsHTML + /*html*/`
                <option value="${customers[index][EntityId]}">${customers[index].name}</option>
            `);
        }

        /* Returning the responds that we just build */ {
            return ( responds
                .status(StatusCodes.OK)
                .type("text/html")
                .send(respondsHTML)
            );
        }

    } catch (error) { console.error(error);

        /* Returning an error responds */ {
            return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .type("text/html")
                .send(/*HTML*/`<p> ${ReasonPhrases.INTERNAL_SERVER_ERROR}: There was an error getting all documents. </p>`)
            );
        }
    }
});

import { repository as templateRepository } from "#source/utilities/database/schemas/template.js";
router.get("/htmx/create-new-document/options/template", htmxOnlyEndpoint, requiresAuthentication, async (request, responds) => {
    
  try {

        let respondsHTML = "";
        /* Getting all the templates, and creating options out of them */ {
            const templates = await templateRepository.search().sortAscending("name").return.all();
            for ( const index in templates ) respondsHTML = (respondsHTML + /*html*/`
                <option value="${templates[index][EntityId]}">${templates[index].name}</option>
            `);
        }

        /* Returning the responds that we just build */ {
            return ( responds
                .status(StatusCodes.OK)
                .type("text/html")
                .send(respondsHTML)
            );
        }

    } catch (error) { console.error(error);

        /* Returning an error responds */ {
            return ( responds
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .type("text/html")
                .send(/*HTML*/`<p> ${ReasonPhrases.INTERNAL_SERVER_ERROR}: There was an error getting all documents. </p>`)
            );
        }
    }
});

//|---------------------------------------------------- TEMPLATE ---------------------------------------------------|//

//`----------------------------------------------------- SEARCH ----------------------------------------------------`//

import { repository as userRepository } from "#source/utilities/database/schemas/user.js";
router.get("/htmx/search-template", htmxOnlyEndpoint, requiresAuthentication, async (request, responds) => {

    let userOptions = "";
    /* Creating the HTML required for the options. */ {
        const users = await userRepository.search().return.all();
        for ( const index in users ) {
            userOptions = ( 
                userOptions + /*html*/`<option value="${users[index][EntityId]}">${users[index].name}</option>`
            ); 
        }
    }
    
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Searching a Template</h3>
            <form hx-get="/api/v1/template/all" hx-target="#content" hx-trigger="submit" 
                class="relative flex flex-col" id="template-search">
                <div class="mt-4">
                    <div class="form-group flex-grow">
                        <!-- Name -->
                        <label class="default" for="template-name">Name:</label>
                        <input class="default"  id="template-name" name="name" type="text" placeholder="Invoice">
                        <!-- Created by -->
                        <label for="template-user-select" class="default">Created by:</label>
                        <select id="template-user-select" class="default" name="userID">
                            <option value="" selected>Select a creator</option>
                            <optgroup label="Users">${userOptions}</optgroup>
                        </select>
                        <!-- Sort By -->
                        <label class="hidden" for="template-sort-by">Sort by:</label>
                        <input class="hidden"  id="template-sort-by" name="sort-by" type="text" value="name">
                        <!-- Sort Direction -->
                        <label class="hidden" for="template-sort-direction">Sort direction:</label>
                        <input class="hidden"  id="template-sort-direction" name="sort-direction" type="text" value="ASC">
                    </div>
                </div>
                <div class="grid grid-cols-1 w-full mt-auto"> 
                    <div class="flex justify-center mt-6">
                        <button type="submit" class="default confirm">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                              <path class="fill-inherit" d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                            </svg>
                            Search
                        </button> 
                    </div>
                </div>
            </form>
            <div hx-target="#content" hx-get="/api/v1/template/all?sort-by=name&sort-direction=ASC" hx-trigger="load">
            </div>
        `)
    );
});

//`----------------------------------------------------- CREATE ----------------------------------------------------`//

router.get("/htmx/create-new-template", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(/*HTML*/`
            <h3>Creating a new Template</h3>
            <p>
                In here you can create a new template. A template has a name, making it easier to find, and a body.
                if you want to know how to make a template take a look 
                over <a href="https://pdfmake.github.io/docs/0.1/">here</a>. The server creates documents 
                using <a href="http://pdfmake.org/">pdfMake</a>, an NPM library. It replaces some special values 
                in the template with values from the customer or user who creates it.
            </p>  
            <p>
                There are plans to make the template not be JSON based but more like an online document editor, but
                that is a lot of effort to make. So for now it's easier if you make the JSON template in an IDE, and
                then paste it in here.
            </p>
            <br>
            <form hx-put="/api/v1/template" hx-trigger="submit" class="relative flex flex-col" id="template-creation"
                hx-target="#content" hx-swap="afterbegin">
                <div>
                    <div class="form-group flex-grow">
                        <!-- ID -->
                        <label for="new-template-id" class="default">Template ID:</label>
                        <input  id="new-template-id" class="default cursor-not-allowed" value="will be created automatically" disabled>
                        <!-- Name -->
                        <label for="new-template-name" class="default">Name:</label>
                        <input  id="new-template-name" class="default" placeholder="Invoice" name="name" type="text" required>
                        <!-- Template body -->
                        <label    for="new-template-body" class="default">JSON:</label>
                        <textarea  id="new-template-body" class="default" type="text" name="json" placeholder="[ ... ]" required>[]</textarea>
                    </div>
                </div>
                <div class="grid grid-cols-2 w-full mt-auto"> 
                    <div class="flex justify-center mt-6">
                        <button class="default confirm" type="button" id="new-template-preview-button">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                            </svg>
                            Preview
                            <script class="hidden">
                                function updateFrameURL() {
                                    const iframe = document.getElementById("new-template-iframe");
                                    const textarea  = document.getElementById("new-template-body");
                                    const parameter = encodeURIComponent(textarea.value)
                                    iframe.src = "/api/v1/template/preview?name=preview&json="+parameter;
                                };
                                document.getElementById("new-template-preview-button")
                                    .addEventListener("click", updateFrameURL);
                            </script>
                        </button> 
                    </div>
                    <div class="flex justify-center mt-6">
                        <button type="submit" class="default confirm">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path class="fill-inherit" d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                            Create
                        </button> 
                    </div>
                    </div>
            </form>
            <br>
            <iframe id="new-template-iframe" src="/api/v1/template/preview?name=preview&json=[]" 
                frameborder="0" class="w-full h-[100vh]"></iframe>
            <style scoped>#content{display:none;visibility:hidden}</style>
        `)
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
