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
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const dateHelpers_1 = require("../dateHelpers");
class ViewTripHelper {
    static displayTripRequest(requestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripRequest = yield trip_service_1.default.getById(requestId, true);
                const { riderId } = tripRequest;
                const { slackId } = yield user_service_1.default.getUserById(riderId);
                const message = ViewTripHelper.tripAttachment(tripRequest, userId, slackId);
                return message;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return new SlackMessageModels_1.SlackInteractiveMessage('Request unsuccessful.:cry:');
            }
        });
    }
    static tripAttachmentFields(tripRequest, passSlackId, slackId) {
        const { noOfPassengers, reason, tripStatus, origin, destination, departureTime, tripType, createdAt, tripNote, distance } = tripRequest;
        const [createdString, departureString] = [
            dateHelpers_1.getSlackDateString(createdAt), dateHelpers_1.getSlackDateString(departureTime)
        ];
        const { address: pickUpLocation } = origin;
        const { address: destinationAddress } = destination;
        const fromField = new SlackMessageModels_1.SlackAttachmentField('*Pickup Location*', pickUpLocation, true);
        const toField = new SlackMessageModels_1.SlackAttachmentField('*Destination*', destinationAddress, true);
        const passengerField = new SlackMessageModels_1.SlackAttachmentField('*Passenger*', `<@${passSlackId}>`, true);
        const requestedByField = new SlackMessageModels_1.SlackAttachmentField('*Requested By*', `<@${slackId}>`, true);
        const statusField = new SlackMessageModels_1.SlackAttachmentField('*Trip Status*', tripStatus, true);
        const distanceField = (typeof distance === 'string' && distance !== 'unknown')
            && new SlackMessageModels_1.SlackAttachmentField('*Distance*', distance, true);
        const noOfPassengersField = new SlackMessageModels_1.SlackAttachmentField('*No Of Passengers*', noOfPassengers, true);
        const reasonField = new SlackMessageModels_1.SlackAttachmentField('*Reason*', reason, true);
        const requestDateField = new SlackMessageModels_1.SlackAttachmentField('*Request Date*', createdString, true);
        const departureField = new SlackMessageModels_1.SlackAttachmentField('*Trip Date*', departureString, true);
        const tripTypeField = new SlackMessageModels_1.SlackAttachmentField('*Trip Type*', tripType, true);
        const tripNoteField = new SlackMessageModels_1.SlackAttachmentField('*Trip Notes*', tripNote, true);
        const fields = [fromField, toField, requestedByField, passengerField, noOfPassengersField,
            reasonField, requestDateField, departureField, distanceField, statusField, tripTypeField];
        if (tripNote)
            fields.push(tripNoteField);
        return fields;
    }
    static tripAttachment(tripRequest, SlackId, passSlackId, timezone) {
        const { id } = tripRequest;
        const attachment = new SlackMessageModels_1.SlackAttachment('Trip Information');
        const done = new SlackMessageModels_1.SlackButtonAction('done', 'Done', id);
        const attachmentFields = ViewTripHelper.tripAttachmentFields(tripRequest, passSlackId, SlackId, timezone);
        attachment.addFieldsOrActions('fields', attachmentFields);
        attachment.addFieldsOrActions('actions', [done]);
        attachment.addOptionalProps('view_new_trip', 'Trip Information', '#3359DF');
        const greeting = `Hey, <@${SlackId}> below are your trip request details :smiley:`;
        const message = new SlackMessageModels_1.SlackInteractiveMessage(greeting, [attachment]);
        return message;
    }
}
exports.default = ViewTripHelper;
//# sourceMappingURL=ViewTripHelper.js.map