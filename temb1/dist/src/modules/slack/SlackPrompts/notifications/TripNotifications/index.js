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
const dateHelpers_1 = require("../../../helpers/dateHelpers");
class TripNotifications {
    static sendCompletionNotification(trip, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rider: { slackId } } = trip;
            const directMessageId = yield Notifications_1.default.getDMChannelId(slackId, botToken);
            const actions = [
                new SlackMessageModels_1.SlackButtonAction('trip_taken', 'Yes', trip.id),
                new SlackMessageModels_1.SlackButtonAction('still_on_trip', 'Still on trip', trip.id),
                new SlackMessageModels_1.SlackButtonAction('not_taken', 'No', trip.id, 'danger')
            ];
            const attachment = new SlackMessageModels_1.SlackAttachment('', '', '', '', '');
            const fields = Notifications_1.default.notificationFields(trip);
            attachment.addFieldsOrActions('actions', actions);
            attachment.addFieldsOrActions('fields', fields);
            attachment.addOptionalProps('trip_completion');
            const message = Notifications_1.default.createDirectMessage(directMessageId, `Hi! <@${trip.rider.slackId}> Did you take this trip?`, attachment);
            return Notifications_1.default.sendNotification(message, botToken);
        });
    }
    static sendTripReminderNotifications(trip, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                TripNotifications.sendRiderReminderNotification(trip, token),
                TripNotifications.sendDriverReminderNotification(trip, token),
            ]);
        });
    }
    static sendDriverReminderNotification(trip, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trip.driver.user) {
                const driverDirectMessageId = yield Notifications_1.default.getDMChannelId(trip.driver.user.slackId, slackBotOauthToken);
                const driverMessage = `Hello *${trip.driver.driverName}*, the trip you have been assigned to `
                    + `from *${trip.origin.address}* to *${trip.destination.address}*, is due for take off at`
                    + `*${dateHelpers_1.getSlackTimeOnly(trip.departureTime)}*.`
                    + ` Your passenger is <@${trip.rider.slackId}>.`;
                const driverDMmessage = Notifications_1.default.createDirectMessage(driverDirectMessageId, driverMessage, []);
                return Notifications_1.default.sendNotification(driverDMmessage, slackBotOauthToken);
            }
        });
    }
    static sendRiderReminderNotification(trip, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rider: { slackId } } = trip;
            const riderDirectMessageId = yield Notifications_1.default.getDMChannelId(slackId, slackBotOauthToken);
            const driverNameOrSlackId = trip.driver.user ? `<@${trip.driver.user.slackId}>`
                : `*${trip.driver.driverName}*`;
            const riderMessage = `Hello <@${trip.rider.slackId}>, your trip from *${trip.origin.address}* `
                + `to *${trip.destination.address}* takes off at `
                + `*${dateHelpers_1.getSlackTimeOnly(trip.departureTime)}*.\n`
                + `The driver for the trip is ${driverNameOrSlackId}.\n`
                + 'If you need any help, Please feel free to contact the Operations Team. Enjoy :smiley:';
            const riderDMmessage = Notifications_1.default.createDirectMessage(riderDirectMessageId, riderMessage, []);
            return Notifications_1.default.sendNotification(riderDMmessage, slackBotOauthToken);
        });
    }
}
exports.default = TripNotifications;
//# sourceMappingURL=index.js.map