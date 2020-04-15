"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_service_1 = require("../scheduler.service");
exports.schedulerDeps = {
    config: {
        url: 'hello',
        clientId: 'how are you',
        clientSecret: 'welcome',
        defaultCallbackUrl: 'tembea',
    },
    httpClient: {
        post: jest.fn().mockResolvedValue('OK'),
    },
    logger: {
        error: jest.fn(),
    },
    appEvents: {
        broadcast: jest.fn(),
    },
};
const mockSchedulerService = new scheduler_service_1.SchedulerService(exports.schedulerDeps.config, exports.schedulerDeps.appEvents, exports.schedulerDeps.httpClient, exports.schedulerDeps.logger);
exports.default = mockSchedulerService;
//# sourceMappingURL=scheduler.service.js.map