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
const interactions_1 = __importDefault(require("./interactions"));
const constants_1 = __importDefault(require("./constants"));
const trip_helpers_1 = __importDefault(require("./trip.helpers"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const trip_request_1 = require("../../../../database/models/trip-request");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
class TripController {
    static approve(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel: { id: channelId }, actions: [{ value, action_id }] } = payload;
            const isApproval = action_id === constants_1.default.approve ? 1 : 0;
            const tripInfo = yield slack_helpers_1.default.getTripState(value);
            if (tripInfo.currentState !== trip_request_1.TripStatus.pending) {
                const message = yield trip_helpers_1.default.getManagerApprovedOrDeclineMessage(value, tripInfo, channelId, payload.user.id);
                return updatePastMessageHelper_1.default.newUpdateMessage(payload.response_url, message);
            }
            const response_url = payload.response_url;
            yield interactions_1.default.sendReasonForm(payload, { isApproval, origin: response_url, tripId: value });
        });
    }
    static completeApproveOrDecline(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { isApproval, tripId: requestId, origin } = JSON.parse(payload.state);
                const tripId = Number(requestId);
                const { submission: { reason }, channel: { id: channelId } } = payload;
                const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(payload.team.id);
                const tripInfo = yield slack_helpers_1.default.getTripState(tripId);
                let message;
                if (tripInfo.currentState !== trip_request_1.TripStatus.pending) {
                    message = yield trip_helpers_1.default.getManagerApprovedOrDeclineMessage(tripId, tripInfo, channelId, payload.user.id);
                    return updatePastMessageHelper_1.default.newUpdateMessage(origin, message);
                }
                yield trip_helpers_1.default.completeManagerResponse({ tripId, botToken, isApproval, reason,
                    managerSlackId: payload.user.id, teamId: payload.team.id });
                const updated = Object.assign(Object.assign({}, tripInfo), { lastActionById: payload.user.id });
                updated.currentState = isApproval ? trip_request_1.TripStatus.approved : trip_request_1.TripStatus.declinedByManager;
                message = yield trip_helpers_1.default.getManagerApprovedOrDeclineMessage(tripId, updated, channelId, payload.user.id);
                yield updatePastMessageHelper_1.default.newUpdateMessage(origin, message);
                trip_helpers_1.default.notifyManagerIfOpsApproved(tripId, channelId, botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.default = TripController;
//# sourceMappingURL=trip.controller.js.map