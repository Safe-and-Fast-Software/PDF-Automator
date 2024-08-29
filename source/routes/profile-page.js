export default function profilePage(request) {
    return (/*HTML*/`
        <div class="absolute bottom-4 top-4 left-4 right-4 border xl:border-none border-gray-300 rounded-lg p-3 xl:p-0">
            <div class="xl:grid xl:grid-cols-2 xl:gap-4 xl:h-full">
                <section class="xl:h-full xl:w-full xl:border xl:rounded-md xl:border-gray-300 xl:p-3" 
                    id="profile-explanation">
                    <h1 class="m-0">Profile</h1>
                    <p>
                        This is all the application has saved about you. When you joined, some of these fields 
                        get filled in by Oauth provider. If you want to change any of them you can do so below.
                        Just know that changing them here won't change them with your Oauth provider. Your
                        information is used when creating documents. It get's filled in automatically on creation.
                    </p>  
                </section>
                <section class="mt-3 xl:mt-0 xl:h-full xl:w-full xl:border xl:rounded-md xl:border-gray-300 xl:p-3"
                    id="profile-section">
                    ${profileFormComponent(request)}
                </section>
            </div>
        </div>
    `);
}

export function profileFormComponent(request) {
    return (/*HTML*/`
        <form id="user-${request?.session?.passport?.user}-profile-form"  class="relative flex flex-col"
            hx-trigger="submit" hx-post="/api/v1/user/by-id/${request?.session?.passport?.user}" 
            hx-target="#update-results">            
            <div class="flex-1">
                <div class="form-group">
                    <!--  -->
                    <h4 class="default text-right">Your identity</h4><div></div>
                    <!-- ID -->
                    <label class="default" for="customer-id">User ID:</label>
                    <input class="default cursor-not-allowed" id="customer-id" value="${request?.session?.passport?.user??''}" disabled>
                    <!-- Name  -->
                    <label class="default" for="user-name">Name:</label>
                    <input class="default" id="user-name" name="name" type="text" value="${request?.user?.name??''}" required>
                    <!--  -->
                    <h4>Contact information</h4><div></div>
                    <!-- Phone Number -->
                    <label class="default" for="user-phone-number">phone number:</label>
                    <input class="default"  id="user-phone-number" type="text" name="phone" value="${request?.user?.phone??''}" required>
                    <!-- Email -->
                    <label class="default" for="user-email">email:</label>
                    <input class="default"  id="user-email" type="text" name="email" value="${request?.user?.email??''}" required>
                    <!--  -->
                    <h4>Address information</h4><div></div>
                    <!-- Street 1 -->
                    <label class="default" for="user-street1">Street 1:</label>
                    <input class="default" type="text" id="user-street1" name="street1" value="${request?.user?.street1??''}" required>
                    <!-- Street 2 -->
                    <label class="default" for="user-street2">Street 2:</label>
                    <input class="default" id="user-street2" type="text" name="street2" value="${request?.user?.street2??''}" >
                    <!-- Zip Code -->
                    <label class="default" for="user-zip">zip code:</label>
                    <input class="default" id="user-zip" type="text" name="zip" value="${request?.user?.zip??''}" required>
                    <!-- City -->
                    <label class="default" for="user-city">city:</label>
                    <input class="default" id="user-city" type="text" name="city" value="${request?.user?.city??''}" required>
                    <!-- Country -->
                    <label class="default" for="user-country">country:</label>
                    <input class="default" id="user-country" type="text" name="country" value="${request?.user?.country??''}" required>
                </div>
                <p class="font-bold my-4" id="update-results"></p>
            </div>
            <div class="p-3 grid grid-cols-2 w-full mt-auto">
                    <div class="flex justify-center">
                        <button hx-get="/profile/htmx/form" hx-trigger="click" hx-swap="outerHTML"
                            hx-target="#user-${request?.session?.passport?.user}-profile-form" class="default cancel">
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
    `);
}