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
const DialogPrompts_1 = __importDefault(require("../../../slack/SlackPrompts/DialogPrompts"));
const interactions_1 = __importDefault(require("./interactions"));
const trip_request_1 = require("../../../../database/models/trip-request");
const trip_helpers_1 = __importDefault(require("../manager/trip.helpers"));
const trip_1 = require("../__mocks__/trip");
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
describe(interactions_1.default, () => {
    let payload;
    let state;
    let dialogSpy;
    let action;
    beforeEach(() => {
        payload = { user: { id: 'U1567' } };
        state = { origin: 'https;//github.com', tripId: '39', isApproval: 1 };
        action = 'Approval' || 'Decline';
        dialogSpy = jest.spyOn(DialogPrompts_1.default, 'sendDialog').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('sendTripReasonForm', () => {
        it('should send trip reason form', () => __awaiter(void 0, void 0, void 0, function* () {
            yield interactions_1.default.sendReasonForm(payload, state);
            expect(dialogSpy).toHaveBeenCalledTimes(1);
            expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
                title: `Reason for ${action}`,
                submit_label: 'Submit',
            })), payload);
        }));
    });
    describe('sendOpsDeclineOrApprovalCompletion', () => {
        const status = Object.assign(Object.assign({}, trip_1.trip), { lastActionById: 'UP0V0HLQ3', currentState: '' });
        it('should send ops decline or approval', () => __awaiter(void 0, void 0, void 0, function* () {
            status.currentState = trip_request_1.TripStatus.declinedByOps;
            const getApprovalOrDeclineMessage = jest.spyOn(trip_helpers_1.default, 'getApprovalOrDeclineMessage')
                .mockResolvedValue({ trip: trip_1.trip, status, channel: 'channelId', userId: 'UP0V0HLQ3' });
            yield interactions_1.default.sendOpsDeclineOrApprovalCompletion(false, trip_1.trip, '3456787654.3456787654', 'DM45676543', 'http://www.slacktembea.com');
            expect(getApprovalOrDeclineMessage).toHaveBeenCalled();
        }));
        it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log').mockResolvedValue('error');
            const data = {
                name: null,
                origin: { address: null },
                destination: { address: null },
                requester: { slackId: null },
            };
            yield interactions_1.default.sendOpsDeclineOrApprovalCompletion(data, 'botToken');
            expect(bugsnagHelper_1.default.log).toBeCalled();
        }));
    });
    describe('sendRequesterApprovedNotification', () => {
        let sendNotification;
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('YES');
            jest.spyOn(trip_helpers_1.default, 'getApprovedMessageOfRequester').mockResolvedValue(['message']);
            sendNotification = jest.spyOn(Notifications_1.default, 'sendNotification');
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should successfully send approve notification to requester', () => __awaiter(void 0, void 0, void 0, function* () {
            const responseData = Object.assign(Object.assign({}, trip_1.trip), { requester: { slackId: 2 }, managerComment: 'Hello', distance: '12km', reason: 'Hey', noOfPassengers: 2, approvedById: 3, tripType: 'Regular Trip' });
            sendNotification.mockResolvedValueOnce(null);
            yield interactions_1.default
                .sendRequesterApprovedNotification(responseData, 'slackBotOauthToken');
            expect(sendNotification).toHaveBeenCalledTimes(1);
        }));
        it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log').mockResolvedValue('error');
            const data = {
                name: null,
                origin: { address: null },
                destination: { address: null },
                requester: { slackId: null },
            };
            sendNotification.mockRejectedValueOnce(new Error());
            yield interactions_1.default
                .sendRequesterApprovedNotification(data, 'botToken');
            expect(bugsnagHelper_1.default.log).toBeCalled();
        }));
    });
});
//# sourceMappingURL=interactions.spec.js.map