import Core from "../Core";
import PageManager from "./PageManager";

/**
 * @description
 * SignUpManager is the manager for the sign up page.
 *
 * @extends {PageManager}
 * @author Gayamina De Silva
 * @version {1.0.0}
 */
export default class SignUpManager extends PageManager {

    /**
     * @description
     * constructor for the SignUpManager class.
     *
     * @param {string} id - the id of the page container.
     */
    constructor() {
        super("sign-up");
    }

    /**
     * @description
     * load the page data that are needed for the page to function.
     *
     * @abstract
     */
    load() {
        this.data = {
            title: "Sign Up",
            description: "Sign Up Page",
        };
    }

    /**
     * @description
     * initialize the page features and functionalities.
     *
     * @abstract
     */
    init() {
        this.initializeIntlTelInput();
    }

    /**
     * @description
     * set the listners for the page
     */
    setListners() {
        this.ELM.setClickListners("#signUpBtn", this.signUp);
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
     * sign up the user
     */
    async signUp() {

        const inputs = Core.UIM.getInputs("signUpForm", {});
        console.log(inputs);
        const response = await Core.RM.post(
            "/api/register",inputs,
            {
                requestType: "json",
                responseType: "json",
                showToast: true,
            }
        );

        console.log(response);

        if (response.status === 200) {
            window.location.href = "/signin";
        }
    }

    /**
     * @description
     * initialize the intlTelInput
     */
    initializeIntlTelInput() {
        const input = document.querySelector("#su-s1-ipt-mn");
        window.intlTelInput(input, {
            // Set default country to Sri Lanka
            initialCountry: "lk",
            showSelectedDialCode: true,
            nationalMode: false,
        // Link to utils.js file in intl-tel-input plugin
        utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@21.1.1/build/js/utils.js",
        });

        document.querySelector(
            ".iti__arrow"
        ).innerHTML = `<i class="fa-solid fa-angle-down"></i>`;
    }

    
    handleResize() {
        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        var buttonElement = document.querySelector('.iti__country-container');
        var arrowElement = document.querySelector('.iti__arrow');
        var dialCode = document.querySelector('.iti__selected-dial-code');
      
        if (viewportWidth <= 215) {
          // Apply height style directly within the class
          buttonElement.style.cssText = 'height: 60% !important;margin-top:8px;padding-right:3px !important;';
          arrowElement.style.cssText = 'margin-left:2px !important;';
          dialCode.style.cssText = 'font-size: 12px !important;';
        } else if (viewportWidth >= 216 && viewportWidth <= 480) {
          // Apply height style directly within the class
          buttonElement.style.cssText = 'height: 60% !important;margin-top:8px;padding-right:5px !important;';
          arrowElement.style.cssText = '';
          dialCode.style.cssText = 'font-size: 12px !important;';
        } else {
          // Reset height style
          buttonElement.style.cssText = '';
          arrowElement.style.cssText = '';
          dialCode.style.cssText = 'font-size: 14px !important;';
        }
    }
}