import Admin from "./Admin";
import Core from "./Core";
import UIManager from "./modules/core/UIManager";
import EventListnerManager from "./modules/optional/EventListnerManager";

/**
 * @author Janith Nirmal (Algowrite Solutions)
 * 
 * @description
 * Parent of Panel Class
 * @extends UIManager
 * @version 1.0
 *  

 */
export default class Panel extends UIManager {
    #mainContainerId = Core.get_main_container_id();
    #URL_ROOT = Core.get_domain(); //  empty for none that exits
    #config = {};
    #data = {};
    #name = null;
    #activeEvents = [];
    #buttonEvent = null;

    get data() {
        return this.#data;
    }

    set data(data) {
        return (this.#data = data);
    }

    /**
     * @description
     * Event Listner Manager
     * @type {EventListnerManager}
     */
    ELM = null;

    constructor(config) {
        super();
        if (!Admin.getInstance()) {
            throw Error("Admin Panel is not instantiated");
        }
        if (!config.name) {
            throw Error("Missing Parameter : config.name : string");
        }

        this.ELM = new EventListnerManager();
        this.#config = config;
        this.#name = config.name;
        this.#_init();
    }

    #_init() {
        // listner
        this.addListner(`${this.#name}_switch`, () => {
            Admin.switchPanel(this.#name);
        });
        this.#_init_processes();
        this.init();
    }

    /**
     * @description panel instantiating time executable programmes for all panels
     * this will work regardless of the panel
     */
    #_init_processes() {
        // your code
    }

    /**
     * @description panel instantiating programmes. this only works with overide features in cirtain panel adn user to do panel specific tasks
     */
    init() {}

    /**
     * all the boot level hardcode registers and workers for a panel
     */
    #_boot() {
        this.#eventRegister();
        this.#_boot_processes();
        this.boot();
    }

    /**
     * @description custom panel switching actions
     * this will work regardless of the panel
     */
    #_boot_processes() {
        // your code
    }

    /**
     *
     * all the boot level registers and workers for a specific panel
     *
     * @override
     */
    boot() {}

    async render() {
        const container = document.getElementById(this.#mainContainerId);
        container.innerHTML = "";
        container.innerHTML = await this.#fetchPanel();
        this.data = null;
        this.#_boot();
        this.eventDispatch(`${this.#name}_launch`);
    }

    _destroy() {
        Core.debugLog("panel cleaned");
        this.clean();
    }

    /**
     * clean the panel data when exiting
     */
    clean() {}

    /**
     * get the panel HTML code from server
     */
    async #fetchPanel() {
        Core.EM.emit("panel_fetch_start");
        return await fetch(`${this.#URL_ROOT}/comp/panel/${this.#name}`)
            .then((res) => res.text())
            .then((data) => {
                Core.EM.emit("panel_fetch_end");
                return data;
            })
            .catch((error) => {
                Core.EM.emit("panel_fetch_error", error);
                Core.EM.emit("panel_fetch_end");
                Core.toast.show("error", "Panel template loading failed!😵");
                console.error(error);
                console.error(
                    "Panel template loading failed! : UI fetch failed"
                );
            });
    }

    /**
     * get the current panel name
     * @returns {string} - name of the panel
     */
    getName() {
        return this.#name;
    }

    /**
     * event subscriber
     *
     * @param {string} eventName name of the event
     * @param {Function} functions functions list
     */
    addListner(eventName, functions) {
        Core.EM.subscribe(eventName, functions);
    }

    /**
     * dispatch an event
     *
     * @param {string} event name of the event wants to trigger
     */
    eventDispatch(event) {
        Core.EM.emit(event);
    }

    /**
     * register all the events for a panel on render
     */
    #eventRegister() {
        this.#cleanPanelEvenets(); // required

        // add event listners
        const containers = document.querySelectorAll("[data-admin-container]");
        let actionName = "";
        let actionTrigger = null;

        containers.forEach((container) => {
            if (container.dataset.isView) {
                this.viewProcessEventAction(container); //  automated view process
                return;
            } else {
                actionTrigger = container.querySelector("[data-btn-action]");
                actionName = actionTrigger
                    ? actionTrigger.dataset.btnAction
                    : "";
            }

            this.#loadSelectors(container);

            const action = () => {
                switch (actionName) {
                    case "add":
                        this.addProcessEventAction(container); //  automated add process
                        break;

                    case "update":
                        this.updateProcessEventAction(container); // automated udpate process
                        break;

                    default:
                        break;
                }
            };

            if (actionTrigger) {
                actionTrigger.addEventListener("click", action);
                this.#activeEvents.push({
                    event: "click",
                    btn: actionTrigger,
                    action: action,
                });
            }
        });
    }

    /**
     *
     * @param {Element} container container of the selectors
     */
    #loadSelectors(container) {
        container
            .querySelectorAll("select[data-options]")
            .forEach((selector) => {
                Core.AO.stopObserving(selector, "data-options");
                function loadSelector() {
                    selector.innerHTML = "";
                    try {
                        JSON.parse(selector.dataset.options).forEach((data) => {
                            const option = document.createElement("option");
                            option.value = data[0];
                            option.text = data[1];

                            selector.appendChild(option);
                        });
                    } catch (error) {
                        throw new Error(
                            "Invalid Selector Configuration at :" +
                                container.dataset.adminContainer
                        );
                    }
                }
                loadSelector();

                // option update observer
                Core.AO.observeAttribute(
                    selector,
                    "data-options",
                    loadSelector
                );
            });
    }

    /**
     * remove all the events from event manager related to the current panel
     */
    #cleanPanelEvenets() {
        this.#activeEvents.forEach((eventObject) => {
            eventObject.btn.removeEventListener(
                eventObject.event,
                eventObject.action
            ); // remove event listeners from DOM for actions
        });
        this.#activeEvents = []; // clear array

        console.log("cleaned");
    }

    /**
     * hadnle the request actions for common usecases
     *
     * @param {Element} container object to use when creating form
     * @param {Object} options object to use when creating form
     */
    async requestActionProcess(type, container, options = {}) {
        if (!container || !type) {
            throw new Error("Invalid Action Process");
        }

        const METHOD = type === "view" || type === "get" ? "GET" : "POST";

        if (type !== "view" && type !== "get") {
            const form = Core.APIR.createFormData(this.scrapeData(container)); // build form object by data

            const imagePicekrList = container.querySelectorAll(
                "[data-image-picker]"
            );
            imagePicekrList.forEach((pickerElement) => {
                let count = 1;
                Core.ImageInputManager.getPicker(pickerElement)
                    .picker.getImageFiles()
                    .forEach((file) => {
                        let name =
                            pickerElement.dataset.name + "_" + count ?? "";
                        console.log(name);

                        form.append(name, file); // add images to form
                        count++;
                    });

                console.log(
                    Core.ImageInputManager.getPicker(
                        pickerElement
                    ).picker.getImageFiles()
                );
            });

            options = {
                body: form,
                ...options,
            };
            console.log("options is modified" + type);
        }

        const successActions = [() => this.clearInputs(container)];
        const failedActions = [];
        if (container.dataset.onsuccess) {
            container.dataset.onsuccess.split(" ").forEach((item) => {
                successActions.push(this[item] ? this[item] : () => {});
            });
        }
        if (container.dataset.onfailed) {
            container.dataset.onfailed.split(" ").forEach((item) => {
                failedActions.push(this[item] ? this[item] : () => {});
            });
        }

        console.log(options);

        const response = await Core.APIR.request(
            METHOD,
            container.dataset.endpoint ?? "/",
            options,
            {
                success: successActions,
                failed: failedActions,
            }
        ); // build form object by data

        return response;
    }

    /**
     * scrape data from inputs and fileds in a container
     *
     */
    scrapeData(container) {
        const inputs = container.querySelectorAll(
            "input[name], textarea[name], select[name], [data-custom-data]"
        );
        const values = {};
        inputs.forEach((input) => {
            values[input.name] = input.value ?? "";
        });
        return values;
    }

    /**
     *  peraped view event action for a container
     *
     * @param {Element} container container object
     */
    async viewProcessEventAction(container) {
        const response = await this.requestActionProcess("view", container);
        switch (container.dataset.viewType) {
            case "table":
                // Core.EDT.createTable(
                //   container,
                //   "[data-table-container]",
                //   container.dataset.field
                //     ? container.dataset.field.split(" ")
                //     : ["Header"],
                //   {}
                // );

                const property = container.dataset.field.split(" ");
                response.forEach((element) => {
                    container.innerHTML +=
                        element[property[1]] +
                        " : " +
                        element[property[0]] +
                        "<br>";
                });
                break;

            case "list":
                console.log(response);
                break;

            default:
                break;
        }

        console.log(
            "proform viewing operations : " + container.dataset.adminContainer
        );
    }

    /**
     *  peraped add event action for a container
     *
     * @param {Element} container container object
     */
    async addProcessEventAction(container) {
        const response = await this.requestActionProcess("add", container);
        if (response !== false) {
            Core.toast.show("info", response);
        }
        console.log(
            "proform adding operations : " + container.dataset.adminContainer
        );
    }

    /**
     *  peraped update event action for a container
     *
     * @param {Element} container container object
     */
    async updateProcessEventAction(container) {
        const response = await this.requestActionProcess(container, {
            method: "POST",
        });
        Core.toast.show("info", response);
        console.log(
            "proform updating operations : " + container.dataset.adminContainer
        );
    }
}
