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
const googleMapsHelpers_1 = require("../../../helpers/googleMaps/googleMapsHelpers");
const GoogleMapsStatic_1 = __importDefault(require("../GoogleMapsStatic"));
const GoogleMapsDirections_1 = __importDefault(require("../GoogleMapsDirections"));
const address_service_1 = require("../../../modules/addresses/address.service");
describe('Google map static', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        GoogleMapsDirections_1.default.getDirections = jest.fn(() => ({
            routes: [{
                    overview_polyline: {
                        points: 'ThePath'
                    }
                }]
        }));
        address_service_1.addressService.findAddress = jest.fn(() => ({
            dataValues: {
                location: {
                    latitude: 2.432678,
                    longitude: 4.324671
                }
            }
        }));
    }));
    it('should be able to fetch an image from google', () => __awaiter(void 0, void 0, void 0, function* () {
        const markers = [new googleMapsHelpers_1.Marker('blue', 'A')];
        markers[0].addLocation('The Dojo');
        const imageUrl = yield GoogleMapsStatic_1.default.getLocationScreenshot(markers);
        expect(/^https:\/\/maps.googleapis/.test(imageUrl)).toBe(true);
    }));
    it('should get path from dojo to drop off', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(GoogleMapsDirections_1.default, 'getDirections').mockResolvedValue({
            routes: [{
                    overview_polyline: {
                        points: 2
                    },
                }]
        });
        jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getDojoCoordinateFromDb').mockResolvedValue({
            location: {
                latitude: 1.2555,
                longitude: -0.4567
            }
        });
        const imageUrl = yield GoogleMapsStatic_1.default.getPathFromDojoToDropOff('destination', '500x500', '13', '5', 'red');
        expect(/^https:\/\/maps.googleapis.com\/maps\/api\/staticmap\?size=500x500/.test(imageUrl))
            .toEqual(true);
    }));
    it('should get path from dojo to drop off', () => __awaiter(void 0, void 0, void 0, function* () {
        const imageUrl = yield GoogleMapsStatic_1.default.getPathFromDojoToDropOff('destination');
        expect(/^https:\/\/maps.googleapis.com\/maps\/api\/staticmap\?size=700x700/.test(imageUrl))
            .toEqual(true);
    }));
});
describe('generateQueryParams', () => {
    it('should generate the correct params', () => {
        const markers = [new googleMapsHelpers_1.Marker('blue', 'A')];
        markers[0].addLocation('The Dojo');
        const stringedMarkers = GoogleMapsStatic_1.default.generateQueryParams(markers);
        expect(stringedMarkers).toEqual('&markers=color:blue|label:A|The Dojo');
    });
});
//# sourceMappingURL=GoogleMapsStatic.spec.js.map