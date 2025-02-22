import Core from "../../Core";

/**
 * @description
 * Text Manager
 */
export default class TextManager {
    constructor() {
        Core.debugLog("Text Manager instatiated");

        console.log(TextManager.passwordGenerator());;
    }

    /**
     * @description
     * Generate a random password
     * @param {number} min - Minimum length of the password
     * @param {number} max - Maximum length of the password
     * @returns {string} - Random password
     */
    static passwordGenerator(min = 8, max = 12) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const length = Math.floor(Math.random() * (max - min + 1)) + min;
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    }
}
