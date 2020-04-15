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
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const index_1 = __importDefault(require("../../events/index"));
const slackEvents_1 = require("../../events/slackEvents");
const JoinRouteDialogPrompts_1 = __importDefault(require("./JoinRouteDialogPrompts"));
const JoinRouteNotifications_1 = __importDefault(require("./JoinRouteNotifications"));
const JoinRouteHelpers_1 = __importDefault(require("./JoinRouteHelpers"));
const JoinRouteFormValidators_1 = __importDefault(require("./JoinRouteFormValidators"));
const JoinRouteInteractions_1 = __importDefault(require("./JoinRouteInteractions"));
const RouteServiceHelper_1 = __importDefault(require("../../../../helpers/RouteServiceHelper"));
const route_service_1 = require("../../../routes/route.service");
const formHelper_1 = require("../../helpers/formHelper");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const joinRouteRequest_service_1 = require("../../../joinRouteRequests/joinRouteRequest.service");
const engagement_service_1 = require("../../../engagements/engagement.service");
const SlackInteractionsHelpers_1 = __importDefault(require("../../helpers/slackHelpers/SlackInteractionsHelpers"));
const cleanData_1 = __importDefault(require("../../../../helpers/cleanData"));
const handler_1 = require("../../helpers/slackHelpers/handler");
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
class JoinRouteInputHandlers {
    static joinRoute(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { actions: [{ value: routeId }], user: { id: userId } } = payload;
                const [engagement, routeBatch] = yield Promise.all([
                    formHelper_1.getFellowEngagementDetails(userId, payload.team.id),
                    routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeId, true)
                ]);
                const user = yield user_service_1.default.getUserBySlackId(userId);
                if (!JoinRouteInputHandlers.joinRouteHandleRestrictions(user, routeBatch, engagement, respond)) {
                    return;
                }
                if (RouteServiceHelper_1.default.canJoinRoute(routeBatch)) {
                    const state = JSON.stringify({ routeId, capacityFilled: false });
                    yield JoinRouteDialogPrompts_1.default.sendFellowDetailsForm(payload, state, engagement);
                    respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted'));
                }
                else {
                    const notice = JoinRouteInteractions_1.default.fullRouteCapacityNotice(routeBatch.id);
                    respond(notice);
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static joinRouteHandleRestrictions(user, route, engagement, respond) {
        if (!engagement) {
            respond(new SlackMessageModels_1.SlackInteractiveMessage(`Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`));
            return false;
        }
        if (user.routeBatchId) {
            respond(new SlackMessageModels_1.SlackInteractiveMessage('You are already on a route. Cannot join another'));
            return false;
        }
        return true;
    }
    static continueJoinRoute(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actions: [{ value: routeId }] } = payload;
            const engagement = yield formHelper_1.getFellowEngagementDetails(payload.user.id, payload.team.id);
            if (!engagement) {
                respond(new SlackMessageModels_1.SlackInteractiveMessage(`Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`));
                return;
            }
            const state = JSON.stringify({ routeId, capacityFilled: true });
            yield JoinRouteDialogPrompts_1.default.sendFellowDetailsForm(payload, state, engagement);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted'));
        });
    }
    static fellowDetails(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = yield JoinRouteFormValidators_1.default.validateFellowDetailsForm(payload);
                if (errors.length > 0) {
                    return { errors };
                }
                const preview = yield JoinRouteNotifications_1.default.sendFellowDetailsPreview(payload);
                respond(preview);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static submitJoinRoute(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { actions: [{ value }], user: { id }, team: { id: teamId } } = payload;
                const { routeId, capacityFilled } = JSON.parse(value);
                let more = '';
                let eventArgs;
                if (capacityFilled) {
                    more = ' Someone from the Ops team will reach out to you shortly.';
                    eventArgs = [
                        slackEvents_1.slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST,
                        { routeId, teamId, requesterSlackId: id }
                    ];
                }
                else {
                    const { id: joinId, dataValues: { engagementId } } = yield JoinRouteHelpers_1.default.saveJoinRouteRequest(payload, routeId);
                    yield joinRouteRequest_service_1.joinRouteRequestService.updateJoinRouteRequest(joinId, { status: 'Confirmed' });
                    const user = yield user_service_1.default.getUserBySlackId(id);
                    const engagement = yield formHelper_1.getFellowEngagementDetails(id, teamId);
                    const { startDate, endDate } = engagement;
                    yield engagement_service_1.engagementService.updateEngagement(engagementId, { startDate, endDate });
                    yield route_service_1.routeService.addUserToRoute(routeId, user.id);
                    eventArgs = [
                        slackEvents_1.slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE,
                        payload,
                        joinId
                    ];
                }
                respond(new SlackMessageModels_1.SlackInteractiveMessage(`Hey <@${id}> :smiley:, request has been received.${more}`));
                index_1.default.raise(...eventArgs);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(SlackMessageModels_1.SlackFailureResponse);
            }
        });
    }
    static showAvailableRoutes(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            yield JoinRouteInteractions_1.default.sendAvailableRoutesMessage(payload, respond);
        });
    }
    static backButton(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actions: [{ value }] } = payload;
            if (value === 'back') {
                return JoinRouteInteractions_1.default.sendAvailableRoutesMessage(payload, respond);
            }
            respond(SlackInteractionsHelpers_1.default.goodByeMessage());
        });
    }
    static handleJoinRouteActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                return handler_1.handleActions(payload, respond, JoinRouteInputHandlers);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
}
exports.default = JoinRouteInputHandlers;
//# sourceMappingURL=JoinRouteInputHandler.js.map