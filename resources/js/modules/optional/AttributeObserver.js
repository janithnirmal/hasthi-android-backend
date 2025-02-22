export class AttributeObserver {
  constructor() {
    if (!AttributeObserver.instance) {
      this.observers = new Map();
      AttributeObserver.instance = this;
    }
    return AttributeObserver.instance;
  }

  /**
   * 
   * @param {Element} targetElement 
   * @param {string} attributeName 
   * @param {Function} callback 
   */
  observeAttribute(targetElement, attributeName, callback) {
    const key = `${targetElement}_${attributeName}`;

    // Disconnect existing observer for this element-attribute pair
    if (this.observers.has(key)) {
      this.observers.get(key).disconnect();
    }

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === attributeName
        ) {
          const newValue = targetElement.getAttribute(attributeName);
          callback(newValue);
        }
        // Check if the target element is removed
        if (mutation.type === "childList") {
          mutation.removedNodes.forEach((node) => {
            if (node === targetElement) {
              this.stopObserving(targetElement, attributeName);
            }
          });
        }
      }
    });

    // Observe the target element and also child list changes to detect removals
    const config = { attributes: true, childList: true, subtree: true };

    // Start observing
    observer.observe(targetElement.parentNode, config);

    // Store the observer
    this.observers.set(key, observer);
  }

  stopObserving(targetElement, attributeName) {
    const key = `${targetElement}_${attributeName}`;
    if (this.observers.has(key)) {
      this.observers.get(key).disconnect();
      this.observers.delete(key);
    }
  }

  stopAllObserving() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}
