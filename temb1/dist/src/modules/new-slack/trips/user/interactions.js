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
const SlackDialogModels_1 = require("../../../slack/SlackModels/SlackDialogModels");
const actions_1 = __importDefault(require("./actions"));
const user_trip_helpers_1 = __importDefault(require("./user-trip-helpers"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const DialogPrompts_1 = __importDefault(require("../../../slack/SlackPrompts/DialogPrompts"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const slack_edit_trip_helpers_1 = __importDefault(require("../../helpers/slack-edit-trip-helpers"));
const SlackViews_1 = require("../../extensions/SlackViews");
class Interactions {
    static sendTripReasonForm(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog(actions_1.default.reasonDialog, 'Reason for booking trip', 'Submit', '', JSON.stringify(state));
            const textarea = new SlackDialogModels_1.SlackDialogTextarea('Reason', 'reason', 'Enter reason for booking the trip');
            dialog.addElements([textarea]);
            yield DialogPrompts_1.default.sendDialog(dialog, payload);
        });
    }
    static sendDetailsForm(payload, state, { title, submitLabel, callbackId, fields }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog(callbackId, title, submitLabel, '', JSON.stringify(state));
            dialog.addElements(fields);
            yield DialogPrompts_1.default.sendDialog(dialog, payload);
        });
    }
    static sendPostPickUpMessage(payload, submission, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.parse(payload.view.private_metadata);
            const message = yield user_trip_helpers_1.default.getPostPickupMessage(payload, submission, isEdit);
            yield updatePastMessageHelper_1.default.newUpdateMessage(data.origin, message);
        });
    }
    static sendPostDestinationMessage(payload, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield user_trip_helpers_1.default.getPostDestinationMessage(payload, submission);
            yield Interactions.sendMessage(payload, message);
        });
    }
    static sendMessage(payload, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin } = JSON.parse(payload.state || payload.view.private_metadata);
            yield updatePastMessageHelper_1.default.newUpdateMessage(origin, message);
        });
    }
    static sendAddPassengers(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = user_trip_helpers_1.default.getAddPassengersMessage();
            const { origin } = JSON.parse(state);
            yield updatePastMessageHelper_1.default.newUpdateMessage(origin, message);
        });
    }
    static sendPriceForm(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceDialog = new SlackDialogModels_1.SlackDialog(actions_1.default.payment, 'The price of the trip', 'Submit', '', JSON.stringify(state));
            priceDialog.addElements([new SlackDialogModels_1.SlackDialogText('Price', 'price', 'Enter total amount of the trip in Ksh.')]);
            yield DialogPrompts_1.default.sendDialog(priceDialog, payload);
        });
    }
    static sendPickupModal(homebaseName, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = { origin: payload.response_url };
            const modal = yield slack_helpers_1.default.getPickupModal(homebaseName, state);
            const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return SlackViews_1.SlackViews.open({
                botToken: token,
                modal,
                triggerId: payload.trigger_id,
            });
        });
    }
    static sendEditRequestModal(tripDetails, teamId, triggerId, responseUrl, allDepartments, homebaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = yield slack_edit_trip_helpers_1.default.getEditRequestModal(tripDetails, responseUrl, allDepartments, homebaseName);
            const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            return SlackViews_1.SlackViews.open({
                botToken: token,
                modal,
                triggerId,
            });
        });
    }
}
exports.default = Interactions;
//# sourceMappingURL=interactions.js.map