/**
 * simple event manager
 *
 * @author janithnirmal https://github.com/janithnirmal
 *
 * @description this module must required to have both jQuery and DataTables js libraries to be linked with the project.
 */
export class EventManager {
    constructor() {
        this.events = {};
    }

    subscribe(event, ...listeners) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        listeners.forEach((listener) => {
            this.events[event].push(listener);
        });
    }

    unsubscribe(event) {
        delete this.events[event];
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach((listener) => {
                listener(data);
            });
            // finisher
            this.emit(`${event}_end`);
        }
    }
}
