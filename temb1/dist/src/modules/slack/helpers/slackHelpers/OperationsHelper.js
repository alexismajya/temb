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
const route_request_service_1 = __importDefault(require("../../../routes/route-request.service"));
const cab_service_1 = require("../../../cabs/cab.service");
const index_1 = __importDefault(require("../../SlackPrompts/notifications/OperationsRouteRequest/index"));
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const helper_1 = __importDefault(require("../../SlackPrompts/notifications/ProviderNotifications/helper"));
const ProviderNotifications_1 = __importDefault(require("../../SlackPrompts/notifications/ProviderNotifications"));
const RouteNotifications_1 = __importDefault(require("../../SlackPrompts/notifications/RouteNotifications"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
class OperationsHelper {
    static completeRouteApproval(updatedRequest, result, { channelId, opsSlackId, timeStamp, submission, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagement: { fellow: { id: userId } } } = updatedRequest;
            const updateUserInfo = user_service_1.default.updateUser(userId, { routeBatchId: result.batch.id });
            const providerNotification = ProviderNotifications_1.default.sendRouteApprovalNotification(result.batch, submission.providerId, botToken);
            const opsNotification = index_1.default.completeOperationsApprovedAction(updatedRequest, channelId, timeStamp, opsSlackId, botToken, submission);
            const managerNotification = RouteNotifications_1.default.sendRouteApproveMessageToManager(updatedRequest, botToken, submission);
            const userNotification = RouteNotifications_1.default.sendRouteApproveMessageToFellow(updatedRequest, botToken, submission);
            return Promise.all([providerNotification, opsNotification, managerNotification, userNotification, updateUserInfo]);
        });
    }
    static getCabSubmissionDetails(data, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            let regNumber;
            let routeCapacity;
            if (data.callback_id === 'operations_reason_dialog_route') {
                const { driverName, driverPhoneNo, regNumber: rgNum, capacity, model } = submission;
                yield cab_service_1.cabService.findOrCreateCab(driverName, driverPhoneNo, rgNum, capacity, model);
                regNumber = rgNum;
                routeCapacity = capacity;
            }
            else {
                const [, , regNo] = submission.cab.split(',');
                regNumber = regNo;
                routeCapacity = yield route_request_service_1.default.getCabCapacity(regNumber);
            }
            return {
                regNumber,
                routeCapacity
            };
        });
    }
    static sendCompleteOpAssignCabMsg(teamId, ids, tripInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requesterSlackId, riderSlackId } = ids;
            yield Notifications_1.default.sendManagerConfirmOrDeclineNotification(teamId, requesterSlackId, tripInformation, false);
            yield Notifications_1.default.sendUserConfirmOrDeclineNotification(teamId, riderSlackId, tripInformation, false);
        });
    }
    static getTripDetailsAttachment(tripInformation, driverDetails) {
        const approve = [
            new SlackMessageModels_1.SlackAttachmentField('', `:white_check_mark: <@${tripInformation.confirmer.slackId}>`
                + 'approved this *request*')
        ];
        const tripDetailsAttachment = new SlackMessageModels_1.SlackAttachment('Trip request complete');
        tripDetailsAttachment.addOptionalProps('', '', '#3c58d7');
        tripDetailsAttachment.addFieldsOrActions('fields', helper_1.default.providerFields(tripInformation, driverDetails));
        tripDetailsAttachment.addFieldsOrActions('fields', approve);
        return tripDetailsAttachment;
    }
    static getUpdateTripStatusPayload(tripId, confirmationComment, opsUserId, timeStamp, cabId, driverId, providerId) {
        return {
            tripStatus: 'Confirmed',
            tripId,
            operationsComment: confirmationComment,
            confirmedById: opsUserId,
            approvalDate: timeStamp,
            cabId,
            driverId,
            providerId
        };
    }
}
exports.default = OperationsHelper;
//# sourceMappingURL=OperationsHelper.js.map