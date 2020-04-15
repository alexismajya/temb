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
const Notifications_1 = __importDefault(require("../../Notifications"));
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const helper_1 = __importDefault(require("../ManagerRouteRequest/helper"));
const helper_2 = __importDefault(require("./helper"));
const InteractivePrompts_1 = __importDefault(require("../../InteractivePrompts"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
class OperationsNotifications {
    static sendOpsDeclineMessageToFellow(routeRequest, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { engagement: { fellow } } = routeRequest;
                const fellowChannelID = yield Notifications_1.default.getDMChannelId(fellow.slackId, botToken);
                const fellowMessage = yield helper_2.default.getOperationDeclineAttachment(routeRequest, fellowChannelID, 'fellow');
                Notifications_1.default.sendNotification(fellowMessage, botToken);
                return;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendOpsDeclineMessageToManager(routeRequest, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { manager: { slackId } } = routeRequest;
                const managerChannelID = yield Notifications_1.default.getDMChannelId(slackId, botToken);
                const managerMessage = yield helper_2.default.getOperationDeclineAttachment(routeRequest, managerChannelID);
                yield Notifications_1.default.sendNotification(managerMessage, botToken);
                return;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static completeOperationsApprovedAction(routeRequest, channel, timestamp, opsSlackId, botToken, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cache_1.default.delete(`RouteRequestTimeStamp_${routeRequest.id}`);
            const { engagement: { fellow } } = routeRequest;
            const title = 'Route Request Approved';
            const message = ':white_check_mark: This route request has been approved';
            const attachments = yield helper_2.default.getOperationCompleteAttachment(message, title, routeRequest, submission);
            yield InteractivePrompts_1.default.messageUpdate(channel, `<@${opsSlackId}> has just approved <@${fellow.slackId}>'s route request`, timestamp, attachments, botToken);
        });
    }
    static completeOperationsDeclineAction(routeRequest, botToken, channel, timestamp, opsSlackId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield cache_1.default.delete(`RouteRequestTimeStamp_${routeRequest.id}`);
                const title = 'Route Request Declined';
                const message = `:x: <@${opsSlackId}> has declined this route request`;
                const attachments = yield helper_1.default.getManagerCompleteAttachment(message, title, routeRequest, '#ff0000');
                if (!update) {
                    yield OperationsNotifications
                        .sendOpsDeclineMessageToFellow(routeRequest, botToken);
                }
                const opsDeclineNotification = InteractivePrompts_1.default.messageUpdate(channel, '', timestamp, attachments, botToken);
                const managerDeclineNotification = OperationsNotifications.sendOpsDeclineMessageToManager(routeRequest, botToken);
                return Promise.all([opsDeclineNotification, managerDeclineNotification]);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static updateOpsStatusNotificationMessage(payload, routeRequest, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel, message_ts: timeStamp } = payload;
            if (routeRequest.status === 'Approved') {
                const opsNotify = yield OperationsNotifications
                    .completeOperationsApprovedAction(routeRequest, channel.id, timeStamp, routeRequest.opsReviewer.slackId, botToken, {}, true);
                return opsNotify;
            }
            if (routeRequest.status === 'Declined') {
                return OperationsNotifications
                    .completeOperationsDeclineAction(routeRequest, botToken, channel.id, timeStamp, payload, true);
            }
        });
    }
}
exports.default = OperationsNotifications;
//# sourceMappingURL=index.js.map