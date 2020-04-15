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
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const Notifications_1 = __importDefault(require("../SlackPrompts/Notifications"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const UserInputValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const ProviderNotifications_1 = __importDefault(require("../SlackPrompts/notifications/ProviderNotifications"));
const TripHelper_1 = __importDefault(require("../../../helpers/TripHelper"));
const trip_request_1 = require("../../../database/models/trip-request");
const interactions_1 = __importDefault(require("../../new-slack/trips/manager/interactions"));
const constants_1 = __importDefault(require("../../new-slack/trips/manager/constants"));
class TripActionsController {
    static getErrorMessage() {
        return { text: 'Dang, something went wrong there.' };
    }
    static runCabValidation(payload) {
        if (payload.submission.confirmationComment) {
            const errors = [];
            const err = UserInputValidator_1.default.validateCabDetails(payload);
            errors.push(...err);
            return errors;
        }
    }
    static getTripNotificationDetails(opsDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, team: { id: teamId } } = opsDetails;
            const [ops, slackBotOauthToken] = yield Promise.all([
                slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId),
                teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId)
            ]);
            return { ops, slackBotOauthToken };
        });
    }
    static changeTripStatus(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: userId }, team: { id: teamId }, actions } = payload;
                const [ops, teamDetails] = yield Promise.all([
                    slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId),
                    teamDetails_service_1.teamDetailsService.getTeamDetails(teamId)
                ]);
                const { id: opsUserId } = ops;
                if (actions && actions.length >= 1) {
                    const [{ action_id: actionId }] = actions;
                    if (actionId === constants_1.default.confirmApprovedTrip) {
                        return TripActionsController.changeTripStatusToConfirmed(opsUserId, payload, teamDetails);
                    }
                }
                if (payload.submission.confirmationComment) {
                    return TripActionsController.changeTripStatusToPendingConfirmation(opsUserId, payload, teamDetails);
                }
                if (payload.submission.opsDeclineComment) {
                    return TripActionsController.changeTripStatusToDeclined(opsUserId, payload, teamDetails);
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return TripActionsController.getErrorMessage();
            }
        });
    }
    static changeTripStatusToPendingConfirmation(opsUserId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { submission: { confirmationComment, providerId }, channel, state: payloadState } = payload;
            const { tripId, timeStamp, responseUrl } = JSON.parse(payloadState);
            const approvalDate = TripHelper_1.default.convertApprovalDateFormat(timeStamp);
            const trip = yield trip_service_1.default.updateRequest(tripId, {
                tripStatus: trip_request_1.TripStatus.pendingConfirmation,
                operationsComment: confirmationComment,
                confirmedById: opsUserId,
                providerId,
                approvalDate
            });
            yield interactions_1.default.sendOpsDeclineOrApprovalCompletion(false, trip, channel, payload.user.id, responseUrl);
        });
    }
    static changeTripStatusToConfirmed(opsUserId, payload, teamDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel, response_url: responseUrl, message, actions } = payload;
            const [{ value: tripId }] = actions;
            const { ts: timeStamp } = message;
            const approvalDate = TripHelper_1.default.convertApprovalDateFormat(timeStamp, true);
            const trip = yield trip_service_1.default.updateRequest(tripId, {
                tripStatus: trip_request_1.TripStatus.confirmed,
                confirmedById: opsUserId,
                approvalDate
            });
            const data = Object.assign(Object.assign({}, payload), { submission: { providerId: trip.provider.id } });
            this.notifyAll(data, trip, teamDetails);
            yield interactions_1.default.sendOpsDeclineOrApprovalCompletion(false, trip, channel, payload.user.id, responseUrl);
        });
    }
    static notifyAll(payload, trip, teamDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submission: { providerId }, team: { id: teamId }, user: { id: userId }, } = payload;
                yield Promise.all([
                    ProviderNotifications_1.default.sendTripNotification(providerId, teamDetails, trip),
                    Notifications_1.default.sendManagerConfirmOrDeclineNotification(teamId, userId, trip, false),
                    Notifications_1.default.sendUserConfirmOrDeclineNotification(teamId, userId, trip, false, true)
                ]);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static completeTripRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submission: { cab: cabId, driver: driverId }, team: { id: teamId }, state: payloadState, } = payload;
                const { tripId, timeStamp, channel, } = JSON.parse(payloadState);
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                const trip = trip_service_1.default.completeCabAndDriverAssignment({
                    tripId, updateData: { cabId, driverId }, teamId: payload.team.id
                });
                yield ProviderNotifications_1.default.UpdateProviderNotification(channel, slackBotOauthToken, trip, timeStamp);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static sendAllNotifications(teamId, userId, trip, channel, isDecline = false, responseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                Notifications_1.default.sendUserConfirmOrDeclineNotification(teamId, userId, trip, isDecline),
                Notifications_1.default.sendManagerConfirmOrDeclineNotification(teamId, userId, trip, isDecline),
                interactions_1.default.sendOpsDeclineOrApprovalCompletion(isDecline, trip, channel, userId, responseUrl)
            ]);
        });
    }
    static changeTripStatusToDeclined(opsUserId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { submission: { opsDeclineComment }, team: { id: teamId }, user: { id: userId }, channel: { id: channelId }, state: payloadState } = payload;
            const { trip: stateTrip, responseUrl } = JSON.parse(payloadState);
            const tripId = Number(stateTrip);
            const trip = yield trip_service_1.default.updateRequest(tripId, {
                tripStatus: trip_request_1.TripStatus.declinedByOps,
                operationsComment: opsDeclineComment,
                declinedById: opsUserId
            });
            yield TripActionsController.sendAllNotifications(teamId, userId, trip, channelId, true, responseUrl);
            return 'success';
        });
    }
}
exports.default = TripActionsController;
//# sourceMappingURL=TripActionsController.js.map