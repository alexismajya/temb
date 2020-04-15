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
const index_1 = __importDefault(require("../index"));
const teamDetails_service_1 = require("../../../../../teamDetails/teamDetails.service");
const route_request_service_1 = __importDefault(require("../../../../../routes/route-request.service"));
const __mocks__1 = require("../../../../../../services/__mocks__");
const Notifications_1 = __importDefault(require("../../../Notifications"));
const bugsnagHelper_1 = __importDefault(require("../../../../../../helpers/bugsnagHelper"));
const slackEvents_1 = require("../../../../events/slackEvents");
const InteractivePrompts_1 = __importDefault(require("../../../InteractivePrompts"));
const cache_1 = __importDefault(require("../../../../../shared/cache"));
const testErrorHandle = (fnHandle, ...args) => () => __awaiter(void 0, void 0, void 0, function* () {
    const sendNotification = jest.spyOn(Notifications_1.default, 'sendNotification');
    jest.spyOn(bugsnagHelper_1.default, 'log');
    sendNotification.mockImplementation(() => { throw new Error('Dummy error'); });
    yield fnHandle(...args);
    expect(bugsnagHelper_1.default.log.mock.calls[0][0].message).toEqual('Dummy error');
});
describe('Manager Route Request Notification Tests', () => {
    let respond;
    let routeRequestData;
    const data = { routeRequestId: __mocks__1.mockRouteRequestData.id, botToken: 'xoop-wwrew' };
    beforeEach(() => {
        const result = ['12/01/2019', '12/12/2020', 'Airtel'];
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(result);
        routeRequestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' });
        respond = jest.fn();
        jest.spyOn(Notifications_1.default, 'sendNotification')
            .mockResolvedValue();
        jest.spyOn(route_request_service_1.default, 'getRouteRequest')
            .mockResolvedValue(routeRequestData);
        jest.spyOn(route_request_service_1.default, 'getRouteRequestByPk')
            .mockResolvedValue(routeRequestData);
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
            .mockResolvedValue('token');
        jest.spyOn(Notifications_1.default, 'getDMChannelId')
            .mockResolvedValue('token');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('handleStatusValidationError', () => {
        it('handleStatusValidationError should complete manager action', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                channel: { id: 1 },
                team: { id: 1 },
                original_message: { ts: 'timestamp' }
            };
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                .mockReturnValue('token');
            const completeManagerAction = jest.spyOn(index_1.default, 'completeManagerAction')
                .mockReturnValue('token');
            yield index_1.default.handleStatusValidationError(payload, 'routeRequest');
            expect(completeManagerAction).toHaveBeenCalledTimes(1);
            expect(completeManagerAction).toHaveBeenCalledWith('routeRequest', 1, 'timestamp', 'token');
        }));
    });
    describe('send manager notification', () => {
        it('should send manager notification attachment', () => __awaiter(void 0, void 0, void 0, function* () {
            yield index_1.default.sendManagerNotification(respond, data);
            expect(respond).not.toHaveBeenCalled();
        }));
        it('should handle unexpected error', testErrorHandle(index_1.default.sendManagerNotification, jest.fn(), data));
    });
    describe('send manager decline notification', () => {
        it('should send manager decline attachment', () => __awaiter(void 0, void 0, void 0, function* () {
            routeRequestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' });
            yield index_1.default.sendManagerDeclineMessageToFellow(data);
            expect(respond).not.toHaveBeenCalled();
        }));
        it('should handle unexpected error', testErrorHandle(index_1.default.sendManagerDeclineMessageToFellow, data));
    });
    describe('send manager approval notification', () => {
        const payload = { team: { id: 1 } };
        it('should send notification attachment to ops and fellow ', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slackEvents_1.SlackEvents, 'raise')
                .mockResolvedValue();
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.sendManagerApproval(payload, respond, data);
            expect(slackEvents_1.SlackEvents.raise.mock.calls[0][0])
                .toEqual(slackEvents_1.slackEventNames.RECEIVE_NEW_ROUTE_REQUEST);
            expect(bugsnagHelper_1.default.log).not.toHaveBeenCalled();
        }));
        it('should handle unexpected error', testErrorHandle(index_1.default.sendManagerApproval, payload, respond, data));
    });
    describe('complete manager action', () => {
        const channelId = 'channelId';
        const timestamp = 'timestamp';
        const botToken = 'botToken';
        beforeEach(() => {
            jest.spyOn(InteractivePrompts_1.default, 'messageUpdate')
                .mockResolvedValue();
        });
        it('should complete decline action', () => __awaiter(void 0, void 0, void 0, function* () {
            routeRequestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' });
            yield index_1.default.completeManagerAction(routeRequestData, channelId, timestamp, botToken);
            expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
        }));
        it('should not complete decline/confirm action', () => __awaiter(void 0, void 0, void 0, function* () {
            routeRequestData = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved' });
            yield index_1.default.completeManagerAction(routeRequestData, channelId, timestamp, botToken);
            expect(InteractivePrompts_1.default.messageUpdate).not.toHaveBeenCalled();
        }));
        it('should complete confirm action', () => __awaiter(void 0, void 0, void 0, function* () {
            yield index_1.default.completeManagerAction(routeRequestData, channelId, timestamp, botToken);
            expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
        }));
        it('should handle unexpected error', () => __awaiter(void 0, void 0, void 0, function* () {
            InteractivePrompts_1.default.messageUpdate
                .mockRejectedValue(new Error('Dummy error'));
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.completeManagerAction(routeRequestData, channelId, timestamp, botToken);
            expect(bugsnagHelper_1.default.log.mock.calls[0][0].message).toEqual('Dummy error');
        }));
    });
});
//# sourceMappingURL=ManagerRouteRequest.spec.js.map