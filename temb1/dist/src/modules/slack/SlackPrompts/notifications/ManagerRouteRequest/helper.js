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
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const Notifications_1 = __importDefault(require("../../Notifications"));
const AttachmentHelper_1 = __importDefault(require("../AttachmentHelper"));
class ManagerAttachmentHelper {
    static getManagerCompleteAttachment(message, title, routeRequest, color = '#3359DF') {
        return __awaiter(this, void 0, void 0, function* () {
            const footer = new SlackMessageModels_1.SlackAttachment(message);
            const header = new SlackMessageModels_1.SlackAttachment(title);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const attachments = [header, routeAttachment, engagementAttachment, footer];
            attachments.forEach((at) => at.addOptionalProps('manager_route_btnActions', '/fallback', color));
            return attachments;
        });
    }
    static getManagerMessageAttachment(routeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, id, } = routeRequest;
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const attachments = [routeAttachment, engagementAttachment];
            if (status === 'Pending') {
                const btnAttachment = new SlackMessageModels_1.SlackAttachment('');
                const actions = [new SlackMessageModels_1.SlackButtonAction('approve', 'Approve', id),
                    new SlackMessageModels_1.SlackButtonAction('decline', 'Decline', id, 'danger')
                ];
                btnAttachment.addFieldsOrActions('actions', actions);
                attachments.push(btnAttachment);
            }
            else {
                const { message } = ManagerAttachmentHelper.completeManagerActionLabels(routeRequest);
                const footer = new SlackMessageModels_1.SlackAttachment(message);
                attachments.push(footer);
            }
            attachments.forEach((at) => at.addOptionalProps('manager_route_btnActions', '/fallback', '#3359DF'));
            return attachments;
        });
    }
    static getManagerApproveOrDeclineAttachment(routeRequest, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagement: { fellow }, manager, status } = routeRequest;
            const data = AttachmentHelper_1.default.getStatusLabels(status);
            if (!data)
                return;
            const { action, emoji, title, color } = data;
            const attachment = new SlackMessageModels_1.SlackAttachment(title);
            const comment = AttachmentHelper_1.default.commentAttachment(routeRequest);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const attachments = [attachment, comment, routeAttachment, engagementAttachment];
            attachments
                .filter((item) => !!item)
                .forEach((at) => at.addOptionalProps('manager_route_btnActions', '/fallback', color));
            const greeting = `Hi, <@${fellow.slackId}>`;
            return Notifications_1.default.createDirectMessage(channelID, `${greeting}, your manager <@${manager.slackId}> ${action} your request ${emoji}`, attachments);
        });
    }
    static labelsHelper(status, fellow) {
        const lowerStatus = status.toLowerCase();
        const emoji = status === 'Confirmed' ? ':white_check_mark:' : ':x:';
        const title = `Route Request ${status}`;
        const message = `${emoji} You have ${lowerStatus} this route`;
        const text = `You have just ${lowerStatus} <@${fellow.slackId}> route request`;
        const color = status === 'Confirmed' ? '#3359DF' : '#FF0000';
        return {
            title, message, text, color
        };
    }
    static completeManagerActionLabels(routeRequest) {
        const { status, engagement: { fellow } } = routeRequest;
        let title;
        let message;
        let text;
        let color;
        if (status === 'Confirmed' || status === 'Declined') {
            ({
                title, message, text, color
            } = this.labelsHelper(status, fellow));
        }
        return {
            title, message, text, color
        };
    }
    static managerPreviewAttachment(routeRequest, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { approve } = value;
            const previewAttachment = new SlackMessageModels_1.SlackAttachment('Confirm Engagement Information');
            const engagement = yield AttachmentHelper_1.default.engagementAttachmentFields(routeRequest);
            const actionsBtn = [
                new SlackMessageModels_1.SlackButtonAction('initialNotification', '< Back', JSON.stringify({ data: approve }), '#FFCCAA'),
                new SlackMessageModels_1.SlackButtonAction('approvedRequestSubmit', 'Submit Information', JSON.stringify(value))
            ];
            previewAttachment.addFieldsOrActions('fields', [...engagement]);
            previewAttachment.addFieldsOrActions('actions', [...actionsBtn]);
            previewAttachment.addOptionalProps('manager_route_btnActions', '/fallback', '#dfc602');
            return previewAttachment;
        });
    }
}
exports.default = ManagerAttachmentHelper;
//# sourceMappingURL=helper.js.map