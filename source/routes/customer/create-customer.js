export default function createCustomerComponent(request) {

    return (/*HTML*/`
        <form hx-put="/api/v1/customer" hx-trigger="submit" class="relative flex flex-col" id="customer-creation"
            hx-target="#customers-list" hx-swap="afterbegin">
            <div>
                <div class="form-group flex-grow">
                    <!--  -->
                    <h4 class="default text-right">Customer identity</h4><div></div>
                    <!-- ID -->
                    <label class="default" for="customer-id">Customer ID:</label>
                    <input class="default cursor-not-allowed" id="customer-id" value="will be created automatically" disabled>
                    <!-- Name -->
                    <label class="default" for="customer-name">Name:</label>
                    <input class="default" id="customer-name" name="name" type="text" placeholder="John Doe" required>
                    <!--  -->
                    <h4 class="default text-right">Contact information</h4><div></div>
                    <!-- Phone Number -->
                    <label class="default" for="customer-phone-number">phone number:</label>
                    <input class="default"  id="customer-phone-number" type="text" name="phone" placeholder="+31 6 12 34 56 78" required>
                    <!-- Email -->
                    <label class="default" for="customer-email">email:</label>
                    <input class="default"  id="customer-email" type="text" name="email" placeholder="me@example.com" required>
                    <!--  -->
                    <h4 class="default text-right">Address information</h4><div></div>
                    <!-- Street (primary) -->
                    <label class="default" for="customer-street1">Street 1:</label>
                    <input class="default" type="text" id="customer-street1" name="street1" placeholder="myLane 1" required>
                    <!-- Street (secondary) -->
                    <label class="default" for="customer-street2">Street 2:</label>
                    <input class="default" id="customer-street2" type="text" name="street2" placeholder="myStreet 1">
                    <!-- Zip Code -->
                    <label class="default" for="customer-zip">zip code:</label>
                    <input class="default" id="customer-zip" type="text" name="zip" placeholder="1234AB" required>
                    <!-- City -->
                    <label class="default" for="customer-city">city:</label>
                    <input class="default" id="customer-city" type="text" name="city" placeholder="Amsterdam" required>
                    <!-- Country -->
                    <label class="default" for="customer-country">country:</label>
                    <input class="default" id="customer-country" type="text" name="country" placeholder="The Netherlands" required>
                </div>
            </div>
            <div class="grid grid-cols-1 w-full mt-auto"> 
                <div class="flex justify-center mt-6">
                    <button type="submit" class="default confirm">
                        <svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
	                        <path class="fill-inherit" d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                        Create
                    </button> 
                </div>
            </div>
        </form>
    `);
}


// <form hx-put="/api/v1/customer" hx-target="#customers-list" hx-trigger="submit" hx-swap="afterbegin"
// >
// <div class="form-group">
//     <label for="customer-name">Customer Name:</label>
//     <input type="text" id="customer-name" name="name" placeholder="John Doe" required>
// </div>
// <div class="form-group">
//     <label for="customer-phone-number">Customer phone number:</label>
//     <input type="text" id="customer-phone-number" name="phone" placeholder="">
// </div>
// <div class="form-group">
//     <label for="customer-email">Customer email:</label>
//     <input type="text" id="customer-email" name="email" placeholder="" required>
// </div>
// <div class="form-group">
//     <label for="customer-street1">Customer Street 1:</label>
//     <input type="text" id="customer-street1" name="street1" placeholder="" required>
// </div>
// <div class="form-group">
//     <label for="customer-street2">Customer Street 2:</label>
//     <input type="text" id="customer-street2" name="street2" placeholder="myStreet 1">
// </div>
// <div class="form-group">
//     <label for="customer-zip">Customer zip code:</label>
//     <input type="text" id="customer-zip" name="zip" placeholder="1234AB" required>
// </div>
// <div class="form-group">
//     <label for="customer-city">Customer city:</label>
//     <input type="text" id="customer-city" name="city" placeholder="Amsterdam" required>
// </div>
// <div class="form-group">
//     <label for="customer-country">Customer country:</label>
//     <input type="text" id="customer-country" name="country" placeholder="The Netherlands" required>
// </div>
// <div class="form-group">
//     <button type="submit">Create</button>
// </div>
// </form>