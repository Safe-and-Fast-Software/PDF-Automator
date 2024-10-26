"use-strict";

import { EntityId } from "redis-om";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export default function customerCardComponent(customer) {

    const apiEndpoint = `/api/v1/customer/by-id/${customer[EntityId]}`;

    const cardID = `customer-${customer[EntityId]}`;
    const customerUpdateRespondsID = `${cardID}-update-responds`;

    const clearTextAfter3Seconds = ((`
        setTimeout(() => {
            document.querySelector('#${customerUpdateRespondsID}').innerHTML = '';
        }, 3000);
    `).replace(" ", ""));

    return (/*HTML*/`
        <li id="${cardID}" class="list-none w-full border border-gray-300 rounded-lg">
            <form hx-post="${apiEndpoint}" hx-trigger="submit" class="relative flex flex-col p-4"
                hx-on::after-request="${clearTextAfter3Seconds}" hx-target="#${customerUpdateRespondsID}">
                <div>
                    <div class="form-group flex-grow">
                        <!--  -->
                        <h4 class="default text-right">Customer identity</h4><div></div>
                        <!-- ID -->
                        <label for="${cardID}-id" class="default">Customer ID:</label>
                        <input  id="${cardID}-id" class="default cursor-not-allowed" value="${customer[EntityId]}" disabled>
                        <!-- Name -->
                        <label for="${cardID}-name"    class="default">Name:</label>
                        <input  id="${cardID}-name"    class="default" type="text" name="name" value="${customer?.name}" required>
                        <!--  -->
                        <h4 class="default text-right">Contact information</h4><div></div>
                        <!-- Phone Number -->
                        <label for="${cardID}-phone"   class="default">phone number:</label>
                        <input  id="${cardID}-phone"   class="default" type="text" name="phone"   value="${customer?.phone}" required>
                        <!-- Email -->
                        <label for="${cardID}-email"   class="default">email:</label>
                        <input  id="${cardID}-email"   class="default" type="text" name="email"   value="${customer?.email}" required>
                        <!--  -->
                        <h4 class="default text-right">Address information</h4><div></div>
                        <!-- Street (primary) -->
                        <label for="${cardID}-street1" class="default">Street 1:</label>
                        <input  id="${cardID}-street1" class="default" type="text" name="street1" value="${customer?.street1}" required>
                        <!-- Street (secondary) -->
                        <label for="${cardID}-street2" class="default">Street 2:</label>
                        <input  id="${cardID}-street2" class="default" type="text" name="street2" value="${customer?.street2}" >
                        <!-- City -->
                        <label for="${cardID}-city"    class="default">city:</label>
                        <input  id="${cardID}-city"    class="default" type="text" name="city"    value="${customer?.city}" required>
                        <!-- Zip Code -->
                        <label for="${cardID}-zip"     class="default">zip code:</label>
                        <input  id="${cardID}-zip"     class="default" type="text" name="zip"     value="${customer?.zip}" required>
                        <!-- Country -->
                        <label for="${cardID}-country" class="default">country:</label>
                        <input  id="${cardID}-country" class="default" type="text" name="country" value="${customer?.country}" required>
                    </div>
                    <div id="${customerUpdateRespondsID}" class="m-4 font-semibold"></div>
                </div>
                <div class="p-3 grid grid-cols-3 w-full mt-auto">
                    <div class="flex justify-center">
                        <button hx-delete="${apiEndpoint}" hx-target="#${cardID}" 
                            hx-confirm="Are you sure you want to delete '${customer?.name}'? The consequences of this action cannot be undone."
                            hx-trigger="click" hx-swap="delete" class="default delete">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path class="fill-inherit" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                            Delete
                        </button>
                    </div>
                    <div class="flex justify-center">
                        <button hx-get="${apiEndpoint}" hx-trigger="click" hx-swap="outerHTML"
                            hx-target="#${cardID}" class="default cancel">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path class="fill-inherit" d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                            Cancel
                        </button> 
                    </div>    
                    <div class="flex justify-center">
                        <button type="submit" class="default confirm">
                            <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path class="fill-inherit" d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                            Update
                        </button> 
                    </div>
                </div>
            </form>
        </li>
    `);
}