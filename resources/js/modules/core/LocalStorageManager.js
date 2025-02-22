/**
 * LocalStorageManager is a class designed to manage local storage operations with support for
 * encryption, decryption, and subscription management of Shane objects. It provides methods
 * to set, get, remove, and clear items in local storage, and allows for dynamic management of
 * storage objects (Shane objects) within primary and secondary mega objects.
 *
 * @class
 * @version 1.1
 * @author Prashan Silva (ShaNe)
 * @remarks
 * Author's Notes:
 * - Ensure that the encryption and decryption APIs are correctly configured. We don’t want any
 *   “oops, wrong password” moments.
 * - Handle expiration logic with caution to avoid unintentional data loss. Because nothing says
 *   “fun” like debugging why your data vanished.
 * - This class is designed to be flexible and adaptable to various use cases. It’s like the
 *   Swiss Army knife of local storage management, minus the corkscrew.
 * - Remember: if you ever find a bug, it might be a feature... or not.
 */
export default class LocalStorageManager {
    /**
     * Constructor to initialize the LocalStorageManager with namespace and options.
     *
     * @param {string} namespace - The namespace for local storage keys.
     * @param {Object} [options={}] - Optional settings for encryption and expiration.
     */
    constructor(options = {}) {
        this.namespace = "";
        this.encryptionAPI = options.encryptionAPI || "/encrypt";
        this.decryptionAPI = options.decryptionAPI || "/decrypt";

        this.primary = this.#loadFromStorage("primary") || {
            defaults: {},
            protected: {},
            state: {},
        };

        this.secondary = this.#loadFromStorage("secondary") || {
            defaults: {},
            protected: {},
            state: {},
        };

        this.#saveToStorage("primary", this.primary);
        this.#saveToStorage("secondary", this.secondary);
    }

    /**
     * Loads data from local storage.
     *
     * @param {string} megaObject - The mega object to load data from.
     * @returns {Object|null} - The loaded data or null if not found.
     */
    #loadFromStorage(megaObject) {
        const data = localStorage.getItem(`${this.namespace}${megaObject}`);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Saves data to local storage.
     *
     * @param {string} megaObject - The mega object to save data to.
     * @param {Object} data - The data to be saved.
     */
    #saveToStorage(megaObject, data) {
        localStorage.setItem(
            `${this.namespace}${megaObject}`,
            JSON.stringify(data)
        );
    }

    /**
     * Protected method to subscribe a new Shane object.
     * Triggers optional onBefore and onAfter events if provided.
     *
     * @param {string} shaneObjectName - The name of the Shane object to subscribe to.
     * @param {string} [megaObject="primary"] - The mega object to subscribe the Shane object to.
     * @param {Object} [options={}] - Options for event handlers.
     * @param {function} [options.onBefore=null] - A callback function to be executed before subscribing the Shane object.
     * @param {function} [options.onAfter=null] - A callback function to be executed after subscribing the Shane object.
     */
    _subscribeShaneObject(
        shaneObjectName,
        megaObject = "primary",
        options = {}
    ) {
        const { onBefore = null, onAfter = null } = options;

        if (typeof onBefore === "function") {
            onBefore();
        }

        if (!this[megaObject][shaneObjectName]) {
            this[megaObject][shaneObjectName] = {};
            this.#saveToStorage(megaObject, this[megaObject]);
            console.log(
                `Subscribed to new Shane object '${shaneObjectName}' in ${megaObject}`
            );
        } else {
            console.log(
                `Already subscribed to Shane object '${shaneObjectName}' in ${megaObject}`
            );
        }

        if (typeof onAfter === "function") {
            onAfter();
        }
    }

    /**
     * Protected method to unsubscribe a Shane object.
     * Triggers optional onBefore and onAfter events if provided.
     *
     * @param {string} shaneObjectName - The name of the Shane object to unsubscribe from.
     * @param {string} [megaObject="primary"] - The mega object to unsubscribe the Shane object from.
     * @param {Object} [options={force: false}] - Options for forceful unsubscription. (Force removal even if the Shane object contains data.)
     * @param {function} [options.onBefore=null] - A callback function to be executed before unsubscribing the Shane object.
     * @param {function} [options.onAfter=null] - A callback function to be executed after unsubscribing the Shane object.
     */
    _unsubscribeShaneObject(
        shaneObjectName,
        megaObject = "primary",
        options = { force: false, onBefore: null, onAfter: null }
    ) {
        const { force = false, onBefore = null, onAfter = null } = options;
        const protectedShaneObjects = ["defaults", "protected", "state"];

        if (typeof onBefore === "function") {
            onBefore();
        }

        if (protectedShaneObjects.includes(shaneObjectName)) {
            console.log(
                `Cannot unsubscribe a default Shane object '${shaneObjectName}' in ${megaObject}`
            );
            return;
        }

        if (this[megaObject][shaneObjectName]) {
            const isEmpty =
                Object.keys(this[megaObject][shaneObjectName]).length === 0;

            if (force || isEmpty) {
                delete this[megaObject][shaneObjectName];
                this.#saveToStorage(megaObject, this[megaObject]);
                console.log(
                    `Unsubscribed from Shane object '${shaneObjectName}' in ${megaObject}`
                );
            } else {
                console.log(
                    `Shane object '${shaneObjectName}' in ${megaObject} contains data and was not removed. Use force to unsubscribe.`
                );
            }
        } else {
            console.log(
                `Shane object '${shaneObjectName}' does not exist in ${megaObject}`
            );
        }

        if (typeof onAfter === "function") {
            onAfter();
        }
    }

    /**
     * Asynchronously encrypts data using the specified encryption API.
     *
     * @param {Object} data - The data to be encrypted.
     * @returns {Object} - The encrypted data.
     */
    async _encryptData(data) {
        try {
            const response = await RequestManager.post(
                this.encryptionAPI,
                data,
                {
                    showError: true,
                    showLoading: true,
                }
            );
            return response;
        } catch (error) {
            console.error("Error encrypting data:", error);
            throw error;
        }
    }

    /**
     * Asynchronously decrypts data using the specified decryption API.
     *
     * @param {Object} encryptedData - The encrypted data to be decrypted.
     * @returns {Object} - The decrypted data.
     */
    async _decryptData(encryptedData) {
        try {
            const response = await RequestManager.post(
                this.decryptionAPI,
                encryptedData,
                {
                    showError: true,
                    showLoading: true,
                }
            );
            return response;
        } catch (error) {
            console.error("Error decrypting data:", error);
            throw error;
        }
    }

    /**
     * Public method to subscribe a Shane object.
     *
     * @param {string} shaneObjectName - The name of the Shane object to subscribe to.
     * @param {string} [megaObject="primary"] - The mega object to subscribe the Shane object to.
     * @param {Object} [options={}] - Options for event handlers.
     * @param {function} [options.onBefore=null] - A callback function to be executed before subscribing the Shane object.
     * @param {function} [options.onAfter=null] - A callback function to be executed after subscribing the Shane object.
     */
    subscribe(shaneObjectName, megaObject = "primary") {
        this._subscribeShaneObject(shaneObjectName, megaObject);
    }

    /**
     * Public method to unsubscribe a Shane object.
     *
     * @param {string} shaneObjectName - The name of the Shane object to unsubscribe from.
     * @param {string} [megaObject="primary"] - The mega object to unsubscribe the Shane object from.
     * @param {Object} [options={force: false}] - Options for forceful unsubscription. (Force removal even if the Shane object contains data.)
     * @param {function} [options.onBefore=null] - A callback function to be executed before unsubscribing the Shane object.
     * @param {function} [options.onAfter=null] - A callback function to be executed after unsubscribing the Shane object.
     */
    unsubscribe(
        shaneObjectName,
        megaObject = "primary",
        options = { force: false }
    ) {
        this._unsubscribeShaneObject(shaneObjectName, megaObject, options);
    }

    /**
     * Asynchronously sets an item in the specified Shane object and mega object.
     * Triggers optional onBefore and onAfter events if provided.
     *
     * @param {string} key - The key for the item to be set.
     * @param {any} value - The value of the item to be set.
     * @param {Object} [options={}] - Options for specifying the mega object, Shane object, encryption, expiration, and event handlers.
     * @param {string} [options.megaObject="primary"] - The mega object in which to store the item (e.g., "primary" or "secondary").
     * @param {string} [options.shaneObject="defaults"] - The Shane object within the mega object.
     * @param {boolean} [options.encrypt=false] - Whether to encrypt the data before storing.
     * @param {number|null} [options.expiration=null] - The expiration time for the item in months. If null, no expiration is set.
     * @param {function} [options.onBefore=null] - A callback function to be executed before the item is set.
     * @param {function} [options.onAfter=null] - A callback function to be executed after the item is set.
     *
     * @returns {Promise<void>} - A promise that resolves when the item is set.
     */
    async setItem(key, value, options = {}) {
        const {
            megaObject = "primary",
            shaneObject = "defaults",
            encrypt = false,
            expiration = null,
            onBefore = null,
            onAfter = null,
        } = options;

        if (onBefore && typeof onBefore === "function") {
            onBefore();
        }

        let saveData = value;
        if (encrypt) {
            saveData = await this._encryptData(value);
        }

        if (!this[megaObject]) {
            throw new Error(`Mega object '${megaObject}' does not exist`);
        }

        if (!this[megaObject][shaneObject]) {
            this._subscribeShaneObject(shaneObject, megaObject);
        }

        this[megaObject][shaneObject][key] = {
            data: saveData,
            expiration: expiration ? this.#setExpiration(expiration) : null,
        };

        this.#saveToStorage(megaObject, this[megaObject]);

        if (onAfter && typeof onAfter === "function") {
            onAfter();
        }
    }

    /**
     * Asynchronously retrieves an item from the specified Shane object and mega object.
     * Triggers optional onBefore and onAfter events if provided.
     *
     * @param {string} key - The key for the item to be retrieved.
     * @param {Object} [options={}] - Options for specifying mega object, Shane object, and event handlers.
     * @param {string} [options.megaObject="primary"] - The mega object to retrieve the item from.
     * @param {string|null} [options.shaneObject=null] - The Shane object to retrieve the item from. If null, searches all objects.
     * @param {function} [options.onBefore=null] - A callback function to be executed before retrieving the item.
     * @param {function} [options.onAfter=null] - A callback function to be executed after retrieving the item.
     *
     * @returns {any} - The retrieved item or null if not found, expired, or decryption failed.
     */
    async getItem(key, options = {}) {
        const {
            megaObject = "primary",
            shaneObject = null,
            onBefore = null,
            onAfter = null,
        } = options;

        if (typeof onBefore === "function") {
            onBefore();
        }

        const lookForKey = (megaObj) => {
            for (const obj in megaObj) {
                if (megaObj[obj][key]) {
                    return megaObj[obj][key];
                }
            }
            return null;
        };

        let result;
        if (shaneObject) {
            result = this[megaObject][shaneObject][key] || null;
        } else {
            result = lookForKey(this[megaObject]) || lookForKey(this.secondary);
        }

        if (!result) {
            console.log(`Item '${key}' not found`);
            return null;
        }

        if (result.expiration && new Date(result.expiration) < new Date()) {
            console.log(`Item '${key}' has expired`);
            return null;
        }

        if (shaneObject === "protected" && result.data) {
            result.data = await this._decryptData(result.data);
        }

        if (typeof onAfter === "function") {
            onAfter(result.data);
        }

        return result.data;
    }

    /**
     * Removes an item from the specified Shane object and mega object.
     * Triggers optional onBefore and onAfter events if provided.
     *
     * @param {string} key - The key for the item to be removed.
     * @param {Object} [options={}] - Options for specifying mega object, Shane object, and event handlers.
     * @param {string} [options.megaObject="primary"] - The mega object from which the item should be removed.
     * @param {string|null} [options.shaneObject=null] - The Shane object from which the item should be removed. If null, searches all objects.
     * @param {function} [options.onBefore=null] - A callback function to be executed before the item is removed.
     * @param {function} [options.onAfter=null] - A callback function to be executed after the item is removed.
     */
    removeItem(key, options = {}) {
        const {
            megaObject = "primary",
            shaneObject = null,
            onBefore = null,
            onAfter = null,
        } = options;

        if (typeof onBefore === "function") {
            onBefore();
        }

        if (shaneObject) {
            if (this[megaObject][shaneObject][key]) {
                delete this[megaObject][shaneObject][key];
                this.#saveToStorage(megaObject, this[megaObject]);

                if (typeof onAfter === "function") {
                    onAfter();
                }
            } else {
                console.log(
                    `Item '${key}' not found in ${shaneObject} of ${megaObject}`
                );
            }
        } else {
            for (const obj in this[megaObject]) {
                if (this[megaObject][obj][key]) {
                    delete this[megaObject][obj][key];
                    this.#saveToStorage(megaObject, this[megaObject]);

                    if (typeof onAfter === "function") {
                        onAfter();
                    }
                    return;
                }
            }
            for (const obj in this.secondary) {
                if (this.secondary[obj][key]) {
                    delete this.secondary[obj][key];
                    this.#saveToStorage("secondary", this.secondary);

                    if (typeof onAfter === "function") {
                        onAfter();
                    }
                    return;
                }
            }
        }
    }

    /**
     * Clears all items from the specified Shane object and mega object.
     * Triggers optional onBefore and onAfter events if provided.
     *
     * @param {Object} [options={}] - Options for specifying mega object, Shane object, and event handlers.
     * @param {string} [options.megaObject="primary"] - The mega object to clear items from.
     * @param {string|null} [options.shaneObject=null] - The Shane object to clear. If null, clears all Shane objects in the mega object.
     * @param {function} [options.onBefore=null] - A callback function to be executed before clearing the items.
     * @param {function} [options.onAfter=null] - A callback function to be executed after clearing the items.
     */
    clearAll(options = {}) {
        const {
            megaObject = "primary",
            shaneObject = null,
            onBefore = null,
            onAfter = null,
        } = options;

        if (typeof onBefore === "function") {
            onBefore();
        }

        if (shaneObject) {
            this[megaObject][shaneObject] = {};
            this.#saveToStorage(megaObject, this[megaObject]);
        } else {
            this[megaObject] = {
                defaults: {},
                protected: {},
                state: {},
            };
            this.#saveToStorage(megaObject, this[megaObject]);
        }

        if (typeof onAfter === "function") {
            onAfter();
        }
    }

    /**
     * Checks if a specified Shane object exists in the given mega object.
     *
     * @param {string} shaneObjectName - The name of the Shane object to check.
     * @param {string} [megaObject='primary'] - The mega object to check within ('primary' or 'secondary').
     * @returns {boolean} True if the Shane object exists, otherwise false.
     */
    isExist(shaneObjectName, megaObject = "primary") {
        return !!this[megaObject][shaneObjectName];
    }

    /**
     * Sets an expiration date based on the specified duration in months.
     *
     * @param {number} duration - The duration in months to set the expiration date.
     * @returns {string} - The ISO string representation of the expiration date.
     */
    #setExpiration(duration) {
        const now = new Date();
        const expirationDate = new Date(
            now.setMonth(now.getMonth() + duration)
        );
        return expirationDate.toISOString();
    }
}
