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
const preview_trip_booking_helper_1 = __importDefault(require("../preview-trip-booking-helper"));
const user_data_mocks_1 = require("../__mocks__/user-data-mocks");
const previewScheduleTripAttachments_1 = __importDefault(require("../../../../slack/helpers/slackHelpers/previewScheduleTripAttachments"));
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../../../../services/googleMaps/GoogleMapsDistanceMatrix"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
describe('PreviewTripBooking', () => {
    const riderId = 'HJYU67H';
    beforeEach(() => {
        jest.spyOn(GoogleMapsDistanceMatrix_1.default, 'calculateDistance')
            .mockResolvedValue({ distanceInKm: '10 Km' });
        jest.spyOn(cache_1.default, 'save').mockResolvedValue();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('getRiderName', () => {
        it('should return the name of the rider', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(previewScheduleTripAttachments_1.default, 'getRider').mockResolvedValue({
                name: 'rider', id: riderId
            });
            const riderName = yield preview_trip_booking_helper_1.default.getRiderName(riderId);
            expect(riderName).toEqual('rider');
        }));
    });
    describe('previewDistance', () => {
        it('should get a slack text for the distance', () => {
            const expected = [{
                    type: 'mrkdwn',
                    text: '*Distance* \n10 Km'
                }];
            const preview = preview_trip_booking_helper_1.default.previewDistance('10 Km', []);
            expect(preview).toEqual(expected);
        });
        it('should not get a slack text for the distance when distance is unknown', () => {
            const preview = preview_trip_booking_helper_1.default.previewDistance('unknown', []);
            expect(preview).toEqual([]);
        });
    });
    describe('getpreviewFields', () => {
        it('should return trip preview with latitude and longitude', () => __awaiter(void 0, void 0, void 0, function* () {
            const preview = yield preview_trip_booking_helper_1.default.getPreviewFields(user_data_mocks_1.userTripDetails);
            expect(preview).toBeDefined();
            expect(cache_1.default.save).toHaveBeenCalled();
            expect(GoogleMapsDistanceMatrix_1.default.calculateDistance).toHaveBeenCalled();
        }));
        it('should return trip preview when latitude and longitude is null', () => __awaiter(void 0, void 0, void 0, function* () {
            user_data_mocks_1.userTripDetails.pickupLat = null;
            const preview = yield preview_trip_booking_helper_1.default.getPreviewFields(user_data_mocks_1.userTripDetails);
            expect(preview).toBeDefined();
        }));
        it('should return preview when forMe id false', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(preview_trip_booking_helper_1.default, 'getRiderName').mockResolvedValue('Patrick');
            user_data_mocks_1.userTripDetails.forMe = false;
            const preview = yield preview_trip_booking_helper_1.default.getPreviewFields(user_data_mocks_1.userTripDetails);
            expect(preview).toBeDefined();
        }));
    });
});
//# sourceMappingURL=preview-trip-booking-helper.spec.js.map