"use-strict";

import { StatusCodes } from "http-status-codes";
import requiresAuthentication from "../../utilities/auth/require-authentication.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get("/", requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .send(/*html*/`
            <!DOCTYPE html>
            <head>
                <title>PDF Automator</title>
            </head>
            <body>
                <h1>
                    Hey there, ${request.user.name}!
                </h1>
                <p>
                    Chose what to create. You can either create a <a href="./document">document</a>, 
                    or a new <a href="./customer">customer</a>.
                </p>
            </body>`
        )
    );
});


router.get('/document', requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .send(/*html*/`
            <!DOCTYPE html>
            <head>
                <title>PDF Automator</title>
            </head>
            <body>
                <h1>
                    Create Document
                </h1>
                <p>
                    In here you can create new documents.
                </p>
            </body>`
        )
    );
});

router.get('/customer', requiresAuthentication, (request, responds) => {
    return ( responds
        .status(StatusCodes.OK)
        .send(/*html*/`
            <!DOCTYPE html>
            <head>
                <title>PDF Automator</title>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://unpkg.com/htmx.org@2.0.2" 
                    integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" 
                    crossorigin="anonymous">
                </script>
            </head>
            <body>
                <h1>
                    Create customers
                </h1>
                <p>
                    In here you can create new customers.
                </p>
                <form hx-put="/api/v1/customer" hx-target="#results" hx-trigger="submit" hx-swap="afterbegin"
                    hx-on::after-request="document.querySelector('form').reset()" 
                    hx-on:submit="console.log('submitted new user to the server')">
                    <div class="form-group">
                        <label for="customer-name">Customer Name:</label>
                        <input type="text" id="customer-name" name="name" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-phone-number">Customer phone number:</label>
                        <input type="text" id="customer-phone-number" name="phone" placeholder="+1 1234567890">
                    </div>
                    <div class="form-group">
                        <label for="customer-email">Customer email:</label>
                        <input type="text" id="customer-email" name="email" placeholder="user@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-street1">Customer Street 1:</label>
                        <input type="text" id="customer-street1" name="street1" placeholder="myLane 1" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-street2">Customer Street 2:</label>
                        <input type="text" id="customer-street2" name="street2" placeholder="myStreet 1">
                    </div>
                    <div class="form-group">
                        <label for="customer-zip">Customer zip code:</label>
                        <input type="text" id="customer-zip" name="zip" placeholder="12345" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-city">Customer city:</label>
                        <input type="text" id="customer-city" name="city" placeholder="New York" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-country">Customer country:</label>
                        <input type="text" id="customer-country" name="country" placeholder="USA" required>
                    </div>
                    <div class="form-group">
                        <button type="submit">Create</button>
                    </div>
                </form>
                <ul id="results" hx-get="/api/v1/customer/all" hx-trigger="revealed" class="results"></ul>
            </body>`
        )
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
