"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduler_controller_1 = __importDefault(require("./scheduler.controller"));
const environment_1 = __importDefault(require("../../../config/environment"));
const _1 = __importDefault(require("."));
const sharedRouter = express_1.Router();
const validateCallback = (req, res, next) => {
    const secret = req.headers['scheduler-secret'];
    if (environment_1.default.SCHEDULER_CLIENT_SECRET !== secret) {
        return;
    }
    next();
};
const schedulerController = new scheduler_controller_1.default(_1.default);
sharedRouter.post('/jobhandler', validateCallback, schedulerController.handle.bind(schedulerController));
exports.default = sharedRouter;
//# sourceMappingURL=index.v2.js.map