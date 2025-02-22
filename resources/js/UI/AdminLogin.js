import Core from "../Core";
import PageManager from "./PageManager";

/**
 * @description
 * AdminLogin is the manager for the admin sign in page.
 *
 * @extends {PageManager}
 * @author Gayamina De Silva
 * @version {1.0.0}
 */
export default class AdminLogin extends PageManager {
    /**
     * @description
     * constructor for the AdminLogin class.
     *
     * @param {string} id - the id of the page container.
     */
    constructor() {
        super("admin-sign-in");
    }

    /**
     * @description
     * load the page data that are needed for the page to function.
     *
     * @abstract
     */
    async load() {
        this.data = {
            title: "Admin Sign In",
            description: "Admin Sign In Page",
        };
    }

    /**
     * @description
     * initialize the page features and functionalities.
     *
     * @abstract
     */
    init() {}

    /**
     * @description
     * set the listners for the page
     */
    setListners() {
        this.ELM.setClickListners("#adminLoginBtn", this.login);
        this.ELM.setClickListners("#showPasswordBtn", () => {
            this.showPassword("password");
        });
    }

    /**
     * @description
     * actions for the page that will be called after the page is initialized.
     *
     * @abstract
     */
    actions() {}

    /**
     * @description
     * show password for the password field
     *
     * @param {string} section - the section of the password field
     */
    showPassword(section) {
        const passwordField = document.getElementById(section);
        const showPasswordBtn = document.getElementById("showPasswordBtn");

        if (passwordField.type === "password") {
            passwordField.type = "text";
            showPasswordBtn.innerHTML = `<i class="fa-solid fa-eye"></i>`;
        } else {
            passwordField.type = "password";
            showPasswordBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
        }
    }

    /**
     * @description
     * login the user
     */
    async login() {
        const inputs = Core.UIM.getInputs("adminLoginForm", {});

        const response = await Core.RM.post("/admin/login", inputs, {
            requestType: "json",
            responseType: "json",
            showToast: true,
            onSuccess: () => {
                window.location.href = "/admin/";
            },
        });
    }
}
