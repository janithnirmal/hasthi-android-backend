/**
 * base filter class for filtering data
 */
export default class Filter {
    /**
     * data filter for globale usecases
     *
     * @param {object} data data object
     * @param {string} filterPattern string format for the filter pattern
     * @returns {string}
     */
    constructor(data, filterPattern = "") {
        this.data = data ?? "";
        this.filterPattern = filterPattern ?? "";
    }

    /**
     * run the filter
     *
     * @returns {string}
     */
    run() {
        this.filterPattern.split("|").forEach((filter) => {
            const [method, ...args] = filter.split(":");
            if (typeof this[method] === "function") {
                if (args && args.length > 0) {
                    this.data = this[method](this.data, ...args);
                } else {
                    this.data = this[method](this.data);
                }
            }
        });

        return this.data;
    }

    /**
     *
     * @param {string} price price string
     * @param {string} format filter pattern
     * @returns
     */
    price(price, format = "LKR") {
        return `${price} ${format}`;
    }

    /**
     *
     * @param {string} price price as int or float
     * @returns
     */
    formatPrice(price) {
        price = Number(price);
        return `${parseFloat(price)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

    /**
     * append a strig to an end or begging of a string
     * @param {string} text original string
     * @param {string} addition the stirng to be append
     * @param {boolean} prepend if this is a prepend or not
     */
    appendString(text, addition, withGap = false, prepend = false) {
        try {
            withGap = JSON.parse(withGap);
            prepend = JSON.parse(prepend);
        } catch (error) {}

        addition = withGap
            ? prepend
                ? addition + " "
                : " " + addition
            : addition;
        return prepend ? addition + text : text + addition;
    }

    /**
     * Creates a crossed string span DOM element.
     * @param {string} text The text to be crossed.
     * @returns {string} The HTML string for a span element with a line-through style.
     */
    crossedString(text) {
        return `<span style="text-decoration: line-through;">${text}</span>`;
    }

    /**
     * Modifies the case of the input string based on the specified option.
     * @param {string} text The input string.
     * @param {string} [option] The case modification option. Defaults to "firstCapital".
     * @returns {string} The modified string.
     */
    textcase(text, option = "firstLetter") {
        switch (option) {
            case "uppercase":
                return text.toUpperCase();
            case "lowercase":
                return text.toLowerCase();
            case "wordFirstLetter":
                return text
                    .split(" ")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" ");
            default:
                return (
                    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
                );
        }
    }

    images(images, key = "path", type = "tumb") {
        if (!images || images.length <= 0) {
            return images;
        }

        let element = "";
        for (const image of images) {
            if (type === "tumb") {
                element += `<img src="${image[key]}" alt="${
                    image.product_id + "_" + image.id
                }" role="button" class="iz-rounded-1" style="aspect-ratio: 4/5; object-fit: cover; width: 10%;" alt="product-000">`;
            } else if (type === "main") {
                element = `<img src="${image[key]}" alt="${
                    image.product_id + "_" + image.id
                }" class="small" data-field="images" style="aspect-ratio: 4/5; object-fit: cover;" />`;
                break;
            }
        }
        return element;
    }

    // to data from data like this : 2025-08-26 22:47:32
    toDate() {
        return new Date(this.data).toLocaleDateString();
    }

    // to time from data like this : 2025-08-26 22:47:32
    toTime() {
        return new Date(this.data).toLocaleTimeString();
    }

    // create image
    toImg(image, classes = "", alt = "image") {
        return `<img src="${image}?${new Date().getTime()}" alt="${alt}" class="${classes}" />`;
    }

    // name formatter
    nameFormatter(string, format = "") {
        if (format === "firstLetter") {
            return string
                .split(" ")
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                .join(" ");
        } else if (format === "pascal_underscore") {
            return string
                .split("_")
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                .join(" ");
        } else {
            return string;
        }
    }

    /**
     *
     * @param {number} length the length of the text
     * @returns
     */
    maxTextLength(string, length = 100) {
        return string.length > length
            ? string.substring(0, length) + "..."
            : string;
    }

    /**
     *
     * @param {number} value the value to check
     * @returns
     */
    isAvailable(value) {
        return value > 0 ? "Available" : "Not Available";
    }
}

// console.log(
//     new Filter(
//         "2231.43",
//         "formatPrice|price:$|appendString:Your Price is :true:true|appendString:and isn't is good!:true:false|textcase:wordFirstLetter"
//     ).run()
// );
