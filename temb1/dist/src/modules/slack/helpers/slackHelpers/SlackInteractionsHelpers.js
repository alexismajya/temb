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
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const cleanData_1 = __importDefault(require("../../../../helpers/cleanData"));
const InteractivePrompts_1 = __importDefault(require("../../SlackPrompts/InteractivePrompts"));
const DialogPrompts_1 = __importStar(require("../../SlackPrompts/DialogPrompts"));
const ViewTripHelper_1 = __importDefault(require("./ViewTripHelper"));
const CancelTripController_1 = __importDefault(require("../../TripManagement/CancelTripController"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const OpsTripActions_1 = __importDefault(require("../../TripManagement/OpsTripActions"));
const user_trip_booking_controller_1 = __importDefault(require("../../../new-slack/trips/user/user-trip-booking-controller"));
const OpsDialogPrompts_1 = __importDefault(require("../../SlackPrompts/OpsDialogPrompts"));
const itinerary_controller_1 = __importDefault(require("../../../new-slack/trips/user/itinerary.controller"));
const reschedule_helper_1 = __importDefault(require("../../../new-slack/trips/user/reschedule.helper"));
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
const constants_1 = require("../../../../helpers/constants");
const constants_2 = __importDefault(require("../../../new-slack/trips/manager/constants"));
const feedback_service_1 = require("../../../feedback/feedback.service");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const feedbackHelper_1 = __importDefault(require("./feedbackHelper"));
class SlackInteractionsHelpers {
    static welcomeMessage(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actions: [{ value: action }] } = payload;
            switch (action) {
                case 'book_new_trip':
                    yield user_trip_booking_controller_1.default.startTripBooking(payload, respond);
                    break;
                case 'view_trips_itinerary':
                    yield itinerary_controller_1.default.start(payload, respond);
                    break;
                case 'change_location':
                    yield InteractivePrompts_1.default.changeLocation(payload, respond);
                    break;
                default:
                    respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea'));
                    break;
            }
        });
    }
    static goodByeMessage() {
        return new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea. See you again.');
    }
    static isCancelMessage(data) {
        const payload = cleanData_1.default.trim(data);
        return (payload.type === 'interactive_message' && payload.actions[0].value === 'cancel');
    }
    static sendCommentDialog(data, respond) {
        const payload = cleanData_1.default.trim(data);
        const action = payload.actions[0].name;
        switch (action) {
            case ('confirmTrip'):
                DialogPrompts_1.default.sendOperationsApprovalDialog(payload, respond);
                break;
            case ('declineRequest'):
                DialogPrompts_1.default.sendOperationsDeclineDialog(payload);
                break;
            default:
                break;
        }
    }
    static handleItineraryActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { name, value } = payload.actions[0];
            let message;
            switch (name) {
                case 'view':
                    message = yield ViewTripHelper_1.default.displayTripRequest(value, payload.user.id);
                    break;
                case 'reschedule':
                    message = yield reschedule_helper_1.default.sendTripRescheduleModal(payload, value);
                    break;
                case 'cancel_trip':
                    message = yield CancelTripController_1.default.cancelTrip(value, payload);
                    break;
                default:
                    message = SlackInteractionsHelpers.goodByeMessage();
            }
            if (message)
                respond(message);
        });
    }
    static handleFeedbackAction(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            return DialogPrompts_1.dialogPrompts.sendFeedbackDialog(payload, undefined, respond);
        });
    }
    static handleGetFeedbackAction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel: { id: channelId }, team: { id: teamId }, user: { id: userId }, submission, } = payload;
            const user = yield user_service_1.default.getUserBySlackId(userId);
            const result = yield feedback_service_1.feedbackService.createFeedback({
                userId: user.id,
                feedback: submission.feedback
            });
            if (result) {
                feedbackHelper_1.default.sendFeedbackSuccessmessage(teamId, channelId, JSON.parse(payload.state).actionTs);
            }
        });
    }
    static handleOpsAction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let options;
            const { actions: [{ selected_options: selectedOptions, value: values }], channel: { id: channelId }, team: { id: teamId }, user: { id: userId }, } = payload;
            const { original_message: ogMessage, message } = payload;
            const timeStamp = ogMessage ? ogMessage.ts : message.ts;
            const action = payload.actions[0].name || payload.actions[0].action_id;
            if (action === 'declineRequest') {
                return DialogPrompts_1.default.sendOperationsDeclineDialog(payload);
            }
            if (selectedOptions) {
                options = selectedOptions[0].value.split('_');
            }
            else {
                options = values.split('_');
            }
            if (action === constants_2.default.editApprovedTrip) {
                options = ['', payload.actions[0].value];
            }
            const [value, tripId] = options;
            yield SlackInteractionsHelpers.handleOpsSelectAction(value, tripId, teamId, channelId, userId, timeStamp, payload);
        });
    }
    static startProviderActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const action = payload.state || payload.actions[0].value;
            switch (action.split('_')[0]) {
                case 'accept':
                    yield DialogPrompts_1.default.sendSelectCabDialog(payload);
                    break;
                default:
                    respond(SlackInteractionsHelpers.goodByeMessage());
                    break;
            }
        });
    }
    static handleOpsSelectAction(value, tripId, teamId, channelId, userId, timeStamp, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const isOpsAssignCab = value === 'assignCab';
            const trip = yield trip_service_1.default.getById(tripId, true);
            const tripIsCancelled = trip.tripStatus === 'Cancelled';
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            if (tripIsCancelled) {
                return OpsTripActions_1.default.sendUserCancellation(channelId, slackBotOauthToken, trip, userId, timeStamp);
            }
            if (isOpsAssignCab) {
                return OpsDialogPrompts_1.default.selectDriverAndCab(payload, tripId);
            }
            const correctedData = Object.assign(Object.assign({}, payload), { actions: [Object.assign(Object.assign({}, payload.actions[0]), { value: trip.id })] });
            return SlackInteractionsHelpers.handleSelectProviderAction(correctedData);
        });
    }
    static handleSelectProviderAction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (SlackInteractionsHelpers.isConfirmTripOrAssignCabAndProvider(data)) {
                    return DialogPrompts_1.default.sendSelectProviderDialog(data);
                }
                if (SlackInteractionsHelpers.isDecline(data)) {
                    yield DialogPrompts_1.default.sendOperationsDeclineDialog(data);
                }
            }
            catch (error) {
                const { channel: { id: channel }, team: { id: teamId } } = data;
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                yield Notifications_1.default.sendNotification(Notifications_1.default.createDirectMessage(channel, constants_1.providerErrorMessage), slackBotOauthToken);
            }
        });
    }
    static isConfirmTripOrAssignCabAndProvider(data) {
        return data.actions && (data.actions[0].name === 'confirmTrip'
            || data.actions[0].name === 'assign-cab-or-provider'
            || data.actions[0].action_id === constants_2.default.editApprovedTrip);
    }
    static isDecline(data) {
        return data.actions && data.actions[0].name === 'declineRequest';
    }
}
exports.default = SlackInteractionsHelpers;
//# sourceMappingURL=SlackInteractionsHelpers.js.map