/**
 * @typedef {Object} ImagePickerObject
 * @property {ImagePicker} picker - The image picker instance.
 * @property {Element} container - The DOM element container.
 */

/**
 * Image Picker Manager
 */
export class ImageInputManager {
    /** @type {Array<ImagePickerObject>} */
    static pickers = [];

    /**
     * create an object of image picker
     *
     * @param {Element} container image picker container
     * @param {Object} duplicatePolicy
     * @param {string} style
     * @param {Object} theme
     */
    createImagePicker(container, options = null) {
        const picker = {
            picker: new ImagePicker(container, options),
            container,
        };
        ImageInputManager.pickers.push(picker);
        return picker;
    }

    /**
     * destroy all the image pickers objects
     */
    destoryAll() {
        ImageInputManager.pickers = [];
    }

    /**
     * get all the active image pickers
     */
    getPickers() {
        return ImageInputManager.pickers;
    }

    /**
     * get an image picker by it's container
     *
     * @param {container} container container object of image picekr
     */
    getPicker(container) {
        return ImageInputManager.pickers.find(
            (item) => item.container == container
        );
    }
}

/**
 * image picker for input forms with drag and drop functionality
 *
 * @version 1.0.0
 * @author savith panamgama / https://github.com/Savith-02
 */
export class ImagePicker {
    /**
     * Create an instance of an image picker
     * @param {Element} documentNode - DOM container element referencing the image picker
     * @param {Object} options - Configuration options
     */
    constructor(documentNode, options = {}) {
        this.options = {
            id: "1",
            duplicatePolicy: { type: "none", max: 1 },
            style: "app",
            theme: {},
            ...options,
        };

        this.images = [];
        this.initializeElements(documentNode);
        this.alertManager = new AlertManager(this.parentDiv);
        this.applyStyle();
        this.addEventListeners();
    }

    initializeElements(documentNode) {
        this.parentDiv = documentNode;
        this.imagePickerElement = documentNode.querySelector(".image-picker");
        this.thumbnailsElement = documentNode.querySelector(".thumbnails");
        this.imageInput = documentNode.querySelector(".imageInput");
        this.downloadBtn = documentNode.querySelector(".downloadBtn");
        this.loadingScreen = documentNode.querySelector(".loading-screen");
    }

    applyStyle() {
        this.imagePickerElement.classList.add(this.options.style);
    }

    addEventListeners() {
        this.imagePickerElement.addEventListener(
            "click",
            this.handleImagePickerClick.bind(this)
        );
        this.imageInput.addEventListener(
            "change",
            this.handleImageInputChange.bind(this)
        );
        this.imageInput.addEventListener(
            "cancel",
            this.handleImageInputCancel.bind(this)
        );
        this.downloadBtn.addEventListener("click", () => this.downloadImages());
        this.addDragAndDropListeners();
    }

    addDragAndDropListeners() {
        const events = ["dragenter", "dragover", "dragleave", "drop"];
        events.forEach((eventName) => {
            this.imagePickerElement.addEventListener(
                eventName,
                this.preventDefault
            );
        });

        this.imagePickerElement.addEventListener(
            "dragenter",
            this.highlight.bind(this)
        );
        this.imagePickerElement.addEventListener(
            "dragover",
            this.highlight.bind(this)
        );
        this.imagePickerElement.addEventListener(
            "dragleave",
            this.unhighlight.bind(this)
        );
        this.imagePickerElement.addEventListener(
            "drop",
            this.handleDrop.bind(this)
        );
    }

    handleImagePickerClick(event) {
        if (event.detail !== 1) return;
        this.imageInput.click();
        this.imageInput.disabled = true;
    }

    handleImageInputChange(e) {
        this.handleImageSelection(e.target.files);
        e.target.value = "";
        this.imageInput.disabled = false;
    }

    handleImageInputCancel() {
        if (this.imageInput.disabled) {
            this.imageInput.disabled = false;
        }
    }

    preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.imagePickerElement.classList.add("active");
    }

    unhighlight() {
        this.imagePickerElement.classList.remove("active");
    }

    handleDrop(e) {
        this.unhighlight();
        this.handleImageSelection(e.dataTransfer.files);
    }

    async handleImageSelection(files) {
        this.showLoadingScreen();
        try {
            await Promise.all(
                Array.from(files).map((file) => this.handleImage(file))
            );
        } catch (error) {
            console.error("Error handling image selection:", error);
        } finally {
            this.hideLoadingScreen();
            this.imageInput.disabled = false;
        }
    }

    async handleImage(file) {
        if (!this.validateImage(file)) {
            this.alertManager.show(
                "Invalid file type. Only images are allowed",
                "info"
            );
            return false;
        }

        const imageObject = await this.readFileAsDataURL(file);
        if (this.canAddImage(imageObject)) {
            this.images.push(imageObject);
            this.displayImages();
            this.showSuccess();
            return true;
        } else {
            this.alertManager.show("Duplicate image not allowed!", "error");
            return false;
        }
    }

    readFileAsDataURL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
                resolve({ src: e.target.result, name: file.name });
            reader.readAsDataURL(file);
        });
    }

    validateImage(file) {
        return file.type.startsWith("image/");
    }

    canAddImage(image) {
        if (this.images.some((img) => img.name === image.name)) {
            return false;
        }

        switch (this.options.duplicatePolicy.type) {
            case "none":
                return !this.images.some((img) => img.src === image.src);
            case "limited":
                return (
                    this.images.filter((img) => img.src === image.src).length <
                    this.options.duplicatePolicy.max
                );
            case "no-consecutive":
                return (
                    this.images.length === 0 ||
                    this.images[this.images.length - 1].src !== image.src
                );
            default:
                return true;
        }
    }

    displayImages() {
        this.thumbnailsElement.innerHTML = "";
        this.images.forEach((image, index) => {
            const thumbnail = new Thumbnail(
                image,
                index,
                this,
                this.options.id
            );
            this.thumbnailsElement.appendChild(thumbnail.getElement());
        });
    }

    removeImage(index) {
        this.images.splice(index, 1);
        this.displayImages();
    }

    showSuccess() {
        this.imagePickerElement.classList.add("success");
        setTimeout(
            () => this.imagePickerElement.classList.remove("success"),
            1000
        );
        this.alertManager.show("Image added!", "success");
    }

    downloadImages(format = "file") {
        if (format === "file") {
            const jsonData = JSON.stringify(this.images);
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "imageData.json";
            link.click();
            URL.revokeObjectURL(url);
        } else {
            return this.images;
        }
    }

    showLoadingScreen() {
        this.loadingScreen.style.display = "flex";
    }

    hideLoadingScreen() {
        this.loadingScreen.style.display = "none";
    }

    /**
   * get the list of image objects for selected images

   * @returns {[File]Array}
   */
    getImageFiles() {
        return this.images.map((image) => {
            const [, base64Data] = image.src.split(",");
            const byteString = atob(base64Data);
            const mimeString = image.src.split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            return new File([blob], image.name, { type: mimeString });
        });
    }

    /**
     * get the list of image objects for selected images
     *
     * @returns {[File]Array}
     */
    getImageDataURLs() {
        return this.images.map((image) => image.src);
    }

    /**
     * add a file, data URL or a url for an image to the image picker
     *
     * @param {File|string}
     */
    async addImage(input) {
        if (input instanceof File) {
            console.log("Handling File input:", input);
            return this.handleImage(input);
        } else if (typeof input === "object" && input.src && input.name) {
            if (input.src.startsWith("data:image/")) {
                console.log("Handling Data URL input:", input);
                if (this.canAddImage(input)) {
                    this.images.push(input);
                    this.displayImages();
                    this.showSuccess();
                    return true;
                } else {
                    this.alertManager.show(
                        "Duplicate image not allowed!",
                        "error"
                    );
                    return false;
                }
            } else {
                console.log("Handling URL input:", input);
                try {
                    const response = await fetch(input.src);
                    const blob = await response.blob();
                    console.log("Fetched image:", blob);
                    const mimeType = blob.type;
                    if (mimeType.startsWith("image/")) {
                        // Convert to a File
                        const file = new File([blob], input.name, {
                            type: mimeType,
                        });
                    } else {
                        return this.handleImage(file);
                    }
                } catch (error) {
                    console.error("Error fetching image:", error);
                    this.alertManager.show(
                        "Error loading image from URL",
                        "error"
                    );
                    return false;
                }
            }
        } else {
            console.error("Invalid input type");
            return false;
        }
    }

    /**
     * clear the images in the picker
     */
    clear() {
        this.images = [];
        this.displayImages();
    }
}

export class Thumbnail {
    /**
     *
     * @param {*} image
     * @param {*} index
     * @param {ImagePicker} imagePicker
     * @param {*} id
     */
    constructor(image, index, imagePicker, id) {
        // console.log(`Creating thumbnail for image: ${image.name}, index: ${index}`);
        this.image = image;
        this.index = index;
        this.imagePicker = imagePicker;
        this.element = document.createElement("div");
        this.element.className = "thumbnail";
        this.id = id;
        this.element.appendChild(this.#createItem());
    }

    #createItem() {
        const html = `<div class="d-flex">
                    <img src="${this.image.src}" alt="${this.image.name}">
                    <div class="cross" >X</div>
                  </div>`;
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        const elemet = template.content.firstChild;
        elemet.querySelector(".cross").addEventListener("click", () => {
            this.imagePicker.removeImage(this.index);
        });
        return elemet;
    }

    getElement() {
        return this.element;
    }
}

export class Alert {
    constructor(message, type, manager, parent) {
        this.message = message;
        this.type = type;
        this.manager = manager;
        this.parent = parent;
        this.counter = 1;
        this.element = this.createElement();
        this.startTimeout();
    }

    createElement() {
        const alertElement = document.createElement("div");
        alertElement.className = `alert alert-${this.type}`;
        alertElement.innerHTML = `
      <span class="message">${this.message}</span>
      <span class="counter">${this.counter}</span>
      <span class="close">&times;</span>
    `;

        alertElement.querySelector(".close").addEventListener("click", () => {
            this.dismiss();
        });

        this.parent.querySelector(".alertContainer").appendChild(alertElement);
        return alertElement;
    }

    incrementCounter() {
        this.counter += 1;
        this.element.querySelector(".counter").textContent = this.counter;
    }

    startTimeout() {
        this.timeoutId = setTimeout(() => {
            this.dismiss();
        }, 3000);
    }

    resetTimeout() {
        clearTimeout(this.timeoutId);
        this.startTimeout();
    }

    dismiss() {
        this.element.remove();
        this.manager.removeAlert(this);
    }
}

export class AlertManager {
    constructor(parent) {
        this.parent = parent;
        this.alerts = [];
    }

    show(message, type = "info") {
        const existingAlert = this.alerts.find((alert) => alert.type === type);

        if (existingAlert) {
            existingAlert.incrementCounter();
            existingAlert.resetTimeout();
            existingAlert.element.style.animation = "none";
            existingAlert.element.offsetHeight;
            existingAlert.element.style.animation = "fade-in 0.5s";
        } else {
            const alert = new Alert(message, type, this, this.parent);
            this.alerts.push(alert);
        }
    }

    removeAlert(alert) {
        this.alerts = this.alerts.filter((a) => a !== alert);
    }
}
