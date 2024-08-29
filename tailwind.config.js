/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./source/{utilities/responds,routes}/**/*.{js,ejs,html}",
    ], 
    theme: { 
        extend: {
            colors: {
                lightPrimary : "#E8D8E7",
                darkPrimary : "#A96DA3"
            },
            backgroundColor : {
                lightPrimary : "#E8D8E7",
                darkPrimary : "#694873",
                unknown: "#A96DA3"
            }
        }
    },
    plugins: [ ],
}

// pretty green : #496F5D