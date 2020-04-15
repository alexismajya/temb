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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RouteJobs_1 = __importDefault(require("../RouteJobs"));
const scheduler_1 = __importDefault(require("../../../../modules/shared/scheduler"));
const route_events_constants_1 = require("../../../../modules/events/route-events.constants");
const toggleEnvironment = (env) => {
    process.env.NODE_ENV = process.env.NODE_ENV === 'test' ? env : 'test';
};
const env = 'production';
describe(RouteJobs_1.default, () => {
    const dummyBatches = [
        {
            id: 1,
            capacity: 3,
            takeOff: '05:30',
        },
        {
            id: 2,
            capacity: 4,
            takeOff: '06:00',
        },
    ];
    const botToken = 'xoxp-1234';
    beforeEach(() => {
        jest.spyOn(scheduler_1.default, 'schedule').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(RouteJobs_1.default.scheduleTakeOffReminder, () => {
        const theTest = (allowance) => __awaiter(void 0, void 0, void 0, function* () {
            const testBatch = Object.assign({}, dummyBatches[0]);
            yield RouteJobs_1.default.scheduleTakeOffReminder({ botToken, routeBatch: testBatch });
            expect(scheduler_1.default.schedule).toHaveBeenCalledWith(expect.objectContaining({
                cron: {
                    isSequential: false,
                    repeatTime: expect.stringContaining('-' && ':' && ' '),
                },
                isRecurring: true,
                payload: expect.objectContaining({
                    key: expect.stringContaining(testBatch.id.toString()),
                    args: {
                        name: route_events_constants_1.routeEvents.takeOffAlert,
                        data: {
                            botToken,
                            data: expect.any(Object),
                        },
                    },
                }),
            }));
        });
        it('should send a reminder message to the user before trip', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield theTest({ minutes: -1 });
            done();
        }));
        it('should toggle time based on environment', (done) => __awaiter(void 0, void 0, void 0, function* () {
            toggleEnvironment(env);
            yield theTest({ minutes: -15 });
            toggleEnvironment(env);
            done();
        }));
    });
    describe(RouteJobs_1.default.scheduleTripCompletionNotification, () => {
        const theTest = (allowance) => __awaiter(void 0, void 0, void 0, function* () {
            const testDummy = { takeOff: '06:00', recordId: 2, botToken: 'token' };
            yield RouteJobs_1.default.scheduleTripCompletionNotification(testDummy);
            expect(scheduler_1.default.schedule).toHaveBeenCalledWith(expect.objectContaining({
                cron: {
                    isSequential: false,
                    repeatTime: expect.stringContaining('-' && ':' && ' '),
                },
                isRecurring: true,
                payload: expect.objectContaining({
                    key: expect.stringContaining(testDummy.recordId.toString()),
                }),
            }));
        });
        it('should send post-trip notifications successfully', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield theTest({ minutes: 1 });
            done();
        }));
        it('should send post-trip notifications successfully', (done) => __awaiter(void 0, void 0, void 0, function* () {
            toggleEnvironment(env);
            yield theTest({ hours: 2 });
            toggleEnvironment(env);
            done();
        }));
    });
});
//# sourceMappingURL=RouteJobs.spec.js.map