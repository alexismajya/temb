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
const InteractivePrompts_1 = __importDefault(require("../../../SlackPrompts/InteractivePrompts"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const cache_1 = __importDefault(require("../../../../shared/cache"));
const ScheduleTripController_1 = __importDefault(require("../../../TripManagement/ScheduleTripController"));
const createTravelTripDetails_1 = __importDefault(require("./createTravelTripDetails"));
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const locationsMapHelpers_1 = __importDefault(require("../../../../../helpers/googleMaps/locationsMapHelpers"));
const events_1 = __importDefault(require("../../../events"));
const slackEvents_1 = require("../../../events/slackEvents");
const LocationPrompts_1 = __importDefault(require("../../../SlackPrompts/LocationPrompts"));
const googleMapsError_1 = __importDefault(require("../../../../../helpers/googleMaps/googleMapsError"));
const cleanData_1 = __importDefault(require("../../../../../helpers/cleanData"));
const Validators_1 = __importDefault(require("../../../../../helpers/slack/UserInputValidator/Validators"));
const Notifications_1 = __importDefault(require("../../../SlackPrompts/Notifications"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../InteractivePromptSlackHelper"));
const travelHelper_1 = __importDefault(require("./travelHelper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../../helpers/slack/updatePastMessageHelper"));
const homebase_service_1 = require("../../../../homebases/homebase.service");
const dateHelpers_1 = require("../../dateHelpers");
const dateHelper_1 = __importDefault(require("../../../../../helpers/dateHelper"));
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const travel_helpers_1 = __importDefault(require("../../../../new-slack/trips/travel/travel.helpers"));
exports.getTravelKey = (id) => `TRAVEL_REQUEST_${id}`;
class TravelTripHelper {
    static contactDetails(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                const errors = ScheduleTripController_1.default.validateTravelContactDetailsForm(payload);
                if (errors.length > 0) {
                    return { errors };
                }
                const { user: { id }, submission } = payload;
                yield cache_1.default.save(exports.getTravelKey(id), 'contactDetails', submission);
                const props = {
                    payload,
                    respond,
                    attachmentCallbackId: 'travel_trip_department',
                    navButtonCallbackId: 'back_to_launch',
                    navButtonValue: 'back_to_travel_launch'
                };
                return InteractivePrompts_1.default.sendListOfDepartments(props, 'false');
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static checkVerifiable(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiable = yield travelHelper_1.default.getPickupType(payload.submission);
                if (verifiable)
                    respond(verifiable);
            }
            catch (err) {
                if (err instanceof googleMapsError_1.default && err.code === googleMapsError_1.default.UNAUTHENTICATED) {
                    const message = InteractivePromptSlackHelper_1.default.openDestinationDialog();
                    respond(message);
                }
            }
        });
    }
    static flightDetails(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id } } = payload;
                const errors = yield ScheduleTripController_1.default.validateTravelDetailsForm(payload, 'airport', 'pickup');
                if (errors.length > 0) {
                    return { errors };
                }
                yield updatePastMessageHelper_1.default.updateMessage(payload.state, { text: 'Noted...' });
                const tripDetails = yield createTravelTripDetails_1.default(payload);
                const homeBase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(id);
                const userTimeZone = dateHelpers_1.getTimezone(homeBase.name || 'Nairobi');
                tripDetails.dateTime = dateHelper_1.default.transformDate(tripDetails.dateTime, userTimeZone);
                tripDetails.flightDateTime = dateHelper_1.default.transformDate(tripDetails.flightDateTime, userTimeZone);
                yield cache_1.default.save(exports.getTravelKey(id), 'tripDetails', tripDetails);
                yield TravelTripHelper.checkVerifiable(payload, respond);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static suggestions(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const actionName = payload.actions[0].name;
            if (actionName === 'no') {
                LocationPrompts_1.default.errorPromptMessage(respond);
            }
            else {
                yield locationsMapHelpers_1.default.locationSuggestions(payload, respond, actionName, 'travel_trip');
            }
        });
    }
    static destinationSelection(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPayload = Object.assign({}, payload);
            newPayload.state = JSON.stringify(payload);
            const valueName = payload.actions[0].value;
            if (valueName === 'cancel') {
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea'));
            }
            else {
                yield locationsMapHelpers_1.default.callDestinationSelection(newPayload, respond);
            }
        });
    }
    static destinationConfirmation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = yield ScheduleTripController_1.default.validateTravelDetailsForm(payload, 'airport', 'destination');
                if (errors.length > 0) {
                    return { errors };
                }
                const { user: { id } } = payload;
                const { tripDetails } = yield cache_1.default.fetch(exports.getTravelKey(id));
                const { submission: { destination, othersDestination } } = payload;
                errors.push(...Validators_1.default.checkOriginAnDestination(tripDetails.pickup, destination, 'pickup', 'destination'));
                if (errors.length > 0)
                    return { errors };
                yield updatePastMessageHelper_1.default.updateMessage(payload.state, { text: 'Noted...' });
                tripDetails.destination = destination;
                tripDetails.othersDestination = othersDestination;
                yield cache_1.default.save(exports.getTravelKey(id), 'tripDetails', tripDetails);
                yield travelHelper_1.default.getDestinationType(payload, respond);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Please try again'));
            }
        });
    }
    static sendDetails(payload, respond) {
        if (payload.actions[0].value === 'cancel') {
            return InteractivePromptSlackHelper_1.default.sendCancelRequestResponse(respond);
        }
        if (payload.actions[0].value === 'trip_note') {
            return travelHelper_1.default.notesRequest(payload, respond);
        }
    }
    static confirmation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id } } = payload;
                const { tripDetails } = yield cache_1.default.fetch(exports.getTravelKey(id));
                if (payload.actions[0].value === 'confirm') {
                    yield TravelTripHelper.processTripCompletion(payload, tripDetails, respond);
                }
                else {
                    yield travelHelper_1.default.checkNoteStatus(payload, respond);
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static processTripCompletion(payload, tripDetails, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripRequest = yield ScheduleTripController_1.default.createTravelTripRequest(payload, tripDetails);
                if (tripDetails.destination === 'To Be Decided' || tripDetails.pickup === 'To Be Decided') {
                    yield travelHelper_1.default.riderRequest(payload, tripDetails, respond);
                }
                yield TravelTripHelper.sendCompletedResponseToOps(tripRequest, tripDetails, respond, payload);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static requesterToBeDecidedNotification(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id } } = payload;
            const valueName = payload.actions[0].value;
            let message;
            if (valueName === 'yay') {
                message = ':smiley:';
            }
            else {
                const { tripDetails: { rider } } = yield cache_1.default.fetch(exports.getTravelKey(id));
                message = `Waiting for <@${rider}>'s response...`;
            }
            respond(new SlackMessageModels_1.SlackInteractiveMessage(message));
        });
    }
    static completeTravelConfirmation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: riderID }, submission: { confirmedLocation }, team: { id: teamID } } = payload;
                const { waitingRequester } = yield cache_1.default.fetch(exports.getTravelKey(riderID));
                const { tripDetails } = yield cache_1.default.fetch(exports.getTravelKey(waitingRequester));
                const { location, updatedTripDetails } = travelHelper_1.default.updateLocationInfo(tripDetails, confirmedLocation);
                const tripRequest = yield ScheduleTripController_1.default.createTravelTripRequest(payload, updatedTripDetails);
                yield cache_1.default.save(exports.getTravelKey(waitingRequester), 'tripDetails', updatedTripDetails);
                yield Notifications_1.default.sendOperationsRiderlocationConfirmation({
                    riderID, teamID, confirmedLocation, waitingRequester, location
                }, respond);
                return TravelTripHelper.sendCompletedResponseToOps(tripRequest, updatedTripDetails, respond, payload);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static sendCompletedResponseToOps(tripRequest, tripData, respond, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            InteractivePromptSlackHelper_1.default.sendCompletionResponse(respond, tripRequest.id, tripData.rider);
            const [trip, botToken] = yield Promise.all([
                trip_service_1.default.getById(tripRequest.id, true),
                teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id),
            ]);
            events_1.default.raise(slackEvents_1.slackEventNames.NEW_TRAVEL_TRIP_REQUEST, trip, botToken);
        });
    }
    static tripNotesAddition(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id }, submission: { tripNote } } = payload;
            const { tripDetails } = yield cache_1.default.fetch(exports.getTravelKey(id));
            const errors = [];
            errors.push(...Validators_1.default.validateDialogSubmission(payload));
            if (errors.length)
                return { errors };
            tripDetails.tripNote = tripNote;
            yield cache_1.default.save(exports.getTravelKey(id), 'tripDetails', tripDetails);
            if (payload.state) {
                const data = { text: 'Noted...' };
                yield updatePastMessageHelper_1.default.updateMessage(payload.state, data);
            }
            const result = yield travel_helpers_1.default.getPreviewTripMessage(tripDetails);
            respond(result);
        });
    }
}
exports.default = TravelTripHelper;
//# sourceMappingURL=index.js.map