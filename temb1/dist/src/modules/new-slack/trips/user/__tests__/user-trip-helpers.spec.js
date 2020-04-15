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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const user_trip_helpers_1 = __importDefault(require("../user-trip-helpers"));
const ScheduleTripInputHandlers_1 = require("../../../../../helpers/slack/ScheduleTripInputHandlers");
const user_data_mocks_1 = require("../__mocks__/user-data-mocks");
const googleMapsHelpers_1 = require("../../../../../helpers/googleMaps/googleMapsHelpers");
const location_helpers_1 = __importStar(require("../../../helpers/location-helpers"));
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const slack_helpers_1 = __importDefault(require("../../../helpers/slack-helpers"));
const previewScheduleTripAttachments_1 = __importDefault(require("../../../../slack/helpers/slackHelpers/previewScheduleTripAttachments"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const address_service_1 = require("../../../../addresses/address.service");
describe('UserTripHelpers', () => {
    const testUser = { id: 'U1479' };
    beforeEach(() => {
        jest.spyOn(address_service_1.addressService, 'findCoordinatesByAddress').mockResolvedValue({
            location: {
                longitude: 1.9403,
                latitude: 29.8739,
                id: '32YUODSDK89889'
            }
        });
        jest.spyOn(previewScheduleTripAttachments_1.default, 'getDistance').mockResolvedValue('10 Km');
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('handlePickupDetails', () => {
        let cacheSpy;
        beforeEach(() => {
            jest.spyOn(user_trip_helpers_1.default, 'updateTripData')
                .mockImplementation((userId, d) => ({
                id: userId,
                pickup: d.pickup,
                othersPickup: d.othersPickup,
                dateTime: d.dateTime,
                departmentId: 5
            }));
            cacheSpy = jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue();
        });
        it('should update the trip data and save to cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                dateTime: new Date(2019, 6, 31, 23, 55).toISOString(),
                pickup: 'Test Location'
            };
            yield user_trip_helpers_1.default.handlePickUpDetails(testUser, data);
            expect(cacheSpy).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id), expect.objectContaining(data));
        }));
    });
    describe('updateTripData', () => {
        beforeEach(() => {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(user_data_mocks_1.userTripDetails);
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should update trip data when pickup is not others', () => __awaiter(void 0, void 0, void 0, function* () {
            const submission = {
                pickup: 'kigali',
                othersPickup: null,
                dateTime: moment_1.default('22/12/2019 22:00', 'DD/MM/YYYY hh:mm', true),
            };
            const updateTripData = yield user_trip_helpers_1.default.updateTripData(testUser, submission);
            expect(updateTripData).toBeDefined();
            expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id));
            expect(address_service_1.addressService.findCoordinatesByAddress).toHaveBeenCalledWith(submission.pickup);
        }));
        it('should update trip data when pickup is others', () => __awaiter(void 0, void 0, void 0, function* () {
            const submission = {
                pickup: 'Others',
                othersPickup: 'Nairobi',
                dateTime: moment_1.default('22/12/2019 22:00', 'DD/MM/YYYY hh:mm', true)
            };
            const updateTripData = yield user_trip_helpers_1.default.updateTripData(testUser, submission);
            expect(updateTripData).toBeDefined();
            expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id));
        }));
    });
    describe('handleLocationVerfication', () => {
        beforeEach(() => {
            jest.spyOn(user_trip_helpers_1.default, 'getCachedPlaceIds').mockResolvedValue({ location: 'kigali' });
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(user_data_mocks_1.userTripDetails);
            jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue();
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getAddressDetails').mockResolvedValue({
                results: [{
                        geometry: {
                            location: {
                                lat: -45.5445,
                                lng: 7.322323
                            }
                        }
                    }]
            });
        });
        it('should verify location and send post pickup verfication message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_trip_helpers_1.default.handleLocationVerfication(testUser, 'Kigali', 'pickup');
            expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id));
            expect(cache_1.default.saveObject).toHaveBeenCalled();
        }));
        it('should verify location and send post destination verfication message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_1.addressService, 'findOrCreateAddress').mockResolvedValue({ id: 1 });
            yield user_trip_helpers_1.default.handleLocationVerfication(testUser, 'Kigali', 'destination');
            expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id));
            expect(cache_1.default.saveObject).toHaveBeenCalled();
        }));
    });
    describe('getCachedPlaceIds', () => {
        it('should return place ids and location', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ location: 'Nairobi', id: 45 });
            const placeId = yield user_trip_helpers_1.default.getCachedPlaceIds(testUser.id);
            expect(placeId).toEqual({ location: 'Nairobi', id: 45 });
            expect(cache_1.default.fetch).toHaveBeenCalledWith(location_helpers_1.getPredictionsKey(testUser.id));
        }));
    });
    describe('getPostForMeMessage', () => {
        it('should return post forMe message when forMe is true', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ forMe: true });
            const message = yield user_trip_helpers_1.default.getPostForMeMessage(testUser.id);
            expect(message).toBeDefined();
        }));
        it('should return post forMe message when forMe is false', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ forMe: false });
            const message = yield user_trip_helpers_1.default.getPostForMeMessage(testUser.id);
            expect(message).toBeDefined();
        }));
    });
    describe('getLocationVerificationMsg', () => {
        it('should get location verification message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(location_helpers_1.default, 'getLocationVerificationMsg').mockResolvedValue();
            yield user_trip_helpers_1.default
                .getLocationVerificationMsg('location', testUser.id, 'selectActionId', 'backActionValue');
            expect(location_helpers_1.default.getLocationVerificationMsg).toHaveBeenCalled();
        }));
    });
    describe('user savePayment helper', () => {
        const payload = {
            submission: { price: '200' },
            state: '{"tripId":"16"}'
        };
        it('save payment', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'dialogValidator').mockResolvedValue();
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue();
            yield user_trip_helpers_1.default.savePayment(payload);
            expect(slack_helpers_1.default.dialogValidator).toHaveBeenCalled();
            expect(trip_service_1.default.updateRequest).toHaveBeenCalled();
        }));
        it('should get a error when saving payment', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'dialogValidator').mockImplementation(() => {
                throw new Error();
            });
            try {
                yield user_trip_helpers_1.default.savePayment(payload);
            }
            catch (error) {
                expect(error).toBeDefined();
                expect(slack_helpers_1.default.dialogValidator).toHaveBeenCalled();
            }
        }));
    });
});
//# sourceMappingURL=user-trip-helpers.spec.js.map