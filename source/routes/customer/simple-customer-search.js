export default function simpleCustomerSearch(request) {
    return (/*HTML*/`
        <form hx-get="/api/v1/customer/all" hx-target="#customers-list" hx-trigger="submit" 
            class="w-full flex" id="customer-search-form">
            <label for="customer-name" class="inline-block" ><p class="flex justify-center">Search:</p></label>
            <input  id="customer-name" class="w-full mx-3 border-gray-300 rounded-lg border p-2"
                type="text" name="name" placeholder="Search for a customer by name...">
            <button type="submit">
                <svg class="fill-black aspect-square h-11 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path class="fill-inherit" d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
            </button>
        </form> 
    `);
}

// <input class="inline-block flex-1 p-1 border-current border rounded-md w-full m-0"
//     type="search" name="name" placeholder="Begin Typing To Search Users..." 
//     hx-get="/api/v1/customer/all" hx-trigger="input changed delay:500ms, search" 
//     hx-target="#customers-list" hx-indicator=".htmx-indicator"> 