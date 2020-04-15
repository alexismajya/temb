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
const __mocks__1 = require("../../../../../services/__mocks__");
const OperationsRouteRequest_1 = __importDefault(require("../../../SlackPrompts/notifications/OperationsRouteRequest"));
const OperationsHelper_1 = __importDefault(require("../OperationsHelper"));
const cab_service_1 = require("../../../../cabs/cab.service");
const cache_1 = __importDefault(require("../../../../shared/cache"));
const __mocks__2 = require("../../../../trips/__tests__/__mocks__");
const Notifications_1 = __importDefault(require("../../../SlackPrompts/Notifications"));
const ProviderNotifications_1 = __importDefault(require("../../../SlackPrompts/notifications/ProviderNotifications"));
const RouteNotifications_1 = __importDefault(require("../../../SlackPrompts/notifications/RouteNotifications"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
describe('operations approve request', () => {
    let payload;
    let routeRequestId;
    let timeStamp;
    let channelId;
    beforeAll(() => {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(['12/01/2019', '12/12/2019', 'Saf']);
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
        const state = JSON.stringify({
            approve: {
                timeStamp, channelId, routeRequestId
            }
        });
        payload = Object.assign(Object.assign({}, payload), { submission: {
                routeName: 'QQQQQQ', takeOffTime: '12:30', cab: 'JDD3883, SDSAS, DDDDD'
            }, callback_id: 'operations_route_approvedRequest', state });
    });
    afterAll(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('get cab details if a new cab is created', () => __awaiter(void 0, void 0, void 0, function* () {
        payload.callback_id = 'operations_reason_dialog_route';
        payload.submission = {
            cab: 'Create New Cab',
            driverName: 'James',
            driverPhoneNo: 888288912981,
            regNumber: 'KCB 00P',
            capacity: 2,
            model: 'Toyota'
        };
        jest.spyOn(cab_service_1.cabService, 'findOrCreateCab').mockResolvedValue({ cab: {} });
        yield OperationsHelper_1.default.getCabSubmissionDetails(payload, payload.submission);
        expect(cab_service_1.cabService.findOrCreateCab).toBeCalled();
    }));
});
describe('completeRouteApproval', () => {
    it('Should send notifications to the provider, ops, user and manager', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            channelId: 'QAZWSX',
            opsSlackId: 'WASASAS',
            timeStamp: '12345678987',
            submission: {
                providerId: 1
            },
            botToken: 'xaxsaxscascascs'
        };
        jest.spyOn(ProviderNotifications_1.default, 'sendRouteApprovalNotification').mockResolvedValue();
        jest.spyOn(OperationsRouteRequest_1.default, 'completeOperationsApprovedAction').mockResolvedValue();
        jest.spyOn(RouteNotifications_1.default, 'sendRouteApproveMessageToManager').mockResolvedValue();
        jest.spyOn(RouteNotifications_1.default, 'sendRouteApproveMessageToFellow').mockResolvedValue();
        jest.spyOn(user_service_1.default, 'updateUser').mockResolvedValue();
        yield OperationsHelper_1.default.completeRouteApproval(__mocks__1.mockRouteRequestData, __mocks__1.routeData, data);
        expect(ProviderNotifications_1.default.sendRouteApprovalNotification)
            .toHaveBeenCalledWith(expect.any(Object), expect.any(Number), expect.any(String));
        expect(OperationsRouteRequest_1.default.completeOperationsApprovedAction).toHaveBeenCalledWith(expect.any(Object), expect.any(String), expect.any(String), expect.any(String), expect.any(String), expect.any(Object));
        expect(RouteNotifications_1.default.sendRouteApproveMessageToFellow).toHaveBeenCalledWith(expect.any(Object), expect.any(String), expect.any(Object));
        expect(RouteNotifications_1.default.sendRouteApproveMessageToManager).toHaveBeenCalledWith(expect.any(Object), expect.any(String), expect.any(Object));
        expect(user_service_1.default.updateUser).toHaveBeenCalledWith(expect.any(Number), expect.any(Object));
    }));
});
describe('OperationsHelper', () => {
    describe('sendcompleteOpAssignCabMsg', () => {
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendUserConfirmOrDeclineNotification').mockResolvedValue();
            jest.spyOn(Notifications_1.default, 'sendManagerConfirmOrDeclineNotification').mockResolvedValue();
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should send completion notifications', () => __awaiter(void 0, void 0, void 0, function* () {
            const ids = {
                requesterSlackId: 'requesterSlackId',
                riderSlackId: 'riderSlackId'
            };
            yield OperationsHelper_1.default.sendCompleteOpAssignCabMsg('teamId', ids, {});
            const { sendUserConfirmOrDeclineNotification, sendManagerConfirmOrDeclineNotification } = Notifications_1.default;
            expect(sendUserConfirmOrDeclineNotification).toBeCalledTimes(1);
            expect(sendManagerConfirmOrDeclineNotification).toBeCalledTimes(1);
        }));
        it('should send completion notifications', () => __awaiter(void 0, void 0, void 0, function* () {
            const ids = {
                requesterSlackId: 'requesterSlackId',
                riderSlackId: 'requesterSlackId'
            };
            yield OperationsHelper_1.default.sendCompleteOpAssignCabMsg('teamId', ids, {});
            const { sendUserConfirmOrDeclineNotification, sendManagerConfirmOrDeclineNotification } = Notifications_1.default;
            expect(sendUserConfirmOrDeclineNotification).toBeCalledTimes(1);
            expect(sendManagerConfirmOrDeclineNotification).toBeCalledTimes(1);
        }));
    });
    describe('getTripDetailsAttachment', () => {
        it('should return tripDetailsAttachment', () => {
            jest.spyOn(OperationsHelper_1.default, 'getTripDetailsAttachment');
            OperationsHelper_1.default.getTripDetailsAttachment(__mocks__2.tripInformation, {});
            expect(OperationsHelper_1.default.getTripDetailsAttachment).toHaveReturned();
        });
    });
    describe('getTripDetailsAttachment', () => {
        const payload = {
            tripStatus: 'Confirmed',
            tripId: 'tripId',
            operationsComment: 'comment',
            confirmedById: 'opsUserId',
            approvalDate: 'timeStamp',
        };
        it('should return trioDetailsAttachment', () => {
            jest.spyOn(OperationsHelper_1.default, 'getUpdateTripStatusPayload');
            const statusPayload = OperationsHelper_1.default
                .getUpdateTripStatusPayload('tripId', 'comment', 'opsUserId', 'timeStamp');
            expect(OperationsHelper_1.default.getUpdateTripStatusPayload).toHaveReturned();
            expect(statusPayload).toEqual(payload);
        });
    });
});
//# sourceMappingURL=OperationsHelper.spec.js.map