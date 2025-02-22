import LocalStorageManager from "./LocalStorageManager.js";

/**
 * ToastManager is a class designed to handle the creation and management of toast notifications
 * within a web application. It provides methods for displaying, updating, and dismissing toasts,
 * with customizable options for positioning, duration, and animations. The ToastManager aims
 * to enhance user experience by providing timely feedback and notifications in a non-intrusive way.
 *
 * @class
 * @version 1.0
 * @author Prashan Silva (ShaNe)
 * @remarks
 * Author's Notes:
 * - Ensure that the toast container is properly initialized in the DOM to avoid "where did my toast go?" moments.
 * - Be mindful of the maximum number of concurrent toasts; too many can overwhelm the user.
 * - Customize animations to fit the design aesthetics of your application—smooth transitions make for a better experience.
 * - Remember: toasts should inform, not annoy. Use durations wisely to keep users engaged without frustration.
 * - If you notice a bug, consider it an opportunity for improvement — feedback is a gift!
 */
export default class ToastManager {
    /**
     * Initializes the ToastManager with default options.
     *
     * @param {Object} options - Configuration options for the toast manager.
     * @param {boolean} options.closeButton - If true, shows a close button on the toast.
     * @param {boolean} options.showIcon - If true, shows an icon based on the toast type.
     * @param {boolean} options.newestOnTop - If true, new toasts appear at the top.
     * @param {string} options.position - Position of the toast container
     *  - top-start
     *  - top-center
     *  - top-end
     *  - middle-start
     *  - middle-center
     *  - middle-end
     *  - bottom-start
     *  - bottom-center
     *  - bottom-end
     * @param {number} options.timeout - Duration in milliseconds before a toast auto-dismisses.
     * @param {number} options.extendedTimeout - Duration for the timeout extension on hover.
     * @param {number} options.maxConcurrentToasts - Maximum number of toasts displayed concurrently.
     * @param {string} options.animationType - Type of animation for showing/hiding toasts (e.g., "fade").
     */
    constructor(options = {}) {
        this.options = {
            closeButton: false,
            showIcon: false,
            newestOnTop: false,
            position: "top-end",
            timeout: 3000,
            extendedTimeout: 1000,
            maxConcurrentToasts: 5,
            animationType: "fade",
            // -------------------------- Under Construction --------------------------
            progressBar: false,
            persistState: true,
            theme: {
                success: {
                    background: "#4CAF50",
                    textColor: "#fff",
                    icon: "✅",
                },
                error: { background: "#F44336", textColor: "#fff", icon: "❌" },
                info: { background: "#2196F3", textColor: "#fff", icon: "ℹ️" },
            },
            // -------------------------- Under Construction --------------------------
            ...options,
        };

        this.localStorageManager = new LocalStorageManager();

        this.toastQueue = [];
        this.currentToasts = [];
        this.toastContainer = this.#createToastContainer();
        this.#loadPersistedToasts();
    }

    /**
     * Creates the toast container element and appends it to the body.
     *
     * @returns {HTMLElement} The toast container element.
     */
    #createToastContainer() {
        const container = document.createElement("div");
        container.classList.add("toast-container");
        container.style.position = "fixed";

        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = this.options.newestOnTop
            ? "column-reverse"
            : "column";

        const [vertical, horizontal] = this.options.position.split("-");

        container.style[vertical == "middle" ? "top" : vertical] =
            vertical == "middle" ? "50%" : "0";
        if (vertical == "middle") {
            container.style.transform = "translateY(-50%)";
        }

        container.style[
            this.#getHorizontalPosition(horizontal) == "center"
                ? "left"
                : this.#getHorizontalPosition(horizontal)
        ] = this.#getHorizontalPosition(horizontal) == "center" ? "50%" : "0";

        if (this.#getHorizontalPosition(horizontal) == "center") {
            container.style.transform = "translateX(-50%)";
        }

        container.style.alignItems = horizontal;

        container.style.gap = "10px";
        container.style.padding = "10px";

        document.body.appendChild(container);
        return container;
    }

    /**
     * Returns the appropriate CSS property for horizontal position.
     *
     * @param {string} position - The horizontal position.
     * @returns {string} The CSS property for the horizontal position.
     */
    #getHorizontalPosition(position) {
        switch (position) {
            case "start":
                return "left";
            case "center":
                return "center";
            case "end":
                return "right";
            default:
                return "center";
        }
    }

    /**
     * Displays a toast with the specified type and message.
     * @param {("success" | "error" | "warning" | "info")} type - The type of toast.
     * @param {string} message - The message to display in the toast.
     * @param {Object} userEvents - User-defined event callbacks.
     * @param {Object} userOptions - User-defined options for the toast.
     */
    show(type, message, userEvents = {}, userOptions = {}) {
        const options = {
            ...this.options,
            persistState: false,
            ...userOptions,
        };
        const theme = this.options[type] || options.theme.type;

        if (this.currentToasts.length >= options.maxConcurrentToasts) {
            this.toastQueue.push({ type, message, options });
            return;
        }

        const event = {
            onBeforeShow: () => {},
            onAfterShow: () => {},
            onClick: () => {},
            ...userEvents,
        };

        event.onBeforeShow();

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.style.borderRadius = "5px";
        toast.style.backgroundColor = this.#getToastBackgroundColor(type);
        toast.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        toast.style.display = "flex";
        toast.style.flexDirection = "column";
        toast.style.alignItems = "start";
        toast.style.transition = `opacity ${this.options.showDuration}ms`;
        toast.style.cursor = "pointer";

        const toastBody = document.createElement("div");
        toastBody.style.display = "flex";
        toastBody.style.flexDirection = "row";
        toastBody.style.alignItems = "center";
        toastBody.style.justifyContent = "start";
        toastBody.style.color = "#fff";

        const content = document.createElement("div");
        content.style.padding = "15px 15px";
        content.style.display = "flex";
        content.style.flexDirection = "row";
        content.style.justifyContent = "start";
        content.style.alignItems = "center";

        if (this.options.showIcon) {
            const icon = document.createElement("span");
            icon.innerHTML = this.#getToastIcon(type);
            icon.style.marginRight = "10px";
            icon.style.display = "flex";
            icon.children[0].style.width = "20px";
            icon.children[0].style.fill = "#fff";
            content.appendChild(icon);
        }

        const text = document.createElement("span");
        text.textContent = message;
        content.appendChild(text);
        content.addEventListener("click", () => {
            event.onClick();
            this.#removeToast(toast);
        });
        toastBody.appendChild(content);

        if (this.options.closeButton) {
            const closeButton = document.createElement("div");
            closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;
            closeButton.style.background = "rgba(0, 0, 0, 0.1)";
            closeButton.style.border = "none";
            closeButton.style.display = "flex";
            closeButton.children[0].style.fill = "#fff";
            closeButton.children[0].style.width = "15px";
            closeButton.style.height = "max-content";
            closeButton.style.padding = "15px 10px";
            closeButton.style.borderTopRightRadius = "5px";
            if (this.options.progressBar) {
                closeButton.style.borderBottomRightRadius = "0";
            } else {
                closeButton.style.borderBottomRightRadius = "5px";
            }
            closeButton.style.cursor = "pointer";
            closeButton.addEventListener("click", () =>
                this.#removeToast(toast)
            );
            closeButton.addEventListener("mouseenter", () => {
                closeButton.style.background = "rgba(0, 0, 0, 0.2)";
            });
            closeButton.addEventListener("mouseleave", () => {
                closeButton.style.background = "rgba(0, 0, 0, 0.1)";
            });
            closeButton.addEventListener("mousedown", () => {
                closeButton.style.background = "rgba(0, 0, 0, 0.3)";
            });
            closeButton.addEventListener("mouseup", () => {
                closeButton.style.background = "rgba(0, 0, 0, 0.2)";
            });
            toastBody.appendChild(closeButton);
        }

        toast.appendChild(toastBody);

        if (options.progressBar) {
            const progressBar = this.#createProgressBar(options.timeout);
            toast.appendChild(progressBar);
            setTimeout(() => {
                progressBar.children[0].style.width = "0";
            }, 0);

            toast.addEventListener("mouseenter", () => {
                progressBar.children[0].style.transition = "";
            });

            toast.addEventListener("mouseleave", () => {
                progressBar.children[0].style.transition = `width ${this.options.extendedTimeout}ms linear`;
                progressBar.children[0].style.width = "0";
            });
        }

        this.toastContainer.appendChild(toast);
        this.currentToasts.push(toast);

        this.#animateToastIn(toast, options.animationType);

        event.onAfterShow();

        this.autoDismissToast(toast, options.timeout);

        if (options.persistState) {
            this.#persistToast(type, message, event, options);
        }
    }

    /**
     * Automatically dismisses the toast after a specified timeout.
     *
     * @param {HTMLElement} toast - The toast element to dismiss.
     * @param {number} timeout - The timeout duration.
     */
    autoDismissToast(toast, timeout) {
        let remainingTime = timeout;
        let dismissTimer = setTimeout(() => this.#removeToast(toast), timeout);

        toast.addEventListener("mouseover", () => {
            clearTimeout(dismissTimer);
        });
        toast.addEventListener("mouseleave", () => {
            dismissTimer = setTimeout(
                () => this.#removeToast(toast),
                remainingTime
            );
        });
    }

    /**
     * Returns the background color associated with a toast type.
     *
     * @param {string} type - The type of toast.
     * @returns {string} The background color for the toast.
     */
    #getToastBackgroundColor(type) {
        switch (type) {
            case "success":
                return "#22c55e";
            case "error":
                return "#ef4444";
            case "warning":
                return "#eab308";
            case "info":
                return "#3b82f6";
            default:
                return "#333";
        }
    }

    /**
     * Returns the appropriate icon SVG for a toast type.
     *
     * @param {string} type - The type of toast.
     * @returns {string} The SVG icon for the toast.
     */
    #getToastIcon(type) {
        switch (type) {
            case "success":
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`;
            case "error":
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>`;
            case "warning":
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`;
            case "info":
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`;
            default:
                return "";
        }
    }

    /**
     * Removes a toast from the DOM and manages the toast queue.
     *
     * @param {HTMLElement} toast - The toast element to remove.
     */
    #removeToast(toast) {
        this.#animateToastOut(toast);
        this.currentToasts = this.currentToasts.filter((t) => t !== toast);

        if (this.toastQueue.length > 0) {
            const nextToast = this.toastQueue.shift();
            this.show(nextToast.type, nextToast.message, nextToast.options);
        }
    }

    /**
     * Creates a progress bar element for the toast.
     *
     * @param {number} timeout - The timeout duration for the toast.
     * @returns {HTMLElement} The progress bar element.
     */
    #createProgressBar(timeout) {
        const progressBar = document.createElement("div");
        progressBar.style.position = "relative";
        progressBar.style.bottom = "0";
        progressBar.style.left = "0";
        progressBar.style.width = "100%";
        progressBar.style.height = "5px";
        progressBar.style.backgroundColor = "rgba(0, 0, 0, 0.1)";

        const progress = document.createElement("div");
        progress.style.height = "100%";
        progress.style.width = "100%";
        progress.style.backgroundColor = "#fff";
        progress.style.transition = `width ${timeout}ms linear`;
        progressBar.appendChild(progress);

        return progressBar;
    }

    /**
     * Animates the toast in with the specified animation type.
     *
     * @param {HTMLElement} toast - The toast element to animate.
     * @param {string} animationType - The type of animation to use (fade).
     */
    #animateToastIn(toast, animationType) {
        if (animationType === "fade") {
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.style.opacity = "1";
                toast.style.transition = "opacity 0.5s ease-in";
            }, 0);
        } else if (animationType === "slide") {
            toast.style.transform = "translateY(20px)";
            setTimeout(() => {
                toast.style.transform = "translateY(0)";
                toast.style.transition = "transform 0.5s ease-in-out";
            }, 0);
        }
    }

    /**
     * Animates the toast out and removes it from the DOM.
     *
     * @param {HTMLElement} toast - The toast element to animate out.
     *
     */
    #animateToastOut(toast) {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.5s ease-out";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }

    /**
     * Updates global options for the ToastManager.
     *
     * @param {Object} newOptions - New options to apply.
     */
    updateGlobalOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }

    /**
     * Persists the toast state to local storage for later retrieval.
     *
     * @param {string} type - The type of toast.
     * @param {string} message - The message for the toast.
     * @param {Object} userEvents - User-defined event callbacks.
     * @param {Object} options - Options for the toast.
     */
    #persistToast(type, message, userEvents, options) {
        const toastOptions = { ...options, persistState: false };
        this.localStorageManager.getItem("persistedToasts").then((value) => {
            const savedToasts = JSON.parse(value) || [];
            savedToasts.push({ type, message, userEvents, toastOptions });

            this.localStorageManager.setItem(
                "persistedToasts",
                JSON.stringify(savedToasts),
                {
                    megaObject: "secondary",
                    shaneObject: "state",
                }
            );
        });
    }

    /**
     * Loads persisted toasts from local storage and displays them.
     */
    #loadPersistedToasts() {
        if (!this.options.persistState) return;

        this.localStorageManager.getItem("persistedToasts").then((value) => {
            let savedToasts = JSON.parse(value) || [];

            savedToasts.forEach((toast) => {
                this.show(
                    toast.type,
                    toast.message,
                    toast.events,
                    toast.options
                );
            });

            this.localStorageManager.removeItem("persistedToasts");
        });
    }

    // -------------------------- laoding effect --------------------------
    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

        const spinner = document.createElement("div");
        spinner.id = "custom-spinner";
        spinner.style.cssText = `
        position: relative;
        width: 50px;
        height: 50px;
    `;

        for (let i = 0; i < 4; i++) {
            const dot = document.createElement("div");
            dot.style.cssText = `
            position: absolute;
            width: ${6 + i * 2}px;
            height: ${6 + i * 2}px;
            background-color: white;
            border-radius: 50%;
            animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            top: 50%;
            left: 50%;
            transform-origin: 0 20px;
            transform: rotate(${i * 90}deg) translateX(-50%) translateY(-50%);
            animation-delay: ${i * 0.15}s;
        `;
            spinner.appendChild(dot);
        }

        overlay.appendChild(spinner);
        document.body.appendChild(overlay);

        const style = document.createElement("style");
        style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg) translateX(-50%) translateY(-50%); }
            100% { transform: rotate(360deg) translateX(-50%) translateY(-50%); }
        }
    `;
        document.head.appendChild(style);
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById("loading-overlay");
        if (overlay) {
            overlay.remove();
        }

        const style = document.head.querySelector("style");
        if (style) {
            style.remove();
        }
    }
}
