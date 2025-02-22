import Core from "../Core";
import PageManager from "./PageManager";

/**
 * @description
 * AdminPageManager is the manager for the admin sign in page.
 *
 * @extends {PageManager}
 * @author janith nirmal
 * @version {1.0.0}
 */
export default class AdminPageManager extends PageManager {
    /**
     * @description
     * constructor for the AdminPageManager class.
     *
     * @param {string} id - the id of the page container.
     */
    constructor() {
        super("admin-dashboard");
    }

    /**
     * @description
     * load the page data that are needed for the page to function.
     *
     * @abstract
     */
    async load() {
        this.data = {
            title: "Admin Dashboard",
            description: "Admin Dashboard Page",
        };
    }

    /**
     * @description
     * initialize the page features and functionalities.
     *
     * @abstract
     */
    init() {
        this.getAdmin();
    }

    /**
     * @description
     * set the listners for the page
     */
    setListners() {}

    /**
     * @description
     * actions for the page that will be called after the page is initialized.
     *
     * @abstract
     */
    actions() {}

    /**
     * @description
     * get admin data
     */
    async getAdmin() {
        const response = await Core.RM.get(
            "/admin/session",
            {},
            {
                requestType: "json",
                responseType: "json",
            }
        );
        Core.UIM.setFields("adminProfile", response);
    }

    /**
     * @description
     * log out the admin
     */
    static async logout() {
        const response = await Core.RM.post(
            "/admin/logout",
            {},
            {
                requestType: "json",
                responseType: "json",
                onSuccess: () => {
                    window.location.href = "/admin";
                },
            }
        );
    }
}
