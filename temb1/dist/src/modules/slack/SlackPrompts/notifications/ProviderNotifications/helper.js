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
const AttachmentHelper_1 = __importDefault(require("../AttachmentHelper"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const Notifications_1 = __importDefault(require("../../Notifications"));
const dateHelpers_1 = require("../../../helpers/dateHelpers");
const helper_1 = __importDefault(require("../OperationsRouteRequest/helper"));
class ProviderAttachmentHelper {
    static createProviderRouteAttachment(routeRequest, channelID, submission) {
        const { status } = routeRequest;
        const data = AttachmentHelper_1.default.getStatusLabels(status, 'Confirmed');
        if (!data)
            return;
        const { title, color } = data;
        const attachment = new SlackMessageModels_1.SlackAttachment(title);
        const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
        const routeInformation = ProviderAttachmentHelper.routeInfoAttachment(submission);
        const { id: routeRequestId } = routeRequest;
        const routeInfo = JSON.stringify(submission);
        routeInformation.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('Accept', 'Accept', `accept_request_${routeRequestId}_${routeInfo}`)
        ]);
        const attachments = [
            attachment, routeAttachment, routeInformation
        ];
        attachments.filter((item) => !!item).forEach((at) => at.addOptionalProps('providers_route_approval', '/fallback', color));
        return Notifications_1.default.createDirectMessage(channelID, 'Hi :smiley:, you have received a route request, please assign a cab and a driver', attachments);
    }
    static routeInfoAttachment(submission) {
        const { routeName: name, takeOffTime } = submission;
        const time = moment_1.default(takeOffTime, 'HH:mm').format('LT');
        const attachments = new SlackMessageModels_1.SlackAttachment('');
        const fields = [
            new SlackMessageModels_1.SlackAttachmentField('Route Name', name, true),
            new SlackMessageModels_1.SlackAttachmentField('Take-off Time', time, true),
        ];
        attachments.addFieldsOrActions('fields', fields);
        return attachments;
    }
    static providerFields(tripInformation) {
        const { noOfPassengers, origin: { address: pickup }, destination: { address: destination }, rider: { name: passenger, phoneNo }, createdAt, departureTime, cab: { regNumber, model }, driver: { driverName, driverPhoneNo } } = tripInformation;
        return [
            new SlackMessageModels_1.SlackAttachmentField('Pickup Location', pickup, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination, true),
            new SlackMessageModels_1.SlackAttachmentField('Request Date', dateHelpers_1.getSlackDateString(createdAt), true),
            new SlackMessageModels_1.SlackAttachmentField('Trip Date', dateHelpers_1.getSlackDateString(departureTime), true),
            new SlackMessageModels_1.SlackAttachmentField('Passenger', passenger, true),
            new SlackMessageModels_1.SlackAttachmentField('Passenger Contact', phoneNo || 'N/A', true),
            new SlackMessageModels_1.SlackAttachmentField('Number of Riders', noOfPassengers, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver Name', driverName, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver Contact', driverPhoneNo, true),
            new SlackMessageModels_1.SlackAttachmentField('Vehicle Model', model, true),
            new SlackMessageModels_1.SlackAttachmentField('Vehicle Number', regNumber, true)
        ];
    }
    static providerRouteFields(routeInformation) {
        const { route: { name, destination: { address } }, batch, takeOff, } = routeInformation;
        return [
            new SlackMessageModels_1.SlackAttachmentField('*_`Route Information`_*', null, false),
            new SlackMessageModels_1.SlackAttachmentField('Route Name', name, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', address, true),
            new SlackMessageModels_1.SlackAttachmentField('Route Batch', batch, true),
            new SlackMessageModels_1.SlackAttachmentField('Take Off Time', takeOff, true),
        ];
    }
    static driverFields(driverInformation) {
        if (!driverInformation) {
            return [new SlackMessageModels_1.SlackAttachmentField('*`No Driver assigned`*', null, false)];
        }
        const { driverName, driverPhoneNo } = driverInformation;
        return [
            new SlackMessageModels_1.SlackAttachmentField('*_`Driver Information`_*', null, false),
            new SlackMessageModels_1.SlackAttachmentField('DriverName', driverName, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver Contact', driverPhoneNo, true),
        ];
    }
    static getManagerApproveAttachment(routeRequest, channelID, managerStatus, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagement: { fellow }, manager, status } = routeRequest;
            const data = AttachmentHelper_1.default.getStatusLabels(status, 'Approved');
            if (!data)
                return;
            const { action, emoji, title, color } = data;
            const attachment = new SlackMessageModels_1.SlackAttachment(title);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const routeInformation = helper_1.default.opsRouteInformation(submission);
            const attachments = [
                attachment, routeAttachment, engagementAttachment, routeInformation
            ];
            attachments
                .filter((item) => !!item)
                .forEach((at) => at.addOptionalProps('', '/fallback', color));
            const greeting = managerStatus ? `Hi, <@${manager.slackId}>` : 'Hi there';
            return Notifications_1.default.createDirectMessage(channelID, `${greeting}, the route request you confirmed for
      <@${fellow.slackId}> has been ${action} ${emoji}`, attachments);
        });
    }
    static getFellowApproveAttachment(routeRequest, channelID, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagement: { fellow }, status } = routeRequest;
            const data = AttachmentHelper_1.default.getStatusLabels(status, 'Approved');
            if (!data)
                return;
            const { action, emoji, title, color } = data;
            const attachment = new SlackMessageModels_1.SlackAttachment(title);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const engagementAttachment = yield AttachmentHelper_1.default.engagementAttachment(routeRequest);
            const routeInformation = helper_1.default.opsRouteInformation(submission);
            const attachments = [
                attachment, routeAttachment, engagementAttachment, routeInformation
            ];
            attachments
                .filter((item) => !!item)
                .forEach((at) => at.addOptionalProps('', '/fallback', color));
            const greeting = `Hi, <@${fellow.slackId}>`;
            return Notifications_1.default.createDirectMessage(channelID, `${greeting}, the operations team ${action} your request ${emoji}. You have also been added to the Route you requested and it is awaiting provider action.`, attachments);
        });
    }
    static getProviderCompleteAttachment(message, title, routeRequest, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const footer = new SlackMessageModels_1.SlackAttachment(message);
            const header = new SlackMessageModels_1.SlackAttachment(title);
            const routeAttachment = AttachmentHelper_1.default.routeRequestAttachment(routeRequest);
            const routeInformation = ProviderAttachmentHelper.providerRouteInformation(submission);
            const attachments = [header, routeAttachment, routeInformation, footer];
            attachments.forEach((at) => at.addOptionalProps('', '/fallback', '#3AAF85'));
            return attachments;
        });
    }
    static providerRouteInformation(submission) {
        const { regNumber: registration, driverName, driverPhoneNumber, routeName, routeCapacity: capacity, takeOffTime, } = submission;
        const time = moment_1.default(takeOffTime, 'HH:mm').format('LT');
        const attachments = new SlackMessageModels_1.SlackAttachment('');
        const fields = [
            new SlackMessageModels_1.SlackAttachmentField('Driver Name', driverName, true),
            new SlackMessageModels_1.SlackAttachmentField('Driver Phone Number', driverPhoneNumber, true),
            new SlackMessageModels_1.SlackAttachmentField('Route Name', routeName, true),
            new SlackMessageModels_1.SlackAttachmentField('Route Capacity', capacity, true),
            new SlackMessageModels_1.SlackAttachmentField('*`Take-off Time`*', time, true),
            new SlackMessageModels_1.SlackAttachmentField('Cab Registration Number', registration, true)
        ];
        attachments.addFieldsOrActions('fields', fields);
        return attachments;
    }
    static cabFields(cabInfo) {
        if (!cabInfo)
            return [new SlackMessageModels_1.SlackAttachmentField('*`No Cab assigned`*', null, false)];
        const { model, regNumber, capacity } = cabInfo;
        return [
            new SlackMessageModels_1.SlackAttachmentField('*_`Cab Information`_*', null, false),
            new SlackMessageModels_1.SlackAttachmentField('Model', model, true),
            new SlackMessageModels_1.SlackAttachmentField('Registration Number', regNumber, true),
            new SlackMessageModels_1.SlackAttachmentField('Capacity', capacity, true),
        ];
    }
}
exports.default = ProviderAttachmentHelper;
//# sourceMappingURL=helper.js.map