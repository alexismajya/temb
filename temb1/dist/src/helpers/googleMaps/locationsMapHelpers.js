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
const location_service_1 = __importDefault(require("../../modules/locations/location.service"));
const homebase_service_1 = require("../../modules/homebases/homebase.service");
const googleMapsHelpers_1 = require("./googleMapsHelpers");
const GoogleMapsSuggestions_1 = __importDefault(require("../../services/googleMaps/GoogleMapsSuggestions"));
const GoogleMapsStatic_1 = __importDefault(require("../../services/googleMaps/GoogleMapsStatic"));
const cache_1 = __importDefault(require("../../modules/shared/cache"));
const LocationPrompts_1 = __importDefault(require("../../modules/slack/SlackPrompts/LocationPrompts"));
const DialogPrompts_1 = __importDefault(require("../../modules/slack/SlackPrompts/DialogPrompts"));
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
const SlackMessageModels_1 = require("../../modules/slack/SlackModels/SlackMessageModels");
const googleMapsError_1 = __importDefault(require("./googleMapsError"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../../modules/slack/helpers/slackHelpers/InteractivePromptSlackHelper"));
exports.getTravelKey = (id) => `TRAVEL_REQUEST_${id}`;
class LocationHelpers {
    static convertMapStringToUrl(string) {
        return encodeURI(string).replace('#', '%23');
    }
    static tripCompare(tripDetails) {
        const tripData = tripDetails;
        const { destination, othersDestination, pickup, othersPickup } = tripDetails;
        tripData.destination = destination === 'Others' ? othersDestination : destination;
        tripData.pickup = pickup === 'Others' ? othersPickup : pickup;
        return tripData;
    }
    static checkTripType(string, data) {
        let locationSearchString;
        const { pickup, othersPickup, destination, othersDestination } = data;
        if (string === 'pickup') {
            locationSearchString = LocationHelpers.getLocation(pickup, othersPickup);
        }
        else {
            locationSearchString = LocationHelpers.getLocation(destination, othersDestination);
        }
        return locationSearchString;
    }
    static getLocation(searchstring, other) {
        return searchstring === 'Others' ? other : searchstring;
    }
    static getMarker(location, label) {
        const locationMarker = new googleMapsHelpers_1.Marker('blue', label);
        locationMarker.addLocation(location);
        return locationMarker;
    }
    static locationMarker(predictedPlacesResults) {
        let markerLabel = 0;
        return predictedPlacesResults.map((prediction) => {
            const locationMarker = new googleMapsHelpers_1.Marker('blue', markerLabel += 1);
            locationMarker.addLocation(prediction.description);
            return locationMarker;
        });
    }
    static getPredictionsOnMap(location, homebaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const predictions = yield LocationHelpers.getLocationPredictions(location, homebaseName);
            if (predictions && predictions.length > 0) {
                const markers = predictions.map((prediction, index) => LocationHelpers.getMarker(prediction.description, `${index + 1}`));
                const mapString = GoogleMapsStatic_1.default.getLocationScreenshot(markers);
                const url = LocationHelpers.convertMapStringToUrl(mapString);
                return { url, predictions };
            }
            return false;
        });
    }
    static getLocationPredictions(location, homebaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let locationCoordinates;
            try {
                const { locationId } = yield homebase_service_1.homebaseService.getByName(homebaseName);
                const { latitude, longitude } = yield location_service_1.default.getLocationById(locationId);
                locationCoordinates = `${latitude.toString()}, ${longitude.toString()}`;
                const locations = new googleMapsHelpers_1.GoogleMapsLocationSuggestionOptions(location, locationCoordinates);
                const { predictions } = yield GoogleMapsSuggestions_1.default.getPlacesAutoComplete(locations);
                return predictions;
            }
            catch (_a) {
                return false;
            }
        });
    }
    static locationVerify(submission, buttonType, tripType) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationSearchString = LocationHelpers.checkTripType(buttonType, submission);
            try {
                const locationPredictions = new googleMapsHelpers_1.GoogleMapsLocationSuggestionOptions(locationSearchString);
                const { predictions: predictedPlacesResults } = yield GoogleMapsSuggestions_1.default
                    .getPlacesAutoComplete(locationPredictions);
                const predictedLocations = predictedPlacesResults.map((prediction) => ({ text: prediction.description, value: prediction.place_id }));
                const locationMarkers = LocationHelpers.locationMarker(predictedPlacesResults);
                const staticMapString = GoogleMapsStatic_1.default.getLocationScreenshot(locationMarkers);
                const staticMapUrl = LocationHelpers.convertMapStringToUrl(staticMapString);
                const pickupOrDestination = buttonType === 'pickup' ? 'Pick up' : 'Destination';
                const locationData = {
                    staticMapUrl, predictedLocations, pickupOrDestination, buttonType, tripType
                };
                const message = LocationPrompts_1.default.sendMapSuggestionsResponse(locationData);
                return message;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new googleMapsError_1.default(googleMapsError_1.default.UNAUTHENTICATED, 'cannot verify location');
            }
        });
    }
    static locationPrompt(locationData, respond, payload, stateLocation, trip) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, latitude, longitude } = locationData;
            yield cache_1.default.save(payload.user.id, stateLocation, { address, latitude, longitude });
            LocationPrompts_1.default.sendMapsConfirmationResponse(respond, locationData, trip);
        });
    }
    static sendResponse(actionName, locationData, respond, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (actionName === 'pickupBtn') {
                yield LocationHelpers.locationPrompt(locationData, respond, payload, 'pickUpAddress', 'pickup');
            }
            else {
                yield LocationHelpers.locationPrompt(locationData, respond, payload, 'destinationAddress', 'destination');
            }
        });
    }
    static locationSuggestions(payload, respond, actionName, actionType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const place = yield googleMapsHelpers_1.RoutesHelper.getReverseGeocodePayload(payload);
                if (!place) {
                    LocationPrompts_1.default.sendLocationCoordinatesNotFound(respond);
                    return;
                }
                const { plus_code: { geometry: { location: { lat: latitude } } } } = place;
                const { plus_code: { geometry: { location: { lng: longitude } } } } = place;
                const locationGeometry = `${latitude},${longitude}`;
                const address = `${place.plus_code.best_street_address}`;
                const locationMarker = new googleMapsHelpers_1.Marker('red', 'H');
                locationMarker.addLocation(locationGeometry);
                const staticMapString = GoogleMapsStatic_1.default.getLocationScreenshot([locationMarker]);
                const staticMapUrl = LocationHelpers.convertMapStringToUrl(staticMapString);
                const locationData = {
                    staticMapUrl, address, latitude, longitude, locationGeometry, actionType
                };
                yield LocationHelpers.sendResponse(actionName, locationData, respond, payload);
            }
            catch (error) {
                InteractivePromptSlackHelper_1.default.sendError();
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static callDestinationSelection(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id } } = payload;
                const { tripType } = yield cache_1.default.fetch(exports.getTravelKey(id));
                if (tripType === 'Airport Transfer') {
                    return DialogPrompts_1.default.sendTripDetailsForm(payload, 'travelDestinationForm', 'travel_trip_destinationConfirmation', 'Destination Details');
                }
                respond(new SlackMessageModels_1.SlackInteractiveMessage('We could not process that request. Please try again'));
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static callRiderLocationConfirmation(payload, respond, location) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return DialogPrompts_1.default.sendTripDetailsForm(payload, 'riderLocationConfirmationForm', 'travel_trip_completeTravelConfirmation', `Confirm ${location}`);
            }
            catch (error) {
                respond(new SlackMessageModels_1.SlackInteractiveMessage('We could not process that request. Please try again'));
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = LocationHelpers;
//# sourceMappingURL=locationsMapHelpers.js.map