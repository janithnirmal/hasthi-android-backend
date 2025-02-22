/**
 * @class ShopFilter
 * @description This class is used to filter the shop products
 * @author Janith Nirmal
 * @version 1.0.0
 */
export default class ShopFilter {
    #allowedFilterOptions = {
        sortBy: ["alphabetically", "price", "date"],
        order: ["asc", "desc"],
    };

    #filterOptions = {};

    #filterOptionsData = {
        size: [
            {
                id: "1",
                name: "M",
            },
            {
                id: "2",
                name: "L",
            },
            {
                id: "3",
                name: "XL",
            },
            {
                id: "4",
                name: "XXL",
            },
        ],
        material: [
            {
                id: "1",
                name: "Cotton",
            },
            {
                id: "2",
                name: "Polyester",
            },
            {
                id: "3",
                name: "Silk",
            },
        ],
        color: [
            {
                id: "1",
                name: "Red",
            },
            {
                id: "2",
                name: "Green",
            },
            {
                id: "3",
                name: "Blue",
            },
            {
                id: "4",
                name: "Yellow",
            },
        ],
    };

    constructor(callback = () => {}) {
        this.callback = callback;
        this.init();
    }

    //  sample action trigger event
    // <button data-shop-filter-multiple data-shop-filter="click[sortBy:alphabetically,order:asc]" class="dropdown-item sort-btn">Alphabetically: A-Z</button>

    init() {
        // initialize filter container
        const filterContainers = document.querySelectorAll(
            "[data-shop-filter-container]" // define the container for the filter elements
        );
        filterContainers.forEach((container) => {
            // load filter elements
            container
                .querySelectorAll("[data-shop-filter-section]") // define the filter type
                .forEach((filterSection) => {
                    const template = filterSection.querySelector("template");
                    if (!template) return;

                    filterSection.innerHTML = ""; // clean inside

                    if (
                        this.#filterOptionsData[
                            filterSection.dataset.shopFilterSection
                        ]
                    ) {
                        const filterOptionsData =
                            this.#filterOptionsData[
                                filterSection.dataset.shopFilterSection
                            ];

                        filterOptionsData.forEach((data) => {
                            // clone the input element
                            const filterInput = document.importNode(
                                template.content,
                                true
                            );

                            console.log(filterInput);

                            console.log(data);

                            // set default values
                            const value = filterInput.querySelector(
                                "[data-shop-filter-value]"
                            );
                            if (value) value.innerHTML = data.name;

                            if (value.hasAttribute("data-bind-value")) {
                                value.setAttribute(
                                    "data-bind-value",
                                    data.name
                                );
                                console.log(value);
                            }

                            // set default labels/names
                            const name = filterInput.querySelector(
                                "[data-shop-filter-label]"
                            );
                            if (name) name.innerHTML = data.name;

                            // run custom callback
                            const inputCallbackElement =
                                filterInput.querySelector(
                                    "[data-shop-filter-input-callback]"
                                );
                            if (inputCallbackElement) {
                                const callback =
                                    inputCallbackElement.dataset
                                        .shopFilterInputCallback;

                                if (callback) {
                                    filterInput = callback(filterInput);
                                    if (
                                        !filterInput ||
                                        !(filterInput instanceof HTMLElement)
                                    )
                                        throw new Error(
                                            "Input callback must return the valid input element"
                                        );
                                }
                            }

                            filterSection.appendChild(filterInput);
                        });
                    }
                });
        });

        // initialize filter elements
        const elements = document.querySelectorAll("[data-shop-filter]");
        elements.forEach((element) => {
            const [filterEvent, filterOptions] = element.dataset.shopFilter
                .replace("]", "")
                .split("[");

            element.addEventListener(filterEvent, (e) => {
                for (const option of filterOptions.split(",")) {
                    let [filterType, filterValue] = option.split(":");

                    // for multiple filter types
                    if (e.target.hasAttribute("data-shop-filter-multiple")) {
                        console.log("multiple filter type");

                        // if the filter value is bindValue, then use the bind value
                        filterValue =
                            filterValue == "bindValue"
                                ? e.target.dataset.bindValue
                                : filterValue;

                        if (
                            !this.#filterOptions[filterType] ||
                            !Array.isArray(this.#filterOptions[filterType])
                        ) {
                            this.#filterOptions[filterType] = [];
                        }

                        if (e.target.checked) {
                            this.#filterOptions[filterType].push(filterValue);
                        } else {
                            this.#filterOptions[filterType] =
                                this.#filterOptions[filterType].filter(
                                    (value) => value !== filterValue
                                );
                        }
                        continue;
                    } else if (this.#allowedFilterOptions[filterType]) {
                        console.log("recognized filter type");

                        // for pre recongized filter types
                        this.#filterOptions[filterType] =
                            this.#allowedFilterOptions[filterType].includes(
                                filterValue
                            )
                                ? filterValue
                                : "";
                    } else {
                        console.log("unrecognized filter type");

                        // for unreconized filter types
                        this.#filterOptions[filterType] = filterValue;
                    }
                }

                console.log(this.#filterOptions);
                // this.callback(this.#filterOptions);
            });
        });
    }

    /**
     * @description This method is used to add a filter input
     * @param {String} type
     * @param {Array} options
     * @returns {HTMLInputElement}
     */
    addFilterInputs(type, options) {
        switch (type) {
            case "checkbox":
                return this.addCheckboxFilter(options);
        }
    }

    /**
     * @description This method is used to add a checkbox filter
     * @param {Array} options
     * @returns {HTMLInputElement}
     */
    addCheckboxFilter(options) {
        const checkboxFilter = document.createElement("input");
        checkboxFilter.type = "checkbox";
        checkboxFilter.classList.add("form-check-input");
        checkboxFilter.onchange = () => {
            this.#filterOptions[filterType] = checkboxFilter.checked
                ? filterValue
                : "";
        };
        return checkboxFilter;
    }

    /**
     * @description This method is used to add a select filter
     * @param {Array} options
     * @returns {HTMLSelectElement}
     */
    addSelectFilter(options) {
        const selectFilter = document.createElement("select");
        selectFilter.classList.add("form-select");
        return selectFilter;
    }

    /**
     * @description This method is used to add a range filter
     * @returns {HTMLInputElement}
     */
    addRangeFilter() {
        const rangeFilter = document.createElement("input");
        rangeFilter.type = "range";
        rangeFilter.classList.add("form-range");
        return rangeFilter;
    }
}
