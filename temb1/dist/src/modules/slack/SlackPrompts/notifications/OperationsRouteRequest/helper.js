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
const moment_1 = __importDefault(require("moment"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const Notifications_1 = __importDefault(require("../../Notifications"));
const AttachmentHelper_1 = __importDefault(require("../AttachmentHelper"));
class OpsAttachmentHelper {
    static getOperationDeclineAttachment(routeRequest, channelID, user = 'manager') {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagement: { fellow }, status, manager: { slackId: id } } = routeRequest;
            const data = AttachmentHelper_1.default.getStatusLabels(status);
            const slackUserId = user === 'manager' ? id : fellow.slackId;
            if (!data)
                return;
            const { action, emoji, title, color } = data;
            const attachment = new SlackMessageModels_1.SlackAttachment(title);
            const comment = AttachmentHelper_1.default.commentAttachment(routeRequest);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest, 'ops');
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const attachments = [attachment, comment, routeAttachment, engagementAttachment];
            attachments
                .filter((item) => !!item)
                .forEach((at) => at.addOptionalProps('operations_route_actions', '/fallback', color));
            const baseMsg = `Hi, <@${slackUserId}>, the operations team has ${action}`;
            const greetingFellow = `${baseMsg} your request ${emoji}`;
            const greetingManager = `${baseMsg} the request you approved for <@${fellow.slackId}> ${emoji}`;
            const greeting = user === 'manager' ? greetingManager : greetingFellow;
            return Notifications_1.default.createDirectMessage(channelID, greeting, attachments);
        });
    }
    static getOperationCompleteAttachment(message, title, routeRequest, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const footer = new SlackMessageModels_1.SlackAttachment(message);
            const header = new SlackMessageModels_1.SlackAttachment(title);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const routeInformation = OpsAttachmentHelper.opsRouteInformation(submission);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const attachments = [header, routeAttachment, engagementAttachment, routeInformation, footer];
            attachments.forEach((at) => at.addOptionalProps('', '/fallback', '#3AAF85'));
            return attachments;
        });
    }
    static opsRouteInformation(submission) {
        const { routeName, takeOffTime } = submission;
        const time = moment_1.default(takeOffTime, 'HH:mm').format('LT');
        const attachments = new SlackMessageModels_1.SlackAttachment('');
        const fields = [
            new SlackMessageModels_1.SlackAttachmentField('Route Name', routeName, true),
            new SlackMessageModels_1.SlackAttachmentField('Take-off Time', time, true)
        ];
        attachments.addFieldsOrActions('fields', fields);
        return attachments;
    }
}
exports.default = OpsAttachmentHelper;
//# sourceMappingURL=helper.js.map