import Config from "./Config";
import EventManager from "./modules/core/EventManager";
import LocalStorageManager from "./modules/core/LocalStorageManager";
import RequestManager from "./modules/core/RequestManager";
import UIManager from "./modules/core/UIManager";
import ToastManager from "./modules/core/ToastManager";

import ExtendedDatatables from "./modules/optional/ExtendedDatatables";
import { NotificationManager } from "./modules/optional/NotificationManager";
import { ImageInputManager } from "./modules/optional/ImageInputManager";
import { AttributeObserver } from "./modules/optional/AttributeObserver";
import TextManager from "./modules/optional/TextManager";
import SearchService from "./modules/optional/services/SearchService";
import DataRouteConfig from "./config/DataRouteConfig";
import ModalManager from "./modules/core/ModalManager";

/**
 * Core class is a singleton class that is responsible for managing all the plugins and features of the application.
 *
 * @description
 * **Directly dependant on the following dependancies**
 *
 * ***core plugins***
 * - Config
 * - EventManager
 * - RequestManager
 * - UIManager
 * - LocalStorageManager
 *
 * ***optional plugins***
 * - AttributeObserver
 * - NotificationManager
 * - ToastManager
 * - ImageInputManager
 * - ExtendedDatatables
 * - TextManager
 */
export default class Core extends Config {
    // core plugins
    //
    //
    //
    /** @type {EventManager} */
    static EM = null;
    /** @type {RequestManager} */
    static RM = null;
    /** @type {LocalStorageManager} */
    static LSM = null;
    /** @type {ToastManager} */
    static toast = null;
    /** @type {UIManager} */
    static UIM = null;
    /** @type {ModalManager} */
    static MM = null;
    //
    //
    //====================================

    // optional plugins
    //
    //
    //
    /** @type {NotificationManager} */
    static NM = null;
    /** @type {AttributeObserver} */
    static AO = null;
    /** @type {ExtendedDatatables} */
    static EDT = null;
    /** @type {ImageInputManager} */
    static ImageInputManager = null;
    /** @type {TextManager} */
    static TXM = null;
    /** @type {SearchService} */
    static SS = null;
    //
    //
    //====================================

    /**
     * @description
     * allowed optional plugins
     * @type {Object}
     */
    static allowed_optional_plugins = {
        ExtendedDatatables: {},
        NotificationManager: {
            url: `${Config.get_domain()}/api/notification`,
        },
        ImageInputManager: {},
        AttributeObserver: {},
        TextManager: {},
        SearchService: {
            dataRoutes: DataRouteConfig.getDataRoutes(),
        },
    };

    /**
     * @description
     * core plugins
     * @type {Object}
     */
    #core_plugins = {
        EventManager: {},
        RequestManager: {
            domain: Config.get_domain(),
        },
        LocalStorageManager: {},
        ToastManager: {},
        UIManager: {},
        ModalManager: {},
    };

    static instance = null;

    /**
     * @description
     * constructor
     */
    constructor() {
        if (Core.instance) {
            return Core.instance;
        }

        super();
        console.log("plugins initializing...");
        this.#_init_core_plugins(); // register core plugins
        this.#_init_optional_plugins(); // register optional plugins
        console.log("plugins initialized...");

        Core.instance = this;
    }

    /**
     * @description
     * get the instance of the core
     * @returns {Core}
     */
    static getInstance() {
        if (!Core.instance) {
            Core.instance = new Core();
        }
        return Core.instance;
    }

    /**
     * @description
     * initialize core plugins
     */
    #_init_core_plugins() {
        try {
            Object.keys(this.#core_plugins).forEach((plugin) => {
                this.coreLoad(plugin, this.#core_plugins[plugin]);
            });
        } catch (error) {
            console.error(error);

            alert("Missing Plugins! ⚠️🔥");
            console.error("Plugin Not Found!");
        }
    }

    /**
     * @description
     * initialize optional plugins
     */
    #_init_optional_plugins() {
        try {
            Object.keys(Core.allowed_optional_plugins).forEach((plugin) => {
                this.optionalLoad(
                    plugin,
                    Core.allowed_optional_plugins[plugin]
                );
            });
        } catch (error) {
            console.error(error);

            alert("Missing Plugins! ⚠️");
            console.error("Plugin Not Found!");
        }
    }

    /**
     * @description
     * log a message to the console if the debug is enabled
     * @param {string} message
     */
    static debugLog(message) {
        if (Config.get_debug()) {
            console.log(message);
        }
    }

    /**
     * @description
     * load optional plugins
     * @param {string} name
     * @returns {boolean}
     */
    optionalLoad(name, options = {}) {
        switch (name) {
            case "ExtendedDatatables":
                Core.EDT = new ExtendedDatatables();
                break;
            case "NotificationManager":
                Core.NM = new NotificationManager(options.url);
                break;
            case "ImageInputManager":
                Core.ImageInputManager = new ImageInputManager();
                break;
            case "AttributeObserver":
                Core.AO = new AttributeObserver();
                break;
            case "TextManager":
                Core.TXM = new TextManager();
                break;
            case "SearchService":
                Core.SS = new SearchService(options.dataRoutes);
                break;
            default:
                return false;
        }

        return false;
    }

    /**
     * @description
     * load core plugins
     * @param {string} name
     * @returns {boolean}
     */
    coreLoad(name, options = {}) {
        switch (name) {
            case "EventManager":
                Core.EM = new EventManager();
                break;
            case "RequestManager":
                Core.RM = new RequestManager(options.domain);
                break;
            case "LocalStorageManager":
                Core.LSM = new LocalStorageManager();
                break;
            case "ToastManager":
                Core.toast = new ToastManager();
                break;
            case "UIManager":
                Core.UIM = new UIManager();
                break;
            case "ModalManager":
                Core.MM = new ModalManager();
                break;
            default:
                return false;
        }
    }

    /**
     * @description
     * ignore optional plugins
     * @param {string} name
     */
    static ignoreOptionalPlugin(name) {
        delete Core.allowed_optional_plugins[name];
    }
}
