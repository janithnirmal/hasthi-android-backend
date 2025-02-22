import Core from "../../Core";

/**
 * @description
 * EventListnerManager is responsible for managing the event listeners for the application.
 * it handles the addition and removal of event listeners for the application.
 */
export default class EventListnerManager {
    /**
     * @typedef {Object} Listener
     * @property {string} selectors - The CSS selector for the element(s) to attach the listener(s) to.
     * @property {string|string[]} listeners - The name(s) of the listener function(s) to be attached.
     */

    /**
     * @typedef {Object} Listeners
     * @property {Listener[]} [key: string] - Array of event listeners for any event type.
     */

    /**
     * @type {Listeners}
     */
    listners = {};

    constructor() {}

    init() {
        if (!this.listners || Object.keys(this.listners).length === 0) {
            Core.debugLog("No listeners found");
            return;
        }

        Object.entries(this.listners).forEach(([event, listeners]) => {
            listeners.forEach((listener) => {
                document
                    .querySelectorAll(listener.selectors)
                    .forEach((element) => {
                        if (listener.listeners instanceof Array) {
                            listener.listeners.forEach((listener) => {
                                element.addEventListener(event, listener);
                            });
                        } else {
                            element.addEventListener(event, listener.listeners);
                        }
                    });
            });
        });

        this.listners = [];
    }

    /**
     * @description
     * set the listener for the page.
     *
     * @param {string} selector - the selector for the element.
     * @param {string} event - the event for the listener.
     * @param {string} listener - the listener for the event.
     */
    setEventListners(selectors, event, listeners) {
        this.listners[event] = this.listners[event] || [];
        this.listners[event].push({ selectors, listeners });
        this.init();
    }

    setClickListners(selector, listener) {
        this.setEventListners(selector, "click", listener);
    }

    setChangeListners(selector, listener) {
        this.setEventListners(selector, "change", listener);
    }

    setMouseOverListners(selector, listener) {
        this.setEventListners(selector, "mouseover", listener);
    }

    setMouseOutListners(selector, listener) {
        this.setEventListners(selector, "mouseout", listener);
    }

    setMouseMoveListners(selector, listener) {
        this.setEventListners(selector, "mousemove", listener);
    }

    setFocusListners(selector, listener) {
        this.setEventListners(selector, "focus", listener);
    }

    setBlurListners(selector, listener) {
        this.setEventListners(selector, "blur", listener);
    }
}
