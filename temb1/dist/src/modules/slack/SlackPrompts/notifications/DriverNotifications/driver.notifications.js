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
const driver_notifications_helper_1 = __importDefault(require("./driver.notifications.helper"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const driver_service_1 = __importDefault(require("../../../../drivers/driver.service"));
const whatsapp_service_1 = __importDefault(require("../../../../../modules/notifications/whatsapp/whatsapp.service"));
const ValidationSchemas_1 = __importDefault(require("./../../../../../middlewares/ValidationSchemas"));
const slack_block_models_1 = require("../../../../new-slack/models/slack-block-models");
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const { phoneNoRegex } = ValidationSchemas_1.default;
class DriverNotifications {
    static sendDriverTripApproveOnSlack(teamId, trip, driverSlackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripData = Object.assign(Object.assign({}, trip), { driverSlackId });
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            const blocks = driver_notifications_helper_1.default.tripApprovalAttachment(tripData);
            const imResponse = yield Notifications_1.default.getDMChannelId(driverSlackId, slackBotOauthToken);
            const message = new slack_block_models_1.BlockMessage(blocks, imResponse, 'You have been assigned a trip');
            return Notifications_1.default.sendNotification(message, slackBotOauthToken);
        });
    }
    static checkAndNotifyDriver(id, teamId, trip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const driver = yield driver_service_1.default.findOneDriver({ where: { id } });
                if (driver.userId) {
                    yield DriverNotifications.sendDriverTripApproveOnSlack(teamId, trip, driver.user.slackId);
                    return;
                }
                if (phoneNoRegex.test(driver.driverPhoneNo)) {
                    yield whatsapp_service_1.default.send(DriverNotifications.getTripAssignmentWhatsappMessage(driver, trip));
                }
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static getTripAssignmentWhatsappMessage(driver, trip) {
        return {
            to: driver.driverPhoneNo,
            body: `Hey ${driver.driverName},\n
        You have been assigned the trip with the following details\n
        *Pickup Location*: ${trip.origin.address}\n
        *Destination*: ${trip.destination.address}\n
        *Pickup Time*: ${trip.departureTime}\n
        *Passenger Name*: ${trip.rider.name}\n
        *Passenger Phone No*: ${trip.rider.phoneNo}\n\n
        We wish you a safe trip.`,
        };
    }
    static sendRouteAssignment(routeBatch, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (routeBatch.driver.userId) {
                const blocks = driver_notifications_helper_1.default.routeApprovalAttachment(routeBatch);
                const imResponse = yield Notifications_1.default.getDMChannelId(routeBatch.driver.user.slackId, botToken);
                const message = new slack_block_models_1.BlockMessage(blocks, imResponse, 'New Route Assigned');
                yield Notifications_1.default.sendNotification(message, botToken);
            }
            else {
                const { driver } = routeBatch;
                const waMessage = DriverNotifications.getRouteAssignmentWhatsappMessage(routeBatch);
                yield whatsapp_service_1.default.send(waMessage);
            }
        });
    }
    static getRouteAssignmentWhatsappMessage(routeBatch) {
        const { driver, route } = routeBatch;
        const checkPhoneNo = phoneNoRegex.test(driver.driverPhoneNo);
        if (checkPhoneNo) {
            return {
                to: driver.driverPhoneNo,
                body: `Hello *${driver.driverName}*, `
                    + `you have been assigned to the route *${route.name}* `
                    + `which takes off at *${routeBatch.takeOff}* daily. Please liaise with Ops or your Provider for clarity.
            Thanks `,
            };
        }
    }
}
exports.default = DriverNotifications;
//# sourceMappingURL=driver.notifications.js.map