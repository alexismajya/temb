"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_service_1 = require("../scheduler.service");
const scheduler_service_2 = require("../__mocks__/scheduler.service");
describe(scheduler_service_1.SchedulerService, () => {
    let scheduler;
    let testRequest;
    beforeAll(() => {
        scheduler = new scheduler_service_1.SchedulerService(scheduler_service_2.schedulerDeps.config, scheduler_service_2.schedulerDeps.appEvents, scheduler_service_2.schedulerDeps.httpClient, scheduler_service_2.schedulerDeps.logger);
        testRequest = {
            payload: {
                key: 'TEST_KEY_123',
                args: {
                    name: 'TEST_EVENT_123',
                    data: {
                        data: {
                            id: 123,
                        },
                    },
                },
            },
        };
    });
    it('should instantiate a scheduler service', () => {
        expect(scheduler).toBeDefined();
    });
    describe(scheduler_service_1.SchedulerService.prototype.schedule, () => {
        it('should send a post request to specfied enpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            yield scheduler.schedule(Object.assign({}, testRequest));
            expect(scheduler_service_2.schedulerDeps.httpClient.post).toHaveBeenCalledWith(expect.objectContaining({
                url: scheduler_service_2.schedulerDeps.config.url,
                body: expect.objectContaining(testRequest),
            }));
        }));
        it('should use specified callback url when provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const testRequestWithCallback = Object.assign({}, testRequest);
            const testCallback = 'callback_tester';
            testRequestWithCallback.payload.callbackUrl = testCallback;
            yield scheduler.schedule(Object.assign({}, testRequestWithCallback));
            expect(scheduler_service_2.schedulerDeps.httpClient.post).toHaveBeenCalledWith(expect.objectContaining({
                url: scheduler_service_2.schedulerDeps.config.url,
                body: expect.objectContaining({
                    payload: expect.objectContaining({
                        callbackUrl: testCallback,
                    }),
                }),
            }));
        }));
        it('should handle error when it occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            yield scheduler.schedule(null);
            expect(scheduler_service_2.schedulerDeps.logger.error).toHaveBeenCalled();
        }));
    });
    describe(scheduler_service_1.SchedulerService.prototype.handleJob, () => {
        it('should call appEvents.broadcast', () => {
            const testJob = Object.assign({}, testRequest.payload.args);
            scheduler.handleJob(testJob);
            expect(scheduler_service_2.schedulerDeps.appEvents.broadcast).toHaveBeenCalledWith(testJob);
        });
    });
});
//# sourceMappingURL=scheduler.service.spec.js.map