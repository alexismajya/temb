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
const web_socket_event_service_1 = __importDefault(require("../../../../events/web-socket-event.service"));
const JoinRouteInteractions_1 = __importDefault(require("../JoinRouteInteractions"));
const sequelizePaginationHelper_1 = __importDefault(require("../../../../../helpers/sequelizePaginationHelper"));
const routesHelper_1 = __importDefault(require("../../../helpers/routesHelper"));
const JoinRouteInputHandler_1 = __importDefault(require("../JoinRouteInputHandler"));
const payload_mock_1 = __importDefault(require("../../__mocks__/payload.mock"));
const batchUseRecord_service_1 = require("../../../../batchUseRecords/batchUseRecord.service");
const RouteJobs_1 = __importDefault(require("../../../../../services/jobScheduler/jobs/RouteJobs"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const routeBatch_mock_1 = __importDefault(require("../__mocks__/routeBatch.mock"));
const homebase_service_1 = require("../../../../homebases/homebase.service");
const RateTripController_1 = __importDefault(require("../../../TripManagement/RateTripController"));
const RouteNotifications_1 = require("../../../SlackPrompts/notifications/RouteNotifications");
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../__mocks__/socket.ioMock"));
describe('Test JointRouteInteractions', () => {
    const res = jest.fn();
    const testData = JSON.parse(process.env.TEST_DATA);
    beforeEach(() => {
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    describe('Test sendAvailableRoutesMessage', () => {
        beforeEach(() => {
            jest
                .spyOn(sequelizePaginationHelper_1.default, 'deserializeSort')
                .mockReturnValue(['asc', 'name']);
            jest
                .spyOn(routeBatch_service_1.routeBatchService, 'getRoutes')
                .mockReturnValue({ routes: [{}], totalPages: 1, pageNo: 1 });
            jest
                .spyOn(routesHelper_1.default, 'toAvailableRoutesAttachment')
                .mockReturnValue('');
        });
        it('should test sendAvailableRoutesMessage', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 1 } };
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockImplementation(() => ({ id: 1 }));
            yield JoinRouteInteractions_1.default.sendAvailableRoutesMessage(payload, res);
            expect(routesHelper_1.default.toAvailableRoutesAttachment).toBeCalled();
            expect(routeBatch_service_1.routeBatchService.getRoutes).toBeCalled();
        }));
        it('should skip page', () => __awaiter(void 0, void 0, void 0, function* () {
            const actions1 = [{ name: 'skipPage', field: 'field' }];
            const payload = { actions: actions1, team: { id: 3 }, user: { id: 1 } };
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockImplementation(() => ({ id: 1 }));
            const result = yield JoinRouteInteractions_1.default.sendAvailableRoutesMessage(payload, res);
            expect(result).toBe(undefined);
            expect(routesHelper_1.default.toAvailableRoutesAttachment).toBeCalled();
            expect(routeBatch_service_1.routeBatchService.getRoutes).toBeCalled();
        }));
    });
    describe('Test handleSendAvailableRoutesActions', () => {
        let respond;
        let payload;
        let mockFn;
        beforeEach(() => {
            respond = jest.fn();
            mockFn = jest.spyOn(JoinRouteInteractions_1.default, 'sendAvailableRoutesMessage').mockResolvedValue();
        });
        afterEach(() => {
            mockFn.mockRestore();
        });
        it('should call sendAvailableRoutesMessage for "See Available Routes"', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = payload_mock_1.default('value', 'See Available Routes');
            yield JoinRouteInteractions_1.default.handleSendAvailableRoutesActions(payload, respond);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalledTimes(1);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalledWith(payload, respond);
        }));
        it('should call sendAvailableRoutesMessage for action names starting with "page_"', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = payload_mock_1.default('value', 'page_3');
            yield JoinRouteInteractions_1.default.handleSendAvailableRoutesActions(payload, respond);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalledTimes(1);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalledWith(payload, respond);
        }));
    });
    describe('Test handleViewAvailableRoutes', () => {
        let respond;
        let payload;
        beforeEach(() => {
            respond = jest.fn();
            jest.spyOn(JoinRouteInteractions_1.default, 'sendAvailableRoutesMessage').mockResolvedValue();
            jest.spyOn(JoinRouteInteractions_1.default, 'handleSendAvailableRoutesActions').mockResolvedValue();
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should call handleSendAvailableRoutesActions for interactive message', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = { type: 'interactive_message' };
            yield JoinRouteInteractions_1.default.handleViewAvailableRoutes(payload, respond);
            expect(JoinRouteInteractions_1.default.handleSendAvailableRoutesActions).toHaveBeenCalledTimes(1);
            expect(JoinRouteInteractions_1.default.handleSendAvailableRoutesActions).toHaveBeenCalledWith(payload, respond);
        }));
        it('should call sendAvailableRoutesMessage for dialog submission', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = { type: 'dialog_submission' };
            yield JoinRouteInteractions_1.default.handleViewAvailableRoutes(payload, respond);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalledTimes(1);
            expect(JoinRouteInteractions_1.default.sendAvailableRoutesMessage).toHaveBeenCalledWith(payload, respond);
        }));
    });
    describe('Test full capacity', () => {
        it('should test fullRouteCapacityNotice', () => {
            const result = JoinRouteInteractions_1.default.fullRouteCapacityNotice('state');
            expect(result).toHaveProperty('attachments');
            expect(result).toHaveProperty('text');
        });
    });
    describe('Test handleJoinRouteActions', () => {
        const respond = jest.fn();
        const actions2 = 'callAction';
        it('should test handleJoinRouteActions for wrong payload', () => {
            const payload = { actions: actions2, callBack_id: 'callId' };
            JoinRouteInputHandler_1.default.handleJoinRouteActions(payload, respond);
            expect(respond).toBeCalled();
        });
        it('should throw an error if something goes wrong', () => {
            jest
                .spyOn(JoinRouteInputHandler_1.default, 'joinRoute')
                .mockRejectedValue(new Error('something wrong'));
            const payload = { actions: actions2, callback_id: 'join_Route_joinRoute' };
            expect(JoinRouteInputHandler_1.default.handleJoinRouteActions(payload, respond)).rejects.toThrow('something wrong');
        });
    });
    describe('Test handleRouteBatchConfirmUse', () => {
        const respond = jest.fn();
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should test taken route button', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ action_id: RouteNotifications_1.actions.confirmation, value: '211' }],
                team: { id: 233 },
                user: testData.users[3],
            };
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => (testData.users[3]));
            jest
                .spyOn(batchUseRecord_service_1.batchUseRecordService, 'createSingleRecord').mockResolvedValue();
            jest.spyOn(RateTripController_1.default, 'sendRatingMessage').mockResolvedValue();
            yield JoinRouteInteractions_1.default.handleRouteBatchConfirmUse(payload, respond);
            expect(batchUseRecord_service_1.batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
            expect(RateTripController_1.default.sendRatingMessage).toBeCalledTimes(1);
        }));
        it('should test not taken route button', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ action_id: RouteNotifications_1.actions.decline, value: '211' }],
                team: { id: 343 },
                user: testData.users[3],
            };
            jest.spyOn(JoinRouteInteractions_1.default, 'hasNotTakenTrip').mockResolvedValue();
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'createSingleRecord').mockResolvedValue();
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => (testData.users[3]));
            yield JoinRouteInteractions_1.default.handleRouteBatchConfirmUse(payload, respond);
            expect(batchUseRecord_service_1.batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
            expect(JoinRouteInteractions_1.default.hasNotTakenTrip).toBeCalledTimes(1);
        }));
        it('should test still on trip route button', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{
                        action_id: RouteNotifications_1.actions.pending,
                        value: '211'
                    }],
                team: {
                    id: 343
                },
                user: testData.users[4],
            };
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'createSingleRecord').mockResolvedValue();
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => (testData.users[4]));
            yield JoinRouteInteractions_1.default.handleRouteBatchConfirmUse(payload, respond);
            expect(batchUseRecord_service_1.batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
        }));
        it('should add 30 minutes on production', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'createSingleRecord').mockResolvedValue();
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => (testData.users[4]));
            jest.spyOn(RouteJobs_1.default, 'scheduleTripCompletionNotification');
            process.env.NODE_ENV = 'production';
            const payload = {
                actions: [{
                        action_id: RouteNotifications_1.actions.pending,
                        value: '211'
                    }],
                team: {
                    id: 343
                },
                user: testData.users[4],
            };
            yield JoinRouteInteractions_1.default.handleRouteBatchConfirmUse(payload, respond);
            expect(RouteJobs_1.default.scheduleTripCompletionNotification).toHaveBeenCalled();
        }));
    });
    describe('Test handleRouteSkipped', () => {
        const respond = jest.fn();
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should test handleRouteSkipped', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { submission: { submission: 'teamId' }, state: 233, user: testData.users[3] };
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => (testData.users[3]));
            jest
                .spyOn(batchUseRecord_service_1.batchUseRecordService, 'createSingleRecord').mockResolvedValue();
            yield JoinRouteInteractions_1.default.handleRouteSkipped(payload, respond);
            expect(batchUseRecord_service_1.batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
        }));
    });
    describe('Test hasNotTakenTrip', () => {
        const respond = jest.fn();
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should test hasNotTakenTrip', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { actions: [{ name: 'taken', value: '211' }], team: { id: 233 } };
            jest
                .spyOn(batchUseRecord_service_1.batchUseRecordService, 'updateBatchUseRecord').mockResolvedValue();
            yield JoinRouteInteractions_1.default.hasNotTakenTrip(payload, respond);
            expect(respond).toBeCalledTimes(1);
        }));
    });
    describe('sendCurrentRouteMessage', () => {
        it('should send users current route', () => __awaiter(void 0, void 0, void 0, function* () {
            const [payload, respond, testBatchId] = [{ user: { id: 'U1234' } }, jest.fn(), routeBatch_mock_1.default.routeBatchId];
            const getUserSpy = jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation((slackId) => ({
                slackId,
                routeBatchId: testBatchId
            }));
            const getBatchSpy = jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockImplementation((id) => (Object.assign(Object.assign({}, routeBatch_mock_1.default), { id })));
            yield JoinRouteInteractions_1.default.sendCurrentRouteMessage(payload, respond);
            expect(getUserSpy).toHaveBeenCalledWith(payload.user.id);
            expect(getBatchSpy).toHaveBeenCalledWith(testBatchId, true);
        }));
    });
    it('should display a message when the user has no route', () => __awaiter(void 0, void 0, void 0, function* () {
        const [payload, respond] = [{ user: { id: 'U1234' } }, jest.fn()];
        const getUserSpy = jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation((slackId) => ({
            slackId,
            routeBatchId: null
        }));
        const getBatchSpy = jest
            .spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk')
            .mockImplementation(() => null);
        yield JoinRouteInteractions_1.default.sendCurrentRouteMessage(payload, respond);
        expect(getUserSpy).toHaveBeenCalledWith(payload.user.id);
        expect(getBatchSpy).toHaveBeenCalledWith(null, true);
    }));
});
//# sourceMappingURL=JoinRouteInteraction.spec.js.map