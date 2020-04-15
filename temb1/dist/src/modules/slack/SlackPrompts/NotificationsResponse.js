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
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const dateHelpers_1 = require("../helpers/dateHelpers");
const homebase_service_1 = require("../../homebases/homebase.service");
const constants_1 = require("../../../helpers/constants");
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const slack_block_models_1 = require("../../new-slack/models/slack-block-models");
const trip_request_1 = require("../../../database/models/trip-request");
class NotificationsResponse {
    static getOpsTripRequestMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = data;
            const { department: { head: { slackId } } } = data;
            const actions = yield NotificationsResponse.generateOperationsRequestActions(id, slackId);
            return NotificationsResponse.responseForOperations(data, actions, 'trips_cab_selection');
        });
    }
    static responseForOperations(data, actions, callbackId) {
        const { tripStatus, tripType } = data;
        const color = tripStatus && tripStatus
            .toLowerCase().startsWith('ca') ? 'good' : undefined;
        if (tripType === trip_request_1.TripTypes.regular) {
            return NotificationsResponse.prepareOperationsDepartmentResponse(data, color, actions, callbackId);
        }
        return this.travelOperationsDepartmentResponse(data, color, actions, callbackId);
    }
    static riderInfoResponse(rider, requester) {
        const riderInfo = rider.slackId !== requester.slackId
            ? `<@${requester.slackId}> requested a trip for <@${rider.slackId}>`
            : `<@${requester.slackId}> requested a trip`;
        return riderInfo;
    }
    static travelOperationsDepartmentResponse(trip, color, actions, callbackId) {
        const { tripStatus, requester, pickup, departureTime, rider, destination, department, noOfPassengers, tripType, tripNote } = trip;
        const riderInfo = this.riderInfoResponse(rider, requester);
        const detailedAttachment = new SlackMessageModels_1.SlackAttachment('Travel trip request', riderInfo, null, null, null, 'default', color);
        const fields = [
            new SlackMessageModels_1.SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
            new SlackMessageModels_1.SlackAttachmentField('Department', department.name, true),
            new SlackMessageModels_1.SlackAttachmentField('Pickup Location', pickup.address, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination.address, true),
            new SlackMessageModels_1.SlackAttachmentField('Pick-Up Time', dateHelpers_1.getSlackDateString(departureTime), true),
            new SlackMessageModels_1.SlackAttachmentField('Number of Passengers', noOfPassengers, true),
            new SlackMessageModels_1.SlackAttachmentField('Trip Type', tripType, true),
            new SlackMessageModels_1.SlackAttachmentField('Status', tripStatus, true),
            new SlackMessageModels_1.SlackAttachmentField('Trip Notes', !tripNote ? 'No Trip Notes' : tripNote, true),
        ];
        detailedAttachment.addFieldsOrActions('actions', actions);
        detailedAttachment.addFieldsOrActions('fields', fields);
        detailedAttachment.addOptionalProps(callbackId, '', undefined, 'default');
        return new SlackMessageModels_1.SlackInteractiveMessage('', [detailedAttachment], trip.homebase.channel);
    }
    static prepareOperationsDepartmentResponse(trip, color, actions, callbackId) {
        const { tripStatus, requester, pickup, departureTime, rider, destination, managerComment, department } = trip;
        const riderInfo = this.riderInfoResponse(rider, requester);
        const detailedAttachment = new SlackMessageModels_1.SlackAttachment('Manager approved trip request', riderInfo, null, null, null, 'default', color);
        const fields = [
            new SlackMessageModels_1.SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
            new SlackMessageModels_1.SlackAttachmentField('Department', department.name, true),
            new SlackMessageModels_1.SlackAttachmentField('Pickup Location', pickup.address, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination.address, true),
            new SlackMessageModels_1.SlackAttachmentField('Departure', dateHelpers_1.checkBeforeSlackDateString(departureTime), true),
            new SlackMessageModels_1.SlackAttachmentField('Status', tripStatus, true),
            new SlackMessageModels_1.SlackAttachmentField('Manager Comment', managerComment)
        ];
        detailedAttachment.addFieldsOrActions('actions', actions);
        detailedAttachment.addFieldsOrActions('fields', fields);
        detailedAttachment.addOptionalProps(callbackId, 'fallback', undefined, 'default');
        return new SlackMessageModels_1.SlackInteractiveMessage(`<@${trip.department.head.slackId}> just approved this trip. Its ready for your action :smiley:`, [detailedAttachment], trip.homebase.channel);
    }
    static responseForRequester(data, slackChannelId, isOps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin: pickup, destination, createdAt: requestDate, departureTime, tripStatus, managerComment } = data;
            const text = yield NotificationsResponse.getMessageHeader(data, isOps);
            const detailedAttachment = new SlackMessageModels_1.SlackAttachment('Approved', text, null, null, null, 'default', '#29b016');
            const attachments = NotificationsResponse.getRequesterAttachment(pickup, destination, requestDate, departureTime, tripStatus, managerComment);
            attachments.unshift(detailedAttachment);
            return new SlackMessageModels_1.SlackInteractiveMessage('Trip Approved', attachments, slackChannelId);
        });
    }
    static getRequesterAttachment(pickup, destination, requestDate, departureDate, tripStatus, managerComment) {
        const detailedAttachment = new SlackMessageModels_1.SlackAttachment('*Trip Details*', null, null, null, null, 'default', '#29b016');
        const fields = [
            new SlackMessageModels_1.SlackAttachmentField('Pickup', pickup.address, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination.address, true),
            new SlackMessageModels_1.SlackAttachmentField('Request Date', dateHelpers_1.getSlackDateString(requestDate), true),
            new SlackMessageModels_1.SlackAttachmentField('Departure Date', dateHelpers_1.getSlackDateString(departureDate), true),
            new SlackMessageModels_1.SlackAttachmentField('Trip Status', tripStatus, true),
            new SlackMessageModels_1.SlackAttachmentField('Reason', managerComment, true)
        ];
        detailedAttachment.addFieldsOrActions('fields', fields);
        return [detailedAttachment];
    }
    static getMessageHeader(trip, isOps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin = trip.pickup, destination } = trip;
            const isApproved = yield slackHelpers_1.default.isRequestApproved(trip.id);
            const [opsEnd, mgrEnd] = [
                '\nThe request is now ready for confirmation.',
                '\nThe request has now been forwarded to the operations team for confirmation.'
            ];
            const messageHeader = `Your request from *${origin.address}* to *${destination.address}*`
                + ` has been approved by ${isApproved.approvedBy}.${isOps ? opsEnd : mgrEnd}`;
            return messageHeader;
        });
    }
    static generateOperationsRequestActions(id, slackId, homebase) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = [
                {
                    text: 'Confirm and assign Cab and Driver',
                    value: `assignCab_${id}`,
                },
                {
                    text: 'Confirm and assign provider',
                    value: `confirmTrip_${id}`,
                }
            ];
            const selectAction = yield NotificationsResponse.getOpsSelectAction(slackId, id, options, homebase);
            const actions = [
                selectAction,
                new SlackMessageModels_1.SlackButtonAction('declineRequest', 'Decline', id, 'danger')
            ];
            return actions;
        });
    }
    static generateOpsApprovalActions(tripId) {
        const actions = [
            new SlackMessageModels_1.SlackButtonAction('approveDelayedRequest', 'Approve', `${tripId}`, 'primary'),
            new SlackMessageModels_1.SlackButtonAction('declineDelayedRequest', 'Decline', tripId, 'danger')
        ];
        return actions;
    }
    static getOpsSelectAction(slackId, id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let selectAction = new SlackMessageModels_1.SlackSelectAction('assign-cab-or-provider', 'Confirm request options', options);
            const { name } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            if (name === constants_1.HOMEBASE_NAMES.KAMPALA) {
                selectAction = new SlackMessageModels_1.SlackButtonAction('assign-cab-or-provider', 'Confirm and assign cab and driver', `assignCab_${id}`);
            }
            return selectAction;
        });
    }
    static getOpsTripBlocksFields(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let fields = [];
            const trip = yield trip_service_1.default.getById(id, true);
            fields = [
                new slack_block_models_1.MarkdownText(`*Passenger*:\n ${trip.rider.name}`),
                new slack_block_models_1.MarkdownText(`*Pickup Location*:\n ${trip.origin.address}`),
                new slack_block_models_1.MarkdownText(`*Destination*:\n ${trip.destination.address}`),
                new slack_block_models_1.MarkdownText(`*Provider*:\n ${trip.provider.name}`),
                new slack_block_models_1.MarkdownText(`*Driver Name*:\n ${trip.driver.driverName}`),
                new slack_block_models_1.MarkdownText(`*Driver Contact*:\n ${trip.driver.driverPhoneNo}`),
                new slack_block_models_1.MarkdownText(`*Vehicle*:\n ${trip.cab.regNumber}`),
                new slack_block_models_1.MarkdownText(`*Vehicle model*:\n ${trip.cab.model}`),
                new slack_block_models_1.MarkdownText(`*Distance*:\n ${trip.distance}`),
                new slack_block_models_1.MarkdownText(`*Trip Completion Date*:\n ${dateHelpers_1.getSlackDateString(trip.updatedAt)}`)
            ];
            return fields;
        });
    }
    static getOpsProviderTripsFields(providers) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = providers.map((provider) => {
                const providerBlock = new slack_block_models_1.SectionBlock();
                const providerInfo = [
                    new slack_block_models_1.MarkdownText(`*Provider*: ${provider.name}\n`),
                    new slack_block_models_1.MarkdownText(`*Trips*: ${provider.trips}\n`),
                    new slack_block_models_1.MarkdownText(`*Percentage*: ${provider.percantage}%\n`)
                ];
                providerBlock.addFields(providerInfo);
                return providerBlock;
            });
            return fields;
        });
    }
}
exports.default = NotificationsResponse;
//# sourceMappingURL=NotificationsResponse.js.map