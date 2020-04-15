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
const routeLocation_helpers_1 = __importDefault(require("../routeLocation.helpers"));
const googleMapsHelpers_1 = require("../../../../../helpers/googleMaps/googleMapsHelpers");
const GoogleMapsPlaceDetails_1 = __importDefault(require("../../../../../services/googleMaps/GoogleMapsPlaceDetails"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
const user_location_mocks_1 = require("../__mocks__/user-location-mocks");
describe(routeLocation_helpers_1.default, () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(routeLocation_helpers_1.default.confirmLocationMessage, () => {
        it('should confirm home location after getting place details', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeLocation_helpers_1.default, 'getPlaceDetails').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            yield routeLocation_helpers_1.default.confirmLocationMessage(user_location_mocks_1.payload);
            expect(routeLocation_helpers_1.default.getPlaceDetails).toHaveBeenCalledWith(user_location_mocks_1.payload);
        }));
    });
    describe(routeLocation_helpers_1.default.getPlaceDetails, () => {
        it('should get the details of a place picked by a user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getReverseGeocodePayloadOnBlock').mockReturnValueOnce(user_location_mocks_1.place);
            jest.spyOn(GoogleMapsPlaceDetails_1.default, 'getPlaceDetails').mockReturnValueOnce(user_location_mocks_1.placeDetails);
            jest.spyOn(cache_1.default, 'save').mockReturnValueOnce(null);
            yield routeLocation_helpers_1.default.getPlaceDetails(user_location_mocks_1.payload);
            expect(googleMapsHelpers_1.RoutesHelper.getReverseGeocodePayloadOnBlock).toHaveBeenCalledWith(user_location_mocks_1.payload);
            expect(GoogleMapsPlaceDetails_1.default.getPlaceDetails).toHaveBeenCalledWith(user_location_mocks_1.place.place_id);
            expect(cache_1.default.save).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=routeLocationHelpers.spec.js.map