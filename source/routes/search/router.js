"use-strict";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import Router from "express";
import requiresAuthentication from "../../utilities/auth/require-authentication.js";
export const router = Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ End Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

router.get('/', requiresAuthentication, (request, responds) => {
    return responds.send(/*html*/`
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://unpkg.com/htmx.org@2.0.2" 
                integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" 
                crossorigin="anonymous">
            </script>
            <title>Customer Search - PDF Automator</title>
        </head>
        <body>
            <h1>
                Customer Search
            </h1>
            <p>
                from here you can search for customers.
            </p>
            <form hx-get="/api/v1/customer/all" hx-target="#search-results" hx-trigger="submit">
                <!-- hx-trigger="keyup changed delay:300ms"> -->
                <div class="form-group">
                    <label for="customer-name">Customer Name:</label>
                    <input type="text" id="customer-name" name="name" placeholder="John Doe">
                </div>
                <div class="form-group">
                    <label for="customer-phone-number">Customer phone number:</label>
                    <input type="text" id="customer-phone-number" name="phone" placeholder="+1 1234567890">
                </div>
                <div class="form-group">
                    <label for="customer-email">Customer email:</label>
                    <input type="text" id="customer-email" name="email" placeholder="user@example.com">
                </div>
                <div class="form-group">
                    <label for="customer-street1">Customer Street 1:</label>
                    <input type="text" id="customer-street1" name="street1" placeholder="myLane 1">
                </div>
                <div class="form-group">
                    <label for="customer-street2">Customer Street 2:</label>
                    <input type="text" id="customer-street2" name="street2" placeholder="myStreet 1">
                </div>
                <div class="form-group">
                    <label for="customer-zip">Customer zip code:</label>
                    <input type="text" id="customer-zip" name="zip" placeholder="12345">
                </div>
                <div class="form-group">
                    <label for="customer-city">Customer city:</label>
                    <input type="text" id="customer-city" name="city" placeholder="New York">
                </div>
                <div class="form-group">
                    <button type="submit">Search</button>
                </div>
            </form>
            <div id="search-results" hx-get="/api/v1/customer/all" hx-trigger="revealed" class="results"></div>
        </body>`
    );
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
