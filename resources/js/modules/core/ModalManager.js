import Core from "../../Core";

export default class ModalManager {
    /** @type {bootstrap.Modal} */
    static active = null;

    static modalList = [];

    constructor(name = null) {
        if (name) {
            ModalManager.includeModal(name, Core.UIM.getTemplate(name));
        }
    }

    /** @type {Element} */
    static includeModal(name, DOM) {
        // Check if a modal with the same name already exists
        const exists = ModalManager.modalList.some(
            (modal) => modal.name === name
        );

        // Add the modal only if it does not exist
        if (!exists) {
            const modalData = {
                name: name,
                modal: new bootstrap.Modal(DOM),
            };
            ModalManager.modalList.push(modalData);
        } else {
            new Error(`Requested Modal ${name} Is Already Created`);
        }
    }

    /** @returns {Element} */
    static getElement() {
        return ModalManager.active.modal._element;
    }

    static show(name) {
        Core.debugLog(ModalManager.active);
        if (ModalManager.active) {
            ModalManager.active.modal.hide();
        }
        ModalManager.active = null;

        if (name) {
            const obj =
                ModalManager.modalList.filter((obj) => obj.name === name)[0] ??
                null;
            if (obj) {
                obj.modal.show();
                ModalManager.active = obj;
            }
        }
    }

    static hide(name) {
        if (name) {
            const obj = ModalManager.modalList.filter(
                (obj) => obj.name === name
            )[0];
            if (obj) {
                obj.modal.hide();
                ModalManager.active = null;
            }
        }
    }

    /**
     * Removes a modal from the list by its name.
     * @param {string} name - The name of the modal to remove.
     */
    static remove(name) {
        // Dispose the modal instance if it exists
        ModalManager.modalList
            .filter((modal) => modal.name === name)
            .forEach((modal) => modal.modal.dispose());

        // Update the modal list to exclude the modal with the specified name
        ModalManager.modalList = ModalManager.modalList.filter(
            (modal) => modal.name !== name
        );
    }
}
