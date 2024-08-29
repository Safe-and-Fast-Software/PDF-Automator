import linkComponent from "./link.js";

const icons = {
    home : (/*HTML*/`
        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path class="fill-inherit" d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
        </svg>
    `), profile : (/*HTML*/`
        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path class="fill-inherit" d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
        </svg>
    `), login : (/*HTML*/`
        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path class="fill-inherit" d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
        </svg>
    `), logout : (/*HTML*/`
        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path class="fill-inherit" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
        </svg>
    `), customers : (/*HTML*/`
        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path class="fill-inherit" d="M412-168q45-91 120-121.5T660-320q23 0 45 4t43 10q24-38 38-82t14-92q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 45 11.5 86t34.5 76q41-20 85-31t89-11q32 0 61.5 5.5T500-340q-23 12-43.5 28T418-278q-12-2-20.5-2H380q-32 0-63.5 7T256-252q32 32 71.5 53.5T412-168Zm68 88q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM380-420q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T440-560q0-25-17.5-42.5T380-620q-25 0-42.5 17.5T320-560q0 25 17.5 42.5T380-500Zm280 120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM480-480Z" />
        </svg>
    `), documents : (/*HTML*/`
        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path class="fill-inherit" d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
        </svg>
    `), 
};

export const links = [
    { text : `${icons.home} Home`,           link : "/",             hotReload : true, }, 
    
    // Items to show when logged in:
    { text : `${icons.profile} Profile`,     link : "/profile",      hotReload : true,   loginRequired : true  }, 
    { text : `${icons.customers} Customers`,   link : "/customer",     hotReload : true,   loginRequired : true  }, 
    { text : `${icons.documents} Documents`, link : "/document",     hotReload : true,   loginRequired : true  }, 
    { text : `${icons.logout} Log out`,      link : "/auth/logout",  hotReload : false,  loginRequired : true  }, 
    
    // Items to show when logged out:
    { text : `${icons.login} Log in`,        link : "/auth/login",   hotReload : false,  loginRequired : false }, 
];

export default function navigationBarComponent(request) {
    
    const navigationBarLinkComponents = (links
        .map( (link) => navigationBarLinkComponent(request, link) )
        .join("")
        .replace(/^\s*[\r\n]/gm, '')
        .trim()
    );

    return (/*HTML*/`
        <nav class="flex w-full h-fit m-2">
            <ul class="w-full h-fit flex m-0 p-0 justify-between text-white">
                ${navigationBarLinkComponents}
            </ul>
        </nav>`
    );
}

export function navigationBarLinkComponent(request, navBarLink) {

    const noHTML = "";

    /* checking if it's supposed to exist, if not, skip it. */ {
        const loginRequired = navBarLink?.loginRequired === true;
        const loggedIn = request.isAuthenticated() === true;
        if (navBarLink?.loginRequired !== undefined) {
            if (( loginRequired && (! loggedIn) )) return noHTML;
            if (( (! loginRequired) && loggedIn )) return noHTML;
        }
    }

    const innerHTML = (/*HTML*/`<span class="text-white">${navBarLink.text}</span>`);
    const link = ( navBarLink?.hotReload
        ? linkComponent(innerHTML, navBarLink.link)
        : /*HTML*/`<a href="${navBarLink.link}">${innerHTML}</a>`
    );

    return (/*HTML*/`
        <li class="inline-block list-none flex-1 text-center">${link}</li>
    `);
}
