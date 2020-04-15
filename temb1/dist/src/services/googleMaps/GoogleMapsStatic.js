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
const GoogleMapsDirections_1 = __importDefault(require("./GoogleMapsDirections"));
const googleMapsHelpers_1 = require("../../helpers/googleMaps/googleMapsHelpers");
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
class GoogleMapsStatic {
    static getLocationScreenshot(markers, size = '700x700', zoom = '') {
        const stringedMarkers = GoogleMapsStatic.generateQueryParams(markers);
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}${stringedMarkers}&zoom=${zoom}&key=${apiKey}`;
        return url;
    }
    static generateQueryParams(markers) {
        let stringedMarkers = '';
        markers.forEach((item) => {
            const { color, label, locations } = item;
            stringedMarkers += (`&markers=color:${color}|label:${label}${locations}`);
        });
        return stringedMarkers;
    }
    static getPathFromDojoToDropOff(dropOffLocation, size = '700x700', zoom = '', weight = '5', color = 'red') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.GOOGLE_MAPS_API_KEY;
                const theDojo = yield googleMapsHelpers_1.RoutesHelper.getDojoCoordinateFromDb();
                const { location: { latitude, longitude } } = theDojo;
                const dojoLocation = `${latitude}, ${longitude}`;
                const directions = yield GoogleMapsDirections_1.default.getDirections(dojoLocation, dropOffLocation);
                const originMarker = new googleMapsHelpers_1.Marker('Blue', 'A');
                originMarker.addLocation(dojoLocation);
                const destinationMarker = new googleMapsHelpers_1.Marker('Blue', 'D');
                destinationMarker.addLocation(dropOffLocation);
                const markersString = GoogleMapsStatic.generateQueryParams([originMarker, destinationMarker]);
                const path = encodeURI(directions.routes[0].overview_polyline.points);
                const params = `size=${size}${markersString}&path=weight:${weight}|color:${color}|enc:`
                    + `${path}&zoom=${zoom}$&key=${apiKey}`;
                const url = `https://maps.googleapis.com/maps/api/staticmap?${params}`;
                return url;
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.default = GoogleMapsStatic;
//# sourceMappingURL=GoogleMapsStatic.js.map