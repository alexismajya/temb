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
const navButtons_1 = __importDefault(require("../../../helpers/slack/navButtons"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const AttachmentHelper_1 = __importDefault(require("./notifications/AttachmentHelper"));
class PreviewPrompts {
    static sendPartnerInfoPreview(payload, result, fellow) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeRequest = PreviewPrompts.generateRouteModelFromCacheDate(result, Object.assign(Object.assign({}, payload.submission), { nameOfPartner: payload.partnerName, fellow }));
            const { routeImageUrl } = routeRequest;
            const attachment = new SlackMessageModels_1.SlackAttachment('', '', '', '', routeImageUrl);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachmentFields(routeRequest);
            const manager = new SlackMessageModels_1.SlackAttachmentField('Manager', `<@${routeRequest.manager.slackId}>`);
            engagementAttachment.splice(2, 0, manager);
            const addressDetailAttachment = AttachmentHelper_1.default.routeAttachmentFields(routeRequest);
            const cancellationText = 'Are you sure you want to cancel this trip request';
            const actions = [
                new SlackMessageModels_1.SlackButtonAction('confirmNewRouteRequest', 'Confirm', JSON.stringify(payload)),
                new SlackMessageModels_1.SlackCancelButtonAction('Cancel', 'cancel', cancellationText, 'cancel_new_request')
            ];
            attachment.addFieldsOrActions('actions', actions);
            attachment.addFieldsOrActions('fields', [...engagementAttachment, ...addressDetailAttachment]);
            attachment.addOptionalProps('new_route_handlePartnerForm', 'fallback', undefined, 'default');
            return new SlackMessageModels_1.SlackInteractiveMessage('*Preview Details*', [
                attachment
            ]);
        });
    }
    static generateEngagementModel(engagementInfo) {
        if (!engagementInfo)
            return {};
        const { manager: managerId, nameOfPartner, workingHours: workHours, fellow } = engagementInfo;
        return {
            manager: { slackId: managerId },
            engagement: { partner: { name: nameOfPartner }, workHours, fellow }
        };
    }
    static generateRouteModelFromCacheDate(previewData, engagementInfo) {
        const { staticMapUrl, homeToDropOffDistance, dojoToDropOffDistance, savedBusStop, savedHomeAddress, } = previewData;
        let { distanceInMetres: busStopDistance } = homeToDropOffDistance;
        let { distanceInMetres: distance } = dojoToDropOffDistance;
        busStopDistance = Math.ceil(busStopDistance / 1000).toFixed(1);
        distance = Math.ceil(distance / 1000).toFixed(1);
        const engagement = PreviewPrompts.generateEngagementModel(engagementInfo);
        return Object.assign(Object.assign({ busStopDistance,
            distance }, engagement), { busStop: savedBusStop, home: savedHomeAddress, routeImageUrl: staticMapUrl });
    }
    static displayDestinationPreview(previewData) {
        const routeRequest = PreviewPrompts.generateRouteModelFromCacheDate(previewData);
        const { routeImageUrl } = routeRequest;
        const title = 'A preview of your location and selected bus stop :smile:';
        const attachment = new SlackMessageModels_1.SlackAttachment('', title, '', '', routeImageUrl);
        attachment.addFieldsOrActions('fields', AttachmentHelper_1.default.routeAttachmentFields(routeRequest));
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('launchNewRoutePrompt', 'Continue', 'launchNewRoutePrompt')
        ]);
        attachment.addOptionalProps('new_route_handleNewRouteRequest');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch');
        return new SlackMessageModels_1.SlackInteractiveMessage('*Map Preview*', [attachment, navAttachment]);
    }
}
exports.default = PreviewPrompts;
//# sourceMappingURL=PreviewPrompts.js.map