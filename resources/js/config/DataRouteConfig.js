/**
 * @description
 * DataRouteConfig is a class that provides the data routes for the application.
 */
export default class DataRouteConfig {
    /**
     * @description
     * the routes that are available for the application
     * @type {string[]}
     */
    static routes = [
        "products",
        "main-categories",
        "sub-categories",
        "users",
        "header-categories",
        "taxonomies",
        "promotions",
        "ui-primary-carousal",
        "product-taxonomies",
        "images",
        "variations",
        "variation-options",
        "stocks",
        "statuses",
        "orders",
        "order-items",
        "countries",
        "addresses",
        "roles",
        "conditions",
        "staff",
        "taxonomy-types",
        "stock-variations",
        "seo",
        "seo-type",
    ];

    /**
     * @description
     * get the data routes
     * @returns {string[]} - the data routes
     */
    static getDataRoutes() {
        return DataRouteConfig.routes;
    }
}
