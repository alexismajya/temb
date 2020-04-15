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
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const rescheduleHelper_1 = __importDefault(require("../rescheduleHelper"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../InteractivePromptSlackHelper"));
const reschedule_controller_1 = require("../../../../new-slack/trips/user/reschedule.controller");
jest.mock('../../../SlackPrompts/Notifications.js');
jest.mock('../../../events/', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
}));
jest.mock('../../../events/slackEvents', () => ({
    SlackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
    slackEventNames: Object.freeze({
        TRIP_APPROVED: 'trip_approved',
        TRIP_WAITING_CONFIRMATION: 'trip_waiting_confirmation',
        NEW_TRIP_REQUEST: 'new_trip_request',
        DECLINED_TRIP_REQUEST: 'declined_trip_request'
    })
}));
describe('Trip Reschedule Helper test', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should send Reschedule Trip Form ', () => __awaiter(void 0, void 0, void 0, function* () {
        const twoHoursAfter = new Date(Date.now() + 2 * 60 * 60 * 1000);
        jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({
            confirmedById: 0,
            departureTime: `${twoHoursAfter.toISOString()}`
        });
        const sendRescheduleTripFormSpy = jest.spyOn(reschedule_controller_1.RescheduleController, 'sendRescheduleModal')
            .mockResolvedValue();
        const payload = {};
        const response = jest.fn();
        yield rescheduleHelper_1.default.sendTripRescheduleDialog(payload, response, 12);
        expect(sendRescheduleTripFormSpy).toBeCalledTimes(1);
    }));
    it('should send reschedule confirm error when trip is < 1hr before the departure time', () => __awaiter(void 0, void 0, void 0, function* () {
        const oneHourAfter = new Date(Date.now() - 60 * 60 * 1000);
        jest.spyOn(trip_service_1.default, 'getById')
            .mockResolvedValue({
            departureTime: `${oneHourAfter.toISOString()}`
        });
        const spy = jest.spyOn(InteractivePromptSlackHelper_1.default, 'passedTimeOutLimit');
        const payload = {};
        const response = jest.fn();
        yield rescheduleHelper_1.default.sendTripRescheduleDialog(payload, response, 12);
        expect(spy).toHaveBeenCalledTimes(1);
    }));
    it('should send reschedule confirm or approve error when trip has been approved', () => __awaiter(void 0, void 0, void 0, function* () {
        const twoHourBefore = new Date(Date.now() + 2 * 60 * 60 * 1000);
        jest.spyOn(trip_service_1.default, 'getById')
            .mockResolvedValue({
            approvedById: 1,
            departureTime: `${twoHourBefore.toISOString()}`
        });
        const spy = jest.spyOn(InteractivePromptSlackHelper_1.default, 'rescheduleConfirmedApprovedError');
        const payload = {};
        const response = jest.fn();
        yield rescheduleHelper_1.default.sendTripRescheduleDialog(payload, response, 12);
        expect(spy).toHaveBeenCalledTimes(1);
    }));
    it('should handle unexpected errors', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(trip_service_1.default, 'getById').mockRejectedValue();
        const spy = jest.spyOn(InteractivePromptSlackHelper_1.default, 'sendTripError');
        const payload = {};
        const response = jest.fn();
        yield rescheduleHelper_1.default.sendTripRescheduleDialog(payload, response, 12);
        expect(spy).toBeCalledTimes(1);
    }));
});
//# sourceMappingURL=rescheduleHelper.spec.js.map