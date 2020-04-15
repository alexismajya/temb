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
const handler_1 = require("../helpers/slackHelpers/handler");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const route_request_service_1 = __importDefault(require("../../routes/route-request.service"));
const DialogPrompts_1 = __importDefault(require("../SlackPrompts/DialogPrompts"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const managerFormValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator/managerFormValidator"));
const index_1 = __importDefault(require("../SlackPrompts/notifications/OperationsRouteRequest/index"));
const cleanData_1 = __importDefault(require("../../../helpers/cleanData"));
const OperationsHelper_1 = __importDefault(require("../helpers/slackHelpers/OperationsHelper"));
const Notifications_1 = __importDefault(require("../SlackPrompts/Notifications"));
const constants_1 = require("../../../helpers/constants");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const TripHelper_1 = __importDefault(require("../../../helpers/TripHelper"));
const InteractivePrompts_1 = __importDefault(require("../SlackPrompts/InteractivePrompts"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const RouteHelper_1 = __importDefault(require("../../../helpers/RouteHelper"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const driver_service_1 = require("../../drivers/driver.service");
const SlackDialogModels_1 = require("../SlackModels/SlackDialogModels");
const driver_notifications_1 = __importDefault(require("../SlackPrompts/notifications/DriverNotifications/driver.notifications"));
const TripJobs_1 = __importDefault(require("../../../services/jobScheduler/jobs/TripJobs"));
const cab_service_1 = require("../../cabs/cab.service");
const handlers = {
    decline: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
        const [{ value: routeRequestId }] = actions;
        const { botToken, routeRequest } = yield route_request_service_1.default
            .getRouteRequestAndToken(routeRequestId, payload.team.id);
        const declined = routeRequest.status === 'Declined';
        const approved = routeRequest.status === 'Approved';
        if (approved || declined) {
            index_1.default.updateOpsStatusNotificationMessage(payload, routeRequest, botToken);
            return;
        }
        const state = {
            decline: {
                timeStamp,
                channelId,
                routeRequestId
            }
        };
        DialogPrompts_1.default.sendReasonDialog(payload, 'operations_route_declinedRequest', JSON.stringify(state), 'Decline', 'Decline', 'declineReason', 'route');
    }),
    declinedRequest: (data, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = cleanData_1.default.trim(data);
            const { submission: { declineReason }, team: { id: teamId }, user: { id: opsSlackId }, state } = payload;
            const { decline: { timeStamp, channelId, routeRequestId } } = JSON.parse(state);
            const opsUserInfo = yield user_service_1.default.getUserBySlackId(opsSlackId);
            const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            const updatedRequest = yield RouteHelper_1.default.updateRouteRequest(routeRequestId, { status: 'Declined', opsComment: declineReason, opsReviewerId: opsUserInfo.id });
            yield index_1.default.completeOperationsDeclineAction(updatedRequest, botToken, channelId, timeStamp, opsSlackId, false);
        }
        catch (error) {
            bugsnagHelper_1.default.log(error);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
        }
    }),
    approve: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = cleanData_1.default.trim(data);
        const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
        const [{ value: routeRequestId }] = actions;
        const { slackBotOauthToken, routeRequest, routeRequest: { status } } = yield route_request_service_1.default
            .getRouteRequestAndToken(routeRequestId, payload.team.id);
        const declined = status === 'Declined';
        const approved = status === 'Approved';
        if (approved || declined) {
            yield index_1.default.updateOpsStatusNotificationMessage(payload, routeRequest, slackBotOauthToken);
            return;
        }
        const state = { approve: { timeStamp, channelId, routeRequestId } };
        try {
            yield DialogPrompts_1.default.sendOperationsNewRouteApprovalDialog(payload, state);
        }
        catch (error) {
            yield Notifications_1.default.sendNotification(Notifications_1.default.createDirectMessage(channelId, constants_1.providerErrorMessage), slackBotOauthToken);
        }
    }),
    approvedRequest: (data, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = cleanData_1.default.trim(data);
            const errors = managerFormValidator_1.default.approveRequestFormValidation(payload);
            if (errors.length > 0) {
                return { errors };
            }
            const { team: { id: teamId }, user: { id: opsSlackId }, submission, state } = payload;
            const { id: opsUserId } = yield user_service_1.default.getUserBySlackId(opsSlackId);
            const { approve: { channelId, timeStamp, routeRequestId } } = JSON.parse(state);
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const updatedRequest = yield RouteHelper_1.default.updateRouteRequest(routeRequestId, {
                opsReviewerId: opsUserId, opsComment: submission.opsComment, status: 'Approved',
            });
            const result = yield RouteHelper_1.default.createNewRouteBatchFromSlack(submission, routeRequestId, botToken);
            yield OperationsHelper_1.default.completeRouteApproval(updatedRequest, result, {
                channelId, opsSlackId, timeStamp, submission, botToken
            });
        }
        catch (error) {
            bugsnagHelper_1.default.log(error);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
        }
    })
};
exports.handlers = handlers;
class OperationsHandler {
    static operationsRouteController(action) {
        const errorHandler = (() => {
            throw new Error(`Unknown action: operations_route_${action}`);
        });
        return handlers[action] || errorHandler;
    }
    static handleOperationsActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                const action = handler_1.getAction(payload, 'actions');
                const actionHandler = OperationsHandler.operationsRouteController(action);
                return actionHandler(payload, respond);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Error:bangbang:: I was unable to do that.'));
            }
        });
    }
    static completeOpsAssignCabDriver(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submission: { driver: driverId, cab: cabId, confirmationComment }, team: { id: teamId }, user: { id: userId }, state, channel } = data;
                const cab = yield cab_service_1.cabService.getById(cabId);
                const driver = yield driver_service_1.driverService.getDriverById(driverId);
                const errors = yield OperationsHandler.validateOpsAssignCabnDriverDialog(cab, driver);
                if (errors)
                    return { errors };
                const { tripId, timeStamp: ts } = JSON.parse(state);
                const { id: opsUserId } = yield slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId);
                const timeStamp = TripHelper_1.default.convertApprovalDateFormat(ts);
                const updateTripStatusPayload = OperationsHelper_1.default
                    .getUpdateTripStatusPayload(tripId, confirmationComment, opsUserId, timeStamp, cabId, driverId, cab.providerId);
                const trip = yield trip_service_1.default.update(tripId, updateTripStatusPayload, {
                    returning: true,
                    include: trip_service_1.default.defaultInclude,
                });
                const { rider: { slackId: riderSlackId }, requester: { slackId: requesterSlackId } } = trip;
                const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                OperationsHandler.sendAssignCabDriverNotifications(teamId, trip, cab, driver, requesterSlackId, riderSlackId, channel, ts);
                driver_notifications_1.default.checkAndNotifyDriver(driverId, teamId, trip);
                TripJobs_1.default.scheduleTakeOffReminder({ botToken, data: trip });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static validateOpsAssignCabnDriverDialog(cab, driver) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = 'cab and driver must belong to the same provider';
            if (driver.providerId !== cab.providerId) {
                return [
                    new SlackDialogModels_1.SlackDialogError('cab', error),
                    new SlackDialogModels_1.SlackDialogError('driver', error)
                ];
            }
        });
    }
    static sendAssignCabDriverNotifications(teamId, trip, cab, driver, requesterSlackId, riderSlackId, channel, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                const tripInformation = Object.assign(Object.assign({}, trip), { cab, driver });
                const driverDetails = `,${driver.driverName},${driver.driverPhoneNo}`;
                const message = 'Thank you for completing this trip request';
                const tripDetailsAttachment = OperationsHelper_1.default.getTripDetailsAttachment(tripInformation, driverDetails);
                yield InteractivePrompts_1.default.messageUpdate(channel.id, message, ts, [tripDetailsAttachment], slackBotOauthToken);
                yield OperationsHelper_1.default.sendCompleteOpAssignCabMsg(teamId, {
                    requesterSlackId,
                    riderSlackId
                }, tripInformation);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.OperationsHandler = OperationsHandler;
//# sourceMappingURL=OperationsController.js.map