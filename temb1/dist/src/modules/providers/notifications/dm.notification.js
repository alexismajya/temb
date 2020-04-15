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
const Notifications_1 = __importDefault(require("../../slack/SlackPrompts/Notifications"));
const SlackMessageModels_1 = require("../../slack/SlackModels/SlackMessageModels");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
class DirectMessage {
    sendVerificationMessage(provider, options) {
        return Promise.resolve();
    }
    notifyNewTripRequest(provider, tripDetails, teamDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, user: { slackId } } = provider;
                const { id: tripId } = tripDetails;
                const directMessageId = yield Notifications_1.default.getDMChannelId(slackId, teamDetails.botToken);
                const attachment = new SlackMessageModels_1.SlackAttachment();
                const fields = Notifications_1.default.notificationFields(tripDetails);
                attachment.addFieldsOrActions('actions', [new SlackMessageModels_1.SlackButtonAction('assign-cab', 'Accept', `${tripId}`)]);
                attachment.addFieldsOrActions('fields', fields);
                attachment.addOptionalProps('provider_actions', 'fallback', '#FFCCAA', 'default');
                const message = Notifications_1.default.createDirectMessage(directMessageId, `A trip has been assigned to *${name}*,`
                    + 'please assign a driver and a cab', [attachment]);
                yield Notifications_1.default.sendNotification(message, teamDetails.botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.DirectMessage = DirectMessage;
//# sourceMappingURL=dm.notification.js.map