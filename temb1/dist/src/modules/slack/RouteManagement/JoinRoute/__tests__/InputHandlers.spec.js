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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_socket_event_service_1 = __importDefault(require("../../../../events/web-socket-event.service"));
const JoinRouteInputHandler_1 = __importDefault(require("../JoinRouteInputHandler"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const JoinRouteHelpers_1 = __importDefault(require("../JoinRouteHelpers"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const slackEvents_1 = require("../../../events/slackEvents");
const JoinRouteFormValidators_1 = __importDefault(require("../JoinRouteFormValidators"));
const JoinRouteNotifications_1 = __importDefault(require("../JoinRouteNotifications"));
const bugsnagHelper_1 = __importStar(require("../../../../../helpers/bugsnagHelper"));
const JoinRouteDialogPrompts_1 = __importDefault(require("../JoinRouteDialogPrompts"));
const route_service_1 = require("../../../../routes/route.service");
const __mocks__1 = require("../../../../../services/__mocks__");
const joinRouteRequest_service_1 = require("../../../../joinRouteRequests/joinRouteRequest.service");
const JoinRouteInteractions_1 = __importDefault(require("../JoinRouteInteractions"));
const formHelper = __importStar(require("../../../helpers/formHelper"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const engagement_service_1 = require("../../../../engagements/engagement.service");
const cache_1 = __importDefault(require("../../../../shared/cache"));
const providersController_mock_1 = require("../../__mocks__/providersController.mock");
const twilio_mocks_1 = require("../../../../notifications/whatsapp/twilio.mocks");
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../__mocks__/socket.ioMock"));
twilio_mocks_1.mockWhatsappOptions();
beforeEach(() => {
    jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
});
const error = new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again');
describe('JoinInputHandlers', () => {
    const respond = jest.fn();
    const submission = {
        workHours: '18:00-00:00'
    };
    const engagement = {
        id: 1,
        partnerName: 'partner',
        workHours: '18:00-00:00',
        startDate: '12/12/2019',
        endDate: '12/12/2020',
        partnerStatus: 'ss'
    };
    beforeEach(() => {
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('joinRoute', () => {
        let detailsFormSpy;
        const payload = {
            actions: [{ value: 1 }], trigger_id: 'triggerId', team: { id: 'teamId' }, user: { id: 1 }
        };
        beforeEach(() => {
            detailsFormSpy = jest.spyOn(JoinRouteDialogPrompts_1.default, 'sendFellowDetailsForm')
                .mockResolvedValue();
            jest.spyOn(JoinRouteInteractions_1.default, 'fullRouteCapacityNotice')
                .mockResolvedValue();
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk');
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should call sendFellowDetailsForm', () => __awaiter(void 0, void 0, void 0, function* () {
            routeBatch_service_1.routeBatchService.getRouteBatchByPk.mockResolvedValue(Object.assign(Object.assign({}, __mocks__1.mockRouteBatchData), { riders: [] }));
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockResolvedValue(engagement);
            jest.spyOn(user_service_1.default, 'getUserBySlackId')
                .mockResolvedValue({ slackId: 'ss' });
            yield JoinRouteInputHandler_1.default.joinRoute(payload, respond);
            expect(detailsFormSpy)
                .toBeCalledWith(payload, JSON.stringify({ routeId: 1, capacityFilled: false }), engagement);
            expect(routeBatch_service_1.routeBatchService.getRouteBatchByPk).toHaveBeenCalledWith(1, true);
        }));
        it('should stop fellow with a route', () => __awaiter(void 0, void 0, void 0, function* () {
            routeBatch_service_1.routeBatchService.getRouteBatchByPk.mockResolvedValue(Object.assign(Object.assign({}, __mocks__1.mockRouteBatchData), { riders: [{ slackId: 'ss' }] }));
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockResolvedValue(engagement);
            jest.spyOn(user_service_1.default, 'getUserBySlackId')
                .mockResolvedValue({ slackId: 'ABCDEF', routeBatchId: 'aaa' });
            const restrictions = jest.spyOn(JoinRouteInputHandler_1.default, 'joinRouteHandleRestrictions');
            yield JoinRouteInputHandler_1.default.joinRoute(payload, respond);
            expect(respond).toBeCalledTimes(1);
            expect(restrictions).toBeCalledTimes(1);
        }));
        it('should stop fellow who is not on engagement', () => __awaiter(void 0, void 0, void 0, function* () {
            routeBatch_service_1.routeBatchService.getRouteBatchByPk.mockResolvedValue(Object.assign(Object.assign({}, __mocks__1.mockRouteBatchData), { riders: [] }));
            const notOnEngagement = null;
            jest.spyOn(user_service_1.default, 'getUserBySlackId')
                .mockResolvedValue({ slackId: 'ss' });
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockResolvedValue(notOnEngagement);
            yield JoinRouteInputHandler_1.default.joinRoute(payload, respond);
            expect(respond).toBeCalledTimes(1);
            expect(respond).toHaveBeenCalledWith({
                attachments: undefined,
                channel: undefined,
                response_type: 'ephemeral',
                text: `Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`,
                user: undefined
            });
        }));
        it('should send full capacity notice to user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockResolvedValue(engagement);
            const copy = {};
            Object.assign(copy, __mocks__1.mockRouteBatchData);
            copy.riders.push(...[{}, {}]);
            jest.spyOn(user_service_1.default, 'getUserBySlackId')
                .mockResolvedValue({ slackId: 'ss' });
            routeBatch_service_1.routeBatchService.getRouteBatchByPk.mockResolvedValue(__mocks__1.mockRouteBatchData);
            yield JoinRouteInputHandler_1.default.joinRoute(payload, respond);
            expect(detailsFormSpy).not.toBeCalled();
            expect(JoinRouteInteractions_1.default.fullRouteCapacityNotice)
                .toBeCalledWith(copy.id);
            expect(routeBatch_service_1.routeBatchService.getRouteBatchByPk)
                .toHaveBeenCalledWith(1, true);
        }));
        it('should log caught error on bugsnag', () => __awaiter(void 0, void 0, void 0, function* () {
            routeBatch_service_1.routeBatchService.getRouteBatchByPk.mockRejectedValue(new Error('very error'));
            const spy = jest.spyOn(bugsnagHelper_1.Bugsnag.prototype, 'log');
            yield JoinRouteInputHandler_1.default.joinRoute(payload, respond);
            expect(respond).toBeCalledWith(error);
            expect(spy).toBeCalledWith(new Error('very error'));
        }));
    });
    describe('continueJoinRoute', () => {
        const payload = {
            actions: [{ value: 1 }], trigger_id: 'triggerId', team: { id: 'teamId' }, user: { id: 1 }
        };
        beforeEach(() => {
            jest.spyOn(JoinRouteDialogPrompts_1.default, 'sendFellowDetailsForm')
                .mockResolvedValue();
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockResolvedValue(engagement);
        });
        it('should continue with join route request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield JoinRouteInputHandler_1.default.continueJoinRoute(payload, respond);
            expect(JoinRouteDialogPrompts_1.default.sendFellowDetailsForm)
                .toBeCalledWith(payload, JSON.stringify({ routeId: 1, capacityFilled: true }), engagement);
            expect(respond).toBeCalledWith(new SlackMessageModels_1.SlackInteractiveMessage('Noted'));
        }));
        it('should stop fellow who is not on engagement', () => __awaiter(void 0, void 0, void 0, function* () {
            const notengagement = null;
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockResolvedValue(notengagement);
            yield JoinRouteInputHandler_1.default.continueJoinRoute(payload, respond);
            expect(respond).toBeCalledTimes(1);
            expect(respond).toHaveBeenCalledWith({
                attachments: undefined,
                channel: undefined,
                response_type: 'ephemeral',
                text: `Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`,
                user: undefined
            });
        }));
    });
    describe('fellowDetails', () => {
        const data = {
            callback_id: 'join_route_fellowDetails_1',
            submission: Object.assign({}, submission),
            user: { id: 'testId', name: 'test.user' },
            team: { id: 'testId', name: 'test.user' },
            state: JSON.stringify({ routeId: 1 })
        };
        beforeEach(() => {
            jest.spyOn(JoinRouteNotifications_1.default, 'sendFellowDetailsPreview');
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(['12/01/2019', '12/12/2022', 'Safaricom']);
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should call respond()', () => __awaiter(void 0, void 0, void 0, function* () {
            JoinRouteNotifications_1.default.sendFellowDetailsPreview
                .mockResolvedValue('preview attachment');
            yield JoinRouteInputHandler_1.default.fellowDetails(data, respond);
            expect(respond).toBeCalledWith('preview attachment');
        }));
        it('should not call respond() if submission data from payload has errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = Object.assign(Object.assign({}, data), { submission: { workHours: 'an invalid string' } });
            const result = yield JoinRouteInputHandler_1.default.fellowDetails(invalidData, respond);
            expect(respond).not.toHaveBeenCalled();
            expect(result).toHaveProperty('errors');
        }));
        it('should handle validation error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(JoinRouteFormValidators_1.default, 'validateFellowDetailsForm')
                .mockReturnValue([{}]);
            yield JoinRouteInputHandler_1.default.fellowDetails(data, respond);
        }));
        it('should log a caught error on bugsnag', () => __awaiter(void 0, void 0, void 0, function* () {
            const errors = new Error('very error');
            JoinRouteNotifications_1.default.sendFellowDetailsPreview
                .mockRejectedValue(errors);
            const spy = jest.spyOn(bugsnagHelper_1.Bugsnag.prototype, 'log');
            yield JoinRouteInputHandler_1.default.fellowDetails(data, respond);
            expect(spy).toBeCalledWith(errors);
            expect(respond).toBeCalledWith(error);
        }));
    });
    describe('showAvailableRoutes', () => {
        it('should send available routes prompt', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(JoinRouteInteractions_1.default, 'sendAvailableRoutesMessage')
                .mockReturnValue();
            yield JoinRouteInputHandler_1.default.showAvailableRoutes({}, respond);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalled();
        }));
    });
    describe('submitJoinRoute', () => {
        let payload;
        beforeEach(() => {
            const value = JSON.stringify({ routeId: 1, capacityFilled: false });
            payload = {
                actions: [{ value }],
                user: { id: 'slackId' },
                team: { id: 'teamId' },
            };
            jest.spyOn(JoinRouteHelpers_1.default, 'saveJoinRouteRequest')
                .mockResolvedValue({ id: 2, dataValues: { engagementId: 2 } });
            jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'updateJoinRouteRequest')
                .mockResolvedValue();
            jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockReturnValue();
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should save join request and send notification to managers', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeId = 1;
            const value = JSON.stringify({ routeId, capacityFilled: false });
            payload = Object.assign(Object.assign({}, payload), { actions: [{ value }] });
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ id: 1 });
            jest.spyOn(engagement_service_1.engagementService, 'updateEngagement').mockResolvedValue({ id: 1 });
            jest.spyOn(route_service_1.routeService, 'addUserToRoute').mockResolvedValue({ id: 1 });
            jest.spyOn(formHelper, 'getFellowEngagementDetails').mockResolvedValue(engagement);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(providersController_mock_1.route);
            yield JoinRouteInputHandler_1.default.submitJoinRoute(payload, respond);
            expect(respond).toBeCalledTimes(1);
            expect(JoinRouteHelpers_1.default.saveJoinRouteRequest).toBeCalledWith(payload, 1);
            expect(slackEvents_1.SlackEvents.raise)
                .toBeCalledWith(slackEvents_1.slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE, payload, 2);
        }));
        it('Should catch all errors', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield JoinRouteInputHandler_1.default.submitJoinRoute('invalid payload', respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(respond).toHaveBeenCalled();
        }));
        it('should send request to ops when user trying to join a full route', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeId = 1;
            const value = JSON.stringify({ routeId, capacityFilled: true });
            payload = Object.assign(Object.assign({}, payload), { actions: [{ value }] });
            yield JoinRouteInputHandler_1.default.submitJoinRoute(payload, respond);
            expect(respond).toBeCalledTimes(1);
            expect(slackEvents_1.SlackEvents.raise)
                .toBeCalledWith(slackEvents_1.slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST, {
                routeId,
                teamId: payload.team.id,
                requesterSlackId: payload.user.id,
            });
        }));
    });
    describe('backButton', () => {
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should send available routes prompt when back button is clicked', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ value: 'back' }],
                user: { id: 'slackId' }
            };
            const spy = jest.spyOn(JoinRouteInteractions_1.default, 'sendAvailableRoutesMessage')
                .mockImplementation(jest.fn());
            yield JoinRouteInputHandler_1.default.backButton(payload, respond);
            expect(spy)
                .toBeCalledTimes(1);
        }));
        it('should send goodbye message ', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ value: 'not back' }],
                user: { id: 'slackId' }
            };
            yield JoinRouteInputHandler_1.default.backButton(payload, respond);
            expect(respond)
                .toBeCalledTimes(1);
            expect(respond)
                .toBeCalledWith({
                attachments: undefined,
                channel: undefined,
                response_type: 'ephemeral',
                text: 'Thank you for using Tembea. See you again.',
                user: undefined
            });
        }));
    });
});
describe('JoinRouteInteractions', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('JoinRouteInteractivePrompts', () => {
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        describe('fullRouteCapacityNotice', () => {
            it('should send an interactive message of available routes', () => {
                const fieldsOrActionSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
                const addPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
                const attachment = JoinRouteInteractions_1.default.fullRouteCapacityNotice('state');
                expect(fieldsOrActionSpy).toBeCalledTimes(1);
                expect(fieldsOrActionSpy.mock.calls[0][0]).toEqual('actions');
                expect(fieldsOrActionSpy.mock.calls[0][1]).toBeInstanceOf(Array);
                expect(fieldsOrActionSpy.mock.calls[0][1].length).toEqual(2);
                expect(addPropsSpy).toBeCalledWith('join_route_actions');
                expect(attachment).toBeInstanceOf(SlackMessageModels_1.SlackInteractiveMessage);
            });
        });
    });
});
//# sourceMappingURL=InputHandlers.spec.js.map