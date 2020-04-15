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
const joinRoute_helpers_1 = __importDefault(require("./joinRoute.helpers"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const JoinRouteNotifications_1 = __importDefault(require("../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications"));
const formHelper_1 = require("../../../slack/helpers/formHelper");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const schema_1 = require("../schema");
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const getRouteKey = (id) => `ROUTE_REQUEST_${id}`;
class JoinRouteController {
    static joinARoute(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { response_url: state, user: { id: slackId }, actions: [{ value: routeId }], team: { id: teamId } } = payload;
            const user = yield user_service_1.default.getUserBySlackId(slackId);
            const engagement = yield formHelper_1.getFellowEngagementDetails(slackId, teamId);
            const restrictMsg = yield joinRoute_helpers_1.default.joinRouteHandleRestrictions(user, engagement);
            if (restrictMsg) {
                respond(restrictMsg);
            }
            else {
                yield cache_1.default.save(getRouteKey(slackId), 'routeJoined', routeId);
                yield joinRoute_helpers_1.default.joinRouteModal(payload, state);
            }
        });
    }
    static handleSelectManager(payload, submission, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: slackId }, team: { id: teamId } } = payload;
                slack_helpers_1.default.modalValidator(submission, schema_1.joinRouteSchema);
                yield cache_1.default.save(getRouteKey(slackId), 'submissionData', submission);
                respond.clear();
                const getRouteId = yield cache_1.default.fetch(getRouteKey(slackId));
                const result = yield cache_1.default.fetch(`userDetails${slackId}`);
                const engagementObject = {
                    startDate: result[0],
                    endDate: result[1],
                    partnerName: result[2],
                };
                const tempJoinRoute = yield JoinRouteNotifications_1.default.generateJoinRouteFromSubmission(submission, Number(getRouteId.routeJoined), slackId, teamId, engagementObject);
                const message = yield joinRoute_helpers_1.default.confirmRouteBlockMessage(tempJoinRoute);
                const url = JSON.parse(payload.view.private_metadata);
                yield updatePastMessageHelper_1.default.sendMessage(url, message);
            }
            catch (error) {
                respond.error(error.errors);
            }
        });
    }
    static confirmJoiningRoute(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, team: { id: teamId } } = payload;
            const routeCached = yield cache_1.default.fetch(getRouteKey(slackId));
            const result = yield cache_1.default.fetch(`userDetails${slackId}`);
            const engagementObject = {
                startDate: result[0],
                endDate: result[1],
                partnerName: result[2],
            };
            const tempJoinRoute = yield JoinRouteNotifications_1.default.generateJoinRouteFromSubmission(routeCached.submissionData, Number(routeCached.routeJoined), slackId, teamId, engagementObject);
            const message = yield joinRoute_helpers_1.default.notifyJoiningRouteMessage(payload, tempJoinRoute);
            respond(message);
        });
    }
}
exports.default = JoinRouteController;
//# sourceMappingURL=joinRoute.controller.js.map