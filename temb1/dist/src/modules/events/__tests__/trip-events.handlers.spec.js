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
const web_socket_event_service_1 = __importDefault(require("../web-socket-event.service"));
const app_event_service_1 = __importDefault(require("../app-event.service"));
const Notifications_1 = __importDefault(require("../../slack/SlackPrompts/Notifications"));
const TripNotifications_1 = __importDefault(require("../../slack/SlackPrompts/notifications/TripNotifications"));
const TripJobs_1 = __importDefault(require("../../../services/jobScheduler/jobs/TripJobs"));
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const trip_request_1 = require("../../../database/models/trip-request");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const trip_helpers_1 = __importDefault(require("../../new-slack/trips/manager/trip.helpers"));
const trip_events_handlers_1 = __importDefault(require("../trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
exports.mockTrip = {
    id: 1,
    origin: { address: 'Kampala 1' },
    destination: { address: 'Kampala 2' },
    tripStatus: 'Confirmed',
    departureTime: new Date().toISOString(),
    noOfPassengers: 5,
    reason: 'Good',
    tripType: 'Regular',
    createdAt: new Date().toISOString(),
    distance: '45km',
    managerComment: 'come on',
    approvedById: 1,
    requestedById: 2,
};
describe(trip_events_handlers_1.default, () => {
    const botToken = 'xoxp-12782892';
    const testData = { botToken, data: { id: 3 } };
    const errorTest = (func, args) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue(null);
        jest.spyOn(trip_service_1.default, 'getById').mockRejectedValue('just fail bro');
        yield func(args);
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    });
    beforeEach(() => {
        jest.spyOn(trip_service_1.default, 'getById').mockImplementation((id) => (Object.assign(Object.assign({}, exports.mockTrip), { id })));
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should register trip events subscriptions', () => {
        jest.spyOn(app_event_service_1.default, 'subscribe');
        trip_events_handlers_1.default.init();
        expect(app_event_service_1.default.subscribe).toHaveBeenCalled();
    });
    describe(trip_events_handlers_1.default.handleTakeOffReminder, () => {
        it('should call send sendTripReminderNotifications', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripNotifications_1.default, 'sendTripReminderNotifications').mockResolvedValue(null);
            jest.spyOn(TripJobs_1.default, 'scheduleCompletionReminder').mockResolvedValue(null);
            yield trip_events_handlers_1.default.handleTakeOffReminder(testData);
            expect(TripNotifications_1.default.sendTripReminderNotifications).toHaveBeenCalledWith(expect.objectContaining({ id: 3 }), botToken);
        }));
        it('should handle the error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield errorTest(trip_events_handlers_1.default.handleTakeOffReminder, testData);
        }));
    });
    describe(trip_events_handlers_1.default.handleNewTripCreated, () => {
        it('should schedule auto approve', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripJobs_1.default, 'scheduleAutoApprove').mockResolvedValue(null);
            jest.spyOn(trip_helpers_1.default, 'sendManagerTripRequestNotification').mockResolvedValue(null);
            yield trip_events_handlers_1.default.handleNewTripCreated(testData, 'newTrip');
            expect(trip_helpers_1.default.sendManagerTripRequestNotification)
                .toHaveBeenCalledWith(expect.objectContaining({ id: testData.data.id }), testData.botToken, 'newTrip');
            expect(TripJobs_1.default.scheduleAutoApprove).toHaveBeenCalled();
        }));
        it('should handle the error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield errorTest(trip_events_handlers_1.default.handleNewTripCreated, testData);
        }));
    });
    describe(trip_events_handlers_1.default.handleAutoApproval, () => {
        const mockTripGetById = (tripStatus) => (id) => (Object.assign(Object.assign({}, exports.mockTrip), { id, tripStatus }));
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendOpsApprovalNotification').mockResolvedValue(null);
        });
        it('should send message to ops', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockImplementation(mockTripGetById(trip_request_1.TripStatus.pending));
            yield trip_events_handlers_1.default.handleAutoApproval({ botToken, data: { id: 2 } });
            expect(Notifications_1.default.sendOpsApprovalNotification).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }), botToken);
        }));
        it('should not send message to ops', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockImplementation(mockTripGetById(trip_request_1.TripStatus.confirmed));
            yield trip_events_handlers_1.default.handleAutoApproval({ botToken, data: { id: 3 } });
            expect(Notifications_1.default.sendOpsApprovalNotification).not.toHaveBeenCalled();
        }));
        it('should handle the error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield errorTest(trip_events_handlers_1.default.handleAutoApproval, testData);
        }));
    });
});
//# sourceMappingURL=trip-events.handlers.spec.js.map