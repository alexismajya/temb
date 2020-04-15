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
const itinerary_controller_1 = __importDefault(require("../itinerary.controller"));
const itinerary_helpers_1 = __importDefault(require("../itinerary.helpers"));
const reschedule_helper_1 = __importDefault(require("../reschedule.helper"));
const slack_block_models_1 = require("../../../models/slack-block-models");
describe(itinerary_controller_1.default, () => {
    const payload = {
        user: {
            id: 'UP0RTRL02',
        },
        actions: [{
                action_id: 'user_trip_reschedule_107',
                block_id: 'user_trip_itinerary_action_107',
                value: '107',
            }],
    };
    const respond = jest.fn();
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(itinerary_controller_1.default.start, () => {
        it('should send start itinerary trip message', () => {
            itinerary_controller_1.default.start(payload, respond);
            expect(respond).toHaveBeenCalledTimes(1);
        });
    });
    describe(itinerary_controller_1.default.getPast, () => {
        it('should send past trips message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(itinerary_helpers_1.default, 'getPastTripsMessage').mockReturnValueOnce(payload);
            yield itinerary_controller_1.default.getPast(payload, respond);
            expect(itinerary_helpers_1.default.getPastTripsMessage).toHaveBeenCalledWith(payload);
        }));
    });
    describe(itinerary_controller_1.default.getUpcoming, () => {
        it('should send upcoming trips Message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(itinerary_helpers_1.default, 'getUpcomingTripsMessage').mockReturnValueOnce(payload);
            yield itinerary_controller_1.default.getUpcoming(payload, respond);
            expect(itinerary_helpers_1.default.getUpcomingTripsMessage).toHaveBeenCalledWith(payload);
        }));
    });
    describe(itinerary_controller_1.default.handleRescheduleOrCancel, () => {
        const mockMessage = (text) => new slack_block_models_1.MarkdownText(text);
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should send Trip reschedule dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = { actions: [{ value: 172, action_id: 'user_trip_reschedule_172' }] };
            jest.spyOn(reschedule_helper_1.default, 'sendTripRescheduleModal').mockResolvedValueOnce(null);
            yield itinerary_controller_1.default.handleRescheduleOrCancel(newPayload, respond);
            expect(reschedule_helper_1.default.sendTripRescheduleModal).toHaveBeenCalledWith(newPayload, newPayload.actions[0].value);
        }));
        it('should return appropriate message when trip cannot be rescheduled', () => __awaiter(void 0, void 0, void 0, function* () {
            const rsMock = mockMessage('reschedule');
            const newPayload = { actions: [{ value: 172, action_id: 'user_trip_reschedule_172' }] };
            jest.spyOn(reschedule_helper_1.default, 'sendTripRescheduleModal').mockResolvedValueOnce(rsMock);
            yield itinerary_controller_1.default.handleRescheduleOrCancel(newPayload, respond);
            expect(reschedule_helper_1.default.sendTripRescheduleModal).toHaveBeenCalledWith(newPayload, newPayload.actions[0].value);
            expect(respond).toHaveBeenCalledWith(rsMock);
        }));
        it('should send cancel trip dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = { actions: [{ value: 172, action_id: 'user_trip_cancel_trip_172' }] };
            jest.spyOn(itinerary_helpers_1.default, 'cancelTrip').mockResolvedValueOnce(null);
            yield itinerary_controller_1.default.handleRescheduleOrCancel(newPayload, respond);
            expect(itinerary_helpers_1.default.cancelTrip).toHaveBeenCalledWith(newPayload, newPayload.actions[0].value);
        }));
        it('should return appropriate message when trip cannot be cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
            const cancelMock = mockMessage('cancel');
            const newPayload = { actions: [{ value: 172, action_id: 'user_trip_cancel_trip_172' }] };
            jest.spyOn(itinerary_helpers_1.default, 'cancelTrip').mockResolvedValueOnce(cancelMock);
            yield itinerary_controller_1.default.handleRescheduleOrCancel(newPayload, respond);
            expect(itinerary_helpers_1.default.cancelTrip).toHaveBeenCalledWith(newPayload, newPayload.actions[0].value);
            expect(respond).toHaveBeenCalledWith(cancelMock);
        }));
    });
    describe(itinerary_controller_1.default.nextOrPrevPage, () => {
        it('should send nextOrPrevPage on past trips message', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = { actions: [{ value: 'pastTrips' }] };
            jest.spyOn(itinerary_helpers_1.default, 'getPastTripsMessage').mockReturnValueOnce(payload);
            yield itinerary_controller_1.default.nextOrPrevPage(newPayload, respond);
            expect(itinerary_helpers_1.default.getPastTripsMessage).toHaveBeenCalledWith(newPayload);
        }));
        it('should send nextOrPrevPage on upcoming trips message', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = { actions: [{ value: 'upcomingTrips' }] };
            jest.spyOn(itinerary_helpers_1.default, 'getUpcomingTripsMessage').mockReturnValueOnce(payload);
            yield itinerary_controller_1.default.nextOrPrevPage(newPayload, respond);
            expect(itinerary_helpers_1.default.getUpcomingTripsMessage).toHaveBeenCalledWith(newPayload);
        }));
    });
    describe(itinerary_controller_1.default.skipPage, () => {
        it('should send skip page dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(itinerary_helpers_1.default, 'triggerPage').mockReturnValueOnce(payload);
            yield itinerary_controller_1.default.skipPage(payload, respond);
            expect(itinerary_helpers_1.default.triggerPage).toHaveBeenCalledWith(payload);
        }));
    });
    describe(itinerary_controller_1.default.handleSkipPage, () => {
        it('should handle skip page', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = {
                team: { id: 'TPDKFR8TF', domain: 'tembeaherve' },
                user: { id: 'UP0RTRL02', name: 'herve.nkurikiyimfura', team_id: 'TPDKFR8TF' },
                submission: { pageNumber: '2' },
                callback_id: 'user_trip_skip_page',
                state: 'upcomingTrips',
                actions: [
                    {
                        action_id: 'user_trip_page_2',
                        block_id: 'user_trip_pagination',
                        value: 'upcomingTrips_page_2',
                    },
                ],
            };
            jest.spyOn(itinerary_controller_1.default, 'nextOrPrevPage').mockReturnValueOnce(null);
            yield itinerary_controller_1.default.handleSkipPage(newPayload, respond);
            expect(itinerary_controller_1.default.nextOrPrevPage).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=itinerary.controller.spec.js.map