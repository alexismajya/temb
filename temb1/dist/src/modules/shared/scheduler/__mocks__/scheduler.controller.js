"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_controller_1 = __importDefault(require("../scheduler.controller"));
const scheduler_service_1 = __importDefault(require("./scheduler.service"));
const schedulerController = new scheduler_controller_1.default(scheduler_service_1.default);
exports.default = schedulerController;
//# sourceMappingURL=scheduler.controller.js.map