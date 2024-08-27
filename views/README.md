# Views, Pages, and Components
In this document I'll be trying to explain how the server deals with requests.

## Getting a document on the screen
The way the server sends responds is by first checking if it's an HTMX request. There is no need to completely throw a page, hot reloading is much better. So it sends the `main.ejs` file if the user isn't making an HTMX request. That loads in very fast as it's a super small file. That file loads the HTMX script that sees the URL that the page must load in the `<main>` tag.