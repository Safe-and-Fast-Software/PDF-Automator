"use-strict";

import { StatusCodes } from "http-status-codes";
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
            <section id="content" class="mt-3">
                Loading Documents...
            </section>
        `)
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  HTMX end Points  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import htmxOnlyEndpoint from "#source/utilities/responds/htmx-only-endpoint.js";
router.get("/htmx/search-document", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
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

router.get("/htmx/create-new-document", htmxOnlyEndpoint, requiresAuthentication, (request, responds) => {
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
                                    console.log("textarea", textarea.value, "parameter", parameter);
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
