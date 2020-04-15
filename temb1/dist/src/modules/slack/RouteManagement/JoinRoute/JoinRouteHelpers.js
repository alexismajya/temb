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
const index_1 = __importDefault(require("../../../../utils/index"));
const joinRouteRequest_service_1 = require("../../../joinRouteRequests/joinRouteRequest.service");
const cache_1 = __importDefault(require("../../../shared/cache"));
const partner_service_1 = require("../../../partners/partner.service");
const engagement_service_1 = require("../../../engagements/engagement.service");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const AttachmentHelper_1 = __importDefault(require("../../SlackPrompts/notifications/AttachmentHelper"));
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
const dateHelpers_1 = require("../../helpers/dateHelpers");
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
class JoinRouteHelpers {
    static getName(username) {
        let names = username.split('.');
        names = names.map((name) => index_1.default.toSentenceCase(name));
        return names.join(' ');
    }
    static saveJoinRouteRequest(payload, routeBatchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, team: { id: teamId } } = payload;
            const { manager: managerSlackId, workHours } = yield cache_1.default.fetch(`joinRouteRequestSubmission_${slackId}`);
            const [start, end, partnerName] = yield cache_1.default.fetch(`userDetails${slackId}`);
            const engagementDates = { startDate: start, endDate: end };
            const { startDate, endDate } = dateHelper_1.default.convertIsoString(engagementDates);
            const [partner, fellow, manager, routeBatch] = yield Promise.all([
                partner_service_1.partnerService.findOrCreatePartner(partnerName),
                slackHelpers_1.default.findOrCreateUserBySlackId(slackId, teamId),
                slackHelpers_1.default.findOrCreateUserBySlackId(managerSlackId),
                routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId)
            ]);
            const engagement = yield engagement_service_1.engagementService.findOrCreateEngagement(workHours, fellow, partner, startDate, endDate);
            return joinRouteRequest_service_1.joinRouteRequestService.createJoinRouteRequest(engagement.id, manager.id, routeBatch.id);
        });
    }
    static getJoinRouteRequest({ id, submission, slackId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let manager;
            let workHours;
            let startDate;
            let endDate;
            let partnerName;
            if (submission) {
                ({
                    manager, partnerName, workHours, startDate, endDate
                } = submission);
                yield cache_1.default.saveObject(`joinRouteRequestSubmission_${slackId}`, submission);
            }
            else {
                ({
                    manager: { slackId: manager },
                    engagement: {
                        workHours, startDate, endDate, partner: { name: partnerName }
                    }
                } = yield joinRouteRequest_service_1.joinRouteRequestService.getJoinRouteRequest(id));
            }
            return {
                manager, workHours, startDate, endDate, partnerName
            };
        });
    }
    static engagementFields(joinRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { manager: { slackId, email, name } } = joinRequest;
            const managerName = index_1.default.getNameFromEmail(email) || name;
            const managerField = new SlackMessageModels_1.SlackAttachmentField('Line Manager', `${managerName} (<@${slackId}>)`);
            const fields = yield AttachmentHelper_1.default.engagementAttachmentFields(joinRequest);
            fields.splice(2, 0, managerField);
            return fields;
        });
    }
    static routeFields(route) {
        const { capacity, riders, takeOff, route: { name: routeName, destination: { address } } } = route;
        const takeOffTime = dateHelpers_1.timeTo12hrs(takeOff);
        return [
            new SlackMessageModels_1.SlackAttachmentField('Route', routeName, true),
            new SlackMessageModels_1.SlackAttachmentField('Route capacity', `${riders.length}/${capacity}`, true),
            new SlackMessageModels_1.SlackAttachmentField('Route Departure Time', takeOffTime, false),
            new SlackMessageModels_1.SlackAttachmentField('Bus Stop :busstop:', address, false),
        ];
    }
    static joinRouteAttachments(joinRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeBatch, routeBatch: { route: { imageUrl } } } = joinRoute;
            const attachment = new SlackMessageModels_1.SlackAttachment(undefined, undefined, undefined, undefined, imageUrl);
            const fellowFields = yield JoinRouteHelpers.engagementFields(joinRoute);
            const routeBatchFields = yield JoinRouteHelpers.routeFields(routeBatch);
            const separator = '---------------------';
            const attachments = [
                new SlackMessageModels_1.SlackAttachmentField(`${separator}${separator}${separator}`, null, false),
                new SlackMessageModels_1.SlackAttachmentField('*_`Engagement Details`_*', null, false),
                ...fellowFields,
                new SlackMessageModels_1.SlackAttachmentField(`${separator}${separator}${separator}`, null, false),
                new SlackMessageModels_1.SlackAttachmentField('*_`Route Information`_*', null, false),
                ...routeBatchFields,
                new SlackMessageModels_1.SlackAttachmentField(`${separator}${separator}${separator}`, null, false),
            ];
            attachment.addFieldsOrActions('fields', attachments);
            return attachment;
        });
    }
}
exports.default = JoinRouteHelpers;
//# sourceMappingURL=JoinRouteHelpers.js.map