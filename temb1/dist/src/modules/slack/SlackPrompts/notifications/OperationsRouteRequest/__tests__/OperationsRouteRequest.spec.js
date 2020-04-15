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
const Notifications_1 = __importDefault(require("../../../Notifications"));
const __mocks__1 = require("../../../../../../services/__mocks__");
const InteractivePrompts_1 = __importDefault(require("../../../InteractivePrompts"));
const bugsnagHelper_1 = __importDefault(require("../../../../../../helpers/bugsnagHelper"));
const helper_1 = __importDefault(require("../helper"));
const cache_1 = __importDefault(require("../../../../../shared/cache"));
const helper_2 = __importDefault(require("../../ManagerRouteRequest/helper"));
const index_1 = __importDefault(require("../index"));
describe('OperationsNotifications', () => {
    beforeEach(() => {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(['12/01/2019', '12/12/2022', 'Safaricom']);
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue({});
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue({});
        jest.spyOn(Notifications_1.default, 'sendNotification').mockReturnValue({});
        jest.spyOn(bugsnagHelper_1.default, 'log');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('OperationsNotifications', () => {
        let dmSpy;
        let requestData;
        beforeEach(() => {
            dmSpy = jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('WESRTE');
            jest.spyOn(helper_1.default, 'getOperationDeclineAttachment');
            jest.spyOn(helper_1.default, 'getOperationCompleteAttachment');
            jest.spyOn(helper_2.default, 'getManagerCompleteAttachment');
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
            jest.spyOn(bugsnagHelper_1.default, 'log');
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        describe('sendOpsDeclineMessageToFellow', () => {
            const botToken = 'xxop-asdaw';
            it('should send ops decline notification to fellow', (done) => __awaiter(void 0, void 0, void 0, function* () {
                yield index_1.default.sendOpsDeclineMessageToFellow(__mocks__1.mockRouteRequestData, botToken);
                expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
                expect(helper_1.default.getOperationDeclineAttachment).toHaveBeenCalledTimes(1);
                expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
                done();
            }));
            it('should catch errors', (done) => __awaiter(void 0, void 0, void 0, function* () {
                dmSpy.mockRejectedValue(new Error('Channel not found'));
                yield index_1.default.sendOpsDeclineMessageToFellow([]);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
                done();
            }));
        });
        describe('completeOperationsActions', () => {
            const channelId = 'channelId';
            const timestamp = 'timestamp';
            const botToken = 'botToken';
            const opsSlackId = 'SADASDS';
            requestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined', opsComment: 'no route' });
            beforeEach(() => {
                jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue();
                jest.spyOn(index_1.default, 'sendOpsDeclineMessageToFellow').mockResolvedValue({});
            });
            afterEach(() => {
                jest.resetAllMocks();
            });
            it('should complete the decline new route action', () => __awaiter(void 0, void 0, void 0, function* () {
                yield index_1.default.completeOperationsDeclineAction(requestData, botToken, channelId, timestamp, opsSlackId, true);
                expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
                expect(index_1.default.sendOpsDeclineMessageToFellow).not.toHaveBeenCalled();
                expect(helper_2.default.getManagerCompleteAttachment).toHaveBeenCalled();
            }));
            it('should send decline notification to user if any update is made', () => __awaiter(void 0, void 0, void 0, function* () {
                yield index_1.default.completeOperationsDeclineAction(requestData, botToken, channelId, timestamp, opsSlackId, false);
                expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
                expect(index_1.default.sendOpsDeclineMessageToFellow).toHaveBeenCalled();
            }));
            it('should complete approve new route action', () => __awaiter(void 0, void 0, void 0, function* () {
                requestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved', opsComment: 'okay' });
                const submission = { routeName: 'the dojo', takeOff: '10:00' };
                yield index_1.default.completeOperationsApprovedAction(requestData, channelId, timestamp, 1, botToken, submission, false);
                expect(helper_1.default.getOperationCompleteAttachment).toHaveBeenCalled();
            }));
            it('should send ops update approve notification', () => __awaiter(void 0, void 0, void 0, function* () {
                requestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved', opsComment: 'okay', opsReviewer: { slackId: 'abc123' } });
                const payload = {
                    channel: channelId,
                    team: 1,
                    message_ts: timestamp,
                    actions: []
                };
                jest.spyOn(index_1.default, 'completeOperationsApprovedAction');
                yield index_1.default
                    .updateOpsStatusNotificationMessage(payload, requestData, botToken);
                expect(index_1.default.completeOperationsApprovedAction).toHaveBeenCalled();
            }));
            it('should send ops update decline notification', () => __awaiter(void 0, void 0, void 0, function* () {
                requestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined', opsComment: 'not okay', opsReviewer: { slackId: 'abc123' } });
                const payload = {
                    channel: channelId,
                    team: 1,
                    message_ts: timestamp,
                    actions: [{ action: 'random action' }]
                };
                jest.spyOn(index_1.default, 'completeOperationsDeclineAction');
                yield index_1.default
                    .updateOpsStatusNotificationMessage(payload, requestData, botToken);
                expect(index_1.default.completeOperationsDeclineAction).toHaveBeenCalled();
            }));
            it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
                yield index_1.default.completeOperationsDeclineAction();
                jest.spyOn(bugsnagHelper_1.default, 'log');
                expect(bugsnagHelper_1.default.log).toHaveBeenCalledTimes(1);
            }));
        });
    });
});
//# sourceMappingURL=OperationsRouteRequest.spec.js.map