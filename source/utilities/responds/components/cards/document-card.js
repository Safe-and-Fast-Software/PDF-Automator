"use-strict";

import { EntityId } from "redis-om";

import { repository as userRepository } from "#source/utilities/database/schemas/user.js"
import { repository as customerRepository } from "#source/utilities/database/schemas/customer.js"
import { repository as templateRepository } from "#source/utilities/database/schemas/template.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export default async function documentCardComponent(document) {

  const apiEndpoint = `/api/v1/document/by-id/${document[EntityId]}`;
  const cardID = `document-${document[EntityId]}`;
  const updateRespondsID = `${cardID}-update-responds`;
  const clearTextAfter3Seconds = ((/*JS*/`
    setTimeout(() => {
      document.querySelector('#${updateRespondsID}').innerHTML = '';
    }, 3000);
  `).replace(" ", ""));

  let userOptions = "";
  /* Creating the HTML required for the options. */ {
      const instance = await userRepository.fetch(document.userID);
      if ( Object.keys(instance).length === 0 ) userOptions = ( userOptions + /*html*/`
        <option value="${document.userID}" selected>Deleted User</option>`
      ); 

      const users = await userRepository.search().sortAscending("name").return.all();
      for ( const index in users ) {
        const selected = ( users[index][EntityId] === document.userID ? "selected" : "" )
        userOptions = ( userOptions + /*html*/`
          <option value="${users[index][EntityId]}" ${selected}>${users[index].name}</option>`
        ); 
      }
  }

  let customerOptions = "";
  /* Creating the HTML required for the options. */ {
    const instance = await customerRepository.fetch(document.customerID);
    if ( Object.keys(instance).length === 0 ) customerOptions = ( customerOptions + /*html*/`
      <option value="${document.customerID}" selected>Deleted Customer</option>`
    ); 

    const customers = await customerRepository.search().sortAscending("name").return.all();
    for ( const index in customers ) {
      const selected = ( customers[index][EntityId] === document.customerID ? "selected" : "" )
      customerOptions = ( customerOptions + /*html*/`
        <option value="${customers[index][EntityId]}" ${selected}>${customers[index].name}</option>`
      ); 
    }
  }
  
  let templateOptions = "";
  /* Creating the HTML required for the options. */ {
      const instance = await templateRepository.fetch(document.templateID);
      if ( Object.keys(instance).length === 0 ) templateOptions = ( templateOptions + 
        /*html*/`<option value="${document.templateID}" selected>Deleted Template</option>`
      ); 
      
      const templates = await templateRepository.search().sortAscending("name").return.all();
      for ( const index in templates ) {
        const selected = ( templates[index][EntityId] === document.templateID ? "selected" : "" )
        templateOptions = ( templateOptions + /*html*/`
          <option value="${templates[index][EntityId]}" ${selected}>${templates[index].name}</option>`
        ); 
      }
  }

  return (/*HTML*/`
    <li id="${cardID}" class="list-none w-full border border-gray-300 rounded-lg">
      <form hx-post="${apiEndpoint}" hx-trigger="submit" class="relative flex flex-col p-4" hx-on::after-request="${clearTextAfter3Seconds}" hx-target="#${updateRespondsID}">
        <div>
          <div class="form-group flex-grow">
            <h4 class="default text-right">Document identity</h4><div></div>
            <!-- ID -->
            <label for="${cardID}-id" class="default">document ID:</label>
            <input  id="${cardID}-id" class="default cursor-not-allowed" 
                value="${document[EntityId]}" disabled>
            <!-- User -->
            <label for="${cardID}-created-by" class="default">Created by user:</label>
            <select id="${cardID}-created-by" class="default" name="userID" required>
              <optgroup label="Users">${userOptions}</optgroup>
            </select>
            <!-- Customer -->
            <label for="${cardID}-created-for" class="default">Created for customer:</label>
            <select id="${cardID}-created-for" class="default" name="customerID" required>
              <optgroup label="Customers">${customerOptions}</optgroup>
            </select>
            <!-- Template -->
            <label for="${cardID}-created-with" class="default">Created with template:</label>
            <select id="${cardID}-created-with" class="default" name="templateID" required>
              <optgroup label="Templates">${templateOptions}</optgroup>
            </select>
            <!-- Date -->
            <label for="${cardID}-created-on" class="default">Created on:</label>
            <input  id="${cardID}-created-on" class="default cursor-not-allowed" value="${document?.dateCreated.toISOString()}" name="dateCreated" readonly>
          </div>
          <div id="${updateRespondsID}" class="m-4 font-semibold"></div>
        </div>
        <div class="p-3 grid grid-cols-3 w-full mt-auto">
          <div class="flex justify-center">
            <button hx-delete="${apiEndpoint}" hx-target="#${cardID}" hx-confirm="Are you sure you want to delete document '${document[EntityId]}'? The consequences of this action cannot be undone." hx-trigger="click" hx-swap="delete" class="default delete">
              <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path class="fill-inherit" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
              Delete
            </button>
          </div>
          <div class="flex justify-center">
            <button hx-get="${apiEndpoint}" hx-trigger="click" hx-swap="outerHTML" hx-target="#${cardID}" class="default cancel">
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
    </li>`
  );
}