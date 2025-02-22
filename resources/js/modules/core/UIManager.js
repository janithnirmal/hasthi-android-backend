import Core from "../../Core";
import Filter from "../optional/dataFilter/Filter";
import { ImageInputManager } from "../optional/ImageInputManager";

/**
 * UIManager
 *
 * @description: This class is used to manage the UI of the application. this manage core feature of UI interaftions
 *
 * @author: Janith Nirmal
 * @version: 1.0
 */
export default class UIManager {
    /**
     * @description: This is the default placeholder for the fields
     * @type {string}
     */
    #defaultPlaceholder = "N/A";

    /** @type {Object[]} */
    #imageInputManagers = [];

    /**
     * setFields
     *
     * @description: This method is used to set the fields of the form
     * @param {string|Element} component - The component of the container
     * @param {object} data - The data to be set
     * @param {object} options - The options to be used
     * @param {boolean} options.usePlaceholder - The flag to use the placeholder
     */
    setFields(
        component,
        data,
        options = {
            usePlaceholder: false,
        }
    ) {
        const container =
            typeof component === "object"
                ? component
                : document.getElementById(component);
        container.querySelectorAll("[data-field]").forEach((field) => {
            const selectedData =
                this.getNestedValue(data, field.getAttribute("data-field")) ??
                (options.usePlaceholder ? this.#defaultPlaceholder : "");

            const filteredData = new Filter(
                selectedData,
                field.getAttribute("data-filter") ?? ""
            ).run();
            field.innerHTML = filteredData;
        });
    }

    /**
     * fillData
     *
     * @description: This method is used to fill the data of the form
     * @param {string} id - The id of the container
     * @param {object} data - The data to be set
     * @param {object} options - The options to be used
     * @param {boolean} options.useHook - The flag to use the hook
     */
    fillData(
        id,
        data,
        options = {
            useHook: false,
            usePlaceholder: false,
        }
    ) {
        let query = "";
        let setKey = "";
        if (options.useHook) {
            query = "[data-input-hook]";
            setKey = "data-input-hook";
        } else {
            query =
                "select[name], input[name], textarea[name], [data-container]";
            setKey = "name";
        }

        const container = document.getElementById(id);
        container.querySelectorAll(query).forEach((input) => {
            if (input.dataset.ignore !== undefined) return;

            let preparedData = null;

            if (input.dataset.container !== undefined) {
                preparedData = this.getNestedValue(
                    data,
                    input.dataset.container
                );
            } else {
                preparedData = options.useHook
                    ? this.getNestedValue(data, input.getAttribute(setKey)) ??
                      (options.usePlaceholder ? this.#defaultPlaceholder : "")
                    : this.getNestedValue(data, input.name) ??
                      (options.usePlaceholder ? this.#defaultPlaceholder : "");
            }

            if (input.dataset.filter !== undefined) {
                preparedData = new Filter(
                    preparedData,
                    input.getAttribute("data-filter") ?? ""
                ).run();
                input.innerHTML = preparedData; // add the data to the inner html if container
                return;
            }

            input.value = preparedData; // add data if it is an input
        });
    }

    /**
     * getInputs
     *
     * @description: This method is used to get the inputs from inputs or input hooks in the UI
     * @param {string} id - The id of the container
     * @param {object} options - The options to be used
     * @param {boolean} options.useHook - The flag to use the hook
     * @returns {object} The inputs of the form
     */
    getInputs(id, options = {}) {
        const _options = {
            useHook: false,
            ...options,
        };

        let query = "";
        let getKey = "";
        if (_options.useHook) {
            query = "[data-input-hook]";
            getKey = "data-input-hook";
        } else {
            query = "select[name], input[name], textarea[name]";
            getKey = "name";
        }

        const inputs = {};
        const container = document.getElementById(id);
        container.querySelectorAll(query).forEach((input) => {
            inputs[input.getAttribute(getKey)] = input.value ?? "";
        });
        return inputs;
    }

    /**
     * clear input values of all inputs
     *
     * @param {string} inputGroupId - The id of the input group
     */
    clearInputs(inputGroupId) {
        if (!inputGroupId) {
            Core.debugLog("No input group id provided");
            return;
        }

        const container = document.getElementById(inputGroupId);
        const inputs = container.querySelectorAll(
            "input[name], textarea[name], select[name]"
        );
        inputs.forEach((input) => {
            if (input.tagName === "SELECT") {
                input.value = "0";
            } else if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = ""; //#TODO: check this - update to accept default value
            }
        });

        const imagePickerObject = Core.ImageInputManager.getPicker(container);
        if (imagePickerObject) {
            imagePickerObject.picker.clear();
        }
    }

    /**
     * getNestedValue
     *
     * @description: This method retrieves a value from a nested object or array using dot notation or bracket notation
     * @param {object|array} obj - The object or array to search in
     * @param {string} path - The path to the desired value, using dot notation for objects and bracket notation for arrays
     * @returns {*} The value at the specified path, or undefined if not found
     */
    getNestedValue(obj, path) {
        return path
            .split(/[.\[\]]/)
            .filter(Boolean)
            .reduce((current, key) => {
                return current !== undefined && current !== null
                    ? current[key]
                    : undefined;
            }, obj);
    }

    /**
     * setSelectOptions
     *
     * @description: This method is used to set the options of the select
     * @param {string} id - The id of the container
     * @param {Array<Object>} data - The data to be set as options
     * @param {object} options - The options to be used
     * @param {string} options.value - The key of the data
     * @param {string} options.text - The value of the data
     * @param {string} options.defaultOption - The default option of the select
     */
    setSelectOptions(selectorId, data, options = {}) {
        if (!data || data.length === 0) {
            Core.debugLog("No data provided for select options");
            return;
        }

        const _options = {
            defaultOption: "Select an option",
            ...options,
            value: options.value ?? "id",
            text: options.text ?? "name",
        };

        console.log(_options);

        const selector = document.getElementById(selectorId);
        selector.innerHTML = "";

        if (_options.defaultOption) {
            selector.innerHTML += `<option value="0">${_options.defaultOption}</option>`;
        }

        data.forEach((option) => {
            selector.innerHTML += `<option value="${option[_options.value]}">${
                option[_options.text]
            }</option>`;
        });
    }

    /**
     * set a selector data from entity search
     *
     * @param {string} entity - search entity
     * @param {string} id  - selector ID
     * @param {object} dataProperty - data object
     * @param {string} defaultOption - default option text field
     * @param {string} value - option value key
     * @param {string} text - option filed text name
     */
    async loadSelectOptionsFromRemote(
        entity,
        id,
        defaultOption = "Select an item",
        value = null,
        text = null
    ) {
        let dataProperty = await Core.SS.search(entity);
        Core.UIM.setSelectOptions(id, dataProperty, {
            defaultOption,
            value,
            text,
        });

        return dataProperty;
    }

    _init_image_inputs(container) {
        document
            .getElementById(container)
            .querySelectorAll("[data-image-picker]")
            .forEach((imagePickerElement) => {
                this.#imageInputManagers.push(
                    Core.ImageInputManager.createImagePicker(
                        imagePickerElement,
                        {
                            id: "1",
                            duplicatePolicy: { type: "limited", max: 2 },
                            style: "app",
                            theme: defaultTheme,
                        }
                    )
                );
            });

        console.log(this.#imageInputManagers);
    }

    /**
     *
     * @param {string} name name of the template
     * @returns
     */
    getTemplate(name) {
        const template = document.querySelector(
            `[data-tempalte-name="${name}"]`
        );

        if (!template) {
            Core.debugLog(`${name} template not found`);
            return;
        }
        const documentFragment = template.content.firstElementChild;
        return documentFragment.cloneNode(true);
    }

    /**
     * apearing animation
     */
    applyAppearAnimation() {
        const elements = document.querySelectorAll('[data-animation="apear"]');
        if (elements.length === 0) return;

        // Initialize elements with 0% opacity
        elements.forEach((el) => {
            const delay =
                parseInt(el.getAttribute("data-animation-delay")) || 0;
            // Apply delay using a timeout
            el.style.transitionDelay = `${delay}ms`;

            // Initial styles: invisible and slightly smaller
            el.style.opacity = 0.05;
            el.style.transform = "scale(0.9)"; // Slightly smaller
            el.style.transition =
                "opacity 1s cubic-bezier(0.6, 0, 0.2, 1), transform 1s cubic-bezier(0.6, 0, 0.2, 1)";
        });

        function handleScroll() {
            elements.forEach((el) => {
                if (!el.dataset.animated && isElementInViewport(el)) {
                    el.style.opacity = 1;
                    el.style.transform = "scale(1)"; // Slightly smaller
                    el.dataset.animated = "true"; // Mark as animated
                }
            });
        }

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const elementHeight = rect.height;
            const elementWidth = rect.width;

            // Calculate the visible portion vertically
            const visibleHeight =
                Math.min(rect.bottom, window.innerHeight) -
                Math.max(rect.top, 0);

            // Calculate visibility percentage vertically
            const visiblePercent = Math.max(0, visibleHeight) / elementHeight;

            // Return true if at least 40% of the element's height is visible
            return visiblePercent >= 0.4;
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        // Run initially in case elements are already in view
        handleScroll();
    }

    /**
     * apear animation for UI components that will be triggered by action
     * @param {HTMLElement} element - element to apply animation
     * @param {number} delay - delay in milliseconds
     */
    applyAppearAnimationForElement(element, delay = 0) {
        element.style.opacity = 0;
        element.style.transform = "scale(0.9)";
        element.style.transition =
            "opacity 1s cubic-bezier(0.6, 0, 0.2, 1), transform 1s cubic-bezier(0.6, 0, 0.2, 1)";
        element.style.transitionDelay = `${delay}s`;

        // Force reflow
        element.offsetHeight;

        // Trigger animation
        element.style.opacity = 1;
        element.style.transform = "scale(1)";
    }
}
