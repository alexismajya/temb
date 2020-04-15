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
const TripItineraryHelper_1 = __importDefault(require("../TripItineraryHelper"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const database_1 = __importDefault(require("../../../../../database"));
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const { models: { TripRequest, User } } = database_1.default;
describe('TripItineraryHelper ', () => {
    beforeEach(() => {
        jest.spyOn(TripRequest, 'findAll').mockResolvedValue([{}, {}]);
        jest.spyOn(User, 'findOne').mockResolvedValue([{}, {}]);
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue([{}, {}]);
        jest.spyOn(trip_service_1.default, 'getAll').mockResolvedValue([{}, {}]);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('TripItineraryHelper_getUserIdBySlackId', () => {
        it('should return the user id', () => __awaiter(void 0, void 0, void 0, function* () {
            const slackId = 'test001';
            yield TripItineraryHelper_1.default.getUserIdBySlackId(slackId);
            expect(user_service_1.default.getUserBySlackId).toBeCalled();
        }));
        it('should throw an error when it can not get user', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                jest.spyOn(user_service_1.default, 'getUserBySlackId')
                    .mockResolvedValue();
                const userId = 'TEST001';
                yield TripItineraryHelper_1.default.getUserIdBySlackId(userId);
            }
            catch (e) {
                expect(user_service_1.default.getUserBySlackId).toBeCalled();
                expect(e.message).toEqual('User not found');
            }
        }));
    });
    describe('TripItineraryHelper_getThirtyDaysFromNow', () => {
        it('should return 30 days less than the current date', () => {
            const dateDifference = TripItineraryHelper_1.default.getThirtyDaysFromNow();
            expect(dateDifference).toBeTruthy();
        });
        it('should return date as a number', () => {
            const dateDifference = TripItineraryHelper_1.default.getThirtyDaysFromNow();
            expect(dateDifference).not.toBeNaN();
        });
    });
    describe('TripItineraryHelper_getTripItineraryFilters', () => {
        it('should filter trip by date', () => {
            jest.spyOn(TripItineraryHelper_1.default, 'getThirtyDaysFromNow').mockResolvedValue(new Date());
            TripItineraryHelper_1.default.getTripItineraryFilters();
            expect(TripItineraryHelper_1.default.getThirtyDaysFromNow).toBeCalled();
        });
    });
    describe('TripItineraryHelper_getPaginatedTripRequestsBySlackUserId', () => {
        it('should call getUserIdBySlackId method to get the user ', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripItineraryHelper_1.default, 'getUserIdBySlackId').mockResolvedValue([{}, {}]);
            jest.spyOn(trip_service_1.default, 'getPaginatedTrips').mockResolvedValue([{}, {}]);
            const slackUserId = 'test001';
            yield TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId(slackUserId);
            expect(TripItineraryHelper_1.default.getUserIdBySlackId).toBeCalled();
        }));
        it('should  return paginated trips', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripItineraryHelper_1.default, 'getUserIdBySlackId').mockResolvedValue([{}]);
            jest.spyOn(TripItineraryHelper_1.default, 'getTripItineraryFilters').mockResolvedValue([{}, {}]);
            jest.spyOn(trip_service_1.default, 'getPaginatedTrips').mockResolvedValue([{}, {}]);
            const slackUserId = 'test001';
            yield TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId(slackUserId);
            expect(trip_service_1.default.getPaginatedTrips).toBeCalled();
        }));
    });
});
//# sourceMappingURL=tripIntineraryHelper.spec.js.map