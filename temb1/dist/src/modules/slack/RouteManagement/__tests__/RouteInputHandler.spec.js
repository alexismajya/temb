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
const maps_1 = __importDefault(require("@google/maps"));
const GoogleMapsMock_1 = __importDefault(require("../../../../helpers/googleMaps/__mocks__/GoogleMapsMock"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const SlackClientMock_1 = __importDefault(require("../../__mocks__/SlackClientMock"));
const LocationPrompts_1 = __importDefault(require("../../SlackPrompts/LocationPrompts"));
const RouteInputHandler_1 = __importDefault(require("../RouteInputHandler"));
const GoogleMapsStatic_1 = __importDefault(require("../../../../services/googleMaps/GoogleMapsStatic"));
const googleMapsHelpers_1 = require("../../../../helpers/googleMaps/googleMapsHelpers");
const DialogPrompts_1 = __importDefault(require("../../SlackPrompts/DialogPrompts"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const UserInputValidator_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator"));
const googleMaps_1 = __importDefault(require("../../../../services/googleMaps"));
const RouteInputHandlerHelper_1 = __importDefault(require("../RouteInputHandlerHelper"));
const PreviewPrompts_1 = __importDefault(require("../../SlackPrompts/PreviewPrompts"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const dummyMockData_1 = __importDefault(require("./dummyMockData"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const slackEvents_1 = require("../../events/slackEvents");
const events_1 = __importDefault(require("../../events"));
const AISService_1 = __importDefault(require("../../../../services/AISService"));
const location_helpers_1 = __importDefault(require("../../../new-slack/helpers/location-helpers"));
const homebase_service_1 = require("../../../homebases/homebase.service");
jest.mock('@google/maps');
const mockedCreateClient = { placesNearby: jest.fn() };
SlackClientMock_1.default();
GoogleMapsMock_1.default();
describe('RouteInputHandler Tests', () => {
    const respond = jest.fn();
    beforeEach(() => {
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({});
        jest.spyOn(maps_1.default, 'createClient').mockReturnValue(mockedCreateClient);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.resetAllMocks();
    });
    describe('RouteInputHandler.home Tests', () => {
        it('should call sendLocationSuggestionsResponse', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user: { id: 'UP0RTRL02' },
                submission: { location: 'Nairobi' },
            };
            const { user: { id: userId }, submission: { location } } = payload;
            const options = {
                selectBlockId: 'user_route_confirm_location',
                selectActionId: 'user_route_pickup_location',
                navBlockId: 'user_route_nav_block',
                navActionId: 'user_route_back',
                backActionValue: 'back_to_routes_launch'
            };
            jest.spyOn(location_helpers_1.default, 'getLocationVerificationMsg').mockReturnValue({});
            yield RouteInputHandler_1.default.home(payload, respond);
            expect(location_helpers_1.default.getLocationVerificationMsg).toHaveBeenCalledWith(location, userId, options);
        }));
        it('should catch thrown errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                type: 'dialog_submission',
                submission: {
                    location: 'test location'
                }
            };
            jest.spyOn(location_helpers_1.default, 'getLocationVerificationMsg')
                .mockRejectedValue(new Error('Dummy error'));
            bugsnagHelper_1.default.log = jest.fn().mockReturnValue({});
            yield RouteInputHandler_1.default.home(payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('RouteInputHandler.suggestion Tests', () => {
        it('should call sendLocationConfirmationResponse', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user: { id: 1 },
                type: 'dialog_submission',
                actions: [{
                        selected_options: [{ value: 'xxxxx' }]
                    }]
            };
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getAddressDetails').mockResolvedValue({
                plus_code: { geometry: { location: { lat: 1, lng: 1 } }, best_street_address: 'Test Location Address' }
            });
            jest.spyOn(GoogleMapsStatic_1.default, 'getLocationScreenshot').mockReturnValue('staticMapUrl');
            jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue({});
            jest.spyOn(LocationPrompts_1.default, 'sendLocationConfirmationResponse').mockReturnValue({});
            yield RouteInputHandler_1.default.suggestions(payload, respond);
            expect(LocationPrompts_1.default.sendLocationConfirmationResponse).toHaveBeenCalled();
        }));
        it('should call sendLocationCoordinatesNotFound', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                submission: { coordinates: '1,1' }
            };
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getAddressDetails')
                .mockResolvedValueOnce(null);
            jest.spyOn(LocationPrompts_1.default, 'sendLocationCoordinatesNotFound').mockReturnValueOnce({});
            yield RouteInputHandler_1.default.suggestions(payload, respond);
            expect(LocationPrompts_1.default.sendLocationCoordinatesNotFound).toHaveBeenCalled();
        }));
        it('should catch thrown errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                submission: {
                    coordinated: '1,1'
                }
            };
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getAddressDetails')
                .mockRejectedValue(new Error('Dummy error'));
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue(null);
            yield RouteInputHandler_1.default.suggestions(payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('RouteInputHandler.sendLocationCoordinatesForm tests', () => {
        it('should call sendLocationCoordinatesForm', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ value: 'no' }]
            };
            jest.spyOn(DialogPrompts_1.default, 'sendLocationCoordinatesForm').mockReturnValue({});
            yield RouteInputHandler_1.default.locationNotFound(payload, respond);
            expect(DialogPrompts_1.default.sendLocationCoordinatesForm).toHaveBeenCalled();
        }));
        it('should call sendLocationForm', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ value: 'retry' }]
            };
            jest.spyOn(DialogPrompts_1.default, 'sendLocationForm').mockReturnValue({});
            yield RouteInputHandler_1.default.locationNotFound(payload, respond);
            expect(DialogPrompts_1.default.sendLocationForm).toHaveBeenCalled();
        }));
    });
    describe('RouteInputHandler.runValidations tests', () => {
        it('should return coordinates validation errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                submission: { coordinates: '1,1' }
            };
            jest.spyOn(UserInputValidator_1.default, 'validateCoordinates')
                .mockImplementation().mockReturnValueOnce([]);
            const errors = yield RouteInputHandler_1.default.runValidations(payload);
            expect(errors.length).toEqual(0);
        }));
        it('should catch validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                submission: { coordinates: 'bad coordinates' }
            };
            jest.spyOn(UserInputValidator_1.default, 'validateCoordinates')
                .mockImplementation().mockReturnValueOnce(['error']);
            const errors = yield RouteInputHandler_1.default.runValidations(payload);
            expect(errors.length).toEqual(1);
        }));
    });
    describe(RouteInputHandler_1.default.continueWithTheFlow, () => {
        it('it should call the home route handler function', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            const payload = { user: { id: 1 } };
            const respond2 = jest.fn();
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ newRouteRequest: 'test' });
            jest.spyOn(RouteInputHandler_1.default, 'home').mockResolvedValue({});
            yield RouteInputHandler_1.default.continueWithTheFlow(payload, respond2);
            expect(cache_1.default.fetch).toBeCalled();
            expect(RouteInputHandler_1.default.home).toBeCalled();
            done();
        }));
    });
    describe('RouteInputHandler: Bus Stop handler', () => {
        let payload;
        beforeEach(() => {
            payload = {
                channel: {},
                team: { id: 1 },
                user: { id: 1 },
                actions: [{ value: '12' }],
                submission: {
                    otherBusStop: 'san',
                    selectBusStop: null,
                }
            };
        });
        afterEach(() => {
            jest.resetModules();
            jest.resetAllMocks();
        });
        describe('handleBusStopRoute', () => {
            beforeEach(() => {
                const asPromise = jest.fn().mockResolvedValue({ json: { results: ['Test'] } });
                mockedCreateClient.placesNearby.mockImplementation(() => ({
                    asPromise
                }));
                jest.spyOn(DialogPrompts_1.default, 'sendBusStopForm').mockResolvedValue({});
                jest.spyOn(cache_1.default, 'save').mockResolvedValue();
                jest.spyOn(googleMaps_1.default, 'mapResultsToCoordinates').mockResolvedValue([{
                        label: 'USIU Stage',
                        text: 'USIU Stage',
                        value: '-1.2249681,36.8853843'
                    }]);
                jest.spyOn(RouteInputHandlerHelper_1.default, 'generateResolvedBusList').mockResolvedValue([{
                        label: 'Andela Nairobi',
                        text: 'Andela Nairobi',
                        value: '1.2345,-0.3456'
                    }]);
            });
            afterEach(() => {
                jest.resetModules();
                jest.resetAllMocks();
            });
            it('handleBusStopRoute throw error', () => __awaiter(void 0, void 0, void 0, function* () {
                yield RouteInputHandler_1.default.handleBusStopRoute(payload, respond);
                expect(respond).toHaveBeenCalled();
            }));
            it('handleBusStopRoute: send dialog', () => __awaiter(void 0, void 0, void 0, function* () {
                const maps = new googleMaps_1.default();
                jest.spyOn(maps, 'findNearestBusStops').mockImplementation([{}]);
                payload.actions[0].value = '23,23';
                yield RouteInputHandler_1.default.handleBusStopRoute(payload, respond);
                expect(DialogPrompts_1.default.sendBusStopForm).toHaveBeenCalledTimes(1);
            }));
            it('should get the value for the nearest bus stop', () => __awaiter(void 0, void 0, void 0, function* () {
                const maps = new googleMaps_1.default();
                jest.spyOn(maps, 'findNearestBusStops').mockImplementation([{}]);
                payload.actions[0].value = '23,23';
                yield RouteInputHandler_1.default.handleBusStopRoute(payload, respond);
                expect(googleMaps_1.default.mapResultsToCoordinates).toBeCalled();
            }));
            it('should send bus stop Dialog form ', () => __awaiter(void 0, void 0, void 0, function* () {
                payload.actions[0].value = '23,23';
                yield RouteInputHandler_1.default.handleBusStopRoute(payload, respond);
                expect(DialogPrompts_1.default.sendBusStopForm).toBeCalled();
            }));
            it('should call continueWithFlow function', (done) => __awaiter(void 0, void 0, void 0, function* () {
                payload.actions[0].name = 'not_listed';
                jest.spyOn(RouteInputHandler_1.default, 'continueWithTheFlow').mockResolvedValueOnce(null);
                yield RouteInputHandler_1.default.handleBusStopRoute(payload, respond);
                expect(RouteInputHandler_1.default.continueWithTheFlow).toBeCalled();
                done();
            }));
        });
        describe('handleBusStopSelected', () => {
            beforeEach(() => {
                jest.spyOn(DialogPrompts_1.default, 'sendBusStopForm').mockResolvedValue();
                jest.spyOn(GoogleMapsStatic_1.default, 'getPathFromDojoToDropOff')
                    .mockResolvedValue('https://sampleMapurl');
                jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getReverseGeocodePayload').mockResolvedValue(dummyMockData_1.default.place);
                jest.spyOn(cache_1.default, 'fetch').mockResolvedValue([{}, {}]);
                jest.spyOn(cache_1.default, 'save').mockResolvedValue();
                jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getPlaceInfo')
                    .mockResolvedValue({ plus_code: { locality: { local_address: 'Nairobi, Kenya' } } });
                jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId')
                    .mockResolvedValue({ country: { name: 'Kenya' } });
            });
            afterEach(() => {
                jest.resetAllMocks();
            });
            it('handleBusStopSelected error. invalid coordinate', () => __awaiter(void 0, void 0, void 0, function* () {
                const resp = yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(respond).toHaveBeenCalledTimes(0);
                expect(resp).toEqual({
                    errors: [{ error: 'You must submit a valid coordinate', name: 'otherBusStop' }]
                });
            }));
            it('handleBusStopSelected error. Location in Different homebase', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId')
                    .mockResolvedValue({ country: { name: 'Rwanda' } });
                payload = Object.assign(Object.assign({}, payload), { submission: { selectBusStop: '34,45' } });
                const resp = yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(respond).toHaveBeenCalledTimes(0);
                expect(resp).toEqual({
                    errors: [{ error: 'The selected location should be within your homebase country', name: 'selectBusStop' }]
                });
            }));
            it('handleBusStopSelected error. both fields submitted', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: { otherBusStop: 'san', selectBusStop: 'san', } });
                const resp = yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(respond).toHaveBeenCalledTimes(0);
                expect(resp).toEqual({
                    errors: [{
                            error: 'You can not fill in this field if you selected a stop in the drop down',
                            name: 'otherBusStop'
                        }]
                });
            }));
            it('handleBusStopSelected error. none of the fields is submitted', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: {} });
                const resp = yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(respond).toHaveBeenCalledTimes(0);
                expect(resp).toEqual({
                    errors: [{ error: 'One of the fields must be filled.', name: 'otherBusStop' }]
                });
            }));
            it('handleBusStopSelected with valid coordinates', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: { selectBusStop: '34,45' } });
                const previewData = {};
                jest.spyOn(RouteInputHandlerHelper_1.default, 'resolveDestinationPreviewData')
                    .mockReturnValue(previewData);
                jest.spyOn(PreviewPrompts_1.default, 'displayDestinationPreview')
                    .mockReturnValue({});
                jest.spyOn(RouteInputHandlerHelper_1.default, 'savePreviewDataToCache')
                    .mockReturnValue({});
                yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(PreviewPrompts_1.default.displayDestinationPreview).toHaveBeenCalledWith(previewData);
            }));
            it('handleBusStopSelected with invalid distance coordinates', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: { selectBusStop: '34,45' } });
                const previewData = { validationError: { test: 'AAAAAA' } };
                jest.spyOn(RouteInputHandlerHelper_1.default, 'resolveDestinationPreviewData')
                    .mockReturnValue(previewData);
                jest.spyOn(PreviewPrompts_1.default, 'displayDestinationPreview')
                    .mockReturnValue({});
                jest.spyOn(RouteInputHandlerHelper_1.default, 'savePreviewDataToCache')
                    .mockReturnValue({});
                const result = yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(result).toBe(previewData.validationError);
                expect(PreviewPrompts_1.default.displayDestinationPreview).not.toHaveBeenCalled();
            }));
            it('handleBusStopSelected should handle error properly', () => __awaiter(void 0, void 0, void 0, function* () {
                payload = Object.assign(Object.assign({}, payload), { submission: { selectBusStop: '34,45' } });
                const previewData = { validationError: { test: 'AAAAAA' } };
                jest.spyOn(RouteInputHandlerHelper_1.default, 'resolveDestinationPreviewData')
                    .mockRejectedValue(previewData);
                jest.spyOn(PreviewPrompts_1.default, 'displayDestinationPreview')
                    .mockReturnValue({});
                jest.spyOn(RouteInputHandlerHelper_1.default, 'savePreviewDataToCache')
                    .mockReturnValue({});
                jest.spyOn(bugsnagHelper_1.default, 'log')
                    .mockReturnValue({});
                yield RouteInputHandler_1.default.handleBusStopSelected(payload, respond);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
                expect(PreviewPrompts_1.default.displayDestinationPreview).not.toHaveBeenCalled();
            }));
        });
    });
    describe('RouteInputHandlers_handleNewRouteRequest', () => {
        beforeEach(() => {
            jest.spyOn(DialogPrompts_1.default, 'sendNewRouteForm').mockResolvedValue();
        });
        it('should handle route request', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { actions: [{ value: 'launchNewRoutePrompt' }] };
            yield RouteInputHandler_1.default.handleNewRouteRequest(payload, respond);
            expect(DialogPrompts_1.default.sendNewRouteForm).toBeCalled();
        }));
    });
    describe('RouteInputHandlers_handlePreviewPartnerInfo', () => {
        const { partnerInfo: { userId, teamId }, locationInfo, partnerInfo } = dummyMockData_1.default;
        const placement = {
            client: 'john doe',
            status: 'External Engagements',
            end_date: '2018-11-21T08:04:16.625Z',
            start_date: '2018-11-21T08:04:16.625Z',
        };
        beforeEach(() => {
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue(partnerInfo);
            jest.spyOn(slackHelpers_1.default, 'getUserInfoFromSlack').mockResolvedValue({
                profile: { email: 'john@andela.com' }
            });
            jest.spyOn(AISService_1.default, 'getUserDetails').mockResolvedValue({ placement });
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ locationInfo });
            jest.spyOn(PreviewPrompts_1.default, 'sendPartnerInfoPreview').mockResolvedValue();
        });
        it('should display a preview of the fellows information', () => __awaiter(void 0, void 0, void 0, function* () {
            const submission = { managerId: 'Test_567', workingHours: '20:30 - 02:30' };
            const payload = { user: { id: userId }, team: { id: teamId }, submission };
            yield RouteInputHandler_1.default.handlePreviewPartnerInfo(payload, respond);
            expect(AISService_1.default.getUserDetails).toHaveBeenCalledWith('john@andela.com');
            expect(PreviewPrompts_1.default.sendPartnerInfoPreview).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Object));
        }));
        it('should return an error when user enter invalid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const submission = { nameOfPartner: '', workingHours: '20:30 - hello' };
            const payload = { user: { id: userId }, team: { id: teamId }, submission };
            const res = yield RouteInputHandler_1.default.handlePreviewPartnerInfo(payload, respond);
            const { errors: [SlackDialogError] } = res;
            const { name, error } = SlackDialogError;
            expect(name).toEqual('workingHours');
            expect(error).toEqual('Invalid date');
        }));
    });
    describe('RouteInputHandlers_handlePartnerForm', () => {
        const { partnerInfo: { userId, teamId } } = dummyMockData_1.default;
        beforeEach(() => {
            jest.spyOn(RouteInputHandlerHelper_1.default, 'handleRouteRequestSubmission')
                .mockResolvedValue({ id: userId });
        });
        it('should submit the preview form', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { team: { id: teamId } };
            yield RouteInputHandler_1.default.handlePartnerForm(payload, respond);
            expect(RouteInputHandlerHelper_1.default.handleRouteRequestSubmission).toBeCalled();
        }));
        it('should throw an error when it cannot trigger notification', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteInputHandlerHelper_1.default, 'handleRouteRequestSubmission').mockResolvedValue();
            const payload = { team: { id: null } };
            const res = yield RouteInputHandler_1.default.handlePartnerForm(payload, respond);
            expect(res).toBeFalsy();
        }));
    });
    describe('handleNewRouteRequest', () => {
        let payload;
        beforeEach(() => {
            payload = {
                team: { id: 'AAAAAA' },
                actions: [{}]
            };
        });
        it('should notify manager when submission is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteInputHandlerHelper_1.default, 'handleRouteRequestSubmission')
                .mockResolvedValue({ id: 'BBBBBB' });
            jest.spyOn(events_1.default, 'raise').mockReturnValue();
            yield RouteInputHandler_1.default.handlePartnerForm(payload, respond);
            expect(events_1.default.raise.mock.calls[0][0]).toBe(slackEvents_1.slackEventNames.NEW_ROUTE_REQUEST);
            expect(respond).toHaveBeenCalledWith(new SlackMessageModels_1.SlackInteractiveMessage('Your Route Request has been successfully submitted'));
        }));
    });
});
//# sourceMappingURL=RouteInputHandler.spec.js.map