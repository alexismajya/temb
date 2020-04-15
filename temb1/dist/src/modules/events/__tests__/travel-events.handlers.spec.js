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
const travel_events_handlers_1 = __importDefault(require("../travel-events.handlers"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const Notifications_1 = __importDefault(require("../../slack/SlackPrompts/Notifications"));
const trip_events_handlers_1 = __importDefault(require("../trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
describe(travel_events_handlers_1.default, () => {
    const botToken = 'xoxp-12782892';
    const testData = {
        botToken,
        data: { id: 3 },
        payload: { user: { id: 9 } },
        trip: { id: 5 },
        respond: jest.fn(),
    };
    beforeEach(() => {
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should register trip events subscriptions', () => {
        jest.spyOn(app_event_service_1.default, 'subscribe');
        travel_events_handlers_1.default.init();
        expect(app_event_service_1.default.subscribe).toHaveBeenCalled();
    });
    describe('TravelEventHandlers.handleCompletedTrip', () => {
        it('should call managerTripApproval', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_events_handlers_1.default, 'managerTripApproval').mockResolvedValue(null);
            yield travel_events_handlers_1.default.handleCompletedTrip(testData);
            expect(trip_events_handlers_1.default.managerTripApproval)
                .toHaveBeenCalledWith(expect.objectContaining({ data: { id: 3 } }));
        }));
        it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue(null);
            jest.spyOn(trip_events_handlers_1.default, 'managerTripApproval').mockRejectedValue('just fail please');
            yield travel_events_handlers_1.default.handleCompletedTrip(testData);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('TravelEventHandlers.handleTravelCancelledByRider', () => {
        it('should send cancel notifications', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'sendManagerCancelNotification').mockResolvedValue(null);
            jest.spyOn(Notifications_1.default, 'sendOpsCancelNotification').mockResolvedValue(null);
            yield travel_events_handlers_1.default.handleTravelCancelledByRider(testData);
            expect(Notifications_1.default.sendManagerCancelNotification).toHaveBeenCalledTimes(1);
            expect(Notifications_1.default.sendOpsCancelNotification).toHaveBeenCalledTimes(1);
        }));
        it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue(null);
            jest.spyOn(Notifications_1.default, 'sendOpsCancelNotification').mockRejectedValue('just fail please');
            yield travel_events_handlers_1.default.handleTravelCancelledByRider(testData);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=travel-events.handlers.spec.js.map