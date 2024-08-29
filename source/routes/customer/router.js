"use-strict";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import requiresAuthentication from "../../utilities/auth/require-authentication.js";
import loadBaseFirst from "../../utilities/responds/load-base-first.js";

import simpleCustomerSearch from "./simple-customer-search.js"
import createCustomerComponent from "./create-customer.js"
import advancedCustomerSearchComponent from "./advanced-customer-search.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const getContent = (request, responds) => {
        
    const originalUrlWithoutQuery = (request.originalUrl.split("?")[0]);
    
    const URLs = {
        base : "/customer",
        search : "/customer/search",
        create : "/customer/create",
    };

    let actionHTML;
    switch(originalUrlWithoutQuery) {
        case URLs.base:   actionHTML = simpleCustomerSearch(request);                        break;
        case URLs.search: actionHTML = advancedCustomerSearchComponent(request);             break;
        case URLs.create: actionHTML = createCustomerComponent(request);                     break;
        default: return ( responds
            .status(StatusCodes.BAD_REQUEST)
            .type("text/html")
            .send(`${ReasonPhrases.BAD_REQUEST}: URL not recognised.`)
        );
    }

    const HTML = (/*HTML*/`
        <section id="actions">
            <form class="inline-menu" action="get">
                <input class="inline-menu" type="radio" id="action1" name="action" 
                    hx-trigger="click" hx-get="${URLs.base}" hx-target="#main" hx-push-url="true"
                    ${ originalUrlWithoutQuery === URLs.base ? "checked" : "" }>
                <label class="inline-menu" for="action1">Simple Customer Search</label>
                <input class="inline-menu" type="radio" id="action2" name="action" 
                    hx-trigger="click" hx-get="${URLs.search}" hx-target="#main" hx-push-url="true"
                    ${ originalUrlWithoutQuery === URLs.search ? "checked" : "" }>
                <label class="inline-menu" for="action2">Advanced Customer Search</label>
                <input class="inline-menu" type="radio" id="action3" name="action" 
                    hx-trigger="click" hx-get="${URLs.create}" hx-target="#main" hx-push-url="true"
                    ${ originalUrlWithoutQuery === URLs.create ? "checked" : "" }>
                <label class="inline-menu" for="action3">Create Customer</label>
            </form>
        </section>
        <div class="w-full border border-gray-300 rounded-lg mt-3 p-3">
            <section id="customer-explained">
                <h1 class="mt-0">Customers</h1>
                <p>
                    Customers are people that you can create documents for. When you select a customer, 
                    their details will be auto filled into the document. This way, creating a new document
                    is super fast, and all you'll have to do is 
                </p>
            </section>
            <section id="content" class="p-4"> 
                ${actionHTML}
            </section>
        </div>
        <section id="customers-list" hx-get="/api/v1/customer/all" hx-trigger="load"
            class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 mt-4" >
            <p> Loading customers... </p>
        </section>
    `);

    return ( responds
        .status(StatusCodes.OK)
        .type("text/html")
        .send(HTML)
    );
}

router.get("/", requiresAuthentication, loadBaseFirst, getContent);
router.get("/search", requiresAuthentication, loadBaseFirst, getContent);
router.get("/create", requiresAuthentication, loadBaseFirst, getContent);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
