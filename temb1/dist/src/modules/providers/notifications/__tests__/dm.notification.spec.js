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
const dm_notification_1 = require("../dm.notification");
const mockInformation_1 = require("../__mocks__/mockInformation");
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
describe(dm_notification_1.DirectMessage, () => {
    const directMessage = new dm_notification_1.DirectMessage();
    describe(dm_notification_1.DirectMessage.prototype.notifyNewTripRequest, () => {
        it('should notify provider using direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('directMessageId');
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            yield directMessage.notifyNewTripRequest(mockInformation_1.mockProviderInformation, mockInformation_1.mockInformation.tripDetails, mockInformation_1.mockTeamDetailInformation);
            expect(Notifications_1.default.getDMChannelId).toBeCalled();
        }));
        it('should return error when there is server errors', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            const func = yield directMessage.notifyNewTripRequest(null, mockInformation_1.mockInformation.tripDetails, null);
            expect(func).toBeUndefined();
            expect(bugsnagHelper_1.default.log).toBeCalled();
        }));
    });
});
//# sourceMappingURL=dm.notification.spec.js.map