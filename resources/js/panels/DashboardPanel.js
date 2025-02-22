import Panel from "../Panel";

/**
 * application dashboard goas here
 */
export default class DashboardPanel extends Panel {
    constructor(config) {
        super(config);
    }

    init() {}

    async boot() {
        this.test();
    }

    test() {}
}
