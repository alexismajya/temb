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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const cache_1 = __importDefault(require("../../shared/cache"));
const DialogPrompts_1 = __importDefault(require("../SlackPrompts/DialogPrompts"));
const LocationPrompts_1 = __importDefault(require("../SlackPrompts/LocationPrompts"));
const PreviewPrompts_1 = __importDefault(require("../SlackPrompts/PreviewPrompts"));
const googleMapsHelpers_1 = require("../../../helpers/googleMaps/googleMapsHelpers");
const googleMaps_1 = __importDefault(require("../../../services/googleMaps"));
const GoogleMapsStatic_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsStatic"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const busStopValidation_1 = __importDefault(require("../../../helpers/googleMaps/busStopValidation"));
const UserInputValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const events_1 = __importDefault(require("../events"));
const slackEvents_1 = require("../events/slackEvents");
const RouteInputHandlerHelper_1 = __importStar(require("./RouteInputHandlerHelper"));
const formHelper_1 = require("../helpers/formHelper");
const InteractivePromptSlackHelper_1 = __importDefault(require("../helpers/slackHelpers/InteractivePromptSlackHelper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../helpers/slack/updatePastMessageHelper"));
const location_helpers_1 = __importDefault(require("../../new-slack/helpers/location-helpers"));
const actions_1 = __importDefault(require("../../new-slack/routes/actions"));
const blocks_1 = __importDefault(require("../../new-slack/routes/blocks"));
class RouteInputHandlers {
    static home(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submission: { location: locationSearchString } } = payload;
                if (payload.type === 'dialog_submission') {
                    const result = yield RouteInputHandlerHelper_1.default
                        .checkIfAddressExistOnDatabase(payload, respond, locationSearchString);
                    if (result)
                        return;
                }
                const { user: { id: userId }, submission: { location } } = payload;
                const locationOptions = {
                    selectBlockId: blocks_1.default.confirmLocation,
                    selectActionId: actions_1.default.pickupLocation,
                    navBlockId: blocks_1.default.navBlock,
                    navActionId: actions_1.default.back,
                    backActionValue: 'back_to_routes_launch',
                };
                const message = yield location_helpers_1.default.getLocationVerificationMsg(location, userId, locationOptions);
                respond(message);
            }
            catch (error) {
                respond(InteractivePromptSlackHelper_1.default.sendError());
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static suggestions(payload, respond) {
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
                const staticMapUrl = RouteInputHandlerHelper_1.default.convertStringToUrl(staticMapString);
                yield cache_1.default.save(RouteInputHandlerHelper_1.getNewRouteKey(payload.user.id), 'homeAddress', { address, latitude, longitude });
                LocationPrompts_1.default
                    .sendLocationConfirmationResponse(respond, staticMapUrl, address, locationGeometry);
            }
            catch (error) {
                InteractivePromptSlackHelper_1.default.sendError();
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static locationNotFound(payload, respond) {
        const { value } = payload.actions[0];
        if (value === 'no') {
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
            return DialogPrompts_1.default.sendLocationCoordinatesForm(payload);
        }
        if (value === 'retry') {
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
            return DialogPrompts_1.default.sendLocationForm(payload);
        }
    }
    static handleBusStopRoute(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (payload.actions[0].name === 'not_listed') {
                    RouteInputHandlers.continueWithTheFlow(payload, respond);
                    return;
                }
                const { value: location } = payload.actions[0].name === 'DatabaseSuggestions'
                    ? JSON.parse(payload.actions[0].selected_options[0].value)
                    : payload.actions[0];
                const maps = new googleMaps_1.default();
                const result = yield maps.findNearestBusStops(location);
                if (payload.actions[0].name === 'DatabaseSuggestions') {
                    yield RouteInputHandlerHelper_1.default.cacheLocationAddress(payload);
                }
                const busStageList = googleMaps_1.default.mapResultsToCoordinates(result);
                const resolvedList = yield RouteInputHandlerHelper_1.default.generateResolvedBusList(busStageList, location, payload);
                if (resolvedList) {
                    return DialogPrompts_1.default.sendBusStopForm(payload, resolvedList);
                }
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Sorry, we could not find a bus-stop close to your location'));
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Please Try again, Request Timed out'));
            }
        });
    }
    static handleBusStopSelected(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let locationGeometry;
                const { user } = payload;
                const { otherBusStop, selectBusStop } = payload.submission;
                if (otherBusStop) {
                    const newPayload = Object.assign(Object.assign({}, payload), { submission: { coordinates: otherBusStop } });
                    locationGeometry = yield RouteInputHandlerHelper_1.default.coordinatesFromPlusCodes(newPayload);
                }
                const busStopCoordinate = selectBusStop || locationGeometry;
                const errors = yield busStopValidation_1.default(locationGeometry, selectBusStop, user);
                if (errors)
                    return errors;
                const previewData = yield RouteInputHandlerHelper_1.default.resolveDestinationPreviewData(payload, busStopCoordinate);
                const { validationError } = previewData;
                if (validationError)
                    return validationError;
                yield updatePastMessageHelper_1.default.updateMessage(payload.state, { text: 'Noted...' });
                yield RouteInputHandlerHelper_1.default.savePreviewDataToCache(payload.user.id, previewData);
                const previewMessage = PreviewPrompts_1.default.displayDestinationPreview(previewData);
                respond(previewMessage);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static runValidations(payload) {
        if (payload.submission && (payload.submission.coordinates || payload.submission.otherBusStop)) {
            const errors = [];
            errors.push(...UserInputValidator_1.default.validateCoordinates(payload));
            return errors;
        }
    }
    static handleNewRouteRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = payload.actions[0];
            if (value === 'launchNewRoutePrompt') {
                return DialogPrompts_1.default.sendNewRouteForm(payload);
            }
        });
    }
    static handlePreviewPartnerInfo(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, team: { id: teamId } } = payload;
            const [requester, cached, partnerInfo] = yield Promise.all([
                slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId),
                yield cache_1.default.fetch(RouteInputHandlerHelper_1.getNewRouteKey(userId)),
                yield formHelper_1.getFellowEngagementDetails(userId, teamId)
            ]);
            const { locationInfo } = cached;
            const { submission } = payload;
            const errors = UserInputValidator_1.default.validateEngagementForm(submission);
            if (errors)
                return errors;
            yield updatePastMessageHelper_1.default.updateMessage(payload.state, { text: 'Noted...' });
            if (locationInfo) {
                const message = yield PreviewPrompts_1.default.sendPartnerInfoPreview(Object.assign(Object.assign({}, payload), { partnerName: partnerInfo.partnerStatus }), locationInfo, requester);
                respond(message);
            }
        });
    }
    static handlePartnerForm(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { team: { id: teamId } } = payload;
                const routeRequest = yield RouteInputHandlerHelper_1.default.handleRouteRequestSubmission(payload);
                events_1.default.raise(slackEvents_1.slackEventNames.NEW_ROUTE_REQUEST, respond, {
                    routeRequestId: routeRequest.id,
                    teamId
                });
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Your Route Request has been successfully submitted'));
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Please Try again, Request Timed out'));
            }
        });
    }
    static continueWithTheFlow(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newRouteRequest: result } = yield cache_1.default.fetch(payload.user.id);
            const newPayload = Object.assign(Object.assign({}, payload), { submission: { location: result } });
            return RouteInputHandlers.home(newPayload, respond);
        });
    }
}
exports.default = RouteInputHandlers;
//# sourceMappingURL=RouteInputHandler.js.map