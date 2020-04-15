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
const Notifications_1 = __importDefault(require("../../Notifications"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const RouteServiceHelper_1 = __importDefault(require("../../../../../helpers/RouteServiceHelper"));
const helper_1 = __importDefault(require("../ProviderNotifications/helper"));
const whatsapp_service_1 = __importDefault(require("../../../../notifications/whatsapp/whatsapp.service"));
const ValidationSchemas_1 = __importDefault(require("../../../../../middlewares/ValidationSchemas"));
const slack_block_models_1 = require("../../../../new-slack/models/slack-block-models");
const slack_helpers_1 = require("../../../../new-slack/helpers/slack-helpers");
const prefix = 'route_trip_';
const { phoneNoRegex } = ValidationSchemas_1.default;
exports.actions = Object.freeze({
    confirmation: `${prefix}confirm`,
    decline: `${prefix}decline`,
    pending: `${prefix}pending`,
});
exports.blocks = Object.freeze({
    tripCompletion: `${prefix}completion`,
});
class RouteNotifications {
    static sendRouteNotificationToRouteRiders(teamUrl, routeInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { riders, route: { destination: { address } }, status, deleted } = routeInfo;
            const { botToken: teamBotOauthToken } = yield teamDetails_service_1.teamDetailsService
                .getTeamDetailsByTeamUrl(teamUrl);
            const isDeactivation = (status && status.toLowerCase() === 'inactive') || deleted;
            const updatedDetails = routeInfo && (yield RouteServiceHelper_1.default.serializeRouteBatch(routeInfo));
            const text = isDeactivation
                ? `Sorry, Your route to *${address}* is no longer available :disappointed:`
                : `Your route to *${address}* has been updated.`;
            const message = yield Notifications_1.default.createDirectMessage('', text, !isDeactivation && RouteNotifications.generateRouteUpdateAttachement(updatedDetails));
            RouteNotifications.nofityRouteUsers(riders, message, isDeactivation, teamBotOauthToken);
        });
    }
    static generateRouteUpdateAttachement(updatedDetails) {
        const { takeOff, name, destination, driverName, driverPhoneNo } = updatedDetails;
        const updateMessageAttachment = new SlackMessageModels_1.SlackAttachment('Updated Route Details');
        updateMessageAttachment.addOptionalProps('', '', '#3c58d7');
        updateMessageAttachment.addFieldsOrActions('fields', [
            new SlackMessageModels_1.SlackAttachmentField('Take Off Time', takeOff, true),
            new SlackMessageModels_1.SlackAttachmentField('Route Name', name, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver\'s name', driverName, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver\'s Phone Number', driverPhoneNo, true),
        ]);
        return updateMessageAttachment;
    }
    static nofityRouteUsers(riders, message, isDeactivation = false, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                riders.forEach((rider) => __awaiter(this, void 0, void 0, function* () {
                    if (isDeactivation) {
                        const theRider = yield user_service_1.default.getUserById(rider.id);
                        theRider.routeBatchId = null;
                        yield theRider.save();
                    }
                    RouteNotifications.sendNotificationToRider(message, rider.slackId, botToken);
                }));
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static sendNotificationToRider(message, slackId, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const imId = yield Notifications_1.default.getDMChannelId(slackId, slackBotOauthToken);
            const response = Object.assign(Object.assign({}, message), { channel: imId });
            yield Notifications_1.default.sendNotification(response, slackBotOauthToken);
        });
    }
    static sendRouteUseConfirmationNotificationToRider({ record, rider }, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channelID = yield Notifications_1.default.getDMChannelId(rider.slackId, botToken);
                const routeBatch = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(record.batch.id, true);
                const fields = RouteNotifications.createDetailsFields(routeBatch, false);
                const message = `Hi! <@${rider.slackId}> Did you take the trip on route ${routeBatch.route.name}?`;
                const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(message));
                const buttons = [
                    new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Yes'), `${record.id}`, exports.actions.confirmation, SlackMessageModels_1.SlackActionButtonStyles.primary),
                    new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Still on trip'), `${record.id}`, exports.actions.pending, SlackMessageModels_1.SlackActionButtonStyles.primary),
                    new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('No'), `${record.id}`, exports.actions.decline, SlackMessageModels_1.SlackActionButtonStyles.danger)
                ];
                const confirmationBlock = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText('*Trip*'))
                    .addFields(fields);
                const buttonsBlock = new slack_block_models_1.ActionBlock(slack_block_models_1.BlockTypes.actions, exports.blocks.tripCompletion)
                    .addElements(buttons);
                const notification = new slack_block_models_1.BlockMessage([header, buttonsBlock, slack_helpers_1.sectionDivider, confirmationBlock], channelID, message);
                return Notifications_1.default.sendNotification(notification, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendRouteApproveMessageToManager(routeRequest, slackBotOauthToken, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channelID = yield Notifications_1.default.getDMChannelId(routeRequest.manager.slackId, slackBotOauthToken);
                const message = yield helper_1.default.getManagerApproveAttachment(routeRequest, channelID, true, requestData);
                return Notifications_1.default.sendNotification(message, slackBotOauthToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendRouteApproveMessageToFellow(routeRequest, slackBotOauthToken, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fellow } = routeRequest.engagement;
                const channelID = yield Notifications_1.default.getDMChannelId(fellow.slackId, slackBotOauthToken);
                const message = yield helper_1.default.getFellowApproveAttachment(routeRequest, channelID, requestData);
                return Notifications_1.default.sendNotification(message, slackBotOauthToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getReminderMessage(channelID, { rider, batch: routeBatch }) {
        return __awaiter(this, void 0, void 0, function* () {
            const reminderBlock = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText('*Trip Reminder*'));
            const routeInfoFields = RouteNotifications.createDetailsFields(routeBatch);
            reminderBlock.addFields(routeInfoFields);
            const message = `Hey, <@${rider.slackId}>, you have an upcoming trip on route ${routeBatch.route.name}`;
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(message));
            return new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, reminderBlock], channelID, message);
        });
    }
    static sendRouteTripReminder({ rider, batch }, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channelID = yield Notifications_1.default.getDMChannelId(rider.slackId, slackBotOauthToken);
                const message = yield RouteNotifications.getReminderMessage(channelID, { rider, batch });
                return Notifications_1.default.sendNotification(message, slackBotOauthToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendWhatsappRouteTripReminder(driver, batch) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            if (phoneNoRegex.test(driver.driverPhoneNo)) {
                message = RouteNotifications.getRouteTripReminderMessage(driver, batch);
                yield whatsapp_service_1.default.send(message);
            }
        });
    }
    static createDetailsFields(routeBatch, reminder = true) {
        return [
            new slack_block_models_1.MarkdownText(`*Batch*\n${routeBatch.batch}`),
            new slack_block_models_1.MarkdownText(reminder ? `*Takes Off At*\n${routeBatch.takeOff}` : `*Took Off At*\n${routeBatch.takeOff}`),
            new slack_block_models_1.MarkdownText(`*Cab Reg No*\n${routeBatch.cabDetails.regNumber}`),
            new slack_block_models_1.MarkdownText(`*Driver Name*\n${routeBatch.driver.driverName}`),
            new slack_block_models_1.MarkdownText(`*Driver Phone Number*\n${routeBatch.driver.driverPhoneNo}`)
        ];
    }
    static sendUserLeavesRouteMessage(channelID, payload, slackId, routeInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeName, riders } = routeInformation;
            const { team: { id: teamId } } = payload;
            const users = riders.length;
            const text = `Hello, <@${slackId}> has dropped off \`${routeName}\` route.
The route now has \`${users}\` user${users > 1 ? 's' : ''}`;
            const botAuthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            yield Notifications_1.default.sendNotifications(channelID, null, text, botAuthToken);
        });
    }
    static getRouteTripReminderMessage(driver, routeBatch, reminder = true) {
        const reminderVerb = reminder ? 'Takes Off At' : 'Took Off At';
        return {
            to: driver.driverPhoneNo,
            body: `Hello *${driver.driverName}*,`
                + ` You have an upcoming trip on route *${routeBatch.route.name}*\n\n`
                + `*Batch*: ${routeBatch.batch}\n`
                + `*${reminderVerb}*: ${routeBatch.takeOff}\n`
                + `*Cab Reg No*: ${routeBatch.cabDetails.regNumber}\n\n`
                + 'We wish you a safe trip.',
        };
    }
}
exports.default = RouteNotifications;
//# sourceMappingURL=index.js.map