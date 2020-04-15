"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const dateHelpers_1 = require("../../dateHelpers");
exports.default = (tripDetails) => {
    const { rider, dateTime, tripType, pickup, destination, noOfPassengers, riderPhoneNo, travelTeamPhoneNo, departmentName, flightNumber, requester, tripNote } = tripDetails;
    const timeFieldName = `${tripType === 'Airport Transfer' ? 'Flight' : 'Appointment'} Time`;
    const travelDateTime = tripDetails.flightDateTime || tripDetails.embassyVisitDateTime;
    return [
        new SlackMessageModels_1.SlackAttachmentField('Passenger', `<@${rider}>`, true),
        new SlackMessageModels_1.SlackAttachmentField('Passenger\'s Phone Number', riderPhoneNo, true),
        new SlackMessageModels_1.SlackAttachmentField('Department', departmentName, true),
        new SlackMessageModels_1.SlackAttachmentField('Number of Passengers', noOfPassengers, true),
        new SlackMessageModels_1.SlackAttachmentField('Travel Team Phone Number', travelTeamPhoneNo, true),
        new SlackMessageModels_1.SlackAttachmentField('Requester (Travel)', requester, true),
        new SlackMessageModels_1.SlackAttachmentField('Pickup Location', pickup, true),
        new SlackMessageModels_1.SlackAttachmentField('Destination', destination, true),
        new SlackMessageModels_1.SlackAttachmentField('Pick-Up Time', dateHelpers_1.checkBeforeSlackDateString(dateTime), true),
        new SlackMessageModels_1.SlackAttachmentField(timeFieldName, dateHelpers_1.checkBeforeSlackDateString(travelDateTime), true),
        new SlackMessageModels_1.SlackAttachmentField('Trip Type', tripType, true),
        flightNumber ? new SlackMessageModels_1.SlackAttachmentField('Flight Number', flightNumber, true) : null,
        new SlackMessageModels_1.SlackAttachmentField('TripNotes', tripNote, true),
    ];
};
//# sourceMappingURL=previewTripDetailsAttachment.js.map