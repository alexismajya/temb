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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRoute_helpers_1 = __importDefault(require("./joinRoute.helpers"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const joinRouteRequest_service_1 = require("../../../joinRouteRequests/joinRouteRequest.service");
const cache_1 = __importDefault(require("../../../shared/cache"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const slack_block_models_1 = require("../../models/slack-block-models");
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
const JoinRouteNotifications_1 = __importDefault(require("../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications"));
class JoinRouteNotifications {
    static sendManagerJoinRequest(payload, joinRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, team: { id: teamId } } = payload;
            const joinRoute = yield joinRouteRequest_service_1.joinRouteRequestService.getJoinRouteRequest(joinRequestId);
            const blockMessage = yield joinRoute_helpers_1.default.joinRouteBlock(joinRoute);
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            const text = `Hey :simple_smile: <@${slackId}> has joined a route`;
            const headerText = new slack_block_models_1.MarkdownText(`*${text}*`);
            const heading = new slack_block_models_1.Block().addText(headerText);
            const message = new slack_block_models_1.BlockMessage([heading, ...blockMessage], opsChannelId, text);
            yield Notifications_1.default.sendNotification(message, botToken);
        });
    }
    static sendFilledCapacityJoinRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeId, teamId, requesterSlackId } = data;
            const joinRouteRequestSubmission = __rest(yield cache_1.default.fetch(`joinRouteRequestSubmission_${requesterSlackId}`), []);
            const result = yield cache_1.default.fetch(`userDetails${requesterSlackId}`);
            const dateObject = {
                startDate: result[0],
                endDate: result[1],
                partnerName: result[2],
            };
            const tempJoinRoute = yield JoinRouteNotifications_1.default.generateJoinRouteFromSubmission(joinRouteRequestSubmission, routeId, requesterSlackId, teamId, dateObject);
            const blockMessage = yield joinRoute_helpers_1.default.joinRouteBlock(tempJoinRoute);
            const text = `Hey, <@${requesterSlackId}> tried to join a route that's already filled up.`;
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const { channel } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(requesterSlackId);
            const headerText = new slack_block_models_1.MarkdownText(`*${text}*`);
            const heading = new slack_block_models_1.Block().addText(headerText);
            const message = new slack_block_models_1.BlockMessage([heading, ...blockMessage], channel, text);
            yield Notifications_1.default.sendNotification(message, botToken);
        });
    }
}
exports.default = JoinRouteNotifications;
//# sourceMappingURL=joinRoute.notifications.js.map