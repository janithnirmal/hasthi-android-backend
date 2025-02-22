import Core from "../../../Core";
import Service from "./Service";

/**
 * @description
 * SearchService is a service that provides search functionality for the application.
 */
export default class SearchService extends Service {
    /**
     * @description
     * the routes that are available for the application
     * @type {string[]}
     */
    routes = [];

    /**
     * @description
     * constructor for the SearchService
     * @param {string[]} routes - the routes that are available for the application
     */
    constructor(routes = []) {
        super();
        this.routes = routes;
    }

    /**
     * search filters
     * @type {object}
     */
    filters = {};

    init() {}

    /**
     * @description
     * search for data from the server
     * @param {string} uri - the uri to search from
     * @param {object} filters - the filters to use for the search
     * @returns {Promise<any>} - the response from the search
     */
    async search(entity, filters = null) {
        if (!this.routes.includes(entity)) {
            Core.debugLog(
                `SearchService: ${entity} is not a valid API route for ${Core.config.project_name}`
            );
            return;
        }

        const functionName = `load_${entity}`;
        if (typeof this[functionName] === "function") {
            return await this[functionName](filters);
        } else {
            return await this.load_data(entity, filters);
        }
    }

    /**
     * @description
     * fetch data from the server
     * @param {string} uri - the uri to fetch from
     * @param {object} options - the options to use for the fetch
     * @returns {Promise<any>} - the response from the fetch
     */
    async fetch(uri, data) {
        return await Core.RM.get(uri, data, {
            responseType: "json",
            requestType: "json",
        });
    }

    // data loaders
    async load_products(filters = null) {
        const ENTITY = "products";
        this.filters[ENTITY] = filters ? filters : this.filters[ENTITY];
        return await this.fetch("/api/products", this.filters[ENTITY] ?? {});
    }

    async load_data(entity, filters = null) {
        return await this.fetch(`/api/${entity}`, filters ?? {});
    }
}
