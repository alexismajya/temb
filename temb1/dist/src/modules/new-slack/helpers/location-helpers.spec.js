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
const user_service_1 = __importDefault(require("../../users/user.service"));
const locationsMapHelpers_1 = __importDefault(require("../../../helpers/googleMaps/locationsMapHelpers"));
const cache_1 = __importDefault(require("../../shared/cache"));
const location_helpers_1 = __importDefault(require("./location-helpers"));
const ScheduleTripInputHandlers_1 = require("../../../helpers/slack/ScheduleTripInputHandlers");
describe('getLocationVerificationMsg', () => {
    jest.spyOn(user_service_1.default, 'getUserBySlackId').mockReturnValue({ homebase: { name: 'Kampala' } });
    it('should get verfication message', () => __awaiter(void 0, void 0, void 0, function* () {
        const details = {
            url: 'fakeUrl',
            predictions: [{
                    description: 'fakeDescription',
                    place_id: 'fakeId'
                }]
        };
        jest.spyOn(locationsMapHelpers_1.default, 'getPredictionsOnMap').mockResolvedValue(details);
        jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue(true);
        yield location_helpers_1.default.getLocationVerificationMsg('kigali', 'id', 'options');
        expect(locationsMapHelpers_1.default.getPredictionsOnMap).toHaveBeenCalled();
    }));
    it('should not return verfication message', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(locationsMapHelpers_1.default, 'getPredictionsOnMap').mockResolvedValue(false);
        expect(yield location_helpers_1.default.getLocationVerificationMsg('kigali', 'id', 'options'))
            .toBeFalsy();
    }));
});
describe('getDestinationCoordinates', () => {
    const testUser = { id: 'U1479' };
    beforeEach(() => {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue();
    });
    it('should return destination coordinates when given destination name', () => __awaiter(void 0, void 0, void 0, function* () {
        const submission = {
            destination: 'somewhere',
            othersDestination: null
        };
        jest.spyOn(location_helpers_1.default, 'getCoordinates').mockImplementation((loc) => (loc !== 'Others'
            ? {
                location: {
                    longitude: 1,
                    latitude: 2,
                    id: 3
                }
            } : null));
        const tripDetails = yield location_helpers_1.default.getDestinationCoordinates(testUser.id, submission);
        expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id));
        expect(tripDetails.destinationLat).toBeDefined();
    }));
    it('should return destination only if the destination is others', () => __awaiter(void 0, void 0, void 0, function* () {
        const submission = {
            destination: 'Others',
            othersDestination: 'Kigali'
        };
        const tripDetails = yield location_helpers_1.default.getDestinationCoordinates(testUser.id, submission);
        expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(testUser.id));
        expect(tripDetails.destinationLat).toBeUndefined();
    }));
});
//# sourceMappingURL=location-helpers.spec.js.map