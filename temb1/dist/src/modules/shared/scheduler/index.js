"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_service_1 = require("./scheduler.service");
const environment_1 = __importDefault(require("../../../config/environment"));
const app_event_service_1 = __importDefault(require("../../events/app-event.service"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const schedulerConfig = {
    url: environment_1.default.SCHEDULER_URL,
    clientId: environment_1.default.SCHEDULER_CLIENT_ID,
    clientSecret: environment_1.default.SCHEDULER_CLIENT_SECRET,
    defaultCallbackUrl: environment_1.default.SCHEDULER_DEFAULT_CALLBACK_URL,
};
const schedulerService = new scheduler_service_1.SchedulerService(schedulerConfig, app_event_service_1.default, request_promise_native_1.default, bugsnagHelper_1.default);
exports.default = schedulerService;
//# sourceMappingURL=index.js.map