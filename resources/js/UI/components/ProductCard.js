import Core from "../../Core";

/**
 * ProductCard class responsible for rendering and managing product cards.
 * @class ProductCard
 * @author Janith Nirmal
 * @version 1.0
 * @description This class is responsible for rendering and managing product cards. It contains methods for handling product card functionality.
 */
export default class ProductCard {
    /**
     * @private
     * @type {Object}
     * @property {boolean} hasBadge - Whether the product card has a badge.
     * @property {string} badgeKey - The key for the badge.
     * @description The options for the product card.
     */
    #_options;

    /** @type {ProductCard} a product card component */
    card = null;

    /**
     * Creates an instance of ProductCard.
     * @param {Object} data - The data of the product to be displayed in the card.
     * @param {Object} options - The options for the product card.
     * @memberof ProductCard
     */
    constructor(data, options = {}) {
        this.#_options = {
            hasBadge: false,
            badgeKey: "",
            ...options,
        };

        this.card = this.loadComponent(data);
    }

    /**
     *
     * @returns {ProductCard}
     */
    getComponent() {
        return this.card;
    }

    /**
     * Loads the product card component.
     * @param {Object} data - The data of the product to be displayed in the card.
     */
    loadComponent(data) {
        // Fetch the HTML template for the product card component
        const cardTemplate = document.querySelector(
            '[data-tempalte-name="product-card"]'
        );

        if (!cardTemplate) {
            Core.debugLog("Product card template not found");
            return;
        }

        const documentFragment = cardTemplate.content.firstElementChild;

        documentFragment.querySelector(
            "[data-product-link]"
        ).href = `/${data.slug}`;

        /** @type {Element} */
        const card = documentFragment.cloneNode(true);
        Core.UIM.setFields(card, data); // set data for fields

        card.querySelector(".product-preview").src =
            data.images && data.images.length ? data.images[0].path : "#";

        const tumbContainer = card.querySelector(".product-thumbnails");
        const tumbnail = tumbContainer.firstElementChild.cloneNode(true);
        tumbContainer.innerHTML = "";
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                const clonedThumbnail = tumbnail.cloneNode(true);
                clonedThumbnail.src = image.path;
                tumbContainer.appendChild(clonedThumbnail);
            });
        }
        return card;
    }
}
