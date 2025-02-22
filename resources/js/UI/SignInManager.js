import Core from "../Core";
import PageManager from "./PageManager";

/**
 * @description
 * SignInManager is the manager for the sign in page.
 *
 * @extends {PageManager}
 * @author Gayamina De Silva
 * @version {1.0.0}
 */
export default class SignInManager extends PageManager {
    /**
     * @description
     * constructor for the SignInManager class.
     *
     * @param {string} id - the id of the page container.
     */
    constructor() {
        super("sign-in");
    }

    /**
     * @description
     * load the page data that are needed for the page to function.
     *
     * @abstract
     */
    async load() {
        this.data = {
            title: "Sign In",
            description: "Sign In Page",
        };

        // this.data.product = await Core.SS.search("products");
        // this.data.sub_category = await Core.SS.search("sub-categories");
        // this.data.main_category = await Core.SS.search("main-categories");

        // Core.debugLog(this.data.product);
        // Core.debugLog(this.data.sub_category);
        // Core.debugLog(this.data.main_category);
    }

    /**
     * @description
     * initialize the page features and functionalities.
     *
     * @abstract
     */
    init() {
    }

    /**
     * @description
     * set the listners for the page
     */
    setListners() {
        this.ELM.setClickListners("#signInBtn", this.login);
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
    actions() {

    }

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
        const inputs = Core.UIM.getInputs("signInForm", {});

        const response = await Core.RM.post("/api/login", inputs, {
            requestType: "json",
            responseType: "json",
            showToast: true,
        });
        console.log(response);
        if (response.token) {
            Core.debugLog(response.token);
            Core.LSM.setItem("token", response.token);
            console.log("Success");
            try {

                const res = await fetch(`/web-auth?token=${response.token}`, {
                    method: "GET",
                    headers: {
                      "Accept": "application/json",
                      "Authorization": `Bearer ${response.token}`,
                    },
                });
                window.location.href ="/home";
            } catch (error) {
                console.error("Error in GET request:", error);
            }
        } else {
            console.log("Token is missing, unable to proceed");
        }
        
    }
}
