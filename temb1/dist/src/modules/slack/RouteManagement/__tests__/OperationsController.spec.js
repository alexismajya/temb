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
const DialogPrompts_1 = __importDefault(require("../../SlackPrompts/DialogPrompts"));
const route_request_service_1 = __importDefault(require("../../../routes/route-request.service"));
const OperationsController_1 = require("../OperationsController");
const __mocks__1 = require("../../../../services/__mocks__");
const SlackDialogModels_1 = require("../../SlackModels/SlackDialogModels");
const OperationsRouteRequest_1 = __importDefault(require("../../SlackPrompts/notifications/OperationsRouteRequest"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const managerFormValidator_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator/managerFormValidator"));
const route_service_1 = require("../../../routes/route.service");
const OperationsHelper_1 = __importDefault(require("../../helpers/slackHelpers/OperationsHelper"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const TripJobs_1 = __importDefault(require("../../../../services/jobScheduler/jobs/TripJobs"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const providersController_mock_1 = require("../__mocks__/providersController.mock");
const InteractivePrompts_1 = __importDefault(require("../../SlackPrompts/InteractivePrompts"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const RouteHelper_1 = __importDefault(require("../../../../helpers/RouteHelper"));
const routeMock_1 = require("../../../../helpers/__mocks__/routeMock");
const driver_notifications_1 = __importDefault(require("../../SlackPrompts/notifications/DriverNotifications/driver.notifications"));
const cab_service_1 = require("../../../cabs/cab.service");
const driver_service_1 = require("../../../drivers/driver.service");
const twilio_mocks_1 = require("../../../notifications/whatsapp/twilio.mocks");
twilio_mocks_1.mockWhatsappOptions();
describe('Operations Route Controller', () => {
    let respond;
    const fn = () => ({});
    beforeEach(() => {
        respond = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('operations actions', () => {
        let payload;
        let getRouteRequestAndToken;
        let completeOperationsApprovedAction;
        let updateRouteRequest;
        let routeRequestId;
        let timeStamp;
        let channelId;
        beforeEach(() => {
            getRouteRequestAndToken = jest.spyOn(route_request_service_1.default, 'getRouteRequestAndToken');
            updateRouteRequest = jest.spyOn(RouteHelper_1.default, 'updateRouteRequest');
            completeOperationsApprovedAction = jest.spyOn(OperationsRouteRequest_1.default, 'completeOperationsApprovedAction');
            payload = {
                submission: {
                    declineReason: 'QQQQQQ', startDate: '31/01/2019', endDate: '20/02/2019'
                },
                actions: [{ name: 'action', value: '1' }],
                channel: { id: 1 },
                team: { id: 'TEAMID1' },
                original_message: { ts: 'timestamp' },
                user: { id: '4' }
            };
            ({ channel: { id: channelId }, original_message: { ts: timeStamp } } = payload);
            ({ id: routeRequestId } = __mocks__1.mockRouteRequestData);
        });
        describe('approve', () => {
            beforeEach(() => {
                payload = Object.assign(Object.assign({}, payload), { callback_id: 'operations_route_approve' });
                jest.spyOn(DialogPrompts_1.default, 'sendOperationsNewRouteApprovalDialog')
                    .mockImplementation(fn);
                jest.spyOn(OperationsRouteRequest_1.default, 'updateOpsStatusNotificationMessage')
                    .mockImplementation();
            });
            it('should launch approve dialog prompt', () => __awaiter(void 0, void 0, void 0, function* () {
                const routeRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' });
                getRouteRequestAndToken.mockReturnValue({ botToken: 'botToken', routeRequest });
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(DialogPrompts_1.default.sendOperationsNewRouteApprovalDialog).toHaveBeenCalledTimes(1);
            }));
            it('should not launch approve dialog when request has been declined', () => __awaiter(void 0, void 0, void 0, function* () {
                const routeRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' });
                getRouteRequestAndToken.mockReturnValue({
                    slackBotOauthToken: 'botToken',
                    routeRequest
                });
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(DialogPrompts_1.default.sendOperationsNewRouteApprovalDialog)
                    .not
                    .toHaveBeenCalled();
                expect(OperationsRouteRequest_1.default.updateOpsStatusNotificationMessage)
                    .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
            }));
            it('should not launch approve dialog when request has been approved', () => __awaiter(void 0, void 0, void 0, function* () {
                const routeRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved' });
                getRouteRequestAndToken.mockReturnValue({
                    slackBotOauthToken: 'botToken',
                    routeRequest
                });
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(DialogPrompts_1.default.sendOperationsNewRouteApprovalDialog)
                    .not
                    .toHaveBeenCalled();
                expect(OperationsRouteRequest_1.default.updateOpsStatusNotificationMessage)
                    .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
            }));
        });
        describe('operations approve request', () => {
            beforeEach(() => {
                const state = JSON.stringify({
                    approve: {
                        timeStamp, channelId, routeRequestId
                    }
                });
                payload = Object.assign(Object.assign({}, payload), { submission: {
                        routeName: 'QQQQQQ', takeOffTime: '12:30', regNumber: 'JDD3883, SDSAS, DDDDD'
                    }, callback_id: 'operations_route_approvedRequest' });
                jest.spyOn(OperationsRouteRequest_1.default, 'completeOperationsApprovedAction')
                    .mockImplementation();
                jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ id: 1 });
                jest.spyOn(route_service_1.routeService, 'createRouteBatch').mockResolvedValue();
                jest.spyOn(route_service_1.routeService, 'addUserToRoute');
                payload = Object.assign(Object.assign({}, payload), { state });
            });
            it('should complete approve action if cab is selected from dropdown', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.spyOn(managerFormValidator_1.default, 'approveRequestFormValidation')
                    .mockReturnValue([]);
                jest.spyOn(RouteHelper_1.default, 'updateRouteRequest').mockReturnValue(routeMock_1.routeDetails);
                jest.spyOn(RouteHelper_1.default, 'createNewRouteBatchFromSlack').mockResolvedValue(routeMock_1.batch);
                jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue('xoop-asdad');
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(managerFormValidator_1.default.approveRequestFormValidation).toHaveBeenCalled();
                expect(RouteHelper_1.default.updateRouteRequest).toHaveBeenCalled();
            }));
            it('should not submit invalid user input', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: {
                        routeName: 'cele', takeOffTime: '1230'
                    }, callback_id: 'operations_route_approvedRequest' });
                getRouteRequestAndToken.mockResolvedValue({ routeRequest: Object.assign({}, __mocks__1.mockRouteRequestData), slackBotOauthToken: 'dfdf' });
                updateRouteRequest.mockResolvedValue(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved' }));
                completeOperationsApprovedAction.mockReturnValue('Token');
                const result = yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(result.errors[0]).toBeInstanceOf(SlackDialogModels_1.SlackDialogError);
                expect(RouteHelper_1.default.updateRouteRequest).not.toHaveBeenCalled();
                expect(OperationsRouteRequest_1.default.completeOperationsApprovedAction).not.toHaveBeenCalled();
            }));
            it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = {};
                payload.callback_id = 'operations_route_approvedRequest';
                jest.spyOn(managerFormValidator_1.default, 'approveRequestFormValidation').mockImplementation(() => { throw new Error(); });
                jest.spyOn(bugsnagHelper_1.default, 'log');
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
                expect(respond.mock.calls[0][0].text).toEqual('Unsuccessful request. Kindly Try again');
            }));
        });
        describe('operations route controller', () => {
            it('should return a function if action exist', () => {
                const result = OperationsController_1.OperationsHandler.operationsRouteController('approve');
                expect(result).toBeInstanceOf(Function);
            });
            it('should throw an error if action does exist', () => {
                try {
                    OperationsController_1.OperationsHandler.operationsRouteController('doesNotExist')();
                }
                catch (e) {
                    expect(e).toBeInstanceOf(Error);
                    expect(e.message).toBe('Unknown action: operations_route_doesNotExist');
                }
            });
        });
        describe('handle manager actions', () => {
            let mockHandler;
            let payload2;
            beforeEach(() => {
                payload2 = {
                    actions: [{ name: 'action', value: 1 }],
                    callback_id: 'dummy_callback_actions',
                    team: { id: 'TEAMID1' }
                };
                mockHandler = jest.fn().mockReturnValue({ test: 'dummy test' });
                jest.spyOn(OperationsController_1.OperationsHandler, 'operationsRouteController')
                    .mockImplementation(() => mockHandler);
            });
            it('should properly handle route actions', () => __awaiter(void 0, void 0, void 0, function* () {
                payload2 = Object.assign(Object.assign({}, payload2), { callback_id: 'dummy_callback_id' });
                const result = yield OperationsController_1.OperationsHandler.handleOperationsActions(payload2, respond);
                expect(OperationsController_1.OperationsHandler.operationsRouteController).toHaveBeenCalledWith('id');
                expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
                expect(result).toEqual({ test: 'dummy test' });
            }));
            it('should properly handle slack button actions', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield OperationsController_1.OperationsHandler.handleOperationsActions(payload2, respond);
                expect(OperationsController_1.OperationsHandler.operationsRouteController).toHaveBeenCalledWith('action');
                expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
                expect(result).toEqual({ test: 'dummy test' });
            }));
            it('should properly handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
                payload2 = Object.assign(Object.assign({}, payload2), { callback_id: null });
                jest.spyOn(bugsnagHelper_1.default, 'log');
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload2, respond);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalledTimes(1);
            }));
        });
    });
});
describe('Operations Route Controller', () => {
    let respond;
    const fn = () => ({});
    beforeEach(() => {
        respond = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('operations actions', () => {
        let payload;
        let getRouteRequestAndToken;
        let completeOperationsDeclineAction;
        let updateRouteRequest;
        let routeRequestId;
        let timeStamp;
        let channelId;
        beforeEach(() => {
            getRouteRequestAndToken = jest.spyOn(route_request_service_1.default, 'getRouteRequestAndToken');
            updateRouteRequest = jest.spyOn(RouteHelper_1.default, 'updateRouteRequest');
            completeOperationsDeclineAction = jest.spyOn(OperationsRouteRequest_1.default, 'completeOperationsDeclineAction');
            payload = {
                submission: {
                    declineReason: 'QQQQQQ', startDate: '31/01/2019', endDate: '20/02/2019'
                },
                actions: [{ name: 'action', value: 1 }],
                channel: { id: 1 },
                team: { id: 1 },
                original_message: { ts: 'timestamp' }
            };
            ({ channel: { id: channelId }, original_message: { ts: timeStamp } } = payload);
            ({ id: routeRequestId } = __mocks__1.mockRouteRequestData);
        });
        describe('decline', () => {
            beforeEach(() => {
                payload = Object.assign(Object.assign({}, payload), { callback_id: 'operations_route_decline' });
                jest.spyOn(DialogPrompts_1.default, 'sendReasonDialog').mockImplementation(fn);
                jest.spyOn(OperationsRouteRequest_1.default, 'updateOpsStatusNotificationMessage')
                    .mockImplementation();
            });
            it('should launch decline dialog prompt', () => __awaiter(void 0, void 0, void 0, function* () {
                getRouteRequestAndToken.mockResolvedValue(__mocks__1.mockRouteRequestData);
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(DialogPrompts_1.default.sendReasonDialog).toHaveBeenCalledTimes(1);
            }));
            it('should not launch decline dialog when request has been declined', () => __awaiter(void 0, void 0, void 0, function* () {
                const routeRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined' });
                getRouteRequestAndToken.mockReturnValue({
                    botToken: 'botToken',
                    routeRequest
                });
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(DialogPrompts_1.default.sendReasonDialog)
                    .not
                    .toHaveBeenCalled();
                expect(OperationsRouteRequest_1.default.updateOpsStatusNotificationMessage)
                    .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
            }));
            it('should not launch decline dialog when request has been approved', () => __awaiter(void 0, void 0, void 0, function* () {
                const routeRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved' });
                getRouteRequestAndToken.mockReturnValue({
                    botToken: 'botToken',
                    routeRequest
                });
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(DialogPrompts_1.default.sendReasonDialog)
                    .not
                    .toHaveBeenCalled();
                expect(OperationsRouteRequest_1.default.updateOpsStatusNotificationMessage)
                    .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
            }));
        });
        describe('operations declined request', () => {
            beforeEach(() => {
                const state = JSON.stringify({
                    decline: {
                        timeStamp, channelId, routeRequestId
                    }
                });
                payload = Object.assign(Object.assign({}, payload), { callback_id: 'operations_route_declinedRequest', state, user: { id: 1 } });
                jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                    .mockResolvedValue('xxoop-sdsad');
                jest.spyOn(OperationsRouteRequest_1.default, 'completeOperationsDeclineAction')
                    .mockResolvedValue();
                jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ id: 10 });
            });
            it('should complete decline action', () => __awaiter(void 0, void 0, void 0, function* () {
                getRouteRequestAndToken.mockResolvedValue({
                    routeRequest: Object.assign({}, __mocks__1.mockRouteRequestData),
                    slackBotOauthToken: 'dfdf'
                });
                updateRouteRequest.mockResolvedValue(Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Declined', opsComment: 'declined' }));
                completeOperationsDeclineAction.mockResolvedValue();
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(user_service_1.default.getUserBySlackId).toHaveBeenCalled();
                expect(RouteHelper_1.default.updateRouteRequest).toHaveBeenCalled();
                expect(OperationsRouteRequest_1.default.completeOperationsDeclineAction).toHaveBeenCalled();
            }));
            it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
                getRouteRequestAndToken.mockResolvedValue(Object.assign({}, __mocks__1.mockRouteRequestData));
                updateRouteRequest.mockImplementation(() => {
                    throw new Error();
                });
                jest.spyOn(bugsnagHelper_1.default, 'log');
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload, respond);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
                expect(respond.mock.calls[0][0].text).toEqual('Unsuccessful request. Kindly Try again');
            }));
        });
        describe('operations route controller', () => {
            it('should return a function if action exist', () => {
                const result = OperationsController_1.OperationsHandler.operationsRouteController('decline');
                expect(result).toBeInstanceOf(Function);
            });
            it('should throw an error if action does exist', () => {
                try {
                    OperationsController_1.OperationsHandler.operationsRouteController('doesNotExist')();
                }
                catch (e) {
                    expect(e).toBeInstanceOf(Error);
                    expect(e.message).toBe('Unknown action: operations_route_doesNotExist');
                }
            });
        });
        describe('handle operations actions', () => {
            let mockHandler;
            let payload2;
            beforeEach(() => {
                payload2 = {
                    actions: [{ name: 'action', value: 1 }],
                    callback_id: 'dummy_callback_actions',
                    team: { id: 'TEAMID1' }
                };
                mockHandler = jest.fn().mockReturnValue({ test: 'dummy test' });
                jest.spyOn(OperationsController_1.OperationsHandler, 'operationsRouteController')
                    .mockImplementation(() => mockHandler);
            });
            it('should properly handle route actions', () => __awaiter(void 0, void 0, void 0, function* () {
                payload2 = Object.assign(Object.assign({}, payload2), { callback_id: 'dummy_callback_id' });
                const result = yield OperationsController_1.OperationsHandler.handleOperationsActions(payload2, respond);
                expect(OperationsController_1.OperationsHandler.operationsRouteController).toHaveBeenCalledWith('id');
                expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
                expect(result).toEqual({ test: 'dummy test' });
            }));
            it('should properly handle slack button actions', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield OperationsController_1.OperationsHandler.handleOperationsActions(payload2, respond);
                expect(OperationsController_1.OperationsHandler.operationsRouteController).toHaveBeenCalledWith('action');
                expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
                expect(result).toEqual({ test: 'dummy test' });
            }));
            it('should properly handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
                payload2 = Object.assign(Object.assign({}, payload2), { callback_id: null });
                jest.spyOn(bugsnagHelper_1.default, 'log');
                yield OperationsController_1.OperationsHandler.handleOperationsActions(payload2, respond);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalledTimes(1);
                expect(respond).toHaveBeenCalledTimes(1);
            }));
        });
    });
});
describe(OperationsController_1.OperationsHandler.completeOpsAssignCabDriver, () => {
    const mockTrip = {
        rider: { slackId: 'slack' },
        requester: { slackId: 'slackx' },
        id: 1,
    };
    const mockCab = {
        id: 1,
        regNumber: 'KJK-LKS-123',
        capacity: 4,
        model: 'Avensis'
    };
    const mockDriver = {
        id: 1,
        driverName: 'Bimbo Alake',
        driverPhoneNo: '+2348108746839'
    };
    beforeEach(() => {
        jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue(mockTrip);
        jest.spyOn(TripJobs_1.default, 'scheduleTakeOffReminder').mockResolvedValue();
        jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue({ id: 'id' });
        jest.spyOn(bugsnagHelper_1.default, 'log').mockResolvedValue(null);
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xoxp-11');
        jest.spyOn(driver_notifications_1.default, 'checkAndNotifyDriver').mockResolvedValue(null);
        jest.spyOn(cab_service_1.cabService, 'getById').mockResolvedValue(mockCab);
        jest.spyOn(driver_service_1.driverService, 'getDriverById').mockResolvedValue(mockDriver);
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue(null);
        jest.spyOn(OperationsHelper_1.default, 'getTripDetailsAttachment').mockResolvedValue(null);
        jest.spyOn(TripJobs_1.default, 'scheduleTakeOffReminder').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should log error if it occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cab_service_1.cabService, 'getById').mockRejectedValue(new Error('mock error'));
        yield OperationsController_1.OperationsHandler.completeOpsAssignCabDriver(providersController_mock_1.completeOpsAssignCabPayload);
        expect(bugsnagHelper_1.default.log).toBeCalledTimes(1);
    }));
    it('should complete driver and cab provisioning', () => __awaiter(void 0, void 0, void 0, function* () {
        const teamId = 'UT1234';
        jest.spyOn(OperationsHelper_1.default, 'sendCompleteOpAssignCabMsg').mockResolvedValue(null);
        yield OperationsController_1.OperationsHandler.sendAssignCabDriverNotifications(teamId, mockTrip, mockCab, mockDriver, mockTrip.requester.slackId, mockTrip.rider.slackId, 'Channel', '1334141');
        expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toBeCalled();
        expect(InteractivePrompts_1.default.messageUpdate).toBeCalled();
        expect(OperationsHelper_1.default.sendCompleteOpAssignCabMsg)
            .toHaveBeenCalledWith(teamId, {
            requesterSlackId: mockTrip.requester.slackId,
            riderSlackId: mockTrip.rider.slackId
        }, expect.any(Object));
    }));
});
//# sourceMappingURL=OperationsController.spec.js.map