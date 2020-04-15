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
const GoogleMapsMock_1 = __importDefault(require("../__mocks__/GoogleMapsMock"));
const teamDetails_service_1 = require("../../../modules/teamDetails/teamDetails.service");
const SlackClientMock_1 = __importDefault(require("../../../modules/slack/__mocks__/SlackClientMock"));
const LocationPrompts_1 = __importDefault(require("../../../modules/slack/SlackPrompts/LocationPrompts"));
const GoogleMapsSuggestions_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsSuggestions"));
const GoogleMapsStatic_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsStatic"));
const googleMapsHelpers_1 = require("../googleMapsHelpers");
const bugsnagHelper_1 = __importDefault(require("../../bugsnagHelper"));
const cache_1 = __importDefault(require("../../../modules/shared/cache"));
const locationsMapHelpers_1 = __importDefault(require("../locationsMapHelpers"));
const DialogPrompts_1 = __importDefault(require("../../../modules/slack/SlackPrompts/DialogPrompts"));
jest.mock('../../../utils/WebClientSingleton.js');
jest.mock('../../../modules/slack/events/index.js');
jest.mock('@google/maps');
jest.mock('../../../modules/slack/events/', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
}));
const mockedCreateClient = { placesNearby: jest.fn() };
SlackClientMock_1.default();
GoogleMapsMock_1.default();
jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({});
const pickUpString = 'pickup';
const destinationString = 'destination';
const pickupPayload = {
    submission: {
        pickup: 'Nairobi',
        othersPickup: ''
    }
};
const destinationPayload = {
    submission: {
        destination: 'Kisumu',
        othersDestination: '',
    }
};
const pickupOthers = {
    submission: {
        pickup: 'Others',
        othersPickup: 'Allsops'
    }
};
const destinationOthers = {
    submission: {
        destination: 'Others',
        othersDestination: 'Kigali',
    }
};
describe('Tests for google maps locations', () => {
    let respond;
    beforeEach(() => {
        respond = jest.fn();
        maps_1.default.createClient.mockImplementation(() => (mockedCreateClient));
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should check trip type and return required response', () => {
        expect(locationsMapHelpers_1.default
            .checkTripType(pickUpString, pickupPayload.submission)).toEqual('Nairobi');
        expect(locationsMapHelpers_1.default
            .checkTripType(destinationString, destinationPayload.submission)).toEqual('Kisumu');
        expect(locationsMapHelpers_1.default.checkTripType(pickUpString, pickupOthers.submission)).toEqual('Allsops');
        expect(locationsMapHelpers_1.default
            .checkTripType(destinationString, destinationOthers.submission)).toEqual('Kigali');
    });
    it('should call sendMapSuggestionsResponse', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            type: 'dialog_submission',
            submission: {
                location: 'test location'
            }
        };
        GoogleMapsSuggestions_1.default.getPlacesAutoComplete = jest.fn().mockResolvedValue({ predictions: [{ description: 'Test Location', place_id: 'xxxxx' }] });
        GoogleMapsStatic_1.default.getLocationScreenshot = jest.fn().mockReturnValue('staticMapUrl');
        LocationPrompts_1.default.sendMapSuggestionsResponse = jest.fn().mockReturnValue({});
        yield locationsMapHelpers_1.default.locationVerify(payload.submission, respond, pickUpString, 'travel_trip');
        expect(LocationPrompts_1.default.sendMapSuggestionsResponse).toHaveBeenCalled();
    }));
    it('Should not return "other" if destination or pick up is other', () => {
        const tripData = {
            destination: 'Others', othersDestination: 'Nairobi', pickup: 'Others', othersPickup: 'Dojo'
        };
        const newTripData = {
            destination: 'Nairobi', othersDestination: 'Nairobi', pickup: 'Dojo', othersPickup: 'Dojo'
        };
        const returnData = locationsMapHelpers_1.default.tripCompare(tripData);
        expect(returnData).toEqual(newTripData);
    });
});
describe('Tests for google maps suggestions', () => {
    let respond;
    beforeEach(() => {
        respond = jest.fn();
        maps_1.default.createClient.mockImplementation(() => (mockedCreateClient));
    });
    it('should call sendMapSuggestionsResponse', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            user: { id: 1 },
            type: 'dialog_submission',
            actions: [{
                    selected_options: [{ value: 'xxxxx' }]
                }]
        };
        jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getAddressDetails').mockResolvedValue({
            plus_code: { geometry: { location: { lat: 1, lng: 1 } }, best_street_address: 'Test Location Address' }
        });
        GoogleMapsStatic_1.default.getLocationScreenshot = jest.fn().mockReturnValue('staticMapUrl');
        cache_1.default.saveObject = jest.fn().mockResolvedValue({});
        LocationPrompts_1.default.sendMapSuggestionsResponse = jest.fn().mockReturnValue({});
        locationsMapHelpers_1.default.sendResponse = jest.fn().mockReturnValue({});
        yield locationsMapHelpers_1.default.locationSuggestions(payload, respond, 'pickupBtn');
        expect(locationsMapHelpers_1.default.sendResponse).toHaveBeenCalled();
    }));
    it('should call sendLocationCoordinatesNotFound', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            submission: { coordinates: '1,1' }
        };
        jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getAddressDetails')
            .mockImplementation().mockResolvedValueOnce(null);
        LocationPrompts_1.default.sendLocationCoordinatesNotFound = jest.fn().mockReturnValueOnce({});
        yield locationsMapHelpers_1.default.locationSuggestions(payload, respond, 'pickupBtn');
        expect(LocationPrompts_1.default.sendLocationCoordinatesNotFound).toHaveBeenCalled();
    }));
    it('should catch thrown errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            type: 'dialog_submission',
            submission: {
                location: 'test location'
            }
        };
        googleMapsHelpers_1.RoutesHelper.getReverseGeocodePayload = jest.fn().mockImplementation(() => {
            throw new Error('Dummy error');
        });
        bugsnagHelper_1.default.log = jest.fn().mockReturnValue({});
        yield locationsMapHelpers_1.default.locationSuggestions(payload, respond, pickUpString);
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
});
describe('helper functions', () => {
    let respond;
    beforeEach(() => {
        respond = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    const locationData = {
        address: 'Nairobi', latitude: '1234567', longitude: '34567890'
    };
    const payload = {
        user: {
            id: '1'
        }
    };
    const stateLocation = 'destinationAddress';
    const trip = 'travel_trip';
    it('it should call sendMapsConfirmationResponse', () => __awaiter(void 0, void 0, void 0, function* () {
        cache_1.default.save = jest.fn().mockReturnValue({});
        LocationPrompts_1.default.sendMapsConfirmationResponse = jest.fn().mockReturnValue({});
        yield locationsMapHelpers_1.default.locationPrompt(locationData, respond, payload, stateLocation, trip);
        expect(LocationPrompts_1.default.sendMapsConfirmationResponse).toBeCalled();
        expect(cache_1.default.save).toBeCalled();
    }));
    describe('callRiderLocationConfirmation', () => {
        it('Should call sendTripDetailsForm', () => __awaiter(void 0, void 0, void 0, function* () {
            const sendTripDetailsForm = jest.spyOn(DialogPrompts_1.default, 'sendTripDetailsForm').mockImplementation(() => Promise.resolve());
            yield locationsMapHelpers_1.default.callRiderLocationConfirmation(payload, respond, 'Pickup');
            expect(sendTripDetailsForm).toHaveBeenCalledWith(payload, 'riderLocationConfirmationForm', 'travel_trip_completeTravelConfirmation', 'Confirm Pickup');
        }));
        it('should respond and call bugsnug of error caught', () => __awaiter(void 0, void 0, void 0, function* () {
            DialogPrompts_1.default.sendTripDetailsForm = jest.fn().mockImplementation(() => {
                throw new Error('Dummy error');
            });
            bugsnagHelper_1.default.log = jest.fn().mockReturnValue({});
            yield locationsMapHelpers_1.default.callRiderLocationConfirmation(payload, respond, 'Pickup');
            expect(respond).toHaveBeenCalled();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('getMarker', () => {
        it('should get marker object', () => {
            const location = 'Andela Nairobi';
            const label = 'Dodjo';
            const marker = locationsMapHelpers_1.default.getMarker(location, label);
            expect(marker).toBeDefined();
            expect(marker.color).toEqual('blue');
            expect(marker.label).toEqual('Dodjo');
        });
    });
    describe('getPredictionsOnMap', () => {
        it('should return predictions and url', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(GoogleMapsSuggestions_1.default, 'getPlacesAutoComplete').mockResolvedValue({
                predictions: [{
                        description: 'Nakuru Road'
                    }]
            });
            jest.spyOn(GoogleMapsStatic_1.default, 'getLocationScreenshot').mockResolvedValue('https://maps.googleapis.com/maps/api/staticmap');
            const predictions = yield locationsMapHelpers_1.default.getPredictionsOnMap('Nakuru', 'Nairobi');
            expect(predictions).toBeDefined();
            expect(predictions.predictions).toEqual([{ description: 'Nakuru Road' }]);
        }));
        it('should return false when there is no prediction found', () => __awaiter(void 0, void 0, void 0, function* () {
            const predictions = yield locationsMapHelpers_1.default.getPredictionsOnMap('Nakuru', 'Nairobi');
            expect(predictions).toBe(false);
        }));
    });
    describe('getLocationPredictions', () => {
        it('should return predictions', () => {
            jest.spyOn(GoogleMapsSuggestions_1.default, 'getPlacesAutoComplete').mockResolvedValue({
                predictions: [{
                        description: 'Nakuru Road'
                    }]
            });
        });
    });
});
//# sourceMappingURL=locationsMapHelpers.spec.js.map