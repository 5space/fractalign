/**
 * Utility functions to make API requests.
 * By importing this file, you can use the provided get and post functions.
 * You shouldn't need to modify this file, but if you want to learn more
 * about how these functions work, google search "Fetch API"
 *
 * These functions return promises, which means you should use ".then" on them.
 * e.g. get('/api/foo', { bar: 0 }).then(res => console.log(res))
 */

// ex: formatParams({ some_key: "some_value", a: "b"}) => "some_key=some_value&a=b"
function formatParams(params) {
    // iterate of all the keys of params as an array,
    // map it to a new array of URL string encoded key,value pairs
    // join all the url params using an ampersand (&).
    return Object.keys(params)
        .map((key) => key + "=" + encodeURIComponent(params[key]))
        .join("&");
}

// convert a fetch result to a JSON object with error handling for fetch and json errors
function convertToJSON(res) {
    if (!res.ok) {
        throw `API request failed with response status ${res.status} and text: ${res.statusText}`;
    }

    return res
        .clone() // clone so that the original is still readable for debugging
        .json() // start converting to JSON object
        .catch((error) => {
            // throw an error containing the text that couldn't be converted to JSON
            return res.text().then((text) => {
                throw `API request's result could not be converted to a JSON object: \n${text}`;
            });
        });
}

// Helper code to make a get request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
export function get(endpoint, params = {}) {
    const fullPath = endpoint + "?" + formatParams(params);
    return fetch(fullPath)
        .then(convertToJSON)
        .catch((error) => {
            // give a useful error message
            throw `GET request to ${fullPath} failed with error:\n${error}`;
        });
}

// Helper code to make a post request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
export function post(endpoint, params = {}) {
    return fetch(endpoint, {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(params),
    })
        .then(convertToJSON) // convert result to JSON object
        .catch((error) => {
            // give a useful error message
            throw `POST request to ${endpoint} failed with error:\n${error}`;
        });
}

export function lerpColor(a, b, amount) {
    var rr = Math.round(a.r + amount * (b.r - a.r));
    var rg = Math.round(a.g + amount * (b.g - a.g));
    var rb = Math.round(a.b + amount * (b.b - a.b));
    return {r: rr, g: rg, b: rb};
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
export function rgbToHex(c) {
    return "#" + componentToHex(c.r) + componentToHex(c.g) + componentToHex(c.b);
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}