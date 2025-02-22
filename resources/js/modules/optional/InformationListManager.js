/**
 * information list managment class
 * features:
 * - load a list of items based on html template/dom
 * - hadnle pagination in client side
 * - display the count of items on top left corner
 * - search functionality
 *
 * data strucutres expected:
 * - arrray of objects where items represent the list of items and objects properties represent the item properties
 *
 * the object properties values will be directly passe to the list item if data is not a array or object like structure.
 * or else the data will be loaded based on the data accesing notation provided by the data-filed attribute on the template for each column. the headers will be pre defined into to the base html strucutere where the list applies
 *
 * @author Janith Nirmal
 * @version 1.0.0
 */

import Core from "../../Core";

export default class InformationListManager {
    /**
     * @param {HTMLElement} container - The container where the list will be rendered.
     * @param {Object[]} data - The array of data objects to manage.
     * @param {number} itemsPerPage - The number of items per page for pagination.
     */
    constructor(container, data = [], options = { itemsPerPage: 10 }) {
        this.container = container;
        this.data = data;
        this.options = options;
        this.filteredData = [...data];
        this.itemsPerPage = options.itemsPerPage || 10;
        this.currentPage = 1;

        this.init();
    }

    /**
     * Initialize the list manager by setting up UI components.
     */
    init() {
        this.container.appendChild(Core.UIM.getTemplate(this.options.template));

        this.itemCountEl = this.container.querySelector(".item-count");
        this.searchBoxEl = this.container.querySelector(".search-box");
        this.listEl = this.container.querySelector(".info-list");
        this.paginationInfoEl = this.container.querySelector(".page-info");
        this.prevPageBtn = this.container.querySelector(".prev-page");
        this.nextPageBtn = this.container.querySelector(".next-page");

        this.setupEventListeners();
        this.render();
    }

    /**
     * Set up event listeners for search and pagination.
     */
    setupEventListeners() {
        this.searchBoxEl.addEventListener("input", (e) =>
            this.search(e.target.value)
        );
        this.prevPageBtn.addEventListener("click", () =>
            this.changePage(this.currentPage - 1)
        );
        this.nextPageBtn.addEventListener("click", () =>
            this.changePage(this.currentPage + 1)
        );
    }

    /**
     * Render the list, pagination, and item count.
     */
    render() {
        this.renderList();
        this.renderPagination();
        this.updateItemCount();
    }

    /**
     * Render the list items based on the current page and filtered data.
     */
    renderList() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.filteredData.slice(start, end);

        this.listEl.innerHTML = "";

        pageData.forEach((item) => {
            const listItem = this.createListItem(item);
            this.listEl.appendChild(listItem);
        });
    }

    /**
     * Create a list item based on the data and template structure.
     * @param {Object} item - The data object for the item.
     * @returns {HTMLElement} - The DOM element for the list item.
     */
    createListItem(item) {
        const template = Core.UIM.getTemplate(this.options.container);
        console.log(template);

        const clone = template.cloneNode(true);
        const elements = clone.querySelectorAll("[data-field]");

        elements.forEach((el) => {
            const field = el.getAttribute("data-field");
            const data =
                field.split(".").reduce((obj, key) => obj?.[key], item) || "";

            if (el.dataset.element !== undefined) {
                const templateConfig =
                    this.options.templates?.[el.dataset.element];
                if (templateConfig) {
                    const originalNode = templateConfig.element.cloneNode(true);

                    // Attach the specified events to the cloned node
                    if (templateConfig.events) {
                        templateConfig.events.forEach(({ type, listener }) => {
                            originalNode.addEventListener(type, listener);
                        });
                    }

                    originalNode.dataset.data = data; // Set the data as needed
                    el.appendChild(originalNode);
                }
            } else {
                el.textContent = data;
            }
        });

        return clone;
    }

    /**
     * Render pagination controls.
     */
    renderPagination() {
        const totalPages = Math.ceil(
            this.filteredData.length / this.itemsPerPage
        );
        this.paginationInfoEl.textContent = `Page ${this.currentPage} of ${totalPages}`;

        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
    }

    /**
     * Update the item count display.
     */
    updateItemCount() {
        this.itemCountEl.textContent = `${this.filteredData.length} items`;
    }

    /**
     * Change the current page and re-render.
     * @param {number} page - The new page number.
     */
    changePage(page) {
        const totalPages = Math.ceil(
            this.filteredData.length / this.itemsPerPage
        );
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.render();
    }

    /**
     * Search the list and update the filtered data.
     * @param {string} query - The search query.
     */
    search(query) {
        this.filteredData = this.data.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
        );
        this.currentPage = 1;
        this.render();
    }
}
