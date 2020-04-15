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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const app_event_service_1 = __importDefault(require("../../../events/app-event.service"));
const trip_events_contants_1 = require("../../../events/trip-events.contants");
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
const trip_request_1 = require("../../../../database/models/trip-request");
const slack_block_models_1 = require("../../models/slack-block-models");
const constants_1 = __importStar(require("./constants"));
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const slack_helpers_1 = require("../../helpers/slack-helpers");
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
class TripHelpers {
    static notifyManagerIfOpsApproved(tripId, channelId, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield trip_service_1.default.getById(tripId, true);
                if (trip.homebase.channel === channelId) {
                    yield Notifications_1.default.OpsApprovedNotification(trip, botToken);
                }
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static getManagerApprovedOrDeclineMessage(tripId, status, channelId, actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripinfo = yield trip_service_1.default.getById(tripId, true);
            const message = TripHelpers.getApprovalOrDeclineMessage(tripinfo, status, channelId, actorId);
            return message;
        });
    }
    static completeManagerResponse(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { managerSlackId, isApproval, tripId, reason, botToken, teamId } = options;
            const manager = yield slackHelpers_1.default.findOrCreateUserBySlackId(managerSlackId, teamId);
            if (isApproval) {
                return TripHelpers.approveRequest(tripId, manager.id, reason, botToken);
            }
            return TripHelpers.declineRequest(tripId, manager.id, reason, botToken);
        });
    }
    static approveRequest(tripId, managerId, reason, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield trip_service_1.default.update(tripId, {
                approvedById: managerId,
                managerComment: reason,
                tripStatus: 'Approved',
                approvalDate: new Date(Date.now()).toISOString(),
            });
            app_event_service_1.default.broadcast({
                name: trip_events_contants_1.tripEvents.managerApprovedTrip,
                data: {
                    botToken,
                    data: trip,
                },
            });
        });
    }
    static declineRequest(tripId, managerId, reason, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield trip_service_1.default.update(tripId, {
                declinedById: managerId,
                managerComment: reason,
                tripStatus: 'DeclinedByManager',
            });
            app_event_service_1.default.broadcast({
                name: trip_events_contants_1.tripEvents.managerDeclinedTrip,
                data: {
                    botToken,
                    data: trip,
                },
            });
        });
    }
    static getApprovalPromptMessage(trip, imResponse, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = trip.id.toString();
            const mainBlock = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText('*Trip Request*'));
            const fields = Notifications_1.default.notificationFields(trip);
            mainBlock.addFields(fields);
            const newTripBlock = new slack_block_models_1.ActionBlock(options.blockId);
            newTripBlock.addElements([
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Approve'), tripId, options.approveActionId, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Decline'), tripId, options.declineActionId, SlackMessageModels_1.SlackActionButtonStyles.danger),
            ]);
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(options.headerText));
            return new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, mainBlock,
                slack_helpers_1.sectionDivider, newTripBlock], imResponse, options.headerText);
        });
    }
    static sendManagerTripRequestNotification(trip, botToken, type = 'newTrip') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { department: { head } } = trip;
                const imResponse = yield Notifications_1.default.getDMChannelId(head.slackId, botToken);
                const text = type === 'newTrip' ? 'booked a' : 'rescheduled this';
                const { requester: { slackId: requesterId }, rider: { slackId: riderId }, id } = trip;
                const headerText = yield TripHelpers.getMessage(riderId, requesterId, text);
                const message = yield TripHelpers.getApprovalPromptMessage(trip, imResponse, {
                    headerText,
                    blockId: constants_1.managerTripBlocks.confirmTripRequest,
                    approveActionId: constants_1.default.approve,
                    declineActionId: constants_1.default.decline,
                });
                return Notifications_1.default.sendNotification(message, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getMessage(riderId, requesterId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const smiley = text === 'cancelled this' ? '' : ' :smiley:';
            if (requesterId === riderId) {
                return `Hey, <@${requesterId}> has just ${text} trip.${smiley}`;
            }
            return `Hey, <@${requesterId}> has just ${text} trip for <@${riderId}>.${smiley}`;
        });
    }
    static getActorString(trip, status, channelId, actorId) {
        let actor = 'You have';
        if (channelId === trip.homebase.channel || status.lastActionById !== actorId) {
            actor = `<@${status.lastActionById}> has`;
        }
        return actor;
    }
    static getApprovalOrDeclineMessage(trip, status, channelId, actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [header, main, actions, footer] = [
                new slack_block_models_1.SectionBlock(), new slack_block_models_1.SectionBlock(), new slack_block_models_1.Block(slack_block_models_1.BlockTypes.actions), new slack_block_models_1.SectionBlock(),
            ];
            const mention = TripHelpers.getActorString(trip, status, channelId, actorId);
            switch (status.currentState) {
                case trip_request_1.TripStatus.approved:
                    main.addText(new slack_block_models_1.MarkdownText('*Trip Approved*'));
                    footer.addText(new slack_block_models_1.MarkdownText(`:white_check_mark: ${mention} approved this trip`));
                    header.addText(new slack_block_models_1.MarkdownText('You have just approved the trip from '
                        + `<@${trip.requester.slackId}>`));
                    break;
                case trip_request_1.TripStatus.declinedByManager:
                    main.addText(new slack_block_models_1.MarkdownText('*Trip Declined*'));
                    footer.addText(new slack_block_models_1.MarkdownText(`:x: ${mention} declined this trip`));
                    header.addText(new slack_block_models_1.MarkdownText(`${mention} have just declined the trip from `
                        + `<@${trip.requester.slackId}>`));
                    break;
                case trip_request_1.TripStatus.declinedByOps:
                    main.addText(new slack_block_models_1.MarkdownText('*Trip Declined*'));
                    footer.addText(new slack_block_models_1.MarkdownText(`:x: ${mention} declined this trip`));
                    header.addText(new slack_block_models_1.MarkdownText(`${mention} just declined the trip from `
                        + `<@${trip.requester.slackId}>`));
                    break;
                case trip_request_1.TripStatus.pendingConfirmation:
                    main.addText(new slack_block_models_1.MarkdownText('*Confirm Trip Details*'));
                    actions.elements = [
                        new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Edit'), trip.id.toString(), constants_1.default.editApprovedTrip, SlackMessageModels_1.SlackActionButtonStyles.primary),
                        new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Confirm'), trip.id.toString(), constants_1.default.confirmApprovedTrip, SlackMessageModels_1.SlackActionButtonStyles.primary),
                    ];
                    footer.addText(new slack_block_models_1.MarkdownText(':construction: Double check your entries then confirm'));
                    header.addText(new slack_block_models_1.MarkdownText('You are about to confirm the trip from '
                        + `<@${trip.requester.slackId}>`));
                    break;
                case trip_request_1.TripStatus.confirmed:
                    main.addText(new slack_block_models_1.MarkdownText('*Trip Confirmed*'));
                    footer.addText(new slack_block_models_1.MarkdownText(`:white_check_mark: ${mention} confirmed this trip`));
                    header.addText(new slack_block_models_1.MarkdownText('You have just confirmed the trip from '
                        + `<@${trip.requester.slackId}>`));
                    break;
                default:
                    main.addText(new slack_block_models_1.MarkdownText('*Trip Request Status*'));
                    header.addText(new slack_block_models_1.MarkdownText(`The trip requested by <@${trip.requester.slackId}> `
                        + `have been already *${status.currentState.toLowerCase()}* `
                        + `by <@${status.lastActionById}>`));
                    break;
            }
            const fields = Notifications_1.default.notificationFields(trip);
            fields.push(new slack_block_models_1.MarkdownText(`*Trip Status*:\n${trip.tripStatus}`));
            main.addFields(fields);
            const blocks = [header, slack_helpers_1.sectionDivider, main];
            if (footer.text) {
                blocks.push(slack_helpers_1.sectionDivider);
                blocks.push(footer);
            }
            if (actions.elements && actions.elements.length > 0) {
                blocks.push(slack_helpers_1.sectionDivider);
                blocks.push(actions);
            }
            return new slack_block_models_1.BlockMessage(blocks);
        });
    }
    static getApprovedMessageOfRequester(data, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const { approver } = data;
            const messageHeader = `<@${approver.slackId}> has confirmed this trip.`;
            const fields = yield Notifications_1.default.notificationFields(data);
            const mainBlock = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText('*Trip Approved*'))
                .addFields(fields);
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(messageHeader));
            const response = new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, mainBlock], channel, messageHeader);
            return response;
        });
    }
}
exports.default = TripHelpers;
//# sourceMappingURL=trip.helpers.js.map