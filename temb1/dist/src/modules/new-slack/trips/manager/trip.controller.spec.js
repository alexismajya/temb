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
const interactions_1 = __importDefault(require("./interactions"));
const constants_1 = __importDefault(require("./constants"));
const trip_controller_1 = __importDefault(require("./trip.controller"));
const trip_helpers_1 = __importDefault(require("./trip.helpers"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const trip_request_1 = require("../../../../database/models/trip-request");
const slack_block_models_1 = require("../../models/slack-block-models");
describe(trip_controller_1.default, () => {
    const basePayload = {
        channel: {
            id: 'U12SH',
        },
        user: {
            id: 'UIS233',
        },
        team: { id: 'UIS233' },
        response_url: 'http://url.com',
    };
    const mockPayload = (action) => (Object.assign({ actions: [{ action_id: action, value: '1' }] }, basePayload));
    const mockTripState = (state = trip_request_1.TripStatus.pending) => ({
        currentState: state, lastActionById: 'U123'
    });
    const approvalPayload = mockPayload(constants_1.default.approve);
    beforeEach(() => {
        jest.spyOn(slack_helpers_1.default, 'getTripState').mockResolvedValue(mockTripState());
        jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage').mockResolvedValue(null);
        jest.spyOn(trip_helpers_1.default, 'getManagerApprovedOrDeclineMessage')
            .mockResolvedValue(new slack_block_models_1.BlockMessage([]));
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(trip_controller_1.default.approve, () => {
        beforeEach(() => {
            jest.spyOn(interactions_1.default, 'sendReasonForm').mockResolvedValue(null);
        });
        afterEach(() => jest.restoreAllMocks());
        it('should send status message when trip is not pending', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'getTripState')
                .mockResolvedValue(mockTripState(trip_request_1.TripStatus.confirmed));
            yield trip_controller_1.default.approve(approvalPayload);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
        }));
        describe('approval', () => {
            it('should submit reason for approving', () => __awaiter(void 0, void 0, void 0, function* () {
                const state = { origin: approvalPayload.response_url,
                    isApproval: 1,
                    tripId: approvalPayload.actions[0].value };
                yield trip_controller_1.default.approve(approvalPayload);
                expect(interactions_1.default.sendReasonForm).toHaveBeenCalledWith(approvalPayload, state);
            }));
        });
        describe('decline', () => {
            const declinePayload = mockPayload(constants_1.default.decline);
            it('should submit reason for declining', () => __awaiter(void 0, void 0, void 0, function* () {
                const state = { origin: declinePayload.response_url,
                    isApproval: 0,
                    tripId: declinePayload.actions[0].value };
                yield trip_controller_1.default.approve(declinePayload);
                expect(interactions_1.default.sendReasonForm).toHaveBeenCalledWith(declinePayload, state);
            }));
        });
    });
    describe(trip_controller_1.default.completeApproveOrDecline, () => {
        const completion = Object.assign(Object.assign({}, basePayload), { submission: {
                reason: 'Good reason',
            }, state: JSON.stringify({ origin: 'http://url.com', tripId: '1', isApproval: 1 }) });
        const mockTeamDetails = { teamId: completion.team.id, botToken: 'xoxp-completion-123' };
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue(mockTeamDetails);
            jest.spyOn(trip_helpers_1.default, 'completeManagerResponse').mockResolvedValue(null);
            jest.spyOn(trip_helpers_1.default, 'notifyManagerIfOpsApproved').mockResolvedValue(null);
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('Manager should approve a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            yield trip_controller_1.default.completeApproveOrDecline(completion);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
            expect(trip_helpers_1.default.notifyManagerIfOpsApproved).toHaveBeenCalledWith(1, completion.channel.id, mockTeamDetails.botToken);
        }));
        it('Manager should decline a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const decline = Object.assign(Object.assign({}, completion), { state: JSON.stringify({
                    origin: 'http://url.com', tripId: '1', isApproval: 0,
                }) });
            yield trip_controller_1.default.completeApproveOrDecline(decline);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
            expect(trip_helpers_1.default.notifyManagerIfOpsApproved).toHaveBeenCalledWith(1, decline.channel.id, mockTeamDetails.botToken);
        }));
        it('Manager should receive trip status', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'getTripState')
                .mockResolvedValue(mockTripState(trip_request_1.TripStatus.confirmed));
            yield trip_controller_1.default.completeApproveOrDecline(completion);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
            expect(trip_helpers_1.default.notifyManagerIfOpsApproved).not.toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=trip.controller.spec.js.map