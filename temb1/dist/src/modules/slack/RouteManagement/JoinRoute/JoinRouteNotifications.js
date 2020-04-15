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
const JoinRouteHelpers_1 = __importDefault(require("./JoinRouteHelpers"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const navButtons_1 = __importDefault(require("../../../../helpers/slack/navButtons"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
const joinRouteRequest_service_1 = require("../../../joinRouteRequests/joinRouteRequest.service");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const cleanData_1 = __importDefault(require("../../../../helpers/cleanData"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const homebase_service_1 = require("../../../homebases/homebase.service");
class JoinRouteNotifications {
    static sendFellowDetailsPreview(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, submission, team: { id: teamId } } = payload;
            const result = yield cache_1.default.fetch(`userDetails${slackId}`);
            const engagementObject = {
                startDate: result[0],
                endDate: result[1],
                partnerName: result[2]
            };
            const { routeId } = JSON.parse(payload.state);
            const tempJoinRoute = yield JoinRouteNotifications.generateJoinRouteFromSubmission(submission, routeId, slackId, teamId, engagementObject);
            const attachment = yield JoinRouteHelpers_1.default.joinRouteAttachments(tempJoinRoute);
            const confirmButton = new SlackMessageModels_1.SlackButtonAction('submitJoinRoute', 'Confirm details', payload.state);
            attachment.addFieldsOrActions('actions', [confirmButton]);
            attachment.addOptionalProps('join_route_actions', undefined, '#4285f4');
            const navAttachment = navButtons_1.default('join_route_showAvailableRoutes', 'back_to_routes');
            return new SlackMessageModels_1.SlackInteractiveMessage('*Please confirm these details*', [attachment, navAttachment]);
        });
    }
    static generateJoinRouteFromSubmission(submission, id, slackId, teamId, engagement) {
        return __awaiter(this, void 0, void 0, function* () {
            const { manager: managerID, workHours } = submission;
            const engagementDates = {
                startDate: engagement.startDate, endDate: engagement.endDate
            };
            const { startDate, endDate } = dateHelper_1.default.convertIsoString(engagementDates);
            const [routeBatch, fellow, manager] = yield Promise.all([
                routeBatch_service_1.routeBatchService.getRouteBatchByPk(id, true),
                slackHelpers_1.default.findOrCreateUserBySlackId(slackId, teamId),
                slackHelpers_1.default.findOrCreateUserBySlackId(managerID, teamId),
                yield cache_1.default.saveObject(`joinRouteRequestSubmission_${slackId}`, submission)
            ]);
            return {
                manager,
                routeBatch,
                engagement: {
                    fellow,
                    partner: { name: engagement.partnerName },
                    workHours,
                    startDate,
                    endDate
                }
            };
        });
    }
    static sendManagerJoinRequest(payload, joinRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, team: { id: teamId }, } = cleanData_1.default.trim(payload);
            const joinRoute = yield joinRouteRequest_service_1.joinRouteRequestService.getJoinRouteRequest(joinRequestId);
            const attachment = yield JoinRouteHelpers_1.default.joinRouteAttachments(joinRoute);
            attachment.addOptionalProps('join_route_managerActions');
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            Notifications_1.default.sendNotifications(opsChannelId, attachment, `Hey :simple_smile: <@${slackId}> has joined a route`, botToken);
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
                partnerName: result[2]
            };
            const tempJoinRoute = yield JoinRouteNotifications.generateJoinRouteFromSubmission(joinRouteRequestSubmission, routeId, requesterSlackId, teamId, dateObject);
            const attachments = yield JoinRouteHelpers_1.default.joinRouteAttachments(tempJoinRoute);
            const text = `Hey, <@${requesterSlackId}> tried to join a route that's already filled up.`;
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const { channel } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(requesterSlackId);
            Notifications_1.default.sendNotifications(channel, attachments, text, botToken);
        });
    }
}
exports.default = JoinRouteNotifications;
//# sourceMappingURL=JoinRouteNotifications.js.map