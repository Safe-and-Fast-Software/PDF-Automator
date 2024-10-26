"use-strict";

import { EntityId } from "redis-om";
import { repository as userRepository } from "#source/utilities/database/schemas/user.js";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export default async function templateCardComponent(instance) {

    const apiEndpoint = `/api/v1/template/by-id/${instance[EntityId]}`;

    const cardID = `template-${instance[EntityId]}`;
    const updateRespondsID = `${cardID}-update-responds`;

    const clearTextAfter3Seconds = ((/*JS*/`
        setTimeout(() => {
            document.querySelector('#${updateRespondsID}').innerHTML = '';
        }, 3000);
    `).replace(" ", ""));

    let options = "";
    /* Creating the HTML required for the options. */ {
        const users = await userRepository.search().return.all();
        for ( const index in users ) if (users[index][EntityId] !== instance.userID ) options = ( options + /*html*/`
            <option value="${users[index][EntityId]}">${users[index].name}</option>
        `); else options = ( options + /*html*/`
            <option value="${users[index][EntityId]}" selected>${users[index].name}</option>
        `); 
    }

    return (/*HTML*/`
        <li id="${cardID}" class="list-none w-full border border-gray-300 rounded-lg">
            <form hx-post="${apiEndpoint}" hx-trigger="submit" class="relative flex flex-col p-4"
                hx-on::after-request="${clearTextAfter3Seconds}" hx-target="#${updateRespondsID}">
                <div>
                    <div class="form-group flex-grow">
                        <h4 class="default text-right">Template identity</h4><div></div>
                        <!-- ID -->
                        <label for="${cardID}-id" class="default">template ID:</label>
                        <input  id="${cardID}-id" class="default cursor-not-allowed" value="${instance[EntityId]}" disabled>
                        <!-- Name -->
                        <label for="${cardID}-created-by" class="default">Name:</label>
                        <input  id="${cardID}-created-with" class="default" value="${instance?.name}" name="name" type="text" required>
                        <!-- JSON -->
                        <label   for="${cardID}-json" class="default">JSON:</label>
                        <textarea id="${cardID}-json" class="default" placeholder="[ ... ]" name="json" type="text" required>${instance?.json}</textarea>
                        <!-- User -->
                        <label for="${cardID}-created-with" class="default">Created by:</label>
                        <select id="${cardID}-created-with" class="default" name="userID" required>
                          <optgroup label="Users">${options}</optgroup>
                        </select>
                        <!-- Date -->
                        <label for="${cardID}-created-on" class="default">Created on:</label>
                        <input  id="${cardID}-created-on" class="default cursor-not-allowed" value="${instance?.dateCreated.toISOString()}" name="dateCreated" type="text" readonly>
                    </div>
                    <div id="${updateRespondsID}" class="m-4 font-semibold"></div>
                </div>
                <div class="p-3 grid grid-cols-3 w-full mt-auto">
                    <div class="flex justify-center">
                        <button hx-delete="${apiEndpoint}" hx-target="#${cardID}" 
                            hx-confirm="Are you sure you want to delete document '${instance[EntityId]}'? The consequences of this action cannot be undone."
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