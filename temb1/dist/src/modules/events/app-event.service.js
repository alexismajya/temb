"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class AppEvents {
    constructor() {
        this.subject = new rxjs_1.Subject();
    }
    subscribe(name, subscriber) {
        this.subject.pipe(operators_1.filter((e) => e.name === name))
            .subscribe((e) => subscriber(e.data));
    }
    broadcast({ name, data }) {
        this.subject.next({ name, data });
    }
}
exports.AppEvents = AppEvents;
const appEvents = new AppEvents();
exports.default = appEvents;
//# sourceMappingURL=app-event.service.js.map