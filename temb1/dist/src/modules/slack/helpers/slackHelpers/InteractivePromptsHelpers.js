"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const utils_1 = __importDefault(require("../../../../utils"));
class InteractivePromptsHelpers {
    static addOpsNotificationTripFields(tripInfo) {
        const { requester, department, rider, destination: { address: destination }, origin: { address: pickup } } = tripInfo;
        return [
            new SlackMessageModels_1.SlackAttachmentField('Requested By', `<@${requester.slackId}>`, true),
            new SlackMessageModels_1.SlackAttachmentField('Department', department.name, true),
            new SlackMessageModels_1.SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
            new SlackMessageModels_1.SlackAttachmentField('Pickup Location', pickup, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination, true),
            new SlackMessageModels_1.SlackAttachmentField('Request Date', utils_1.default.formatDate(tripInfo.createdAt), true),
            new SlackMessageModels_1.SlackAttachmentField('Trip Date', utils_1.default.formatDate(tripInfo.departureTime), true)
        ];
    }
    static addOpsNotificationCabFields(cabInfo) {
        const { driverName, driverPhoneNo, regNumber } = cabInfo;
        return [
            new SlackMessageModels_1.SlackAttachmentField('Driver\'s Name', driverName, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver\'s Number', driverPhoneNo, true),
            new SlackMessageModels_1.SlackAttachmentField('Car\'s Reg Number', regNumber, true)
        ];
    }
    static generateCabDetailsAttachment(tripInformation) {
        const { cab } = tripInformation;
        const cabDetailsAttachment = new SlackMessageModels_1.SlackAttachment('Cab Details');
        cabDetailsAttachment.addOptionalProps('', '', '#3c58d7');
        cabDetailsAttachment.addFieldsOrActions('fields', InteractivePromptsHelpers.addOpsNotificationCabFields(cab));
        return cabDetailsAttachment;
    }
    static formatTripHistory(tripHistory) {
        const attachments = [];
        const formatTrip = (trip) => {
            const tripAttachment = new SlackMessageModels_1.SlackAttachment('', `*Date*: ${trip.departureTime}`, '', '', '', '', 'good');
            tripAttachment.addMarkdownIn(['text']);
            tripAttachment.addFieldsOrActions('fields', [
                new SlackMessageModels_1.SlackAttachmentField('Pickup Location', `${trip.origin.address}`, 'true'),
                new SlackMessageModels_1.SlackAttachmentField('Destination', `${trip.destination.address}`, 'true')
            ]);
            attachments.push(tripAttachment);
        };
        tripHistory.forEach((trip) => formatTrip(trip));
        return attachments;
    }
    static getOpsCompletionAttachmentDetails(decline, tripInformation) {
        return {
            color: decline ? 'danger' : 'good',
            confirmTitle: decline
                ? `:X: <@${tripInformation.decliner.slackId}> declined this request`
                : `:white_check_mark: <@${tripInformation.confirmer.slackId}> approved this request`,
            title: decline ? 'Trip request declined' : 'Trip request approved'
        };
    }
}
exports.default = InteractivePromptsHelpers;
//# sourceMappingURL=InteractivePromptsHelpers.js.map