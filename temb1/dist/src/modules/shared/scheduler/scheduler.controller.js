"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchedulerController {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.handle = (req, res) => {
            this.scheduler.handleJob(req.body);
            res.send('done');
        };
    }
}
exports.default = SchedulerController;
//# sourceMappingURL=scheduler.controller.js.map