import Admin from "../../Admin";
import AdminPageManager from "../../UI/AdminPageManager";

let ADMIN = null;
let adminPageManager = null;
document.addEventListener("DOMContentLoaded", () => {
    console.log("admin panel loaded");
    ADMIN = new Admin();
     new AdminPageManager("admin-dashboard");
});

// function to log out the admin
const adminLogOut = () => {
    AdminPageManager.logout();
};

// expose the function to the global scope
window.adminLogOut = adminLogOut;
