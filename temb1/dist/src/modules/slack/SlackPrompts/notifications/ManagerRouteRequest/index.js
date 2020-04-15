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
const route_request_service_1 = __importDefault(require("../../../../routes/route-request.service"));
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const Notifications_1 = __importDefault(require("../../Notifications"));
const slackEvents_1 = require("../../../events/slackEvents");
const InteractivePrompts_1 = __importDefault(require("../../InteractivePrompts"));
const helper_1 = __importDefault(require("./helper"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const app_event_service_1 = __importDefault(require("../../../../events/app-event.service"));
const route_events_constants_1 = require("../../../../events/route-events.constants");
class ManagerNotifications {
    static sendManagerNotification(respond, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { routeRequestId, teamId } = data;
                const { slackBotOauthToken, routeRequest } = yield route_request_service_1.default.getRouteRequestAndToken(routeRequestId, teamId);
                const { engagement: { fellow }, manager } = routeRequest;
                const channelID = yield Notifications_1.default.getDMChannelId(manager.slackId, slackBotOauthToken);
                const attachments = yield helper_1.default.getManagerMessageAttachment(routeRequest);
                const message = Notifications_1.default.createDirectMessage(channelID, `Hey, <@${fellow.slackId}> just requested to create a new route. :smiley:`, [...attachments]);
                app_event_service_1.default.broadcast({ name: route_events_constants_1.RouteSocketEvents.newRouteRequest, data: { data: routeRequest } });
                return Notifications_1.default.sendNotification(message, slackBotOauthToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond({
                    text: 'Error:warning:: Request saved, but I could not send a notification to your manager.'
                });
            }
        });
    }
    static sendManagerDeclineMessageToFellow(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { routeRequestId, botToken } = data;
                const routeRequest = yield route_request_service_1.default.getRouteRequestByPk(routeRequestId);
                const { engagement: { fellow } } = routeRequest;
                const channelID = yield Notifications_1.default.getDMChannelId(fellow.slackId, botToken);
                const message = yield helper_1.default.getManagerApproveOrDeclineAttachment(routeRequest, channelID);
                return Notifications_1.default.sendNotification(message, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendManagerApproval(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { routeRequestId, teamId, botToken } = data;
                const routeRequest = yield route_request_service_1.default.getRouteRequestByPk(routeRequestId);
                const { engagement: { fellow } } = routeRequest;
                const channelID = yield Notifications_1.default.getDMChannelId(fellow.slackId, botToken);
                slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.RECEIVE_NEW_ROUTE_REQUEST, teamId, routeRequestId);
                const message = yield helper_1.default.getManagerApproveOrDeclineAttachment(routeRequest, channelID);
                return Notifications_1.default.sendNotification(message, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static completeManagerAction(routeRequest, channel, timestamp, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, message, text, color } = helper_1.default.completeManagerActionLabels(routeRequest);
                if (!title)
                    return;
                const attachments = yield helper_1.default.getManagerCompleteAttachment(message, title, routeRequest, color);
                yield InteractivePrompts_1.default.messageUpdate(channel, text, timestamp, attachments, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static handleStatusValidationError(payload, routeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel: { id: channelId }, original_message: { ts } } = payload;
            const { team: { id: { teamId } } } = payload;
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            yield ManagerNotifications.completeManagerAction(routeRequest, channelId, ts, slackBotOauthToken);
        });
    }
}
exports.default = ManagerNotifications;
//# sourceMappingURL=index.js.map