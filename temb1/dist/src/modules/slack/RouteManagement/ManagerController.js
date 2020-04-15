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
const DialogPrompts_1 = __importDefault(require("../SlackPrompts/DialogPrompts"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const route_request_service_1 = __importDefault(require("../../routes/route-request.service"));
const InteractivePrompts_1 = __importDefault(require("../SlackPrompts/InteractivePrompts"));
const slackEvents_1 = require("../events/slackEvents");
const index_1 = __importDefault(require("../SlackPrompts/notifications/ManagerRouteRequest/index"));
const engagement_service_1 = require("../../engagements/engagement.service");
const helper_1 = __importDefault(require("../SlackPrompts/notifications/ManagerRouteRequest/helper"));
const managerFormValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator/managerFormValidator"));
const handler_1 = require("../helpers/slackHelpers/handler");
const cache_1 = __importDefault(require("../../shared/cache"));
const RouteHelper_1 = __importDefault(require("../../../helpers/RouteHelper"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const handlers = {
    initialNotification: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { channel: { id: channelId }, original_message: { ts: timestamp }, actions } = payload;
        const { team: { id: teamId } } = payload;
        const [{ value }] = actions;
        const { data: { routeRequestId } } = JSON.parse(value);
        const { slackBotOauthToken, routeRequest } = yield route_request_service_1.default.getRouteRequestAndToken(routeRequestId, teamId);
        const attachments = helper_1.default.getManagerMessageAttachment(routeRequest);
        const { fellow } = routeRequest.engagement;
        yield InteractivePrompts_1.default.messageUpdate(channelId, `Hey, <@${fellow.slackId}> just requested to create a new route. :smiley:`, timestamp, attachments, slackBotOauthToken);
    }),
    decline: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
        const [{ value: routeRequestId }] = actions;
        const routeRequest = yield route_request_service_1.default.getRouteRequest(routeRequestId);
        if (!managerFormValidator_1.default.validateStatus(routeRequest, 'pending')) {
            yield index_1.default.handleStatusValidationError(payload, routeRequest);
            return;
        }
        const state = {
            decline: {
                timeStamp,
                channelId,
                routeRequestId
            }
        };
        DialogPrompts_1.default.sendReasonDialog(payload, 'manager_route_declinedRequest', JSON.stringify(state), 'Decline', 'Decline', 'declineReason');
    }),
    approve: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
        const [{ value: routeRequestId }] = actions;
        const routeRequest = yield route_request_service_1.default.getRouteRequest(routeRequestId);
        if (!managerFormValidator_1.default.validateStatus(routeRequest, 'pending')) {
            yield index_1.default.handleStatusValidationError(payload, routeRequest);
            return;
        }
        const state = {
            approve: {
                timeStamp,
                channelId,
                routeRequestId
            }
        };
        yield DialogPrompts_1.default.sendReasonDialog(payload, 'manager_route_approvedRequestPreview', JSON.stringify(state), 'Approve Route Request', 'Approve', 'approvalReason', 'route');
    }),
    declinedRequest: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { submission: { declineReason }, team: { id: teamId } } = payload;
        const errors = managerFormValidator_1.default.validateReasons(declineReason, 'declineReason');
        if (errors.length > 0) {
            return { errors };
        }
        const { decline: { timeStamp, channelId, routeRequestId } } = JSON.parse(payload.state);
        const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
        const updatedRequest = yield RouteHelper_1.default.updateRouteRequest(routeRequestId, { status: 'Declined', managerComment: declineReason });
        slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.MANAGER_DECLINED_ROUTE_REQUEST, {
            routeRequestId: updatedRequest.id,
            botToken
        });
        yield index_1.default.completeManagerAction(updatedRequest, channelId, timeStamp, botToken);
    }),
    approvedRequestPreview: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { submission: { approvalReason }, team: { id: teamId } } = payload;
        const { approve } = JSON.parse(payload.state);
        const { timeStamp, channelId, routeRequestId } = approve;
        const { slackBotOauthToken, routeRequest } = yield route_request_service_1.default.getRouteRequestAndToken(routeRequestId, teamId);
        const previewAttachment = yield helper_1.default.managerPreviewAttachment(routeRequest, { approve, approvalReason });
        yield InteractivePrompts_1.default.messageUpdate(channelId, '', timeStamp, [previewAttachment], slackBotOauthToken);
    }),
    approvedRequestSubmit: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { actions, team: { id: teamId }, user: { id: slackId } } = payload;
        const [{ value: state }] = actions;
        const { approve: { timeStamp, channelId, routeRequestId } } = JSON.parse(state);
        const result = cache_1.default.fetch(`userDetails${slackId}`);
        const dateObject = { startDate: result[0], endDate: result[1] };
        const { slackBotOauthToken: botToken, routeRequest } = yield route_request_service_1.default.getRouteRequestAndToken(routeRequestId, teamId);
        const { engagement } = routeRequest;
        yield engagement_service_1.engagementService.updateEngagement(engagement.id, dateObject);
        const updatedRequest = yield RouteHelper_1.default.updateRouteRequest(routeRequestId, { status: 'Confirmed' });
        slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.MANAGER_APPROVED_ROUTE_REQUEST, { routeRequestId, teamId, botToken });
        yield index_1.default.completeManagerAction(updatedRequest, channelId, timeStamp, botToken);
    }),
};
class ManagerController {
    static managerRouteController(action) {
        return handlers[action]
            || (() => {
                throw new Error(`Unknown action: manager_route_${action}`);
            });
    }
    static handleManagerActions(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const action = handler_1.getAction(payload, 'btnActions');
                return ManagerController.managerRouteController(action)(payload, respond);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Error:bangbang:: I was unable to do that.'));
            }
        });
    }
}
exports.default = ManagerController;
//# sourceMappingURL=ManagerController.js.map