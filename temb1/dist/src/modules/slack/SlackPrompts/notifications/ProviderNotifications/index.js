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
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const helper_1 = __importDefault(require("./helper"));
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const provider_service_1 = require("../../../../providers/provider.service");
const driver_service_1 = require("../../../../drivers/driver.service");
const CabsHelper_1 = __importDefault(require("../../../helpers/slackHelpers/CabsHelper"));
const cab_service_1 = require("../../../../cabs/cab.service");
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const InteractivePrompts_1 = __importDefault(require("../../InteractivePrompts"));
class ProviderNotifications {
    static checkIsDirectMessage(providerDetails, slackId) {
        if (!providerDetails.isDirectMessage)
            return providerDetails.channelId;
        return slackId;
    }
    static sendRouteApprovalNotification(routeBatch, providerId, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield provider_service_1.providerService.findByPk(providerId, true);
            const { user: { slackId }, name } = provider;
            const directMessageID = yield Notifications_1.default.getDMChannelId(slackId, botToken);
            const detailedRouteBatch = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatch.id, true);
            const channel = yield ProviderNotifications.checkIsDirectMessage(provider, slackId);
            const channelID = channel === slackId ? directMessageID : channel;
            const attachment = new SlackMessageModels_1.SlackAttachment('Assign driver and cab');
            attachment.addFieldsOrActions('fields', helper_1.default.providerRouteFields(detailedRouteBatch));
            attachment.addFieldsOrActions('actions', [
                new SlackMessageModels_1.SlackButtonAction('provider_approval', 'Accept', `${routeBatch.id}`)
            ]);
            attachment.addOptionalProps('provider_actions_route', '', '#FFCCAA');
            const message = Notifications_1.default.createDirectMessage(channelID, `A route has been assigned to *${name}*, please assign a cab and a driver`, [attachment]);
            return Notifications_1.default.sendNotification(message, botToken);
        });
    }
    static updateRouteApprovalNotification(channel, botToken, timeStamp, attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield InteractivePrompts_1.default.messageUpdate(channel, 'Thank you for assigning a cab and driver. :smiley: *`This is a recurring trip.`*', timeStamp, [attachment], botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static sendTripNotification(providerId, teamDetails, tripDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield provider_service_1.providerService.findByPk(providerId, true);
                yield provider_service_1.providerService.getNotifier(provider.notificationChannel)
                    .notifyNewTripRequest(provider, tripDetails, teamDetails);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static UpdateProviderNotification(channel, botToken, trip, timeStamp, driverDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { provider } = trip;
                const message = `Thank you *${provider.name}* for completing this trip request`;
                const tripDetailsAttachment = new SlackMessageModels_1.SlackAttachment('Trip request complete');
                tripDetailsAttachment.addOptionalProps('', '', '#3c58d7');
                tripDetailsAttachment.addFieldsOrActions('fields', helper_1.default.providerFields(trip, driverDetails));
                yield InteractivePrompts_1.default.messageUpdate(channel, message, timeStamp, [tripDetailsAttachment], botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static sendProviderReasignDriverMessage(driver, routes, slackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const { providerId, driverName } = driver;
            const provider = yield provider_service_1.providerService.findByPk(providerId);
            const user = yield user_service_1.default.getUserById(provider.providerUserId);
            const { botToken: teamBotOauthToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(slackUrl);
            const where = { providerId: provider.id };
            const drivers = yield driver_service_1.driverService.findAll({ where });
            const driverData = CabsHelper_1.default.toCabDriverValuePairs(drivers, true);
            const directMessageId = yield Notifications_1.default.getDMChannelId(user.slackId, teamBotOauthToken);
            const sendNotifucations = routes.map((route) => ProviderNotifications.providerMessagePerRoute(route, driverData, directMessageId, driverName, teamBotOauthToken));
            yield Promise.all(sendNotifucations);
        });
    }
    static providerMessagePerRoute(route, driverData, directMessageId, driverName, teamBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = route;
            const attachment = new SlackMessageModels_1.SlackAttachment('Assign another driver to route');
            const fields = helper_1.default.providerRouteFields(route);
            attachment.addFieldsOrActions('actions', [
                new SlackMessageModels_1.SlackSelectAction(`${id}`, 'Select Driver', driverData)
            ]);
            attachment.addFieldsOrActions('fields', fields);
            attachment.addOptionalProps('reassign_driver', 'fallback', '#FFCCAA', 'default');
            const message = Notifications_1.default.createDirectMessage(directMessageId, `Your driver *${driverName}* has been deleted by the Operations team.`
                + ':slightly_frowning_face:', [attachment]);
            return Notifications_1.default.sendNotification(message, teamBotOauthToken);
        });
    }
    static updateProviderReasignDriverMessage(channel, botToken, timeStamp, route, driver) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = 'Driver update complete. Thank you! :smiley:';
            const attachment = new SlackMessageModels_1.SlackAttachment();
            attachment.addOptionalProps('', '', '#3c58d7');
            const routeFields = helper_1.default.providerRouteFields(route);
            const driverFields = helper_1.default.driverFields(driver);
            attachment.addFieldsOrActions('fields', routeFields);
            attachment.addFieldsOrActions('fields', driverFields);
            try {
                yield InteractivePrompts_1.default.messageUpdate(channel, message, timeStamp, [attachment], botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static sendVehicleRemovalProviderNotification(cab, routeBatchData, slackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId } = cab;
                const { name: providerName, providerUserId } = yield provider_service_1.providerService
                    .findByPk(providerId);
                const { slackId } = yield user_service_1.default.getUserById(providerUserId);
                const { botToken: slackBotOauthToken } = yield teamDetails_service_1.teamDetailsService
                    .getTeamDetailsByTeamUrl(slackUrl);
                const channelId = yield Notifications_1.default.getDMChannelId(slackId, slackBotOauthToken);
                const { data: cabs } = yield cab_service_1.cabService.getCabs(undefined, { providerId });
                const cabData = CabsHelper_1.default.toCabLabelValuePairs(cabs, true);
                const notificationResults = routeBatchData.map((route) => {
                    const message = ProviderNotifications.getAssignedNewCabMessage(route, { cab, cabData }, providerName, channelId);
                    return Notifications_1.default.sendNotification(message, slackBotOauthToken);
                });
                yield Promise.all(notificationResults);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getAssignedNewCabMessage(route, cabOptions, providerName, channelId) {
        const { id } = route;
        const { cab, cabData } = cabOptions;
        const attachment = new SlackMessageModels_1.SlackAttachment('Please assign another cab');
        attachment.addFieldsOrActions('actions', [new SlackMessageModels_1.SlackSelectAction(`${id}`, 'Select Cab', cabData)]);
        const fields = helper_1.default.providerRouteFields(route);
        attachment.addFieldsOrActions('fields', fields);
        attachment.addOptionalProps('cab_reassign', 'fallback', '#FECCAE', 'default');
        const message = Notifications_1.default.createDirectMessage(channelId, `Hi *${providerName}*, a vehicle of model *${cab.model}* and a Registration`
            + `Number: *${cab.regNumber}* has been deleted by Andela Operations team.*`, attachment);
        return message;
    }
    static updateProviderReAssignCabMessage(channelId, slackBotOauthToken, timestamp, route, cab) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = new SlackMessageModels_1.SlackAttachment();
            attachment.addOptionalProps('', '', '#CCCEED');
            const routeFields = yield helper_1.default.providerRouteFields(route);
            const cabFields = yield helper_1.default.cabFields(cab);
            attachment.addFieldsOrActions('fields', routeFields);
            attachment.addFieldsOrActions('fields', cabFields);
            try {
                yield InteractivePrompts_1.default.messageUpdate(channelId, 'The Cab has been updated successfully! Thank you! :smiley:', timestamp, [attachment], slackBotOauthToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = ProviderNotifications;
//# sourceMappingURL=index.js.map