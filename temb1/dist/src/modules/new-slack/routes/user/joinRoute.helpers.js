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
const slack_block_models_1 = require("../../models/slack-block-models");
const actions_1 = __importDefault(require("../actions"));
const blocks_1 = __importDefault(require("../blocks"));
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const SlackViews_1 = require("../../extensions/SlackViews");
const index_1 = __importDefault(require("../../../../utils/index"));
const moment_1 = __importDefault(require("moment"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const dateHelpers_1 = require("../../../slack/helpers/dateHelpers");
const joinRouteRequest_service_1 = require("../../../joinRouteRequests/joinRouteRequest.service");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const route_service_1 = require("../../../routes/route.service");
const engagement_service_1 = require("../../../engagements/engagement.service");
const formHelper_1 = require("../../../slack/helpers/formHelper");
const slackEvents_1 = require("../../../slack/events/slackEvents");
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const index_2 = __importDefault(require("../../../slack/events/index"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const partner_service_1 = require("../../../partners/partner.service");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
class JoinRouteHelpers {
    static joinRouteModal(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectManager = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.userSelect, 'Select Manager', 'manager'), 'Select Manager', 'manager');
            const workHours = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('18:00 - 00:00', 'workHours'), 'Work hours', 'workHours', false, 'hh:mm E.g. 18:00 - 00:00');
            const modal = slack_block_models_1.Modal.createModal({
                modalTitle: 'Enter your details',
                modalOptions: {
                    submit: 'Submit',
                    close: 'Cancel',
                },
                inputBlocks: [selectManager, workHours],
                callbackId: actions_1.default.selectManagerSubmit,
                metadata: JSON.stringify(state),
            });
            const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return SlackViews_1.SlackViews.getSlackViews(token).open(payload.trigger_id, modal);
        });
    }
    static confirmRouteBlockMessage(tempJoinRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerText = new slack_block_models_1.MarkdownText('*Please confirm these details*');
            const heading = new slack_block_models_1.Block().addText(headerText);
            const detailsBlock = yield JoinRouteHelpers.joinRouteBlock(tempJoinRoute);
            const confirmButton = [new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Confirm details'), 'submitJoinRoute', actions_1.default.confirmJoining, SlackMessageModels_1.SlackActionButtonStyles.primary)];
            const action = new slack_block_models_1.ActionBlock(blocks_1.default.confirmRoute);
            action.addElements(confirmButton);
            const navBlock = slack_helpers_1.default.getNavBlock(blocks_1.default.availableRoutes, actions_1.default.showAvailableRoutes, 'join_route_showAvailableRoutes');
            const message = new slack_block_models_1.BlockMessage([heading, ...detailsBlock, action, navBlock]);
            return message;
        });
    }
    static joinRouteBlock(joinRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeBatch, routeBatch: { route: { imageUrl } } } = joinRoute;
            const imageBlock = new slack_block_models_1.ImageBlock('Map route', imageUrl, 'Map route');
            const fellowFields = yield JoinRouteHelpers.engagementFields(joinRoute);
            const routeBatchFields = yield JoinRouteHelpers.routeFields(routeBatch);
            const divider = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.divider);
            const eng = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('*_`Engagement Details`_*'));
            const routeInfo = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('*_`Route Information`_*'));
            return [divider, eng, fellowFields, divider, routeInfo, routeBatchFields, divider, imageBlock];
        });
    }
    static engagementFields(joinRequest) {
        const { manager: { email, name } } = joinRequest;
        const managerName = index_1.default.getNameFromEmail(email) || name;
        const managerField = new slack_block_models_1.SectionBlock();
        const fields = JoinRouteHelpers.engagementBlockFields(joinRequest);
        managerField.addFields([
            new slack_block_models_1.MarkdownText(`*Line Manager:* ${managerName} (@${name})`),
            ...fields,
        ]);
        return managerField;
    }
    static engagementBlockFields(routeRequest) {
        const { fellow, workHours, partnerName, startDate, endDate } = JoinRouteHelpers.destructEngagementDetails(routeRequest);
        const { email, name } = fellow;
        const fellowName = index_1.default.getNameFromEmail(email) || name;
        const { from, to } = index_1.default.formatWorkHours(workHours);
        const engagementDateFields = JoinRouteHelpers.engagementDateFields(startDate, endDate);
        const detailedField = [
            new slack_block_models_1.MarkdownText(`*Fellows Name*: ${fellowName}`),
            new slack_block_models_1.MarkdownText(`*Partner*: ${partnerName}`),
            new slack_block_models_1.MarkdownText('*Work Hours*'),
            new slack_block_models_1.MarkdownText(`*_From:_* ${from}`),
            new slack_block_models_1.MarkdownText(`*_To:_* ${to}`),
            ...engagementDateFields,
        ];
        return detailedField;
    }
    static engagementDateFields(startDate, endDate) {
        let result;
        if (startDate && startDate.charAt(2) === '/') {
            result = JoinRouteHelpers.formatStartAndEndDates(startDate, endDate);
        }
        if (startDate && endDate) {
            const sdDate = result ? moment_1.default(new Date(result.startDate)) : moment_1.default(new Date(startDate));
            const edDate = result ? moment_1.default(new Date(result.endDate)) : moment_1.default(new Date(endDate));
            const format = 'Do MMMM YYYY';
            const edFormatted = edDate.format(format);
            const sdFormatted = sdDate.format(format);
            const fields = [
                new slack_block_models_1.MarkdownText('*Engagement Period*'),
                new slack_block_models_1.MarkdownText(`*_Start Date_*: ${sdFormatted}`),
                new slack_block_models_1.MarkdownText(`*_End Date_*: ${edFormatted}`),
            ];
            return fields;
        }
    }
    static joinRouteHandleRestrictions(user, engagement) {
        if (!engagement) {
            return new slack_block_models_1.SlackText(`Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`);
        }
        if (user.routeBatchId) {
            return new slack_block_models_1.SlackText('You are already on a route. Cannot join another');
        }
    }
    static formatStartAndEndDates(startDate, endDate) {
        const engagementDates = { startDate, endDate };
        return dateHelper_1.default.convertIsoString(engagementDates);
    }
    static routeFields(route) {
        const { capacity, takeOff, route: { name: routeName, destination: { address } } } = route;
        const takeOffTime = dateHelpers_1.timeTo12hrs(takeOff);
        const routeFields = new slack_block_models_1.SectionBlock;
        return routeFields.addFields([
            new slack_block_models_1.MarkdownText(`*Route*: ${routeName}`),
            new slack_block_models_1.MarkdownText(`*Route capacity*: ${route.inUse}/${capacity}`),
            new slack_block_models_1.MarkdownText(`*Route Departure Time*: ${takeOffTime}`),
            new slack_block_models_1.MarkdownText(`*Bus Stop:*  :busstop: ${address}`),
        ]);
    }
    static destructEngagementDetails(routeRequest) {
        const { engagement } = routeRequest;
        const { partner: { name: partnerName }, fellow, startDate, endDate, workHours } = engagement;
        return { partnerName, fellow, startDate, endDate, workHours };
    }
    static notifyJoiningRouteMessage(payload, tempJoinRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id }, team: { id: teamId } } = payload;
                const { routeBatch: { id: routeId, capacity, inUse } } = tempJoinRoute;
                const usedData = { id, routeId, teamId, capacity, inUse };
                const capacityFilled = JoinRouteHelpers.checkFilledCapacity(usedData);
                if (capacityFilled) {
                    index_2.default.raise(...capacityFilled);
                    return new slack_block_models_1.SlackText('Someone from the Ops team will reach out to you shortly.');
                }
                const eventArgs = yield JoinRouteHelpers.joinNotFilledCapacity(payload, tempJoinRoute);
                index_2.default.raise(...eventArgs);
                return new slack_block_models_1.SlackText(`Hey <@${id}> :smiley:, request has been received`);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return new slack_block_models_1.SlackText('Sorry, something went wrong. Please try again');
            }
        });
    }
    static checkFilledCapacity(usedData) {
        const { id, routeId, teamId, capacity, inUse } = usedData;
        let eventArgs;
        if (capacity === inUse) {
            eventArgs = [
                slackEvents_1.slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST,
                { routeId, teamId, requesterSlackId: id },
            ];
        }
        return eventArgs;
    }
    static joinNotFilledCapacity(payload, tempJoinRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id }, team: { id: teamId } } = payload;
            const { routeBatch: { id: routeId }, engagement: { workHours } } = tempJoinRoute;
            const { id: joinId, managerId, engagementId, routeBatchId, } = yield JoinRouteHelpers.saveJoinRouteRequest(payload, routeId);
            yield joinRouteRequest_service_1.joinRouteRequestService.updateJoinRouteRequest(joinId, {
                id: joinId, status: 'Confirmed', engagement: { engagementId },
                manager: { managerId }, routeBatch: { routeBatchId }
            });
            const user = yield user_service_1.default.getUserBySlackId(id);
            const engagement = yield formHelper_1.getFellowEngagementDetails(id, teamId);
            const { startDate, endDate } = engagement;
            yield engagement_service_1.engagementService.updateEngagement(engagementId, { startDate, endDate, workHours });
            yield route_service_1.routeService.addUserToRoute(routeId, user.id);
            const eventArgs = [slackEvents_1.slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE, payload, joinId];
            return eventArgs;
        });
    }
    static saveJoinRouteRequest(payload, routeBatchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, team: { id: teamId } } = payload;
            const { manager: managerSlackId, workHours, } = yield cache_1.default.fetch(`joinRouteRequestSubmission_${slackId}`);
            const result = yield cache_1.default.fetch(`userDetails${slackId}`);
            const engagementDates = { startDate: result[0], endDate: result[1] };
            const partnerName = result[2];
            const { startDate, endDate } = dateHelper_1.default.convertIsoString(engagementDates);
            const [partner, fellow, manager, routeBatch] = yield Promise.all([
                partner_service_1.partnerService.findOrCreatePartner(partnerName),
                slackHelpers_1.default.findOrCreateUserBySlackId(slackId, teamId),
                slackHelpers_1.default.findOrCreateUserBySlackId(managerSlackId),
                routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId),
            ]);
            const engagement = yield engagement_service_1.engagementService.findOrCreateEngagement(workHours, fellow, partner, startDate, endDate);
            return joinRouteRequest_service_1.joinRouteRequestService.createJoinRouteRequest(engagement.id, manager.id, routeBatch.id);
        });
    }
}
exports.default = JoinRouteHelpers;
//# sourceMappingURL=joinRoute.helpers.js.map