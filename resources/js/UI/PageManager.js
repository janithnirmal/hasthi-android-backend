import Core from "../Core";
import UIManager from "../modules/core/UIManager";
import EventListnerManager from "../modules/optional/EventListnerManager";
import SearchService from "../modules/optional/services/SearchService";
import URIManager from "../modules/optional/URIManager";

/**
 * @description
 * PageManager is responsible for managing the pages in the application.
 * it handles the display of pages and special functionalities that are page specific.
 *
 * @extends Core
 *
 * all the core plugins are available to this class.
 */
export default class PageManager extends UIManager {
    /**
     * @typedef {Object} PageData
     * @property {string} title - the title of the page.
     * @property {string} description - the description of the page.
     */

    /** @abstract  @type {PageData} */
    data = {};

    /** @type {Core} */
    core = null;

    /** @type {EventListnerManager} */
    ELM = null;

    /**
     * @description
     * constructor for the PageManager class.
     *
     * @param {string} id - the id of the page container.
     */
    constructor(id) {
        super();
        this.ELM = new EventListnerManager();
        this.S = new SearchService();
        this.core = new Core();
        this.URIManager = new URIManager();

        console.log("Page Manager instatiated");
        this.pageId = id;

        this.#_init();
    }

    /**
     * @description
     * initialize the page manager.
     */
    async #_init() {
        this.page = document.getElementById(this.pageId);
        await this.load();
        this.init();
        this.setListners();
        this.#_init_listners();
        this.actions();
    }

    /**
     * @description
     * load the page.
     *
     * @abstract
     */
    async load() {
        throw new Error("Method 'load()' must be implemented.");
    }

    /**
     * @description
     * initialize the page
     *
     * @abstract
     */
    init() {
        throw new Error("Method 'init()' must be implemented.");
    }

    /**
     * @description
     * register the actions for the page.
     *
     * @abstract
     */
    actions() {
        throw new Error("Method 'actions()' must be implemented.");
    }

    /**
     * @description
     * set the listners for the page.
     */
    setListners() {
        throw new Error("Method 'setListners()' must be implemented.");
    }

    /**
     * @description
     * set the dom listeners for the page.
     */
    #_init_listners() {
        this.ELM.init();
    }
}
