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
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const app_event_service_1 = __importDefault(require("../../../events/app-event.service"));
const trip_events_contants_1 = require("../../../events/trip-events.contants");
const trip_helpers_1 = __importDefault(require("./trip.helpers"));
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
const trip_1 = require("../__mocks__/trip");
const trip_request_1 = require("../../../../database/models/trip-request");
describe('TripController', () => {
    let state;
    const status = {
        currentState: 'Approved',
        lastActionById: 'slackId',
    };
    beforeEach(() => {
        state = {
            reason: 'test',
            managerSlackId: 'U1234',
            tripId: 1,
            botToken: 'token',
            teamId: 'T3H2G9',
            isApproval: true,
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('completeManagerResponse for approval', () => {
        it('should submit approval response from manager', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue({
                slackId: state.managerSlackId, teamId: state.teamId,
            });
            jest.spyOn(trip_helpers_1.default, 'approveRequest').mockResolvedValue({
                tripId: state.tripId,
                managerId: state.managerSlackId,
                reason: state.reason,
                botToken: state.botToken,
            });
            yield trip_helpers_1.default.completeManagerResponse(state);
            expect(trip_helpers_1.default.approveRequest).toHaveBeenCalled();
        }));
        it('should submit approve request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'update').mockResolvedValue({
                tripId: state.tripId,
                data: 'tripdetails'
            });
            jest.spyOn(app_event_service_1.default, 'broadcast').mockResolvedValue({
                name: trip_events_contants_1.tripEvents.managerApprovedTrip,
                data: 'tripdetails',
                botToken: state.botToken
            });
            yield trip_helpers_1.default.approveRequest(state.tripId, 2, state.reason, state.botToken);
            expect(app_event_service_1.default.broadcast).toHaveBeenCalled();
        }));
    });
    describe('completeManagerResponse for Decline', () => {
        const newState = Object.assign(Object.assign({}, state), { isApproval: false });
        it('should submit decline response from manager', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue({
                slackId: newState.managerSlackId, teamId: newState.teamId,
            });
            jest.spyOn(trip_helpers_1.default, 'declineRequest').mockResolvedValue({
                tripId: newState.tripId,
                managerId: newState.managerSlackId,
                reason: newState.reason,
                botToken: newState.botToken,
            });
            yield trip_helpers_1.default.completeManagerResponse(newState);
            expect(trip_helpers_1.default.declineRequest).toHaveBeenCalled();
        }));
        it('should submit decline request', () => __awaiter(void 0, void 0, void 0, function* () {
            const managerId = 2;
            jest.spyOn(trip_service_1.default, 'update').mockResolvedValue({
                tripId: newState.tripId,
                data: 'tripdetails'
            });
            jest.spyOn(app_event_service_1.default, 'broadcast').mockResolvedValue({
                name: trip_events_contants_1.tripEvents.managerDeclinedTrip,
                data: 'tripdetails',
                botToken: newState.botToken
            });
            yield trip_helpers_1.default.declineRequest(newState.tripId, managerId, newState.reason, newState.botToken);
            expect(app_event_service_1.default.broadcast).toHaveBeenCalled();
        }));
    });
    describe('getApprovedMessageOfRequester', () => {
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'notificationFields').mockResolvedValue(['fields']);
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should send approved message to requester', () => __awaiter(void 0, void 0, void 0, function* () {
            const responseData = Object.assign(Object.assign({}, trip_1.trip), { requester: { slackId: 2 } });
            yield trip_helpers_1.default.getApprovedMessageOfRequester(responseData, 'channel');
            expect(Notifications_1.default.notificationFields).toBeCalled();
        }));
    });
    describe('notify manager when Ops approved', () => {
        it('should notify manager when Ops approved a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({
                homebase: {
                    channelId: 'channel',
                },
            });
            yield trip_helpers_1.default.notifyManagerIfOpsApproved(1, 'channelId', 'token');
            expect(trip_service_1.default.getById).toBeCalled();
        }));
    });
    describe('Decline request', () => {
        it('should decline trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'update').mockResolvedValue({
                homebase: {
                    channelId: 'channel',
                },
            });
            jest.spyOn(app_event_service_1.default, 'broadcast').mockResolvedValue('data');
            yield trip_helpers_1.default.declineRequest(1, 1, 'reasone', 'token');
            expect(app_event_service_1.default.broadcast).toBeCalled();
            expect(trip_service_1.default.update).toBeCalled();
        }));
    });
    describe('getApprovalOrDeclineMessage', () => {
        it('should return approved or declined message about trip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockReturnValue('message');
            jest.spyOn(trip_helpers_1.default, 'getActorString').mockReturnValue('Actor');
            yield trip_helpers_1.default.getApprovalOrDeclineMessage(trip_1.trip, status, 'data', 'userId');
            expect(trip_helpers_1.default.getActorString).toBeCalled();
        }));
        it('should return default message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getActorString').mockReturnValue('Actor');
            status.currentState = 'none';
            yield trip_helpers_1.default.getApprovalOrDeclineMessage(trip_1.trip, status, 'data', 'userId');
            expect(trip_helpers_1.default.getActorString).toBeCalled();
        }));
        it('should return message when trip has been declined by ops', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getActorString').mockReturnValue('Actor');
            status.currentState = trip_request_1.TripStatus.declinedByOps;
            yield trip_helpers_1.default.getApprovalOrDeclineMessage(trip_1.trip, status, 'data', 'userId');
            expect(trip_helpers_1.default.getActorString).toBeCalled();
        }));
        it('should return message when trip has been declined by manager', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getActorString').mockReturnValue('Actor');
            status.currentState = trip_request_1.TripStatus.declinedByManager;
            yield trip_helpers_1.default.getApprovalOrDeclineMessage(trip_1.trip, status, 'data', 'userId');
            expect(trip_helpers_1.default.getActorString).toBeCalled();
        }));
        it('should return message when trip has been confirmed', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getActorString').mockReturnValue('Actor');
            status.currentState = trip_request_1.TripStatus.confirmed;
            yield trip_helpers_1.default.getApprovalOrDeclineMessage(trip_1.trip, status, 'data', 'userId');
            expect(trip_helpers_1.default.getActorString).toBeCalled();
        }));
    });
    describe('getManagerApprovedOrDeclineMessage', () => {
        it('should return approved or declined message about trip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockReturnValue('data');
            jest.spyOn(trip_helpers_1.default, 'getApprovalOrDeclineMessage').mockResolvedValue('data');
            yield trip_helpers_1.default.getManagerApprovedOrDeclineMessage(1, status, 'channel', 'userId');
            expect(trip_service_1.default.getById).toBeCalled();
        }));
    });
    describe('approveRequest', () => {
        it('should approve a trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'update').mockResolvedValue({
                homebase: {
                    channelId: 'channel',
                },
            });
            jest.spyOn(app_event_service_1.default, 'broadcast').mockResolvedValue('data');
            yield trip_helpers_1.default.approveRequest(1, 1, 'reasone', 'token');
            expect(app_event_service_1.default.broadcast).toBeCalled();
            expect(trip_service_1.default.update).toBeCalled();
        }));
    });
    describe('completeManagerResponse', () => {
        const option = {
            tripId: 1,
            isApproval: false,
            reason: 'reason',
            managerSlackId: 'idSlack',
            botToken: 'token',
            teamId: 'teamId',
        };
        it('should let manager approve  a trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue('data');
            jest.spyOn(trip_helpers_1.default, 'approveRequest').mockResolvedValue('approve');
            yield trip_helpers_1.default.completeManagerResponse(option);
            expect(slackHelpers_1.default.findOrCreateUserBySlackId).toBeCalled();
        }));
        it('should let manager decline a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue('data');
            jest.spyOn(trip_helpers_1.default, 'declineRequest').mockResolvedValue('decline');
            option.isApproval = true;
            yield trip_helpers_1.default.completeManagerResponse(option);
            expect(slackHelpers_1.default.findOrCreateUserBySlackId).toBeCalled();
        }));
    });
    describe('getActorString', () => {
        it('should return the same actor id when both channel are the same', () => {
            trip_1.trip.homebase.channel = 'channelId';
            const getActor = trip_helpers_1.default.getActorString(trip_1.trip, status, 'channelId', 'actorId');
            expect(getActor).toBeDefined();
            expect(typeof getActor).toBe('string');
            expect(getActor).toEqual('<@slackId> has');
        });
    });
    describe('getMessage', () => {
        it('should return the message when requestId not equal to riderId', () => __awaiter(void 0, void 0, void 0, function* () {
            const getMessage = yield trip_helpers_1.default.getMessage('riderId', 'requesterId', 'text');
            expect(typeof getMessage).toBe('string');
        }));
        it('should return message also when requestId is equal to riderId', () => __awaiter(void 0, void 0, void 0, function* () {
            const getMessage = yield trip_helpers_1.default.getMessage('user', 'user', 'text');
            expect(typeof getMessage).toBe('string');
        }));
    });
    describe('sendManagerTripRequestNotification', () => {
        it('should notify a manager about the request trip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('channelId');
            jest.spyOn(trip_helpers_1.default, 'getMessage').mockResolvedValue('message');
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue('message');
            yield trip_helpers_1.default.sendManagerTripRequestNotification(trip_1.trip, 'token');
            expect(Notifications_1.default.getDMChannelId).toBeCalled();
        }));
    });
});
//# sourceMappingURL=trip.helpers.spec.js.map