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
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const googleMaps_1 = __importDefault(require("../../helpers/googleMaps"));
const googleMapsHelpers_1 = require("../../helpers/googleMaps/googleMapsHelpers");
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
class GoogleMapsService {
    constructor() {
        this.client = maps_1.default.createClient({
            key: apiKey,
            Promise
        });
    }
    findNearestBusStops(location) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                data = yield this.client.placesNearby({
                    language: 'en',
                    location: googleMaps_1.default.coordinateStringToArray(location),
                    radius: 2000,
                    keyword: '("matatu") OR ("taxi") OR ("stage") OR ("bus")'
                }).asPromise();
                return data.json.results;
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                throw e;
            }
        });
    }
    static mapResultsToCoordinates(results) {
        const data = results.map((point) => {
            let { name } = point;
            const { geometry: { location: { lat, lng } } } = point;
            const coordinate = `${lat},${lng}`;
            if (name.length > 50)
                name = name.slice(0, 50);
            return { label: name, text: name, value: coordinate };
        });
        data.sort((a, b) => {
            if (a.text.toLowerCase() > b.text.toLowerCase())
                return 1;
            if (a.text.toLowerCase() < b.text.toLowerCase())
                return -1;
            return 0;
        });
        return data;
    }
    static generateMarkers(busStops) {
        return busStops.map((point) => {
            const { geometry, name } = point;
            const { location } = geometry;
            const marker = new googleMapsHelpers_1.Marker(undefined, name);
            marker.addLocation(`${location.lat},${location.lng}`);
            return marker;
        });
    }
}
exports.default = GoogleMapsService;
//# sourceMappingURL=index.js.map