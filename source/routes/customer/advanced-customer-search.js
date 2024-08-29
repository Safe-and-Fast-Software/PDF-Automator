export default function advancedCustomerSearchComponent(request) {
    return (/*HTML*/`
        <form hx-get="/api/v1/customer/all" hx-target="#customers-list" hx-trigger="submit" 
            class="relative flex flex-col" id="customer-search">
            <div>
                <div class="form-group flex-grow">
                    <!--  -->
                    <h4 class="default text-right">Customer identity</h4><div></div>
                    <!-- ID -->
                    <label class="default" for="customer-id">Customer ID:</label>
                    <input class="default cursor-not-allowed" id="customer-id" value="will be created automatically" disabled>
                    <!-- Name -->
                    <label class="default" for="customer-name">Name:</label>
                    <input class="default" id="customer-name" name="name" type="text" placeholder="John Doe">
                    <!--  -->
                    <h4 class="default text-right">Contact information</h4><div></div>
                    <!-- Phone Number -->
                    <label class="default" for="customer-phone-number">phone number:</label>
                    <input class="default"  id="customer-phone-number" type="text" name="phone" placeholder="+31 6 12 34 56 78">
                    <!-- Email -->
                    <label class="default" for="customer-email">email:</label>
                    <input class="default"  id="customer-email" type="text" name="email" placeholder="me@example.com">
                    <!--  -->
                    <h4 class="default text-right">Address information</h4><div></div>
                    <!-- Street (primary) -->
                    <label class="default" for="customer-street1">Street 1:</label>
                    <input class="default" type="text" id="customer-street1" name="street1" placeholder="myLane 1">
                    <!-- Street (secondary) -->
                    <label class="default" for="customer-street2">Street 2:</label>
                    <input class="default" id="customer-street2" type="text" name="street2" placeholder="myStreet 1">
                    <!-- Zip Code -->
                    <label class="default" for="customer-zip">zip code:</label>
                    <input class="default" id="customer-zip" type="text" name="zip" placeholder="1234AB">
                    <!-- City -->
                    <label class="default" for="customer-city">city:</label>
                    <input class="default" id="customer-city" type="text" name="city" placeholder="Amsterdam">
                    <!-- Country -->
                    <label class="default" for="customer-country">country:</label>
                    <input class="default" id="customer-country" type="text" name="country" placeholder="The Netherlands">
                </div>
            </div>
            <div class="grid grid-cols-1 w-full mt-auto"> 
                <div class="flex justify-center mt-6">
                    <button type="submit" class="default confirm">
                        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        	<path class="fill-inherit" d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                        </svg>
                        Search
                    </button> 
                </div>
            </div>
        </form>
    `);
}
