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
const InteractivePrompts_1 = __importDefault(require("../InteractivePrompts"));
const InteractivePromptsHelpers_1 = __importDefault(require("../../helpers/slackHelpers/InteractivePromptsHelpers"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const InteractivePrompts_mock_1 = require("../__mocks__/InteractivePrompts.mock");
const LocationPrompts_1 = __importDefault(require("../LocationPrompts"));
const WebClientSingleton_1 = __importDefault(require("../../../../utils/WebClientSingleton"));
const SlackInteractions_mock_1 = require("../../SlackInteractions/__mocks__/SlackInteractions.mock");
const previewScheduleTripAttachments_1 = __importDefault(require("../../helpers/slackHelpers/previewScheduleTripAttachments"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../../helpers/slackHelpers/InteractivePromptSlackHelper"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const database_1 = __importDefault(require("../../../../database"));
jest.mock('../../../slack/events', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
}));
jest.mock('country-list', () => ({
    getCode: () => 'ng',
}));
describe(InteractivePrompts_1.default, () => {
    afterAll((done) => database_1.default.close().then(done, done));
    describe('Interactive Prompts test', () => {
        let getWebClient;
        const update = jest.fn(() => { });
        beforeEach(() => {
            getWebClient = jest.spyOn(WebClientSingleton_1.default, 'getWebClient');
            getWebClient.mockImplementationOnce(() => ({
                chat: { update }
            }));
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                name: 'Jane Doe',
                slackId: 'UN5FDBM1U',
                email: 'jane.doe@gmail.com',
                createdAt: '2019-09-10',
                updatedAt: '2019-09-10'
            };
            yield user_service_1.default.findOrCreateNewUserWithSlackId(user);
        }));
        it('should sendBookNewTrip Response', (done) => {
            const respond = jest.fn((value) => value);
            const payload = jest.fn(() => 'respond');
            const result = InteractivePrompts_1.default.sendBookNewTripResponse(payload, respond);
            expect(result).toBe(undefined);
            expect(respond).toHaveBeenCalledWith(InteractivePrompts_mock_1.sendBookNewTripMock);
            done();
        });
        it('should changeLocation', () => __awaiter(void 0, void 0, void 0, function* () {
            let responseMock;
            const respond = jest.fn((value) => {
                responseMock = value;
                return value;
            });
            const payload = {
                actions: [{ name: 'changeLocation__ng' }],
                user: { id: 'UN5FDBM1U' }
            };
            yield InteractivePrompts_1.default.changeLocation(payload, respond);
            expect(respond).toHaveBeenCalledWith(responseMock);
        }));
        it('should create view open trips response', (done) => {
            const respond = jest.fn((value) => value);
            const result = InteractivePromptSlackHelper_1.default.sendCompletionResponse(respond, 1, 'UH1RT223');
            expect(result).toBe(undefined);
            expect(respond).toHaveBeenCalledWith(InteractivePrompts_mock_1.sendCompletionResponseMock);
            done();
        });
        it('should send decline response', (done) => {
            const tripInitial = {
                id: 2,
                requestId: null,
                departmentId: 23,
                tripStatus: 'Approved',
                department: null,
                destination: { dataValues: {} },
                origin: { dataValues: {} },
                pickup: {},
                departureDate: null,
                requestDate: new Date(),
                requester: { dataValues: {} },
                rider: { dataValues: { slackId: 2 } },
            };
            InteractivePrompts_1.default.sendManagerDeclineOrApprovalCompletion(true, tripInitial, 'timeStamp', 1);
            expect(update).toHaveBeenCalledTimes(1);
            done();
        });
        it('should SendTripError response', (done) => {
            const result = InteractivePromptSlackHelper_1.default.sendTripError();
            expect(result).toHaveProperty('text', 'Dang! I hit an error with this trip');
            done();
        });
        it('should send rider select list', () => {
            const response = jest.fn();
            InteractivePrompts_1.default.sendRiderSelectList({ channel: { id: 1 }, user: { id: 2 } }, response);
            expect(response).toBeCalledTimes(1);
        });
    });
    describe('test send add passenger response', () => {
        it('should provide an interface to add passengers', (done) => {
            const respond = jest.fn((value) => value);
            InteractivePrompts_1.default.sendAddPassengersResponse(respond);
            expect(respond).toHaveBeenCalled();
            done();
        });
    });
    describe('test send add passenger response with forSelf as [false]', () => {
        it('should provide an interface to add passengers', (done) => {
            const respond = jest.fn((value) => value);
            InteractivePrompts_1.default.sendAddPassengersResponse(respond, false);
            expect(respond).toHaveBeenCalled();
            done();
        });
    });
    describe('test send preview response and cancel response', () => {
        beforeEach(() => {
            InteractivePromptsHelpers_1.default.generatePreviewTripResponse = jest.fn(() => 'called');
        });
        it('should return preview response', () => {
            const tripDetailsMock = {
                tripType: 'Airport Transfer',
            };
            const result = InteractivePrompts_1.default.sendPreviewTripResponse(tripDetailsMock);
            expect(result).toBeDefined();
        });
    });
    describe('LocationPrompts', () => {
        let fieldsOrActionsSpy;
        let optionalPropsSpy;
        beforeEach(() => {
            fieldsOrActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
            optionalPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });
        describe('sendLocationSuggestionResponse', () => {
            const backButtonAction = new SlackMessageModels_1.SlackButtonAction('back', '< Back', 'back_to_routes_launch', '#FFCCAA');
            const cancelButtonAction = new SlackMessageModels_1.SlackCancelButtonAction();
            it('should sendLocationSuggestionResponse: atleast one prediction location', () => {
                const predictedLocations = [{ text: 'Location1', value: 'place_id' }];
                const selectedActions = new SlackMessageModels_1.SlackSelectAction('predictedLocations', 'Select Home location', predictedLocations);
                const buttonAction = new SlackMessageModels_1.SlackButtonAction('no', 'Location not listed', 'no');
                LocationPrompts_1.default.sendLocationSuggestionsResponse('https://staticMap', predictedLocations);
                expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
                expect(fieldsOrActionsSpy).toBeCalledWith('actions', [backButtonAction, cancelButtonAction]);
                expect(optionalPropsSpy).toBeCalledWith('new_route_suggestions', '', '#3AAF85');
                expect(optionalPropsSpy).toBeCalledWith('back_to_launch', undefined, '#4285f4');
            });
            it('sendLocationSuggestionResponse: empty PredictionLocations', () => {
                const selectedActions = new SlackMessageModels_1.SlackButtonAction('retry', 'Try Again', 'retry');
                const buttonAction = new SlackMessageModels_1.SlackButtonAction('no', 'Enter Location Coordinates', 'no');
                LocationPrompts_1.default.sendLocationSuggestionsResponse('https://staticMap', []);
                expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
                expect(fieldsOrActionsSpy).toBeCalledWith('actions', [backButtonAction, cancelButtonAction]);
                expect(optionalPropsSpy).toBeCalledWith('new_route_locationNotFound', '', '#3AAF85');
                expect(optionalPropsSpy).toBeCalledWith('back_to_launch', undefined, '#4285f4');
            });
        });
        describe('sendMapSuggestionsResponse', () => {
            it('should sendMapSuggestionsResponse: atleast one prediction location', () => {
                const predictedLocations = [{ text: 'Location1', value: 'place_id' }];
                const selectedActions = new SlackMessageModels_1.SlackSelectAction('pickupBtn', 'Pick Up location', predictedLocations);
                const staticMapUrl = 'https://staticMap';
                const locationData = {
                    staticMapUrl,
                    predictedLocations,
                    pickupOrDestination: 'Pick Up',
                    buttonType: 'pickup',
                    tripType: 'travel_trip'
                };
                fieldsOrActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
                optionalPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
                LocationPrompts_1.default.sendMapSuggestionsResponse(locationData);
                expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions]);
                expect(optionalPropsSpy).toBeCalledWith('travel_trip_suggestions', '', '#3AAF85', 'default', 'pickup');
                const localData = {
                    staticMapUrl,
                    predictedLocations: [],
                    pickupOrDestination: 'Pick Up',
                    buttonType: 'pickup',
                    tripType: 'travel_trip'
                };
                LocationPrompts_1.default.sendMapSuggestionsResponse(localData);
                expect(optionalPropsSpy).toBeCalledWith('travel_trip_locationNotFound', '', '#3AAF85', 'default', 'pickup');
            });
        });
        it('should sendLocationConfirmationResponse', () => {
            const respond = jest.fn((value) => value);
            LocationPrompts_1.default.sendLocationConfirmationResponse(respond, 'https://staticMap', 'test location', '1,1');
            expect(respond).toBeCalled();
        });
        it('Should call respond', () => {
            const respond = jest.fn((value) => value);
            LocationPrompts_1.default.errorPromptMessage(respond);
            expect(respond).toBeCalled();
        });
        describe('sendMapsConfirmationResponse', () => {
            const respond = jest.fn((value) => value);
            const locationData = {
                staticMapUrl: 'https://staticMap', address: 'test location', locationGeometry: '1,1', actionType: 'travel_trip'
            };
            LocationPrompts_1.default.sendMapsConfirmationResponse(respond, locationData, 'pickup');
            expect(respond).toBeCalled();
            LocationPrompts_1.default.sendMapsConfirmationResponse(respond, locationData, 'Pick up');
            expect(respond).toBeCalled();
        });
        it('Should call respond', () => {
            const respond = jest.fn((value) => value);
            LocationPrompts_1.default.errorPromptMessage(respond);
            expect(respond).toBeCalled();
        });
        it('should sendLocationCoordinatesNotFound', () => {
            const respond = jest.fn((value) => value);
            LocationPrompts_1.default.sendLocationCoordinatesNotFound(respond);
            expect(respond).toBeCalled();
        });
        describe('InteractivePrompts_sendScheduleTripHistory', () => {
            beforeEach(() => {
                fieldsOrActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
                optionalPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
            });
            afterEach(() => {
                jest.resetAllMocks();
                jest.clearAllMocks();
            });
            it('should create view open schedule trips response', () => __awaiter(void 0, void 0, void 0, function* () {
                const tripDetails = SlackInteractions_mock_1.createTripData();
                const respond = jest.fn((value) => value);
                jest.spyOn(previewScheduleTripAttachments_1.default, 'previewScheduleTripAttachments').mockResolvedValue();
                yield InteractivePrompts_1.default.sendScheduleTripResponse(tripDetails, respond);
                const confirm = new SlackMessageModels_1.SlackButtonAction('confirmTripRequest', 'Confirm Trip', 'confirm');
                const cancel = new SlackMessageModels_1.SlackCancelButtonAction('Cancel Trip', 'cancel', 'Are you sure you want to cancel this schedule trip', 'cancel_request');
                expect(fieldsOrActionsSpy).toBeCalledWith('actions', [confirm, cancel]);
                expect(optionalPropsSpy).toBeCalledWith('schedule_trip_confirmation', 'fallback', undefined, 'default');
                expect(respond).toBeCalled();
            }));
        });
        describe('InteractivePrompts_sendCancelRequestResponse', () => {
            it('should create view open schedule trips response', () => __awaiter(void 0, void 0, void 0, function* () {
                const respond = jest.fn((value) => value);
                const result = yield InteractivePromptSlackHelper_1.default.sendCancelRequestResponse(respond);
                expect(result).toBe(undefined);
                expect(respond).toHaveBeenCalled();
            }));
        });
        describe('InteractivePrompts_openDestinationDialog', () => {
            beforeEach(() => {
                fieldsOrActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
                optionalPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
            });
            afterEach(() => {
                jest.resetAllMocks();
                jest.clearAllMocks();
            });
            it('should create view open schedule trips response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield InteractivePromptSlackHelper_1.default.openDestinationDialog();
                expect(optionalPropsSpy).toBeCalledWith('travel_trip_destinationSelection', 'fallback', undefined, 'default');
            }));
        });
        describe('InteractivePrompts_sendSelectDestination', () => {
            it('should create select destination button', () => __awaiter(void 0, void 0, void 0, function* () {
                optionalPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
                const respond = jest.fn((value) => value);
                const result = yield InteractivePrompts_1.default.sendSelectDestination(respond);
                expect(result).toBe(undefined);
                expect(respond).toHaveBeenCalled();
                expect(optionalPropsSpy).toBeCalledWith('schedule_trip_destinationSelection');
            }));
        });
    });
});
//# sourceMappingURL=InterativePrompts.spec.js.map