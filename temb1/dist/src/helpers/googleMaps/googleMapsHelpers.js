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
const maps_1 = __importDefault(require("@google/maps"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../services/googleMaps/GoogleMapsDistanceMatrix"));
const address_service_1 = require("../../modules/addresses/address.service");
const environment_1 = __importDefault(require("../../config/environment"));
const constants_1 = require("../constants");
exports.getGoogleLocationPayload = (uri, options) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request_promise_native_1.default.get(uri, options);
    const responseObject = JSON.parse(response);
    if (!responseObject.error_message) {
        return responseObject;
    }
    throw new Error(responseObject.error_message);
});
class Marker {
    constructor(color = 'blue', label = '') {
        this.color = color;
        this.label = label;
        this.locations = '';
    }
    addLocation(location) {
        this.locations = this.locations.concat('|', location);
    }
}
exports.Marker = Marker;
class RoutesHelper {
    static distanceBetweenDropoffAndHome(busStop, home, limit = 2000) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield RoutesHelper.verifyDistanceBetween(busStop, home, limit);
                if (!result) {
                    return "Your Bus-stop can't be more than 2km away from your Home";
                }
                return 'Acceptable Distance';
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
    static getDojoCoordinateFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const { THE_DOJO_ADDRESS } = environment_1.default;
            const theDojo = yield address_service_1.addressService.findAddress(THE_DOJO_ADDRESS);
            if (!theDojo) {
                throw new Error('Cannot find The Dojo location in the database');
            }
            return theDojo;
        });
    }
    static verifyDistanceBetween(origins, destinations, limitInMetres) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield GoogleMapsDistanceMatrix_1.default.calculateDistance(origins, destinations);
            const { distanceInMetres } = result;
            return distanceInMetres <= limitInMetres;
        });
    }
    static getReverseGeocodePayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (RoutesHelper.isLocationNotFound(payload))
                return false;
            const placeIdOrCoordinates = payload.submission
                ? payload.submission.coordinates : payload.actions[0].selected_options[0].value;
            const optionType = payload.submission ? 'coordinates' : 'placeId';
            return RoutesHelper.getPlaceInfo(optionType, placeIdOrCoordinates);
        });
    }
    static getReverseGeocodePayloadOnBlock(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { selected_option: { value: placeId } } = payload.actions[0];
            const optionType = payload.submission ? 'coordinates' : 'placeId';
            return RoutesHelper.getPlaceInfo(optionType, placeId);
        });
    }
    static getAddressDetails(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = 'https://maps.googleapis.com/maps/api/geocode/json?';
            const plusCodeUri = 'https://plus.codes/api?';
            const searchOption = type === 'placeId' ? {
                place_id: payload
            } : {
                address: payload
            };
            const options = {
                qs: Object.assign(Object.assign({}, searchOption), { key: process.env.GOOGLE_MAPS_API_KEY })
            };
            try {
                const response = searchOption.address
                    ? yield exports.getGoogleLocationPayload(plusCodeUri, options)
                    : yield exports.getGoogleLocationPayload(uri, options);
                return response;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getPlaceInfo(optionType, placeIdOrCoordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield RoutesHelper.getAddressDetails(optionType, placeIdOrCoordinates);
            return place;
        });
    }
    static isLocationNotFound(payload) {
        const { actions } = payload;
        if (!actions)
            return false;
        const [{ name }] = actions;
        return (name === 'retry' || name === 'no');
    }
}
exports.RoutesHelper = RoutesHelper;
class GoogleMapsLocationSuggestionOptions {
    constructor(input, location, radius = 15000, strictBounds = true) {
        this.input = input;
        this.location = location || constants_1.LOCATION_CORDINATES.NAIROBI;
        this.radius = radius;
        this.strictbounds = strictBounds;
        this.sessiontoken = maps_1.default.util.placesAutoCompleteSessionToken();
        this.key = process.env.GOOGLE_MAPS_API_KEY;
    }
}
exports.GoogleMapsLocationSuggestionOptions = GoogleMapsLocationSuggestionOptions;
//# sourceMappingURL=googleMapsHelpers.js.map