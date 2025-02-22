import Core from "./Core";

setTimeout(() => {
    spinnerPause();
}, 1500);

// main js file
document.addEventListener("DOMContentLoaded", async function () {
    spinnerPause();

    await fetch("/sanctum/csrf-cookie");
    Core.UIM.applyAppearAnimation();
});

const spinnerPause = () => {
    const spinner = document.getElementById("spinner");
    if (spinner) {
        spinner.remove();
    }
    Core.debugLog("Spinner paused");
};
