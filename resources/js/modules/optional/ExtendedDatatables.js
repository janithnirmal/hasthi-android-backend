import DataTable from "datatables.net-dt";

/**
 * @author Janith Nirmal, Savith Panmgama
 */
export default class ExtendedDatatables {
    /**
     * @description
     * Active Tables
     * @type {Array<DataTable>}
     */
    #activeTables = [];

    static init() {
        console.log("ExtendedDatatables initialized");
    }

    /**
     *
     * @typedef {Object} DatatableColumnComp
     * @property {Function} comp - The component to be added
     * @property {number} index - The position to be added
     *
     * @description
     * Create Table
     * @param {string} tableId - The ID of the table to create
     * @param {Object} options - DataTable options
     * @param {Array<Object>} options.columns - Array of column definitions
     * @param {Array<DatatableColumnComp>} options.elements - list of compoentns to be aded to the table
     *
     */
    create(tableId, options) {
        const tableContainer = document.getElementById(tableId);
        const _options = {};

        if (!options.columns) {
            options.columns = Array.from(
                tableContainer.querySelectorAll("th[data-column]")
            ).map((th) => {
                const columns = {
                    title: th.textContent,
                };

                if (th.getAttribute("data-column") !== "") {
                    columns.data = th.getAttribute("data-column");
                } else {
                    const element = options.elements.find((element) => {
                        return (
                            element.index ===
                            Array.from(
                                tableContainer.querySelectorAll(
                                    "th[data-column]"
                                )
                            ).indexOf(th)
                        );
                    });
                    columns.render = (data, type, row) => {
                        return element.comp(data, type, row);
                    };
                }

                return columns;
            });
        }

        _options.responsive = true;

        _options.dom = options.dom ?? '<"top"fi>rt<"bottom"lp><"clear">';

        _options.language = {
            search: "_INPUT_",
            searchPlaceholder: "Search...",
        };

        Object.assign(_options, options);

        this.#activeTables.push(new DataTable(tableContainer, _options));
    }

    /**
     * @description
     * Update Table Data
     * @param {string} tableId - The ID of the table to update
     * @param {Array<Object>} data - The data to update the table with
     */
    updateData(tableId, data) {
        this.#activeTables.forEach((table) => {
            if (table.id === tableId) {
                table.clear().rows.add(data).draw();
            }
        });
    }

    /**
     * @description
     * Add Data to Table
     * @param {string} tableId - The ID of the table to add data to
     * @param {Array<Object>} data - The data to add to the table
     */
    addData(tableId, data) {
        this.#activeTables.forEach((table) => {
            if (table.id === tableId) {
                table.rows.add(data).draw();
            }
        });
    }

    /**
     * get a table based on the table id
     */
    getTable(id) {
        return this.#activeTables.find((table) => table.id === id);
    }

    /**
     * @description
     * Get All Tables
     * @returns {Array<DataTable>} - All tables
     */
    getTables() {
        return this.#activeTables;
    }

    /**
     * @description
     * Clear Table
     * @param {string} tableId - The ID of the table to clear
     */
    clearTable(tableId) {
        this.#activeTables = this.#activeTables.filter(
            (table) => table.id !== tableId
        );
    }

    /**
     * @description
     * Clear All Tables
     */
    clearAllTables() {
        this.#activeTables.forEach((table) => {
            table.destroy();
        });
        this.#activeTables = [];
    }

    createTableWithName(name, options = {}) {
        const tableContainer = document.getElementById(name);
        if (!tableContainer) {
            console.error(`Table container with ID \"${name}\" not found.`);
            return;
        }

        const defaultOptions = {
            responsive: true,
            dom: options.dom ?? '<"top"fi>rt<"bottom"lp><"clear">',
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search...",
            },
            searchCols: options.searchCols || [], // Apply initial filters
        };

        // Add name property to columns and handle column configuration
        if (!options.columns) {
            options.columns = Array.from(
                tableContainer.querySelectorAll("th[data-column]")
            ).map((th, index) => {
                const columnName =
                    th.getAttribute("data-column") || `column_${index}`;
                return {
                    title: th.textContent,
                    data: columnName,
                    name: columnName, // Add name property
                    orderable: th.getAttribute("data-orderable") !== "false", // Set orderable if specified
                };
            });
        } else {
            options.columns = options.columns.map((col, index) => ({
                ...col,
                name: col.name || col.data || `column_${index}`, // Add or preserve the name property
            }));
        }
        const _options = { ...defaultOptions, ...options };
        this.#activeTables.push(new DataTable(tableContainer, _options));
        return this.#activeTables[this.#activeTables.length - 1];
    }

    /**
     * Get Table by ID
     * @param {string} id - The ID of the table to get
     * @returns {DataTable} - The table
     */
    getTableById(id) {
        return this.#activeTables.find((table) => {
            return table.settings()[0].sTableId === id;
        });
    }

    /**
     * Get Table Column Names
     * @param {string} tableId - The ID of the table to get column names from
     * @returns {Array<string>} - The column names
     */
    getTableColumnNames(tableId) {
        const tableInstance = this.getTableById(tableId);
        if (!tableInstance) {
            console.error(`No DataTable found with ID: ${tableId}`);
            return [];
        }
        const columnNames = tableInstance
            .columns()
            .header()
            .toArray()
            .map((header) => header.textContent.trim());
        return columnNames;
    }

    /**
     * Clear All Filters
     * @param {string} tableId - Table ID
     */
    clearFilters(tableId) {
        const table = this.getTableById(tableId);
        if (table) {
            table.columns().search("").draw();
            table.search("");
        }
    }

    /**
     * Filter by a Single Column
     * @param {string} tableId - Table ID
     * @param {Object} options - Filter options ({ columnName, searchValue, regex, smart, caseInsensitive })
     * @param {boolean} [draw=true] - Whether to redraw the table
     * @param {boolean} [clearAfter=false] - Whether to clear the filter after execution
     * @returns {Array<Object> | undefined}
     */
    filterByColumn(
        tableId,
        {
            columnName,
            searchValue,
            regex = false,
            smart = true,
            caseInsensitive = true,
        },
        draw = true,
        clearAfter = false
    ) {
        const table = this.getTableById(tableId);
        if (!table) {
            console.error(`No DataTable found with ID: ${tableId}`);
            return;
        }

        const column = table
            .column(`${columnName}:name`)
            .search(searchValue, regex, smart, caseInsensitive);
        let filteredRows = [];

        if (!draw) {
            filteredRows = table.rows({ search: "applied" }).data().toArray();
        } else {
            column.draw();
        }

        if (clearAfter) {
            this.clearFilters(tableId);
        }

        return !draw ? filteredRows : undefined;
    }

    /**
     * Filter by Multiple Columns
     * @param {string} tableId - Table ID
     * @param {Array<Object>} filters - Array of filter options
     * @param {boolean} [draw=true] - Whether to redraw the table
     * @param {boolean} [clearAfter=false] - Whether to clear the filters after execution
     * @returns {Array<Object> | undefined}
     */
    filterByColumns(tableId, filters, draw = true, clearAfter = false) {
        const table = this.getTableById(tableId);
        if (!table) {
            console.error(`No DataTable found with ID: ${tableId}`);
            return [];
        }

        filters.forEach(
            ({
                columnName,
                searchValue,
                regex = false,
                smart = true,
                caseInsensitive = true,
            }) => {
                if (columnName) {
                    table
                        .column(`${columnName}:name`)
                        .search(searchValue, regex, smart, caseInsensitive);
                }
            }
        );

        let filteredRows = [];

        if (!draw) {
            filteredRows = table.rows({ search: "applied" }).data().toArray();
        } else {
            table.draw();
        }

        if (clearAfter) {
            this.clearFilters(tableId);
        }

        return !draw ? filteredRows : undefined;
    }

    /**
     * Register Dynamic Filters
     * @param {string} tableId - Table ID
     * @param {string} filterInputClass - Class for filter input elements
     * @param {string} [buttonClass=null] - Class for filter buttons
     */
    registerDynamicFilters(tableId, filterInputClass, buttonClass = null) {
        const table = this.getTableById(tableId);
        if (!table) {
            console.error(`No DataTable found with ID: ${tableId}`);
            return;
        }

        const filterInputs = document.querySelectorAll(`.${filterInputClass}`);
        filterInputs.forEach((input) => {
            input.addEventListener("input", () => {
                const columnName = input.getAttribute("data-column");
                const searchValue = input.value;
                const regex = new RegExp(`^${searchValue}`, "i");
                this.filterByColumn(tableId, {
                    columnName,
                    searchValue: regex,
                    regex: true,
                    smart: false,
                    caseInsensitive: false,
                });

                console.log(columnName);
            });
        });

        if (buttonClass) {
            const button = document.querySelectorAll(`.${buttonClass}`);
            button.addEventListener("click", () => {
                table.draw();
            });
        }
    }
}
