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
const ManagerController_1 = __importDefault(require("../ManagerController"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const ManagerRouteRequest_1 = __importDefault(require("../../SlackPrompts/notifications/ManagerRouteRequest"));
const route_request_service_1 = __importDefault(require("../../../routes/route-request.service"));
const __mocks__1 = require("../../../../services/__mocks__");
const DialogPrompts_1 = __importDefault(require("../../SlackPrompts/DialogPrompts"));
const managerFormValidator_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator/managerFormValidator"));
const slackEvents_1 = require("../../events/slackEvents");
const SlackDialogModels_1 = require("../../SlackModels/SlackDialogModels");
const InteractivePrompts_1 = __importDefault(require("../../SlackPrompts/InteractivePrompts"));
const engagement_service_1 = require("../../../engagements/engagement.service");
const cache_1 = __importDefault(require("../../../shared/cache"));
const RouteHelper_1 = __importDefault(require("../../../../helpers/RouteHelper"));
describe('Manager Route controller', () => {
    const dummyFunction = () => ({});
    let respond;
    beforeEach(() => {
        respond = jest.fn();
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
            .mockReturnValue('token');
        const engagementData = ['12/01/2018', '12/12/2022', 'Safaricom'];
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(engagementData);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('manager actions', () => {
        let payload;
        let getRouteRequest;
        let completeManagerAction;
        let updateRouteRequest;
        let routeRequestId;
        let timeStamp;
        let channelId;
        let approve;
        beforeEach(() => {
            getRouteRequest = jest.spyOn(route_request_service_1.default, 'getRouteRequest');
            updateRouteRequest = jest.spyOn(RouteHelper_1.default, 'updateRouteRequest');
            completeManagerAction = jest.spyOn(ManagerRouteRequest_1.default, 'completeManagerAction');
            payload = {
                submission: {
                    declineReason: 'QQQQQQ', startDate: '31/01/2019', endDate: '20/02/2019'
                },
                actions: [{ name: 'action', value: 'routeRequestId' }],
                channel: { id: 1 },
                team: { id: 1 },
                user: { id: 1 },
                original_message: { ts: 'timestamp' }
            };
            ({ channel: { id: channelId }, original_message: { ts: timeStamp } } = payload);
            ({ id: routeRequestId } = __mocks__1.mockRouteRequestData);
            approve = {
                timeStamp, channelId, routeRequestId
            };
        });
        describe('decline', () => {
            beforeEach(() => {
                payload = Object.assign(Object.assign({}, payload), { callback_id: 'manager_route_decline' });
                jest.spyOn(DialogPrompts_1.default, 'sendReasonDialog')
                    .mockImplementation(() => ({}));
            });
            it('should launch decline dialog prompt', () => __awaiter(void 0, void 0, void 0, function* () {
                getRouteRequest.mockReturnValue(__mocks__1.mockRouteRequestData);
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(DialogPrompts_1.default.sendReasonDialog).toHaveBeenCalledTimes(1);
            }));
            it('should not launch decline dialog prompt, request has been approved or declined', () => __awaiter(void 0, void 0, void 0, function* () {
                completeManagerAction.mockReturnValue('token');
                const validateStatus = jest.spyOn(managerFormValidator_1.default, 'validateStatus');
                getRouteRequest.mockReturnValueOnce(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' }));
                getRouteRequest.mockReturnValueOnce(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' }));
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(validateStatus).toHaveBeenCalledWith(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' }), 'pending');
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(validateStatus).toHaveBeenCalledWith(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' }), 'pending');
                expect(completeManagerAction).toHaveBeenCalledTimes(2);
            }));
        });
        describe('approve', () => {
            beforeEach(() => {
                payload = {
                    submission: {
                        declineReason: 'QQQQQQ',
                        startDate: '31/01/2019',
                        endDate: '20/02/2019'
                    },
                    actions: [{ name: 'action', value: 'routeRequestId' }],
                    channel: { id: 1 },
                    team: { id: 1 },
                    user: { id: 1 },
                    original_message: { ts: 'timestamp' },
                    callback_id: 'manager_route_approve'
                };
                jest.spyOn(DialogPrompts_1.default, 'sendReasonDialog')
                    .mockImplementation(() => ({}));
            });
            it('should launch engagement information dialog', () => __awaiter(void 0, void 0, void 0, function* () {
                getRouteRequest.mockReturnValue(__mocks__1.mockRouteRequestData);
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(DialogPrompts_1.default.sendReasonDialog).toHaveBeenCalledTimes(1);
            }));
            it('should not launch decline dialog prompt, request has been approved or declined', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                    .mockReturnValue('token');
                completeManagerAction.mockReturnValue('token');
                const validateStatus = jest.spyOn(managerFormValidator_1.default, 'validateStatus');
                getRouteRequest.mockReturnValueOnce(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' }));
                getRouteRequest.mockReturnValueOnce(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' }));
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(validateStatus).toHaveBeenCalledWith(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' }), 'pending');
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(validateStatus).toHaveBeenCalledWith(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' }), 'pending');
                expect(completeManagerAction).toHaveBeenCalledTimes(2);
            }));
        });
        describe('manager declined request', () => {
            beforeEach(() => {
                payload = Object.assign(Object.assign({}, payload), { callback_id: 'manager_route_declinedRequest' });
                const fn = () => ({});
                const state = JSON.stringify({
                    decline: {
                        timeStamp, channelId, routeRequestId
                    }
                });
                payload = Object.assign(Object.assign({}, payload), { state });
                updateRouteRequest.mockReturnValue(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' }));
                completeManagerAction.mockReturnValue('token');
                jest.spyOn(slackEvents_1.SlackEvents, 'raise')
                    .mockImplementation(fn);
                jest.spyOn(DialogPrompts_1.default, 'sendEngagementInfoDialogToManager')
                    .mockImplementation(fn);
                getRouteRequest.mockReturnValue(__mocks__1.mockRouteRequestData);
            });
            it('should send fellow a decline notification and update managers notification message', () => __awaiter(void 0, void 0, void 0, function* () {
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(slackEvents_1.SlackEvents.raise).toHaveBeenCalled();
                expect(ManagerRouteRequest_1.default.completeManagerAction).toHaveBeenCalled();
                expect(updateRouteRequest).toHaveBeenCalled();
                const mockedCalls = updateRouteRequest.mock.calls;
                expect(mockedCalls[0][0]).toEqual(__mocks__1.mockRouteRequestData.id);
                expect(mockedCalls[0][1].status).toEqual('Declined');
                expect(mockedCalls[0][1].managerComment)
                    .toEqual(payload.submission.declineReason);
            }));
            it('should return slack dialog error when invalid reason is provided', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: { declineReason: '                   ' } });
                const result = yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(result.errors[0]).toBeInstanceOf(SlackDialogModels_1.SlackDialogError);
                expect(updateRouteRequest).not.toHaveBeenCalled();
            }));
        });
        describe('preview approval', () => {
            beforeEach(() => {
                payload = Object.assign(Object.assign({}, payload), { callback_id: 'manager_route_approvedRequestPreview' });
                const state = JSON.stringify({
                    approve
                });
                payload = Object.assign(Object.assign({}, payload), { state });
                jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockImplementation(dummyFunction);
                getRouteRequest.mockReturnValue(__mocks__1.mockRouteRequestData);
            });
            it('should display a preview of the approval', () => __awaiter(void 0, void 0, void 0, function* () {
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
            }));
        });
        describe('submit manager approval', () => {
            it('should raise an event to send ops and fellow notification', () => __awaiter(void 0, void 0, void 0, function* () {
                updateRouteRequest.mockReturnValue(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' }));
                completeManagerAction.mockReturnValue('token');
                getRouteRequest.mockReturnValue(__mocks__1.mockRouteRequestData);
                jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockImplementation(dummyFunction);
                jest.spyOn(engagement_service_1.engagementService, 'updateEngagement').mockImplementation(dummyFunction);
                const value = JSON.stringify(Object.assign({ approve }, payload.submission));
                payload = Object.assign(Object.assign({}, payload), { actions: [{ value, name: 'approvedRequestSubmit' }], callback_id: 'manager_route_btnActions' });
                yield ManagerController_1.default.handleManagerActions(payload, respond);
                expect(slackEvents_1.SlackEvents.raise).toHaveBeenCalled();
            }));
        });
        describe('initial notification', () => {
            it('should display initial notification to manager', () => __awaiter(void 0, void 0, void 0, function* () {
                const value = JSON.stringify({
                    data: {
                        timeStamp, channelId, routeRequestId
                    },
                });
                payload = Object.assign(Object.assign({}, payload), { actions: [{ value, name: 'initialNotification' }], callback_id: 'manager_route_btnActions' });
                getRouteRequest.mockReturnValue(__mocks__1.mockRouteRequestData);
                jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockReturnValue();
                yield ManagerController_1.default.handleManagerActions(payload, respond);
            }));
        });
    });
    describe('handle manager actions', () => {
        let mockHandler;
        let payload;
        beforeEach(() => {
            payload = { actions: [{ name: 'action' }], callback_id: 'dummy_callback_btnActions' };
            mockHandler = jest.fn().mockReturnValue({ test: 'dummy test' });
            jest.spyOn(ManagerController_1.default, 'managerRouteController')
                .mockImplementation(() => mockHandler);
        });
        it('should properly handle route actions', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = Object.assign(Object.assign({}, payload), { callback_id: 'dummy_callback_id' });
            const result = yield ManagerController_1.default.handleManagerActions(payload, respond);
            expect(ManagerController_1.default.managerRouteController).toHaveBeenCalledWith('id');
            expect(mockHandler).toHaveBeenCalledWith(payload, respond);
            expect(result).toEqual({ test: 'dummy test' });
        }));
        it('should properly slack button actions', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ManagerController_1.default.handleManagerActions(payload, respond);
            expect(ManagerController_1.default.managerRouteController).toHaveBeenCalledWith('action');
            expect(mockHandler).toHaveBeenCalledWith(payload, respond);
            expect(result).toEqual({ test: 'dummy test' });
        }));
        it('should properly handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = Object.assign(Object.assign({}, payload), { callback_id: null });
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield ManagerController_1.default.handleManagerActions(payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledTimes(1);
            expect(respond).toHaveBeenCalledTimes(1);
        }));
    });
    describe('manager route controller', () => {
        it('should return a function if action exist', () => {
            const result = ManagerController_1.default.managerRouteController('approve');
            expect(result).toBeInstanceOf(Function);
        });
        it('should throw an error if action does exist', () => {
            try {
                ManagerController_1.default.managerRouteController('doesNotExist')();
            }
            catch (e) {
                expect(e).toBeInstanceOf(Error);
                expect(e.message).toBe('Unknown action: manager_route_doesNotExist');
            }
        });
    });
});
//# sourceMappingURL=ManagerController.spec.js.map