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
const index_1 = __importDefault(require("../SlackPrompts/notifications/ProviderNotifications/index"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const route_service_1 = require("../../routes/route.service");
const Notifications_1 = __importDefault(require("../SlackPrompts/Notifications"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const helper_1 = __importDefault(require("../SlackPrompts/notifications/ProviderNotifications/helper"));
const driver_service_1 = require("../../drivers/driver.service");
const provider_service_1 = require("../../providers/provider.service");
const driver_notifications_1 = __importDefault(require("../SlackPrompts/notifications/DriverNotifications/driver.notifications"));
const homebase_service_1 = require("../../homebases/homebase.service");
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
const cab_service_1 = require("../../cabs/cab.service");
class ProvidersController {
    static saveRoute(updatedRequest, submission, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { busStop, routeImageUrl } = updatedRequest;
            const { routeName, routeCapacity, takeOffTime, } = submission;
            const data = {
                destinationName: busStop.address,
                imageUrl: routeImageUrl,
                name: routeName,
                capacity: routeCapacity,
                takeOff: takeOffTime,
                status: 'Active',
            };
            const batch = yield route_service_1.routeService.createRouteBatch(data);
            yield Promise.all([
                route_service_1.routeService.addUserToRoute(batch.id, userId),
            ]);
            return batch;
        });
    }
    static handleProviderRouteApproval(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { team: { id: teamId }, submission: { driver: driverId, cab: cabId }, state } = payload;
                const { capacity } = yield cab_service_1.cabService.getById(cabId);
                const { tripId: routeBatchId, channel, timeStamp } = JSON.parse(state);
                yield routeBatch_service_1.routeBatchService.updateRouteBatch(routeBatchId, { driverId, cabId, capacity });
                const routeBatch = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, true);
                const { cabDetails: { providerId }, route: { name: routeName }, riders } = routeBatch;
                const { name } = yield provider_service_1.providerService.findByPk(providerId);
                const attachment = yield ProvidersController.getMessageAttachment(routeBatch);
                const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
                const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id);
                if (riders[0]) {
                    yield ProvidersController.sendUserProviderAssignMessage(riders, botToken, routeName, attachment);
                }
                yield ProvidersController.sendNotifications(name, routeName, botToken, opsChannelId, attachment, channel, timeStamp, routeBatch);
            }
            catch (err) {
                respond(new SlackMessageModels_1.SlackInteractiveMessage(err.message));
            }
        });
    }
    static sendNotifications(providerName, routeName, botToken, opsChannelId, attachment, channel, timeStamp, routeBatch) {
        return __awaiter(this, void 0, void 0, function* () {
            const opsNotification = ProvidersController.sendOpsProviderAssignMessage(providerName, routeName, botToken, opsChannelId, attachment);
            const updateNotification = index_1.default.updateRouteApprovalNotification(channel, botToken, timeStamp, attachment);
            const driverNotification = driver_notifications_1.default.sendRouteAssignment(routeBatch, botToken);
            return Promise.all([opsNotification, updateNotification, driverNotification]);
        });
    }
    static sendOpsProviderAssignMessage(providerName, routeName, botToken, opsChannelId, attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = Notifications_1.default.createDirectMessage(opsChannelId, `*${providerName}* has assigned a cab and a driver to route "*${routeName}*". :smiley:`, [attachment]);
            return Notifications_1.default.sendNotification(message, botToken);
        });
    }
    static sendUserProviderAssignMessage(riders, botToken, routeName, attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            const userNotifications = riders.map((rider) => __awaiter(this, void 0, void 0, function* () {
                const { slackId } = rider;
                const directMessageId = yield Notifications_1.default.getDMChannelId(slackId, botToken);
                const message = Notifications_1.default.createDirectMessage(directMessageId, `A driver and cab has been assigned to your route "*${routeName}*". :smiley:`, [attachment]);
                return Notifications_1.default.sendNotification(message, botToken);
            }));
            yield Promise.all(userNotifications);
        });
    }
    static getMessageAttachment(route) {
        return __awaiter(this, void 0, void 0, function* () {
            const { driver, cabDetails } = route;
            const routeFields = yield helper_1.default.providerRouteFields(route);
            const driverFields = yield helper_1.default.driverFields(driver);
            const cabFields = yield helper_1.default.cabFields(cabDetails);
            const attachment = new SlackMessageModels_1.SlackAttachment('Route Creation Complete');
            attachment.addOptionalProps('assignment_notification', 'fallback', '#3AAF85', 'default');
            attachment.addFieldsOrActions('fields', routeFields);
            attachment.addFieldsOrActions('fields', driverFields);
            attachment.addFieldsOrActions('fields', cabFields);
            return attachment;
        });
    }
    static providerReassignDriver(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { team: { id: teamId }, channel: { id: channelId }, original_message: { ts: timestamp } } = payload;
                const driverId = payload.actions[0].selected_options[0].value;
                const routeBatchId = payload.actions[0].name;
                yield routeBatch_service_1.routeBatchService.updateRouteBatch(routeBatchId, { driverId });
                const route = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, true);
                const { riders } = route;
                const driver = yield driver_service_1.driverService.getDriverById(driverId);
                const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                yield index_1.default.updateProviderReasignDriverMessage(channelId, botToken, timestamp, route, driver);
                const sendNotifications = riders.map((user) => ProvidersController.sendUserRouteUpdateMessage(user, route, driver, botToken));
                yield Promise.all(sendNotifications);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendUserRouteUpdateMessage(user, route, driver, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slackId } = user;
            const directMessageId = yield Notifications_1.default.getDMChannelId(slackId, botToken);
            const attachment = new SlackMessageModels_1.SlackAttachment();
            attachment.addOptionalProps('', '', '#3c58d7');
            const routeFields = yield helper_1.default.providerRouteFields(route);
            const driverFields = yield helper_1.default.driverFields(driver);
            attachment.addFieldsOrActions('fields', routeFields);
            attachment.addFieldsOrActions('fields', driverFields);
            const message = Notifications_1.default.createDirectMessage(directMessageId, 'A new driver has been assigned to your route. :smiley:', [attachment]);
            return Notifications_1.default.sendNotification(message, botToken);
        });
    }
    static handleCabReAssigmentNotification(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team: { id: teamId }, channel: { id: channelId }, original_message: { ts: timestamp }, } = payload;
            try {
                const cabId = payload.actions[0].selected_options[0].value;
                const cab = yield cab_service_1.cabService.getById(cabId);
                const routeBatchId = payload.actions[0].name;
                yield routeBatch_service_1.routeBatchService.updateRouteBatch(routeBatchId, { cabId: cab.id });
                const route = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, true);
                const { riders: users } = route;
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                yield index_1.default.updateProviderReAssignCabMessage(channelId, slackBotOauthToken, timestamp, route, cab);
                yield users.forEach((user) => ProvidersController.sendUserUpdatedRouteMessage(user, route, cab, slackBotOauthToken));
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static sendUserUpdatedRouteMessage(user, route, cab, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = yield Notifications_1.default.getDMChannelId(user.slackId, slackBotOauthToken);
            const attachment = new SlackMessageModels_1.SlackAttachment();
            const routeFields = yield helper_1.default.providerRouteFields(route);
            const cabFields = yield helper_1.default.cabFields(cab);
            attachment.addFieldsOrActions('fields', routeFields);
            attachment.addFieldsOrActions('fields', cabFields);
            const message = Notifications_1.default.createDirectMessage(channelId, '*A new cab has been assigned to your route* :smiley:', [attachment]);
            return Notifications_1.default.sendNotification(message, slackBotOauthToken);
        });
    }
}
exports.default = ProvidersController;
//# sourceMappingURL=ProvidersController.js.map