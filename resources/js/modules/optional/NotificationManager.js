/**
 * notification pattern
 *
 * types
 * - info
 * - warning
 * - errors
 *
 * format (data structure)
 *
 * all
 * {
 *  [info(notification)],
 *  [warning(notification)],
 *  [errors(notification)],
 * }
 *
 * single
 * {
 *  title,
 *  time,
 *  message,
 *  type,
 *  callback : { action, source }
 * }
 *
 */

import { EventManager } from "./EventManager";

/**
 * reusable notification manager system
 *
 * @version 1.0
 */
export class NotificationManager {
    // -*backend API interface
    /** @type {EventManager} */
    #eventManager = null;
    #default = "";
    #URL = "";
    #notifications = {
        info: [],
        warning: [],
        errors: [],
    };

    /** @type {Element} */
    #popupModal = null;
    /** @type {Element} */
    #popupModalDOM = null;

    /** @param {string} url url to be used as inital notification gateway */
    constructor(url) {
        this.#URL = url;
        this.#default = this.#URL;
        this.#popupInit();

        // test
        this.#test();
        this.#eventManager = new EventManager();
    }

    #test() {}

    /**
     *
     * @param {url} url new URL for fetchin notification
     */
    setSource(url) {
        this.#URL = url;
        this.#eventManager.emit("new_resource_url");
    }

    /** reset to default URL */
    resetSource() {
        this.#URL = this.#default;
        this.#eventManager.emit("reset_resource_url");
    }

    async #fetch(type, params = null) {
        const response = await fetch(
            `${this.#URL}${params ? "?" + params : ""}`
        );
        if (!response.ok) {
            console.log("Source Error!");
        }

        try {
            const data = response.json();
            // todo - verify the notifaction formats and split them into the local collection
            this.#eventManager.emit("new_resource_url");
            return data;
        } catch (error) {
            console.log("Invalid response!");
        }
        return null;
    }

    // *notification display
    // // *pop up

    /** initiate a pop up modal */
    #popupInit() {
        const templateHtml = `
      <div class="modal" tabindex="-1" id="NotificationManagerPupupModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;

        // Append the modal HTML to the body
        document.body.insertAdjacentHTML("beforeend", templateHtml);

        // Reference the modal DOM element directly after it's in the DOM
        this.#popupModalDOM = document.getElementById(
            "NotificationManagerPupupModal"
        );

        // Initialize the Bootstrap modal instance
        this.#popupModal = new bootstrap.Modal(this.#popupModalDOM);
    }

    /** get the model */
    getPopupModel() {
        return this.#popupModalDOM;
    }

    /** show a pop up notification */
    popup(title) {
        this.#eventManager.emit("popup_before");
        this.#popupModalDOM.querySelector(".modal-title").innerHTML = title;
        this.#popupModal.show();
        this.#eventManager.emit("popup_after");
    }

    // // *notification panel
    // // *toast
    // // embded
    // // logs (dev)
    // -sound effects

    // *custamization machanism
    eventRegister(event, callbacks = []) {
        this.#eventManager.subscribe(event, ...callbacks);
    }

    eventClear(event) {
        this.#eventManager.unsubscribe(event);
    }
}
