import Core from "../../Core";

/**
 * RequestManager class is responsible for managing all requests made by the application.
 */
export default class RequestManager {
    /**
     * @typedef {Function} ResponseHandlerProtocol
     * @property {function} handle - The function to handle the response.
     */
    #responseHandlerProtocol = null;
    static domain = "";

    /**
     * @param {string} domain - The domain to use for the request.
     *
     */
    constructor(domain) {
        this.domain = domain ?? Core.get_domain();
    }

    /**
     * Sets the domain.
     * @param {string} domain - The domain to set.
     * @returns {void}
     */
    static setDomain(domain) {
        this.domain = domain;
    }

    /**
     * Sets the domain.
     * @param {string} domain - The domain to set.
     * @returns {void}
     */
    static setDomain(domain) {
        this.domain = domain;
    }

    /**
     * @typedef {Object} RequestOptions
     * @property {boolean} [showLoading = false] - Whether to show the loading message.
     * @property {boolean} [wait = false] - Whether to wait for the request to complete.
     * @property {boolean} [useMainOrigin = false] - Whether to use the main origin.
     * @property {object} [headers = {}] - The headers to use for the request.
     * @property {("json"|"text"|"formData")} [requestType = "json"] - The type of request to send.
     * @returns {any|null} - The response from the request or null if the request failed.
     */

    /**
     * @typedef {Object} ResponseOptions
     * @property {boolean} [showToast = false] - Whether to show the toast message.
     * @property {("json"|"text"|"blob"|"arrayBuffer")} [responseType = "json"] - The type of response to return.
     * @property {boolean} [ignoreProtocol = false] - Whether to ignore the custom response protocol.
     * @property {function} [onSuccess] - The function to call on success.
     * @property {function} [onError] - The function to call on error.
     * @returns {any|null} - The response from the request or null if the request failed.
     */

    /**
     * @typedef {Object} AllOptions
     * @property {boolean} [showLoading = false] - Whether to show the loading message.
     * @property {boolean} [wait = false] - Whether to wait for the request to complete.
     * @property {boolean} [useMainOrigin = false] - Whether to use the main origin.
     * @property {object} [headers = {}] - The headers to use for the request.
     * @property {boolean} [showToast = false] - Whether to show the toast message.
     * @property {("json"|"text"|"blob"|"arrayBuffer")} [responseType = "json"] - The type of response to return.
     * @property {boolean} [ignoreProtocol = false] - Whether to ignore the custom response protocol.
     * @property {function} [onSuccess] - The function to call on success.
     * @property {function} [onError] - The function to call on error.
     * @property {("json"|"text"|"formData")} [requestType = "json"] - The type of request to send.
     * @returns {any|null} - The response from the request or null if the request failed.
     */

    // default request options
    static #defaultRequestOptions = {
        showLoading: false,
        wait: false,
        useMainOrigin: false,
        requestType: "json",
        headers: {},
    };

    // default response options
    static #defaultResponseOptions = {
        showToast: false,
        responseType: "json",
        ignoreProtocol: false,
        onSuccess: (data) => {
            // console.log(data);
        },
        onError: (error) => {
            // console.log(error);
        },
    };

    /**
     *
     * @param {string} url - The URL to send the request to.
     * @param {object} data - The data to send with the request.
     * @param {("GET"|"POST"|"PUT"|"DELETE"|"HEAD")} method - The method to use for the request.
     * @param {RequestOptions} request_options - The options to use for the request.
     * @param {ResponseOptions} response_options - The options to use for the response.
     *
     * @returns {Array|Object|string|boolean} - The response from the request.
     */
    async send(
        url,
        data,
        method = "GET",
        request_options = {},
        response_options = {}
    ) {
        // set request options
        request_options = {
            ...RequestManager.#defaultRequestOptions,
            ...request_options,
        };

        // set response options
        response_options = {
            ...RequestManager.#defaultResponseOptions,
            ...response_options,
        };

        // create the query string
        let query_string =
            (method === "GET" || method === "HEAD") && data
                ? Object.keys(data)
                      .map((key) => `${key}=${data[key]}`)
                      .join("&")
                : null;

        // if the method is not GET or HEAD and the data is an object, add the body to the request options
        if (
            method !== "GET" &&
            method !== "HEAD" &&
            data &&
            data instanceof Object
        ) {
            if (request_options.requestType === "json") {
                request_options.body = JSON.stringify(data);
            } else if (request_options.requestType === "formData") {
                request_options.body = this.buildFormDataFromObject(data);
            } else {
                request_options.body = data;
            }
        }

        // set headers
        let content_type = null;
        switch (request_options.requestType) {
            case "json":
                content_type = "application/json";
                break;
            case "text":
                content_type = "text/plain";
                break;

            case "formData":
                break;

            default:
                content_type = "application/json";
                break;
        }

        //   auth token
        const token = (await Core.LSM.getItem("token")) ?? "";
        const csrf_token_element = document.querySelector(
            'meta[name="csrf-token"]'
        );

        let csrf_token = "";
        if (csrf_token_element) {
            csrf_token = csrf_token_element.getAttribute("content");
        }

        request_options.headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRF-TOKEN": csrf_token,
            ...request_options.headers,
        };

        if (content_type) {
            request_options.headers["Content-Type"] = content_type;
        }

        // create the request options
        const modified_request_options = {
            method: method,
            headers: request_options.headers,
            ...request_options,
        };

        // build URL
        const URL =
            (request_options.useMainOrigin ? this.domain : "") +
            url +
            (query_string ? `?${query_string}` : "");

        // send the request
        let response = null;
        const RM = this;

        try {
            response = await fetch(URL, modified_request_options);

            if (!response.ok) {
                await badRequestHandler(response, response_options);
                return null;
            }

            if (response.status === 299) {
                await badRequestHandler(response, response_options);
                return null;
            }
        } catch (error) {
            console.log("error");
            await badRequestHandler(error, response_options);
            return;
        }

        async function badRequestHandler(response, response_options) {
            if (
                response_options.onError &&
                typeof response_options.onError === "function"
            ) {
                response_options.onError(response);
            }

            try {
                const response_data = await response.json();
                console.log(response_data);
                RM.responseHandler(response_data, response_options);
            } catch (error) {
                RM.responseHandler(response, response_options);
            }
        }

        // get the response data
        const response_data =
            response_options.responseType === "json"
                ? this.responseHandler(await response.json(), response_options)
                : response_options.responseType === "text"
                ? await response.text()
                : response_options.responseType === "blob"
                ? await response.blob()
                : await response.text();

        return response_data;
    }

    /**
     *
     * @param {string} url - The URL to send the request to.
     * @param {object} data - The data to send with the request.
     * @param {AllOptions} options - The options to use for the request.
     *
     * @returns {Array|Object|string|boolean} - The response from the request.
     */
    async get(url, data, options = null) {
        return await this.send(
            url,
            data,
            "GET",
            options ?? RequestManager.#defaultRequestOptions,
            options ?? RequestManager.#defaultResponseOptions
        );
    }

    /**
     *
     * @param {string} url - The URL to send the request to.
     * @param {object} data - The data to send with the request.
     * @param {AllOptions} options - The options to use for the request.
     *
     * @returns {Array|Object|string|boolean} - The response from the request.
     */
    async post(url, data, options = null) {
        return await this.send(
            url,
            data,
            "POST",
            options ?? RequestManager.#defaultRequestOptions,
            options ?? RequestManager.#defaultResponseOptions
        );
    }

    /**
     *
     * @param {string} url - The URL to send the request to.
     * @param {object} data - The data to send with the request.
     * @param {AllOptions} options - The options to use for the request.
     *
     * @returns {Array|Object|string|boolean} - The response from the request.
     */
    async put(url, data, options = null) {
        return await this.send(
            url,
            data,
            "PUT",
            options ?? RequestManager.#defaultRequestOptions,
            options ?? RequestManager.#defaultResponseOptions
        );
    }

    /**
     *
     * @param {string} url - The URL to send the request to.
     * @param {object} data - The data to send with the request.
     * @param {AllOptions} options - The options to use for the request.
     *
     * @returns {Array|Object|string|boolean} - The response from the request.
     */
    async delete(url, data, options = null) {
        return await this.send(
            url,
            data,
            "DELETE",
            options ?? RequestManager.#defaultRequestOptions,
            options ?? RequestManager.#defaultResponseOptions
        );
    }

    /**
     * Builds a FormData object from an object.
     * @param {object} data - The object to build the FormData from.
     * @returns {FormData} - The FormData object.
     */
    buildFormDataFromObject(data) {
        if (!(data instanceof Object)) {
            return null;
        }

        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }

        return formData;
    }

    /**
     * Handles the response.
     * @param {object} response - The response to handle.
     * @returns {any} - The handled response.
     */
    responseHandler(response, response_options) {
        return this.#handleResponse(response, response_options);
    }

    /**
     *
     * Handles the response by protocol.
     * @param {object} data - The response to handle.
     * @param {ResponseOptions} response_options - The options to use for the response.
     * @returns {object} - The handled response.
     */
    #handleResponse(response, response_options) {
        let handled_response = response;
        if (!response_options.ignoreProtocol) {
            handled_response = this.#responseHandlerProtocol
                ? this.#responseHandlerProtocol(response, response_options)
                : this.#defaultResponseHandler(response, response_options);
        }
        return handled_response;
    }

    /**
     * Default response handler.
     * @param {object} response - The response to handle.
     * @param {ResponseOptions} response_options - The options to use for the response.
     * @returns {object} - The handled response.
     */
    #defaultResponseHandler = (data, response_options) => {
        if (data.status === "success") {
            if (response_options.showToast) {
                Core.toast.show(
                    "success",
                    data.message ?? "Request Successful! ✅"
                );
            }

            if (
                response_options.onSuccess &&
                typeof response_options.onSuccess === "function"
            ) {
                response_options.onSuccess(data);
            }
            return data.results ?? null;
        } else if (data.status === "failed") {
            if (response_options.showToast) {
                Core.toast.show(
                    "error",
                    data.message ?? data.errors ?? "Request Failed! ⚠️"
                );
            }

            if (
                response_options.onError &&
                typeof response_options.onError === "function"
            ) {
                response_options.onError(data.errors);
            }
            return null;
        } else {
            if (response_options.showToast) {
                Core.toast.show("error", "Request Failed! ⚠️"); // Error Code: 1211
            }
            response_options.onError(data);
            return null;
        }
    };

    /**
     * Sets the response handler protocol.
     * @param {ResponseHandlerProtocol} responseHandlerProtocol - The response handler protocol to use for the request.
     * @returns {void}
     */
    setResponseHandlerProtocol(responseHandlerProtocol) {
        this.#responseHandlerProtocol = responseHandlerProtocol;
    }

    /**
     * Unsets the response handler protocol.
     * @returns {void}
     */
    unsetResponseHandlerProtocol() {
        this.#responseHandlerProtocol = null;
    }
}
