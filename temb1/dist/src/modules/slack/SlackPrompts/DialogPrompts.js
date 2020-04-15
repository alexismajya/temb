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
const SlackDialogModels_1 = require("../SlackModels/SlackDialogModels");
const createDialogForm_1 = __importDefault(require("../../../helpers/slack/createDialogForm"));
const sendDialogTryCatch_1 = __importDefault(require("../../../helpers/sendDialogTryCatch"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const cab_service_1 = require("../../cabs/cab.service");
const driver_service_1 = require("../../drivers/driver.service");
const CabsHelper_1 = __importDefault(require("../helpers/slackHelpers/CabsHelper"));
const provider_service_1 = require("../../providers/provider.service");
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const ProvidersHelper_1 = __importDefault(require("../helpers/slackHelpers/ProvidersHelper"));
const providerHelper_1 = __importDefault(require("../../../helpers/providerHelper"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const homebase_service_1 = require("../../homebases/homebase.service");
exports.getPayloadKey = (userId) => `PAYLOAD_DETAILS${userId}`;
class DialogPrompts {
    static sendTripDetailsForm(payload, formElementsFunction, callbackId, dialogTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team: { id: teamId } } = payload;
            const dialogForm = yield createDialogForm_1.default(payload, formElementsFunction, callbackId, dialogTitle);
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            yield sendDialogTryCatch_1.default(dialogForm, slackBotOauthToken);
        });
    }
    static sendTripReasonForm(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog('schedule_trip_reason', 'Reason for booking trip', 'Submit', '', JSON.stringify(payload));
            const textarea = new SlackDialogModels_1.SlackDialogTextarea('Reason', 'reason', 'Enter reason for booking the trip');
            dialog.addElements([textarea]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendReasonDialog(payload, callbackId, state, dialogName, submitButtonText, submissionName, type = 'trip') {
        return __awaiter(this, void 0, void 0, function* () {
            const tripOrRoute = type === 'trip' ? 'trip' : 'route';
            const dialog = new SlackDialogModels_1.SlackDialog(callbackId || payload.callbackId, dialogName, submitButtonText, false, state);
            const commentElement = new SlackDialogModels_1.SlackDialogTextarea('Reason', submissionName, `Why do you want to ${submitButtonText} this ${tripOrRoute}?`);
            dialog.addElements([commentElement]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    sendFeedbackDialog(payload, callback_id = 'get_feedback') {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = payload.actions[0];
            const state = {
                user: value,
                actionTs: payload.message.ts
            };
            const dialog = new SlackDialogModels_1.SlackDialog(callback_id, 'Weekly feedback', 'Submit', false, JSON.stringify(state));
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogTextarea('Feedback : ', 'feedback', 'Type your feedback here')
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendOperationsDeclineDialog(payload, callback_id = 'operations_reason_dialog_trips') {
        return __awaiter(this, void 0, void 0, function* () {
            const actionTs = payload.message_ts;
            const { value } = payload.actions[0];
            const state = {
                trip: value,
                actionTs
            };
            const dialog = new SlackDialogModels_1.SlackDialog(callback_id, 'Reason for declining', 'Submit', false, JSON.stringify(state));
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogTextarea('Justification', 'opsDeclineComment')
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendSelectCabDialog(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actions: [{ value: tripId }], message_ts: timeStamp, channel: { id: channel }, user: { id: userId }, } = payload;
            const { callback_id: callback } = payload;
            const { id } = yield user_service_1.default.getUserBySlackId(userId);
            const provider = yield provider_service_1.providerService.findProviderByUserId(id);
            const where = { providerId: provider.id };
            const { data: cabs } = yield cab_service_1.cabService.getCabs(undefined, where);
            const cabData = CabsHelper_1.default.toCabLabelValuePairs(cabs);
            const drivers = yield driver_service_1.driverService.findAll({ where });
            const driverData = CabsHelper_1.default.toCabDriverValuePairs(drivers, true);
            const state = { tripId, timeStamp, channel };
            const callbackId = callback === 'provider_actions_route'
                ? 'providers_approval_route' : 'providers_approval_trip';
            const dialog = new SlackDialogModels_1.SlackDialog(callbackId, 'Complete The Request', 'Submit', false, JSON.stringify(state));
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Select A Driver', 'driver', [...driverData]),
                new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Select A Vehicle', 'cab', [...cabData])
            ]);
            return DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendSelectProviderDialog(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actions: [{ value: tripId }], message_ts: timeStamp, channel: { id: channel }, user: { id } } = payload;
            const currentTrip = yield trip_service_1.default.getById(tripId);
            const { providerId, operationsComment } = currentTrip;
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(id);
            const providers = yield provider_service_1.providerService.getViableProviders(homebase.id);
            const providerData = providerHelper_1.default.generateProvidersLabel(providers);
            const state = {
                tripId, timeStamp, channel, isAssignProvider: true, responseUrl: payload.response_url,
            };
            const dialog = new SlackDialogModels_1.SlackDialog('confirm_ops_approval', 'Confirm Trip Request', 'Submit', false, JSON.stringify(state));
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Select A Provider', 'provider', [...providerData], providerId),
                new SlackDialogModels_1.SlackDialogTextarea('Justification', 'confirmationComment', 'Reason why', 'Enter reason for approving trip', operationsComment)
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendOperationsApprovalDialog(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = payload.actions[0];
            const { confirmationComment } = JSON.parse(value);
            let nextCallback;
            let title;
            const callbackId = 'operations_reason_dialog';
            if (payload.callback_id === 'operations_approval_route') {
                nextCallback = `${callbackId}_route`;
                title = 'Confirm Route Request';
            }
            else {
                nextCallback = `${callbackId}_trips`;
                title = 'Confirm Trip Request';
            }
            let dialog = new SlackDialogModels_1.SlackDialog(nextCallback, title, 'Submit', false, value);
            dialog = DialogPrompts.addCabElementsToDialog(dialog, confirmationComment);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted ...'));
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static addCabElementsToDialog(dialog, confirmationComment) {
        dialog.addElements([
            new SlackDialogModels_1.SlackDialogText('Driver\'s name', 'driverName', 'Enter driver\'s name'),
            new SlackDialogModels_1.SlackDialogText('Driver\'s contact', 'driverPhoneNo', 'Enter driver\'s contact'),
            new SlackDialogModels_1.SlackDialogText('Cab Registration number', 'regNumber', 'Enter the Cab\'s registration number'),
            new SlackDialogModels_1.SlackDialogText('Cab Model', 'model', 'Enter the Cab\'s model name'),
            new SlackDialogModels_1.SlackDialogText('Cab Capacity', 'capacity', 'Enter the Cab\'s capacity'),
            new SlackDialogModels_1.SlackDialogTextarea('Justification', 'confirmationComment', 'Reason why', 'Enter reason for approval', confirmationComment),
        ]);
        return dialog;
    }
    static sendOperationsNewRouteApprovalDialog(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog('operations_route_approvedRequest', 'Approve Route Request', 'Submit', false, JSON.stringify(state));
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogText('Route\'s name', 'routeName', 'Enter route\'s name'),
                new SlackDialogModels_1.SlackDialogText('Route\'s take-off time', 'takeOffTime', 'Enter take-off time', false, 'The time should be in the format (HH:mm), eg. 01:30')
            ]);
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id);
            const providers = yield provider_service_1.providerService.getViableProviders(homebase.id);
            const providersData = ProvidersHelper_1.default.toProviderLabelPairValues(providers);
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Select A Provider', 'providerId', providersData),
                new SlackDialogModels_1.SlackDialogTextarea('Justification', 'confirmationComment', 'Reason why', 'Enter reason for approval'),
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendBusStopForm(payload, busStageList) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = payload.actions[0];
            const state = {
                tripId: value,
                timeStamp: payload.message_ts,
                channel: payload.channel.id,
                response_url: payload.response_url
            };
            const dialog = new SlackDialogModels_1.SlackDialog('new_route_handleBusStopSelected', 'Drop off', 'Submit', false, JSON.stringify(state));
            const select = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Landmarks', 'selectBusStop', busStageList);
            select.optional = true;
            if (busStageList.length > 0) {
                dialog.addElements([select]);
            }
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogText('Landmark not listed?', 'otherBusStop', 'Google Plus Code', true, 'The location should be in the format (QVMX+8X Nairobi, Kenya)'),
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendLocationForm(payload, location = 'home') {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog(`new_route_${location}`, 'Create New Route', 'Submit', true);
            const locationText = location.charAt(0).toUpperCase() + location.slice(1);
            const hint = 'e.g Westlands, Nairobi';
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogText(`Enter ${locationText} Address: `, 'location', `Type in your ${location} address`, false, hint)
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendSkipPage(payload, value, callbackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog(callbackId, 'Page to skip to', 'Submit', false, value);
            const textarea = new SlackDialogModels_1.SlackDialogText('Page Number', 'pageNumber', 'Page to skip to');
            dialog.addElements([textarea]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendSearchPage(payload, value, callbackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message_ts: messageTs, response_url: origin } = payload;
            const state = JSON.stringify({ action: value, origin, messageTs });
            const dialog = new SlackDialogModels_1.SlackDialog(callbackId, 'Search', 'Submit', false, state);
            const hint = 'e.g Emmerich Road';
            const textarea = new SlackDialogModels_1.SlackDialogText('Search', 'search', 'Enter the route name to search', false, hint);
            dialog.addElements([textarea]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendNewRouteForm(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = { response_url: payload.response_url };
            const selectManager = new SlackDialogModels_1.SlackDialogElementWithDataSource('Select Manager', 'manager');
            const workingHours = new SlackDialogModels_1.SlackDialogText('Working Hours', 'workingHours', 'Enter Working Hours', false, 'Hint: (From - To) hh:mm - hh:mm. e.g 20:30 - 02:30');
            const dialog = new SlackDialogModels_1.SlackDialog('new_route_handlePreviewPartnerInfo', 'Engagement Information', 'Submit', true, JSON.stringify(state));
            dialog.addElements([selectManager, workingHours]);
            const dialogForm = new SlackDialogModels_1.SlackDialogModel(payload.trigger_id, dialog);
            const { team: { id: teamId } } = payload;
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            yield sendDialogTryCatch_1.default(dialogForm, slackBotOauthToken);
        });
    }
    static sendLocationCoordinatesForm(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog('new_route_suggestions', 'Home address plus code', 'Submit', true);
            const hint = 'e.g QVMX+8X Nairobi, Kenya';
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogText('Address plus code:', 'coordinates', 'Type in your home address google plus code', false, hint)
            ]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendLocationDialogToUser(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog('schedule_trip_resubmitLocation', 'Location Details', 'Submit', true, state);
            const { value } = state.actions[0];
            const hint = 'Andela Nairobi, Kenya';
            const pickupOrDestination = value === 'no_Pick up' ? 'Pickup' : 'Destination';
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogText(`${pickupOrDestination} Location: `, `${pickupOrDestination}_location`, `Enter your ${pickupOrDestination} details`, false, hint)
            ]);
            yield DialogPrompts.sendDialog(dialog, state);
        });
    }
    static sendEngagementInfoDialogToManager(payload, callback, state, defaultValues = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog(callback, 'Fellow\'s Engagement', 'Submit', true, state);
            const sdName = 'startDate';
            const edName = 'endDate';
            const hint = 'hint: dd/mm/yyyy. example: 31/01/2019';
            const sdPlaceholder = 'Start Date';
            const edPlaceholder = 'End Date';
            const startDate = new SlackDialogModels_1.SlackDialogText(`Engagement ${sdPlaceholder}`, sdName, sdPlaceholder, false, hint, defaultValues[sdName]);
            const endDate = new SlackDialogModels_1.SlackDialogText(`Engagement ${edPlaceholder}`, edName, edPlaceholder, false, hint, defaultValues[edName]);
            dialog.addElements([startDate, endDate]);
            yield DialogPrompts.sendDialog(dialog, payload);
        });
    }
    static sendDialog(dialog, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialogForm = new SlackDialogModels_1.SlackDialogModel(payload.trigger_id, dialog);
            const { team: { id: teamId } } = payload;
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            yield sendDialogTryCatch_1.default(dialogForm, slackBotOauthToken);
        });
    }
    static sendTripNotesDialogForm(payload, formElementsFunction, callbackId, dialogTitle, note) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team: { id: teamId } } = payload;
            const dialogForm = createDialogForm_1.default(payload, formElementsFunction, callbackId, dialogTitle, note);
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            yield sendDialogTryCatch_1.default(dialogForm, slackBotOauthToken);
        });
    }
    static sendOperationsApproveDelayedTripDialog(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DialogPrompts.sendReasonDialog(payload, 'approve_trip', state, 'Approve Trip Request?', 'Approve', 'approveReason');
        });
    }
}
exports.dialogPrompts = new DialogPrompts();
exports.default = DialogPrompts;
//# sourceMappingURL=DialogPrompts.js.map