export class APIRequestHandler {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.callbacks = {
            success: [
                () => {
                    console.log("callback success worked");
                },
            ],
            failed: [
                () => {
                    console.log("callback failed worked");
                },
            ],
        };
    }

    async request(method, endpoint, options = {}, callbacks = {}) {
        this.callbacks = { ...this.callbacks, ...callbacks };
        let url = `${this.baseURL}${endpoint}`;
        let config = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        };

        if (method === "GET" && options.params) {
            const queryString = new URLSearchParams(options.params).toString();
            url += `?${queryString}`;
        }

        if (method === "POST" && options.body) {
            if (options.body instanceof FormData) {
                console.log(config);

                delete config.headers["Content-Type"];
                config.body = options.body;
            } else {
                config.body = createFormData(options.body);
            }
        }

        console.log(config);

        try {
            const response = await fetch(url, config);
            const text = await response.text();
            const isJSON = response.headers
                .get("content-type")
                ?.includes("application/json");

            if (isJSON) {
                const data = JSON.parse(text);
                return this.handleJSONResponse(data);
            } else {
                console.error("Response is not JSON:", text);
                return false;
            }
        } catch (error) {
            console.error("Fetch error:", error);
            return false;
        }
    }

    /**
     * generate FormData object based on a reguler Object
     *
     * @param {Object} obj object that has to be used to create form
     * @returns {FormData}
     */
    createFormData(obj) {
        const formData = new FormData();
        Object.keys(obj).forEach((key) => {
            formData.append(key, obj[key]);
        });
        return formData;
    }

    /**
     * hanle the custom response protocol
     *
     * @param {Object} data response object
     * @returns {any|false}
     */
    handleJSONResponse(data) {
        if (data.status === "success") {
            this.#runCallbacks("success", data.results, 1);
            return data.results || true; // success toast if needed
        } else if (data.status === "failed") {
            if (Array.isArray(data.errors)) {
                Core.toast.show("error", "Errors occuerd : " + data.errors.length);
                console.log(data.errors);
            } else if (data.error) {
                Core.toast.show("error", "Error occured : " + data.error);
                console.log(data.error);
            } else {
                Core.toast.show("error", "API Error"); // error toast
                console.log(data);
            }
            this.#runCallbacks("failed");
            return false;
        } else {
            console.error("Unexpected JSON response:", data);
            this.#runCallbacks("failed");
            return false;
        }
    }

    /**
     * run the callback functions list based on action type
     *
     * @param {string} name name of the action type
     * @param {any} arugs data that will be passed as the arguments to the functions
     */
    #runCallbacks(name, arugs = null) {
        this.callbacks[name].forEach((func) => {
            func(arugs);
        });
    }

    async get(endpoint, params) {
        return await this.request("GET", endpoint, { params });
    }

    async post(endpoint, body) {
        return await this.request("POST", endpoint, { body });
    }
}
