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
const moment_1 = __importDefault(require("moment"));
const TripJobs_1 = __importDefault(require("../TripJobs"));
const app_event_service_1 = __importDefault(require("../../../../modules/events/app-event.service"));
const scheduler_1 = __importDefault(require("../../../../modules/shared/scheduler"));
const isoDateTimeRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
describe(TripJobs_1.default, () => {
    const testTrip = {
        id: 1,
        departureTime: moment_1.default().add(2, 'hours').toISOString(),
        createdAt: moment_1.default().toISOString(),
    };
    const botToken = 'xoxp-14425526';
    describe(TripJobs_1.default.scheduleAutoApprove, () => {
        beforeEach(() => {
            jest.spyOn(scheduler_1.default, 'schedule').mockResolvedValue(null);
            jest.spyOn(app_event_service_1.default, 'broadcast').mockResolvedValue(null);
        });
        afterEach(() => jest.restoreAllMocks());
        it('should call schedulerService', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripJobs_1.default.scheduleAutoApprove({ botToken, data: testTrip });
            expect(scheduler_1.default.schedule).toHaveBeenCalledWith(expect.objectContaining({
                time: expect.stringMatching(isoDateTimeRegex),
            }));
        }));
        it('should throw and handle the error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripJobs_1.default.scheduleAutoApprove({ botToken, data: null });
            expect(app_event_service_1.default.broadcast).not.toHaveBeenCalled();
            expect(scheduler_1.default.schedule).not.toHaveBeenCalled();
        }));
    });
    describe(TripJobs_1.default.scheduleTakeOffReminder, () => {
        beforeEach(() => {
            jest.spyOn(scheduler_1.default, 'schedule').mockResolvedValue(null);
        });
        afterEach(() => jest.restoreAllMocks());
        it('should call scheduler', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripJobs_1.default.scheduleTakeOffReminder({ botToken, data: testTrip });
            expect(scheduler_1.default.schedule).toHaveBeenCalledWith(expect.objectContaining({
                isRecurring: false,
                payload: expect.objectContaining({
                    key: expect.stringContaining(testTrip.id.toString()),
                }),
            }));
        }));
        it('should throw and handle the error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripJobs_1.default.scheduleTakeOffReminder({ botToken, data: null });
            expect(scheduler_1.default.schedule).not.toHaveBeenCalled();
        }));
    });
    describe(TripJobs_1.default.scheduleCompletionReminder, () => {
        beforeEach(() => {
            jest.spyOn(scheduler_1.default, 'schedule').mockResolvedValue(null);
        });
        afterEach(() => jest.restoreAllMocks());
        it('should call scheduler', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripJobs_1.default.scheduleCompletionReminder({ botToken, data: testTrip });
            expect(scheduler_1.default.schedule).toHaveBeenCalledWith(expect.objectContaining({
                isRecurring: false,
                payload: expect.objectContaining({
                    key: expect.stringContaining(testTrip.id.toString()),
                }),
            }));
        }));
        it('should throw and handle the error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripJobs_1.default.scheduleCompletionReminder({ botToken, data: null });
            expect(scheduler_1.default.schedule).not.toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=TripJobs.spec.js.map