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
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const index_1 = __importDefault(require("../../../../utils/index"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
class AttachmentHelper {
    static getStatusLabels(status, statusText = 'Confirmed') {
        let action;
        let emoji;
        let title;
        let color;
        if (status === 'Declined') {
            action = 'declined';
            emoji = ':cry:';
            title = 'Your route request was denied. See below for more information :point_down:';
            color = '#ff0000';
        }
        else if (status === statusText || status === 'Approved') {
            action = statusText.toLowerCase();
            emoji = ':grin:';
            title = '';
            color = '#3AAF85';
        }
        if (!action)
            return;
        return {
            action,
            emoji,
            title,
            color
        };
    }
    static commentAttachment(routeRequest) {
        const { managerComment, opsComment } = routeRequest;
        if (!managerComment && !opsComment) {
            return null;
        }
        const attachments = new SlackMessageModels_1.SlackAttachment('');
        let commentField;
        if (managerComment) {
            commentField = new SlackMessageModels_1.SlackAttachmentField('Comment', managerComment);
        }
        else {
            commentField = new SlackMessageModels_1.SlackAttachmentField('Comment', opsComment);
        }
        attachments.addFieldsOrActions('fields', [commentField]);
        return attachments;
    }
    static routeRequestAttachment(routeRequest) {
        const { routeImageUrl, engagement } = routeRequest;
        const { email, name } = engagement.fellow;
        const fellowName = index_1.default.getNameFromEmail(email) || name;
        const attachments = new SlackMessageModels_1.SlackAttachment('Route Information', '', fellowName, '', (routeImageUrl) || '');
        const routeAttachmentFields = AttachmentHelper.routeAttachmentFields(routeRequest);
        attachments.addFieldsOrActions('fields', routeAttachmentFields);
        return attachments;
    }
    static routeAttachmentFields(routeRequest) {
        const { busStop, home, distance, busStopDistance } = routeRequest;
        const busStopAddress = busStop.address;
        const homeAddress = home.address;
        return [
            new SlackMessageModels_1.SlackAttachmentField(' ', null, false),
            new SlackMessageModels_1.SlackAttachmentField(':house: Home Address', homeAddress, true),
            new SlackMessageModels_1.SlackAttachmentField(':busstop: Bus Stop', busStopAddress, true),
            new SlackMessageModels_1.SlackAttachmentField('Bus Stop Distance', null, false),
            new SlackMessageModels_1.SlackAttachmentField('_From Home_', `${busStopDistance}km`, true),
            new SlackMessageModels_1.SlackAttachmentField('_From Dojo_', `${distance}km`, true),
            new SlackMessageModels_1.SlackAttachmentField(' ', null, false),
        ];
    }
    static engagementAttachment(routeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachments = new SlackMessageModels_1.SlackAttachment('Engagement Information');
            const engagementFields = yield AttachmentHelper.engagementAttachmentFields(routeRequest);
            attachments.addFieldsOrActions('fields', engagementFields);
            return attachments;
        });
    }
    static engagementAttachmentFields(routeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fellow, workHours, partnerName, startDate, endDate } = AttachmentHelper.destructEngagementDetails(routeRequest);
            const { email, name } = fellow;
            const fellowName = index_1.default.getNameFromEmail(email) || name;
            const nameField = new SlackMessageModels_1.SlackAttachmentField('Fellows Name', fellowName, true);
            const partnerField = new SlackMessageModels_1.SlackAttachmentField('Partner', partnerName, true);
            const engagementDateFields = (AttachmentHelper.engagementDateFields(startDate, endDate));
            const { from, to } = index_1.default.formatWorkHours(workHours);
            const workHourLabelField = new SlackMessageModels_1.SlackAttachmentField('Work Hours', null, false);
            const fromField = new SlackMessageModels_1.SlackAttachmentField('_From_', from, true);
            const toField = new SlackMessageModels_1.SlackAttachmentField('_To_', to, true);
            return [
                nameField, partnerField, ...engagementDateFields, workHourLabelField, fromField, toField
            ].filter((field) => !!field);
        });
    }
    static engagementDateFields(startDate, endDate) {
        let fields = [];
        let result;
        if (startDate && startDate.charAt(2) === '/') {
            result = this.formatStartAndEndDates(startDate, endDate);
        }
        if (startDate && endDate) {
            const sdDate = result
                ? moment_1.default(new Date(result.startDate)) : moment_1.default(new Date(startDate));
            const edDate = result
                ? moment_1.default(new Date(result.endDate)) : moment_1.default(new Date(endDate));
            const format = 'Do MMMM YYYY';
            const edFormatted = edDate.format(format);
            const sdFormatted = sdDate.format(format);
            fields = [
                new SlackMessageModels_1.SlackAttachmentField('Engagement Period', null, false),
                new SlackMessageModels_1.SlackAttachmentField('_Start Date_', sdFormatted, true),
                new SlackMessageModels_1.SlackAttachmentField('_End Date_', edFormatted, true)
            ];
        }
        return fields;
    }
    static formatStartAndEndDates(startDate, endDate) {
        const engagementDates = {
            startDate,
            endDate
        };
        return dateHelper_1.default.convertIsoString(engagementDates);
    }
    static destructEngagementDetails(routeRequest) {
        const { engagement } = routeRequest;
        const { partner: { name: partnerName }, fellow, startDate, endDate, workHours } = engagement;
        return {
            partnerName,
            fellow,
            startDate,
            endDate,
            workHours
        };
    }
}
exports.default = AttachmentHelper;
//# sourceMappingURL=AttachmentHelper.js.map