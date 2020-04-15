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
const itinerary_helpers_1 = __importDefault(require("../itinerary.helpers"));
const TripItineraryHelper_1 = __importDefault(require("../../../../slack/helpers/slackHelpers/TripItineraryHelper"));
const constants_1 = require("../../../../../helpers/constants");
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const DialogPrompts_1 = __importDefault(require("../../../../slack/SlackPrompts/DialogPrompts"));
const slack_block_models_1 = require("../../../models/slack-block-models");
const pagination_helpers_1 = __importDefault(require("../../../helpers/pagination-helpers"));
describe(itinerary_helpers_1.default, () => {
    const user = {
        id: 3,
        name: 'New User',
        slackId: 'UN5FDBM2D',
        email: 'newuser2@gmail.com',
        createdAt: '2019-09-10',
        updatedAt: '2019-09-10',
    };
    const tripData = {
        id: 9,
        name: 'From Nairobi to Kigali',
        tripStatus: 'Completed',
        distance: '9.4 km',
        departureTime: '2019-10-22T20:00:00.000Z',
        arrivalTime: '',
        requestedById: user.id,
        approvedById: user.id,
        requester: { name: 'New User', slackId: 'UN5FDBM2D' },
        origin: { address: 'Safari Park Hotel' },
        destination: { address: 'Lymack Suites' },
        rider: { name: 'New User' },
    };
    const payload = {
        user: {
            id: 'UN5FDBM2D',
            username: 'newuser',
            name: 'newuser',
        },
        actions: [
            {
                action_id: 'user_trip_action',
                block_id: 'user_trip_block',
                value: 'trips',
                style: 'primary',
                type: 'button',
                action_ts: '1572324866.668662',
            },
        ],
    };
    const userId = payload.user.id;
    const pageNumber = pagination_helpers_1.default.getPageNumber(payload);
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(itinerary_helpers_1.default.createStartMessage, () => {
        it('should return a block message', () => {
            const message = itinerary_helpers_1.default.createStartMessage();
            expect(message).toBeDefined();
        });
    });
    describe(itinerary_helpers_1.default.getPastTripsMessage, () => {
        it('should display: You have no past trips, when there are none', () => __awaiter(void 0, void 0, void 0, function* () {
            const testTripData = { data: [], pageMeta: {} };
            jest.spyOn(TripItineraryHelper_1.default, 'getPaginatedTripRequestsBySlackUserId')
                .mockResolvedValueOnce(testTripData);
            yield itinerary_helpers_1.default.getPastTripsMessage(payload);
            expect(new slack_block_models_1.SlackText('You have no past trips')).toBeDefined();
        }));
        it('should continue to read past trips message', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripsMock = {
                data: [tripData],
                pageMeta: {
                    totalPages: 2,
                    pageNo: 1,
                    totalItems: 11,
                    itemsPerPage: 10,
                },
            };
            jest.spyOn(TripItineraryHelper_1.default, 'getPaginatedTripRequestsBySlackUserId')
                .mockResolvedValueOnce(tripsMock);
            yield itinerary_helpers_1.default.getPastTripsMessage(payload);
            expect(TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId)
                .toHaveBeenCalledWith(userId.toString(), constants_1.TRIP_LIST_TYPE.PAST, pageNumber);
        }));
    });
    describe(itinerary_helpers_1.default.getUpcomingTripsMessage, () => {
        it('should continue to read upcoming trips message', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripsMock = {
                data: [tripData],
                pageMeta: {
                    totalPages: 2,
                    pageNo: 1,
                    totalItems: 11,
                    itemsPerPage: 10,
                },
            };
            jest
                .spyOn(TripItineraryHelper_1.default, 'getPaginatedTripRequestsBySlackUserId')
                .mockResolvedValueOnce(tripsMock);
            yield itinerary_helpers_1.default.getUpcomingTripsMessage(payload);
            expect(TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId)
                .toHaveBeenCalledWith(userId.toString(), constants_1.TRIP_LIST_TYPE.UPCOMING, pageNumber);
        }));
        it('should return upcoming trips message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(TripItineraryHelper_1.default, 'getPaginatedTripRequestsBySlackUserId')
                .mockResolvedValue(null);
            yield itinerary_helpers_1.default.getUpcomingTripsMessage(payload);
            expect(TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId)
                .toHaveBeenCalledWith(userId.toString(), constants_1.TRIP_LIST_TYPE.UPCOMING, pageNumber);
        }));
        it('should display: You have no upcoming trips, when there are none', () => __awaiter(void 0, void 0, void 0, function* () {
            const testTripData = { data: [], pageMeta: {} };
            jest
                .spyOn(TripItineraryHelper_1.default, 'getPaginatedTripRequestsBySlackUserId')
                .mockResolvedValueOnce(testTripData);
            yield itinerary_helpers_1.default.getUpcomingTripsMessage(payload);
            expect(new slack_block_models_1.SlackText('You have no upcoming trips')).toBeDefined();
        }));
    });
    describe(itinerary_helpers_1.default.triggerPage, () => {
        it('should triggerPage', () => __awaiter(void 0, void 0, void 0, function* () {
            const [newPayload] = [{
                    actions: [{
                            action_id: 'user_trip_skip_page',
                            value: 'trips',
                        }],
                }];
            const { actions: [{ value: requestType, action_id: actionId }] } = newPayload;
            jest.spyOn(DialogPrompts_1.default, 'sendSkipPage').mockReturnValue(null);
            yield itinerary_helpers_1.default.triggerPage(newPayload);
            expect(DialogPrompts_1.default.sendSkipPage).toHaveBeenCalledWith(newPayload, requestType, actionId);
        }));
    });
    describe(itinerary_helpers_1.default.cancelTrip, () => {
        it('should return trip not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockReturnValue(null);
            const result = yield itinerary_helpers_1.default.cancelTrip(payload, null);
            expect(result.text).toBe('Trip not found');
        }));
        it('should return success message after canceling a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockReturnValue(tripData);
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            const result = yield itinerary_helpers_1.default.cancelTrip(payload, tripData.id);
            expect(trip_service_1.default.getById).toHaveBeenCalledWith(tripData.id, true);
            expect(trip_service_1.default.updateRequest).toHaveBeenCalledWith(tripData.id, { tripStatus: 'Cancelled' });
            expect(result.text).toMatch(/^Success! Your Trip request from \w.* has been cancelled$/);
        }));
        it('should catch an error when something goes wrong while canceling trip history', () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(trip_service_1.default, 'updateRequest')
                .mockRejectedValueOnce(new Error('Database Error'));
            const value = 'hey';
            yield itinerary_helpers_1.default.cancelTrip(payload, value);
            expect(new slack_block_models_1.SlackText('Request could not be processed')).toBeDefined();
        }));
    });
});
//# sourceMappingURL=itinerary.helpers.spec.js.map