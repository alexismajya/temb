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
const axios_1 = __importDefault(require("axios"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
class GoogleMapsDistanceMatrix {
    static calculateDistance(origins, destinations) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    origins,
                    destinations,
                    key: googleApiKey
                };
                const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/distancematrix/json', { params });
                if (response.data.status === 'REQUEST_DENIED') {
                    return { distanceInKm: 'unknown', distanceInMetres: 'unknown' };
                }
                const element = response.data.rows[0].elements[0];
                if (element.status === 'ZERO_RESULTS') {
                    return { distanceInKm: null, distanceInMetres: null };
                }
                const { distance: { text: distanceInKm, value: distanceInMetres } } = element;
                return { distanceInKm, distanceInMetres };
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
}
exports.default = GoogleMapsDistanceMatrix;
//# sourceMappingURL=GoogleMapsDistanceMatrix.js.map