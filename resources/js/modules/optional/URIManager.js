export default class URIManager {
    constructor(uri = window.location.href) {
        this.uri = new URL(uri);
    }

    // Method to get the URI parts (path split into array)
    getURIParts() {
        return this.uri.pathname.split("/").filter(Boolean);
    }

    // Method to update the URI based on an array of parts
    updateURI(parts) {
        const newPath = "/" + parts.join("/");
        this.uri.pathname = newPath;
        return this.uri.toString();
    }

    // Method to get query parameters as an object
    getQueryParams() {
        const params = {};
        this.uri.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    // Method to update a query parameter (or add if it doesn't exist)
    updateQueryParam(key, value) {
        this.uri.searchParams.set(key, value);
        return this.uri.toString();
    }

    // Method to remove a query parameter
    removeQueryParam(key) {
        this.uri.searchParams.delete(key);
        return this.uri.toString();
    }

    // Method to return the current URI
    getCurrentURI() {
        return this.uri.toString();
    }

    // Method to replace the current window URL without reloading (if on the browser)
    replaceCurrentURI() {
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, this.uri.toString());
        }
    }

    // Method to add a hash to the URL
    setHash(hash) {
        this.uri.hash = hash;
        return this.uri.toString();
    }

    // Method to get the current hash
    getHash() {
        return this.uri.hash;
    }
}
