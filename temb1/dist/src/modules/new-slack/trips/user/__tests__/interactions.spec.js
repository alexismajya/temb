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
const interactions_1 = __importDefault(require("../interactions"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const DialogPrompts_1 = __importDefault(require("../../../../slack/SlackPrompts/DialogPrompts"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../../helpers/slack/updatePastMessageHelper"));
const user_data_mocks_1 = require("../__mocks__/user-data-mocks");
const user_trip_helpers_1 = __importDefault(require("../user-trip-helpers"));
const ScheduleTripInputHandlers_1 = require("../../../../../helpers/slack/ScheduleTripInputHandlers");
const previewScheduleTripAttachments_1 = __importDefault(require("../../../../slack/helpers/slackHelpers/previewScheduleTripAttachments"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const SlackViews_1 = require("../../../extensions/SlackViews");
const __mocks__1 = require("../__mocks__");
describe('Interactions', () => {
    let payload;
    let state;
    let dialogSpy;
    beforeEach(() => {
        payload = { user: { id: 'U1567' } };
        state = { origin: 'https;//github.com' };
        dialogSpy = jest.spyOn(DialogPrompts_1.default, 'sendDialog').mockResolvedValue();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('sendTripReasonForm', () => {
        it('should send trip reason form', () => __awaiter(void 0, void 0, void 0, function* () {
            yield interactions_1.default.sendTripReasonForm(payload, state);
            expect(dialogSpy).toHaveBeenCalledTimes(1);
            expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
                title: 'Reason for booking trip',
                submit_label: 'Submit'
            })), payload);
        }));
    });
    describe('sendDetailsForm', () => {
        it('should send details form', () => __awaiter(void 0, void 0, void 0, function* () {
            const details = {
                title: 'pickup details',
                submitLabel: 'Submit',
                callbackId: 'id',
                fields: 'fields'
            };
            yield interactions_1.default.sendDetailsForm(payload, state, details);
            expect(dialogSpy).toHaveBeenCalledTimes(1);
            expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
                title: 'pickup details',
                submit_label: 'Submit'
            })), payload);
        }));
    });
    describe('sendPostDestinationMessage, sendPostPickupMessage', () => {
        const newPayload = {
            submission: {
                date: '2019-12-03',
                time: '23:09',
                pickup: 'Andela Nairobi'
            },
            team: {
                id: 'HGYYY667'
            },
            user: {
                id: 'HUIO56LO'
            },
            view: {
                private_metadata: '{ "origin": "https://origin.com"}'
            }
        };
        beforeEach(() => {
            jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage').mockResolvedValue();
        });
        it('should send post destination message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(JSON, 'parse').mockImplementationOnce(() => ({ origin: '' }));
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(user_data_mocks_1.userTripDetails);
            jest.spyOn(user_trip_helpers_1.default, 'getLocationVerificationMsg').mockResolvedValue();
            jest.spyOn(previewScheduleTripAttachments_1.default, 'getDistance').mockResolvedValue('10 Km');
            yield interactions_1.default.sendPostDestinationMessage(newPayload);
            expect(cache_1.default.fetch).toHaveBeenCalledWith(ScheduleTripInputHandlers_1.getTripKey(newPayload.user.id));
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
        }));
        it('should send post pickup message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_trip_helpers_1.default, 'getPostPickupMessage')
                .mockResolvedValue(newPayload, newPayload.submission);
            jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage')
                .mockResolvedValue('origin', 'message');
            yield interactions_1.default.sendPostPickUpMessage(newPayload, newPayload.submission);
            expect(user_trip_helpers_1.default.getPostPickupMessage).toBeCalled();
        }));
    });
    describe(interactions_1.default.sendPickupModal, () => {
        const teamdetails = { teamId: 'U123', botToken: 'xoxp-123' };
        it('should send pickup modal', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                .mockResolvedValue(teamdetails.botToken);
            const slackViewsSpy = jest.spyOn(SlackViews_1.SlackViews.prototype, 'open');
            const payloadData = {
                team: {
                    id: teamdetails.teamId,
                },
                trigger_id: '123',
            };
            yield interactions_1.default.sendPickupModal('homebase', payloadData);
            expect(slackViewsSpy)
                .toHaveBeenCalledWith(payloadData.trigger_id, expect.any(Object));
        }));
    });
    describe('send Edit Request Modal', () => {
        const teamdetails = { teamId: 'U123', botToken: 'xoxp-123' };
        it('should send edit request modal', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                .mockResolvedValue(teamdetails.botToken);
            const slackViewsSpy = jest.spyOn(SlackViews_1.SlackViews.prototype, 'open');
            yield interactions_1.default.sendEditRequestModal(__mocks__1.tripInfo, 1, 'ABC', __mocks__1.responseUrl, __mocks__1.allDepartments, __mocks__1.homeBaseName);
            expect(slackViewsSpy)
                .toHaveBeenCalledWith('ABC', expect.any(Object));
        }));
    });
});
//# sourceMappingURL=interactions.spec.js.map