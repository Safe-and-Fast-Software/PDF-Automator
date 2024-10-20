import { StatusCodes } from "http-status-codes";

const HTMX = ((
        process.env.NODE_ENV === "production" 
    ) ? { // Production HTMX package:
        url : "https://unpkg.com/htmx.org@2.0.2",
        integrity : "sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ"
    } : { // Development HTMX package:
        url : "https://unpkg.com/htmx.org@2.0.2/dist/htmx.js",
        integrity : "sha384-yZq+5izaUBKcRgFbxgkRYwpHhHHCpp5nseXp0MEQ1A4MTWVMnqkmcuFez8x5qfxr"
    }
);

const website = {
    title : "PDF Automator",
    description : (
        "With this free self hostable app you can automate the creation of PDFs using a GUI, or API. All for Free," +
        "forever. Check the GitHub page for more details."
    ),
    keywords : ""
};

/** sends the document base first if it's a request that wasn't made by HTMX. */
export default function loadBaseFirst(request, responds, next) {

    /* Sending the base document first if it's not an HTMX request for a partial */ {
        if (request.headers["hx-request"] === undefined) return ( responds
            .status(StatusCodes.OK)
            .type("text/html")
            .send(/*HTML*/`
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>${website.title}</title>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta name="darkreader-lock">
                        <meta name="keywords" content="${website.keywords}">
                        <meta name="description" content="${website.description}">
                        <meta property="og:title" content="${website.title}">
                        <meta property="og:description" content="${website.description}">
                        <meta property="og:image" content="/logo.svg">
                        <link href="/styles/tailwind.output.css" rel="stylesheet"> 
                        <script src="${HTMX.url}" integrity="${HTMX.integrity}" crossorigin="anonymous"></script>
                    </head>
                    <body class="flex flex-col m-0 min-h-screen p-2">
                        ${headerComponent(request)}
                        <main class="flex-1 flex flex-col rounded-xl p-4 overflow-auto relative" id="main" 
                            hx-get="${request.originalUrl}" hx-trigger="load">
                            If this is still here, even after a couple of seconds, then there was an error 
                            loading the actual content. Check the console, and server logs for more 
                            information about what happend. Possible problems might be that Java Script
                            is disabled, or the server can no longer be reached.
                        </main>
                        ${footerComponent(request)}
                    </body>
                </html>
            `)
        );
    }

    return next();
}

export function footerComponent(request) {
    
    const currentYear = new Date().getFullYear() 
    const copyrightString = ( `${currentYear}` === "2024" ? "2024" : `2024 - ${currentYear}` );
    
    return (/*HTML*/`
        <footer class="min-h-fit w-full p-4 block sm:grid sm:grid-cols-[auto_1fr]">
            <p class="text-white block sm:inline-block w-full sm:w-auto text-left "> 
                Copyright &copy; ${copyrightString} SAFS, all rights reserved.
            </p>
            <p class="text-white block sm:inline-block w-full sm:w-auto text-left sm:text-right"> 
                Made with <span class="text-red-600">&lt;3</span> by SAFS!
            </p>
        </footer>`
    );
}

import navigationBarComponent from "#source/utilities/responds/components/navigation/bar.js";

export function headerComponent(request) {
    return (/*HTML*/`
        <header class="sticky top-0 z-50 bg-black">
            ${navigationBarComponent(request)}
        </header>`
    );
}