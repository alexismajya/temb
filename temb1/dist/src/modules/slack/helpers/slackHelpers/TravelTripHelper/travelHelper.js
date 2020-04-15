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
const locationsMapHelpers_1 = __importDefault(require("../../../../../helpers/googleMaps/locationsMapHelpers"));
const googleMapsError_1 = __importDefault(require("../../../../../helpers/googleMaps/googleMapsError"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const Notifications_1 = __importDefault(require("../../../SlackPrompts/Notifications"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../InteractivePromptSlackHelper"));
const LocationPrompts_1 = __importDefault(require("../../../SlackPrompts/LocationPrompts"));
const DialogPrompts_1 = __importDefault(require("../../../SlackPrompts/DialogPrompts"));
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../../helpers/slack/updatePastMessageHelper"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const travel_helpers_1 = __importDefault(require("../../../../new-slack/trips/travel/travel.helpers"));
exports.getTravelKey = (id) => `TRAVEL_REQUEST_${id}`;
class TravelHelper {
    static getPickupType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pickup } = data;
            if (pickup !== 'Others') {
                return travel_helpers_1.default.getDestinationDialog();
            }
            const verifiable = yield locationsMapHelpers_1.default
                .locationVerify(data, 'pickup', 'travel_trip');
            return verifiable;
        });
    }
    static getDestinationType(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { submission: { destination } } = payload;
            if (destination !== 'Others') {
                const confirmDetails = yield TravelHelper.detailsConfirmation(payload, respond);
                return confirmDetails;
            }
            try {
                const verifiable = yield locationsMapHelpers_1.default
                    .locationVerify(payload.submission, 'destination', 'travel_trip');
                if (verifiable)
                    respond(verifiable);
            }
            catch (err) {
                if (err instanceof googleMapsError_1.default && err.code === googleMapsError_1.default.UNAUTHENTICATED) {
                    const confirmDetails = yield TravelHelper.detailsConfirmation(payload, respond);
                    respond(confirmDetails);
                }
            }
        });
    }
    static validatePickupDestination(payload, respond) {
        const { pickup, teamID, userID, rider } = payload;
        const location = (pickup === 'To Be Decided') ? 'pickup' : 'destination';
        Notifications_1.default.sendRiderlocationConfirmNotification({
            location, teamID, userID, rider
        }, respond);
        const message = TravelHelper.responseMessage(`Travel ${location} confirmation request.`, `A request has been sent to <@${rider}> to confirm his ${location} location.`, 'Once confirmed, you will be notified promptly :smiley:', 'confirm');
        respond(message);
    }
    static responseMessage(messageTitle, messageTitleBody, messageBody, btnValue = 'confirm') {
        const attachment = new SlackMessageModels_1.SlackAttachment(messageTitleBody, messageBody, '', '', '', 'default', 'warning');
        const actions = [
            new SlackMessageModels_1.SlackButtonAction('confirmTripRequest', 'Okay', btnValue),
        ];
        attachment.addFieldsOrActions('actions', actions);
        attachment.addOptionalProps('travel_trip_requesterToBeDecidedNotification', 'fallback', undefined, 'default');
        const message = new SlackMessageModels_1.SlackInteractiveMessage(messageTitle, [attachment]);
        return message;
    }
    static locationNotFound(payload, respond) {
        const value = payload.actions[0].name;
        if (value === 'no') {
            LocationPrompts_1.default.errorPromptMessage(respond);
        }
    }
    static riderLocationConfirmation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const valueName = payload.actions[0].value;
            if (valueName === 'cancel') {
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea'));
            }
            else {
                const location = valueName.split('_')[0];
                yield locationsMapHelpers_1.default.callRiderLocationConfirmation(payload, respond, location);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('noted...'));
            }
        });
    }
    static updateLocationInfo(tripDetails, confirmedLocation) {
        let location;
        const updatedTripDetails = Object.assign({}, tripDetails);
        if (updatedTripDetails.pickup === 'To Be Decided') {
            updatedTripDetails.pickup = confirmedLocation;
            location = 'Pickup';
        }
        else {
            updatedTripDetails.destination = confirmedLocation;
            location = 'Destination';
        }
        return { updatedTripDetails, location };
    }
    static riderRequest(payload, tripDetails, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team: { id: teamID }, user: { id: userID } } = payload;
            const { pickup, destination, rider } = tripDetails;
            yield cache_1.default.save(exports.getTravelKey(rider), 'waitingRequester', userID);
            const data = {
                pickup, destination, teamID, userID, rider
            };
            yield TravelHelper.validatePickupDestination(data, respond);
        });
    }
    static tripNotesUpdate(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id }, submission: { tripNote } } = payload;
            const { tripDetails } = yield cache_1.default.fetch(exports.getTravelKey(id));
            tripDetails.tripNote = tripNote;
            yield cache_1.default.save(exports.getTravelKey(id), 'tripDetails', tripDetails);
            if (tripDetails.tripNote && payload.state) {
                const data = { text: 'Noted...' };
                yield updatePastMessageHelper_1.default.updateMessage(payload.state, data);
            }
            const result = yield travel_helpers_1.default.getPreviewTripMessage(tripDetails, respond);
            respond(result);
        });
    }
    static notesRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id } } = payload;
            const { tripDetails: { tripNote } } = yield cache_1.default.fetch(exports.getTravelKey(id));
            return DialogPrompts_1.default.sendTripNotesDialogForm(payload, 'travelTripNoteForm', 'travel_trip_tripNotesAddition', 'Add Trip Notes', tripNote);
        });
    }
    static checkNoteStatus(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (payload.actions[0].value) {
                case 'cancel':
                    yield InteractivePromptSlackHelper_1.default.sendCancelRequestResponse(respond);
                    break;
                case 'trip_note':
                    yield TravelHelper.notesRequest(payload, respond);
                    break;
                case 'update_note':
                    yield TravelHelper.notesRequest(payload, respond);
                    break;
                default:
            }
        });
    }
    static detailsConfirmation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id } } = payload;
                const { tripDetails } = yield cache_1.default.fetch(exports.getTravelKey(id));
                const requesterData = yield user_service_1.default.getUserBySlackId(id);
                const tripData = locationsMapHelpers_1.default.tripCompare(tripDetails);
                tripData.requester = requesterData.name;
                const result = yield travel_helpers_1.default.getPreviewTripMessage(tripData);
                respond(result);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage(`${error} Unsuccessful request. Please try again`));
            }
        });
    }
}
exports.default = TravelHelper;
//# sourceMappingURL=travelHelper.js.map