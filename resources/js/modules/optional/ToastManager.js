// #todo#janithnirmal

/**
 * toast message manager
 */
export class ToastManager {
  // build  constructor
  static component;
  static toast;

  constructor() {
    this.#init();
  }

  // toast creation
  #init() {
    ToastManager.component = this.#createToastElement();
    document.body.prepend(ToastManager.component);
    ToastManager.toast = new bootstrap.Toast(ToastManager.component);
  }

  #createToastElement() {
    const toastTemplate = `
                            <div class="position-absolute toast bottom-0 mb-4 end-0 text-white align-items-center  border-0 m-2" role="alert" aria-live="assertive" aria-atomic="true">
                              <div class="d-flex">
                                <div class="toast-body"></div>
                                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                              </div>
                            </div>
                          `;

    const template = document.createElement("template");
    template.innerHTML = toastTemplate.trim();
    return template.content.firstChild;

    // Return the created toast element
    return toast;
  }

  /**
   * promopt a toast of message
   *
   * @param {string} message message to show
   */
  prompt(message = "Sample Toast Message!", code = 0) {
    switch (code) {
      case 1:
        ToastManager.component.style.backgroundColor = "green";
        break;
      case 0:
        ToastManager.component.style.backgroundColor = "red";
        break;

      default:
        break;
    }

    ToastManager.component.querySelector(".toast-body").innerText = message;
    ToastManager.toast.show(); // update later for a toast trigger
  }
}
