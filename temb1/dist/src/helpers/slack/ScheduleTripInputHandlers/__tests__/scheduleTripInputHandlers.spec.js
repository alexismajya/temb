"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const InteractivePrompts_1 = __importDefault(require("../../../../modules/slack/SlackPrompts/InteractivePrompts"));
const DialogPrompts_1 = __importDefault(require("../../../../modules/slack/SlackPrompts/DialogPrompts"));
const ScheduleTripController_1 = __importDefault(require("../../../../modules/slack/TripManagement/ScheduleTripController"));
const SlackInteractions_mock_1 = require("../../../../modules/slack/SlackInteractions/__mocks__/SlackInteractions.mock");
const cache_1 = __importDefault(require("../../../../modules/shared/cache"));
const Validators_1 = __importDefault(require("../../UserInputValidator/Validators"));
const locationsMapHelpers_1 = __importDefault(require("../../../googleMaps/locationsMapHelpers"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../../../../modules/slack/helpers/slackHelpers/InteractivePromptSlackHelper"));
jest.mock('../../../../modules/slack/events/', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
}));
jest.mock('../../../../modules/slack/events/slackEvents', () => ({
    SlackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
    slackEventNames: Object.freeze({
        TRIP_APPROVED: 'trip_approved',
        TRIP_WAITING_CONFIRMATION: 'trip_waiting_confirmation',
        NEW_TRIP_REQUEST: 'new_trip_request',
        DECLINED_TRIP_REQUEST: 'declined_trip_request'
    })
}));
describe('ScheduleTripInputHandlers Tests', () => {
    const payload = SlackInteractions_mock_1.createTripPayload('dummyValue');
    let responder;
    beforeAll(() => {
        responder = SlackInteractions_mock_1.respondMock();
        cache_1.default.fetch = jest.fn(() => ({ forSelf: 'true' }));
        cache_1.default.save = jest.fn();
        jest.spyOn(Validators_1.default, 'validateDialogSubmission')
            .mockReturnValue([]);
        jest.spyOn(locationsMapHelpers_1.default, 'locationVerify');
        jest.spyOn(locationsMapHelpers_1.default, 'locationSuggestions');
        jest.spyOn(InteractivePrompts_1.default, 'sendScheduleTripResponse');
        InteractivePrompts_1.default.sendSelectDestination = jest.fn(() => { });
        InteractivePrompts_1.default.sendListOfDepartments = jest.fn(() => { });
        InteractivePrompts_1.default.sendRiderSelectList = jest.fn(() => { });
        InteractivePrompts_1.default.sendAddPassengersResponse = jest.fn(() => { });
        InteractivePromptSlackHelper_1.default.sendCompletionResponse = jest.fn(() => { });
        DialogPrompts_1.default.sendTripDetailsForm = jest.fn(() => { });
        ScheduleTripController_1.default.createTripRequest = jest.fn(() => 1);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('createDepartmentPayloadObject', () => {
        it('should return navigation callbackId of "schedule_trip_reason"', () => {
            const result = index_1.createDepartmentPayloadObject(payload, responder);
            expect(result.navButtonCallbackId)
                .toEqual('schedule_trip_reason');
        });
        it('should return navigation callbackId of "schedule_trip_rider"', () => {
            const result = index_1.createDepartmentPayloadObject(payload, responder, 'false');
            expect(result.navButtonCallbackId)
                .toEqual('schedule_trip_rider');
        });
    });
});
//# sourceMappingURL=scheduleTripInputHandlers.spec.js.map