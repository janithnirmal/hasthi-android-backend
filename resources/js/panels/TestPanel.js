import Panel from "../Panel";

/**
 * testing functionalities will be handled here
 */
export default class TestPanel extends Panel {
    constructor(config) {
        super(config);
    }

    init() {}

    async boot() {
        this.test();
    }

    test() {}
}
