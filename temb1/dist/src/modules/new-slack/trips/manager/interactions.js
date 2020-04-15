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
const DialogPrompts_1 = __importDefault(require("../../../slack/SlackPrompts/DialogPrompts"));
const constants_1 = __importDefault(require("./constants"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const trip_request_1 = require("../../../../database/models/trip-request");
const trip_helpers_1 = __importDefault(require("../manager/trip.helpers"));
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
const trip_helpers_2 = __importDefault(require("./trip.helpers"));
class Interactions {
    static sendReasonForm(payload, options, callback = constants_1.default.reasonSubmission) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = options.isApproval ? 'Approval' : 'Decline';
            const dialog = new SlackDialogModels_1.SlackDialog(callback, `Reason for ${action}`, 'Submit', '', JSON.stringify(options));
            const textarea = new SlackDialogModels_1.SlackDialogTextarea('Reason', 'reason', `Enter reason for ${action.toLowerCase()}`);
            dialog.addElements([textarea]);
            yield DialogPrompts_1.default.sendDialog(dialog, payload);
        });
    }
    static sendOpsDeclineOrApprovalCompletion(decline, tripRequest, channel, userId, responseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = Object.assign(Object.assign({}, tripRequest), { lastActionById: userId });
                status.currentState = decline ?
                    trip_request_1.TripStatus.declinedByOps : this.getPendingOrConfirmedStatus(tripRequest);
                const message = yield trip_helpers_1.default.getApprovalOrDeclineMessage(tripRequest, status, channel, userId);
                yield updatePastMessageHelper_1.default.sendMessage(responseUrl, message);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getPendingOrConfirmedStatus(trip) {
        if (trip.tripStatus === trip_request_1.TripStatus.pendingConfirmation) {
            return trip_request_1.TripStatus.pendingConfirmation;
        }
        return trip_request_1.TripStatus.confirmed;
    }
    static sendRequesterApprovedNotification(data, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { requester } = data;
                const channel = yield Notifications_1.default.getDMChannelId(requester.slackId, botToken);
                const getMessage = yield trip_helpers_2.default.getApprovedMessageOfRequester(data, channel);
                yield Notifications_1.default.sendNotification(getMessage, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = Interactions;
//# sourceMappingURL=interactions.js.map