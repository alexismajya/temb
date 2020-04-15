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
const feedback_service_1 = require("../../../feedback/feedback.service");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const web_socket_event_service_1 = __importDefault(require("../../../events/web-socket-event.service"));
const itinerary_controller_1 = __importDefault(require("../../../new-slack/trips/user/itinerary.controller"));
const index_1 = __importDefault(require("../index"));
const DialogPrompts_1 = __importStar(require("../../SlackPrompts/DialogPrompts"));
const CancelTripController_1 = __importDefault(require("../../TripManagement/CancelTripController"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const SlackInteractions_mock_1 = require("../__mocks__/SlackInteractions.mock");
const TripActionsController_1 = __importDefault(require("../../TripManagement/TripActionsController"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const InteractivePrompts_1 = __importDefault(require("../../SlackPrompts/InteractivePrompts"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const TravelTripHelper_1 = __importDefault(require("../../helpers/slackHelpers/TravelTripHelper"));
const RouteManagement_1 = __importDefault(require("../../RouteManagement"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const SlackController_1 = __importDefault(require("../../SlackController"));
const ViewTripHelper_1 = __importDefault(require("../../helpers/slackHelpers/ViewTripHelper"));
const JoinRouteInteractions_1 = __importDefault(require("../../RouteManagement/JoinRoute/JoinRouteInteractions"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const OpsTripActions_1 = __importDefault(require("../../TripManagement/OpsTripActions"));
const ProvidersController_1 = __importDefault(require("../../RouteManagement/ProvidersController"));
const SlackInteractionsHelpers_1 = __importDefault(require("../../helpers/slackHelpers/SlackInteractionsHelpers"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../../helpers/slackHelpers/InteractivePromptSlackHelper"));
const provider_service_1 = require("../../../providers/provider.service");
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
const OpsDialogPrompts_1 = __importDefault(require("../../SlackPrompts/OpsDialogPrompts"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const twilio_mocks_1 = require("../../../notifications/whatsapp/twilio.mocks");
const reschedule_helper_1 = __importDefault(require("../../../new-slack/trips/user/reschedule.helper"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const user_trip_booking_controller_1 = __importDefault(require("../../../new-slack/trips/user/user-trip-booking-controller"));
const seeAvailableRoute_controller_1 = __importDefault(require("../../../new-slack/routes/user/seeAvailableRoute.controller"));
const trip_events_handlers_1 = __importDefault(require("../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../__mocks__/socket.ioMock"));
const feedbackHelper_1 = __importDefault(require("../../helpers/slackHelpers/feedbackHelper"));
twilio_mocks_1.mockWhatsappOptions();
describe(index_1.default, () => {
    let payload1;
    let respond;
    beforeAll(() => {
        respond = jest.fn();
        payload1 = {
            actions: [{
                    value: 'tests'
                }],
            channel: { id: 2 },
            original_message: { ts: 'dsfdf' },
            user: { id: 3 }
        };
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xyz');
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    describe(index_1.default.launch, () => {
        beforeAll(() => {
            respond = jest.fn();
        });
        it('should test back_to_launch', () => __awaiter(void 0, void 0, void 0, function* () {
            const testResponse = new SlackMessageModels_1.SlackInteractiveMessage('welcome');
            jest.spyOn(SlackController_1.default, 'getWelcomeMessage').mockResolvedValue(testResponse);
            const payload = SlackInteractions_mock_1.createPayload('back_to_launch');
            yield index_1.default.launch(payload, respond);
            expect(respond).toHaveBeenCalledWith(testResponse);
        }));
        it('should test leave_route', () => __awaiter(void 0, void 0, void 0, function* () {
            const testResponse = new SlackMessageModels_1.SlackInteractiveMessage('leave route');
            jest.spyOn(SlackController_1.default, 'leaveRoute').mockResolvedValue(testResponse);
            const payload = SlackInteractions_mock_1.createPayload('leave_route');
            yield index_1.default.launch(payload, respond);
            expect(respond).toHaveBeenCalledWith(testResponse);
        }));
        it('should test back_to_launch', () => __awaiter(void 0, void 0, void 0, function* () {
            const testResponse = new SlackMessageModels_1.SlackInteractiveMessage('this is travel');
            jest.spyOn(SlackController_1.default, 'getTravelCommandMsg').mockResolvedValue(testResponse);
            const payload = SlackInteractions_mock_1.createPayload('back_to_travel_launch');
            yield index_1.default.launch(payload, respond);
            expect(respond).toHaveBeenCalledWith(testResponse);
        }));
        it('should test back_to_routes_launch', () => __awaiter(void 0, void 0, void 0, function* () {
            const testResponse = new SlackMessageModels_1.SlackInteractiveMessage('this is route launch');
            jest.spyOn(SlackController_1.default, 'getRouteCommandMsg').mockResolvedValue(testResponse);
            const payload = SlackInteractions_mock_1.createPayload('back_to_routes_launch');
            yield index_1.default.launch(payload, respond);
            expect(respond).toHaveBeenCalledWith(testResponse);
        }));
        it('should test launch default response', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload();
            yield index_1.default.launch(payload, respond);
            expect(respond).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('Thank you'),
            }));
        }));
    });
    describe(index_1.default.handleTripActions, () => {
        let response;
        let payload;
        beforeEach(() => {
            payload = {
                callback_id: 'operations_reason_dialog_trips',
                submission: {
                    confirmationComment: 'yes',
                    driverName: 'Valid Name',
                    driverPhoneNo: '1234567890',
                    regNumber: 'LNS 8367*'
                }
            };
            response = jest.fn();
            jest.spyOn(DialogPrompts_1.default, 'sendOperationsApprovalDialog').mockResolvedValue(null);
            jest.spyOn(DialogPrompts_1.default, 'sendOperationsDeclineDialog').mockResolvedValue(null);
            jest.spyOn(TripActionsController_1.default, 'changeTripStatus').mockResolvedValue({});
            jest.spyOn(TripActionsController_1.default, 'runCabValidation').mockReturnValue(null);
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            payload.actions = [{ name: 'declineRequest' }];
            const error = new Error('not working');
            jest.spyOn(TripActionsController_1.default, 'changeTripStatus').mockRejectedValue(error);
            yield index_1.default.handleTripActions(payload, response);
            expect(response).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('Unsuccessful request'),
            }));
        }));
        it('should handle validation error', () => __awaiter(void 0, void 0, void 0, function* () {
            const errors = [{ message: 'dummy error message' }];
            jest.spyOn(TripActionsController_1.default, 'runCabValidation').mockReturnValue([...errors]);
            const error = yield index_1.default.handleTripActions(payload, response);
            expect(error).toEqual({ errors });
            expect(TripActionsController_1.default.changeTripStatus).not.toHaveBeenCalled();
        }));
        it('should handle confirmationComment', () => __awaiter(void 0, void 0, void 0, function* () {
            yield index_1.default.handleTripActions(payload, response);
            expect(TripActionsController_1.default.changeTripStatus).toHaveBeenCalled();
        }));
        it('should handle declineComment', () => __awaiter(void 0, void 0, void 0, function* () {
            payload.submission = { opsDeclineComment: 'fghj' };
            yield index_1.default.handleTripActions(payload, response);
            expect(TripActionsController_1.default.changeTripStatus).toHaveBeenCalled();
        }));
    });
    describe(index_1.default.bookTravelTripStart, () => {
        beforeEach(() => {
            jest.spyOn(cache_1.default, 'save').mockResolvedValue(null);
        });
        it('should return thank you message', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('can', 'cancel');
            yield index_1.default.bookTravelTripStart(payload, respond);
            expect(respond).toHaveBeenCalledWith(SlackInteractions_mock_1.responseMessage('Thank you for using Tembea. See you again.'));
        }));
        it('should return thank you message', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('can', 'airport');
            const sendTripDetailsForm = jest.spyOn(DialogPrompts_1.default, 'sendTripDetailsForm');
            sendTripDetailsForm.mockImplementation((value1, value2) => ({ value1, value2 }));
            yield index_1.default.bookTravelTripStart(payload, respond);
            expect(cache_1.default.save).toHaveBeenCalled();
            expect(sendTripDetailsForm).toHaveBeenCalledWith(payload, 'travelTripContactDetailsForm', 'travel_trip_contactDetails');
        }));
        it('should handle changeLocation via travel command', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('change_location', 'changeLocation__travel');
            jest.spyOn(InteractivePrompts_1.default, 'changeLocation').mockResolvedValue(null);
            yield index_1.default.bookTravelTripStart(payload, respond);
            expect(InteractivePrompts_1.default.changeLocation).toHaveBeenCalled();
        }));
    });
    describe(index_1.default.handleTravelTripActions, () => {
        beforeEach(() => {
            respond = SlackInteractions_mock_1.respondMock();
        });
        it('should call the tripHandler method based on callBackId', () => {
            const payload = SlackInteractions_mock_1.createPayload('testBack', 'cancel');
            TravelTripHelper_1.default.testBack = jest.fn((value1, value2) => ({ value1, value2 }));
            index_1.default.handleTravelTripActions(payload, respond);
            expect(TravelTripHelper_1.default.testBack).toHaveBeenCalledWith(payload, respond);
        });
        it('should call the tripHandler method based on callBackId', () => {
            const payload = SlackInteractions_mock_1.createPayload('test', 'cancel');
            index_1.default.handleTravelTripActions(payload, respond);
            expect(respond).toHaveBeenCalledWith(SlackInteractions_mock_1.responseMessage('Thank you for using Tembea. See you again.'));
        });
    });
    describe(index_1.default.startRouteActions, () => {
        beforeEach(() => {
            respond = SlackInteractions_mock_1.respondMock();
            DialogPrompts_1.default.sendLocationForm = jest.fn();
            jest.spyOn(JoinRouteInteractions_1.default, 'handleViewAvailableRoutes').mockResolvedValue();
            jest.spyOn(JoinRouteInteractions_1.default, 'sendCurrentRouteMessage').mockResolvedValue();
        });
        it('should test my_current_route action', (done) => {
            const payload = SlackInteractions_mock_1.createPayload('my_current_route');
            index_1.default.startRouteActions(payload, respond);
            expect(JoinRouteInteractions_1.default.sendCurrentRouteMessage).toBeCalled();
            done();
        });
        it('should test view_available_routes action', (done) => {
            const payload = SlackInteractions_mock_1.createPayload('view_available_routes');
            jest.spyOn(seeAvailableRoute_controller_1.default, 'seeAvailableRoutes').mockResolvedValue(payload, respond);
            index_1.default.startRouteActions(payload, respond);
            expect(seeAvailableRoute_controller_1.default.seeAvailableRoutes).toBeCalled();
            done();
        });
        it('should test change location action', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(InteractivePrompts_1.default, 'changeLocation').mockResolvedValue();
            const payload = SlackInteractions_mock_1.createPayload('change_location');
            yield index_1.default.startRouteActions(payload, respond);
            expect(InteractivePrompts_1.default.changeLocation).toBeCalled();
        }));
        it('should test request_new_route action', (done) => {
            const payload = SlackInteractions_mock_1.createPayload('request_new_route');
            index_1.default.startRouteActions(payload, respond);
            expect(DialogPrompts_1.default.sendLocationForm).toHaveBeenCalledWith(payload);
            done();
        });
        it('should call the tripHandler method based on callBackId', () => {
            const payload = SlackInteractions_mock_1.createPayload('test', 'cancel');
            index_1.default.startRouteActions(payload, respond);
            expect(respond).toHaveBeenCalledWith(SlackInteractions_mock_1.responseMessage('Thank you for using Tembea. See you again.'));
        });
    });
    describe(index_1.default.handleRouteActions, () => {
        beforeEach(() => {
            respond = SlackInteractions_mock_1.respondMock();
            DialogPrompts_1.default.sendLocationForm = jest.fn();
            jest.spyOn(JoinRouteInteractions_1.default, 'handleViewAvailableRoutes').mockResolvedValue();
            jest.spyOn(JoinRouteInteractions_1.default, 'sendCurrentRouteMessage').mockResolvedValue();
        });
        it('should call handleRouteActions based on the callBackId', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('testBack', 'cancel');
            RouteManagement_1.default.testBack = jest.fn((value1, value2) => ({ value1, value2 }));
            yield index_1.default.handleRouteActions(payload, respond);
            expect(RouteManagement_1.default.testBack).toHaveBeenCalledWith(payload, respond);
        }));
        it('should call handleRouteActions based on the callBackId', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('test', 'cancel');
            yield index_1.default.handleRouteActions(payload, respond);
            expect(respond).toHaveBeenCalledWith(SlackInteractions_mock_1.responseMessage('Thank you for using Tembea. See you again.'));
        }));
        it('should return validation errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { callback_id: 'new_route_runValidations' };
            jest.spyOn(RouteManagement_1.default, 'runValidations')
                .mockImplementationOnce().mockReturnValueOnce(['error']);
            const result = yield index_1.default.handleRouteActions(payload, respond);
            expect(result).toHaveProperty('errors');
        }));
        it('should run bugsnag when errors are thrown', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {};
            jest.spyOn(bugsnagHelper_1.default, 'log').mockResolvedValue(null);
            yield index_1.default.handleRouteActions(payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe(index_1.default.completeTripResponse, () => {
        it('should call sendCompletion interactive messages', () => {
            const message = jest.spyOn(InteractivePromptSlackHelper_1.default, 'sendCompletionResponse')
                .mockReturnValue(null);
            index_1.default.completeTripResponse(payload1, respond);
            expect(message).toHaveBeenCalled();
        });
        it('should handle errors', () => {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            jest.spyOn(InteractivePromptSlackHelper_1.default, 'sendCompletionResponse').mockImplementation(() => {
                throw new Error('error');
            });
            index_1.default.completeTripResponse(payload1, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(respond).toHaveBeenCalledWith(expect.objectContaining({
                text: 'Error:bangbang: : We could not complete this process please try again.',
            }));
        });
    });
    describe(index_1.default.handleSelectProviderAction, () => {
        it('should call selectProviderDialog with payload data for confirmTrip actions', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                actions: [
                    {
                        name: 'confirmTrip'
                    }
                ],
                channel: { id: 'ABC' },
                team: { id: 'XYZ' }
            };
            const sendSelectProviderDialogSpy = jest.spyOn(DialogPrompts_1.default, 'sendSelectProviderDialog')
                .mockResolvedValue();
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
            yield SlackInteractionsHelpers_1.default.handleSelectProviderAction(data);
            expect(sendSelectProviderDialogSpy).toHaveBeenCalled();
        }));
        it('should handle provider actions', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(DialogPrompts_1.default, 'sendSelectCabDialog').mockResolvedValue();
            const payload = SlackInteractions_mock_1.createPayload('accept_route_request');
            yield SlackInteractionsHelpers_1.default.startProviderActions(payload, respond);
            expect(DialogPrompts_1.default.sendSelectCabDialog).toBeCalled();
        }));
        it('should handle provider actions', (done) => {
            const payload = SlackInteractions_mock_1.createPayload('default');
            SlackInteractionsHelpers_1.default.startProviderActions(payload, respond);
            expect(respond).toHaveBeenCalledWith(SlackInteractions_mock_1.responseMessage('Thank you for using Tembea. See you again.'));
            done();
        });
        it('should handle decline request action', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                actions: [
                    {
                        name: 'declineRequest'
                    }
                ]
            };
            const sendOperationsDeclineDialogSpy = jest.spyOn(DialogPrompts_1.default, 'sendOperationsDeclineDialog').mockResolvedValue({});
            yield SlackInteractionsHelpers_1.default.handleSelectProviderAction(data, respond);
            expect(sendOperationsDeclineDialogSpy).toHaveBeenCalled();
        }));
        it('should handle select cab dialog submission', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { actions: [{ name: 'confirmTrip' }] };
            const providerDialogSubmissionSpy = jest.spyOn(DialogPrompts_1.default, 'sendSelectProviderDialog').mockResolvedValue({});
            yield SlackInteractionsHelpers_1.default.handleSelectProviderAction(data, respond);
            expect(providerDialogSubmissionSpy).toHaveBeenCalled();
        }));
    });
    describe(index_1.default.handleSelectCabAndDriverAction, () => {
        it('should identify difference between trip and route request and call trip controller', () => {
            const data = {
                callback_id: 'providers_approval_trip'
            };
            const TripCabControllerSpy = jest.spyOn(TripActionsController_1.default, 'completeTripRequest')
                .mockResolvedValue({});
            index_1.default.handleSelectCabAndDriverAction(data, respond);
            expect(TripCabControllerSpy).toHaveBeenCalled();
        });
        it('should call difference between trip and route request and call provider controller', () => {
            const ProvidersControllerSpy = jest.spyOn(ProvidersController_1.default, 'handleProviderRouteApproval')
                .mockResolvedValue({});
            const data = {
                callback_id: 'providers_approval_route'
            };
            index_1.default.handleSelectCabAndDriverAction(data, respond);
            expect(ProvidersControllerSpy).toHaveBeenCalled();
        });
    });
    describe(index_1.default.handleSelectCabActions, () => {
        it('Should call user cancellation function if trip has been canceled', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getProviderBySlackId').mockResolvedValue({ id: 1 });
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({ providerId: '16' });
            const payload = { user: { id: 1 }, actions: [{ value: 1 }], channel: { id: 1 } };
            yield index_1.default.handleSelectCabActions(payload, respond);
            expect(provider_service_1.providerService.getProviderBySlackId).toHaveBeenCalled();
        }));
        it('Should return select cab dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getProviderBySlackId').mockResolvedValue({ id: '16' });
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({ providerId: '16' });
            jest.spyOn(DialogPrompts_1.default, 'sendSelectCabDialog').mockImplementation();
            const payload = { user: { id: 1 }, actions: [{ value: 1 }], channel: { id: 1 } };
            yield index_1.default.handleSelectCabActions(payload, respond);
            expect(provider_service_1.providerService.getProviderBySlackId).toHaveBeenCalled();
            expect(DialogPrompts_1.default.sendSelectCabDialog).toBeCalled();
        }));
    });
    describe(index_1.default.handleProviderApproval, () => {
        it('Should send select cab dialogue', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 1 }, actions: [{ value: 1 }], channel: { id: 1 } };
            jest.spyOn(DialogPrompts_1.default, 'sendSelectCabDialog').mockResolvedValue();
            yield index_1.default.handleProviderApproval(payload);
            expect(DialogPrompts_1.default.sendSelectCabDialog).toBeCalled();
        }));
    });
});
describe(SlackController_1.default, () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe(SlackController_1.default.getHomeBaseMessage, () => {
        it('should handle get homebase message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1, name: 'Nairobi', country: { name: 'Kenya' } });
            const flag = slackHelpers_1.default.getLocationCountryFlag('Kenya');
            const homebaseMessage = yield SlackController_1.default.getHomeBaseMessage(1);
            expect(homebaseMessage).toContain(`_Your current home base is ${flag} *Nairobi*_`);
        }));
        it('should ask user to set their homebase', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue();
            const homebaseMessage = yield SlackController_1.default.getHomeBaseMessage(1);
            expect(homebaseMessage).toContain('`Please set your location to continue`');
        }));
    });
    describe(SlackController_1.default.createChangeLocationBtn, () => {
        it('should create a change location button', () => __awaiter(void 0, void 0, void 0, function* () {
            const changeLocationBtn = yield SlackController_1.default.createChangeLocationBtn('routes');
            expect(changeLocationBtn).toEqual({
                name: 'changeLocation__routes',
                style: 'primary',
                text: 'Change Location',
                type: 'button',
                value: 'change_location'
            });
        }));
    });
});
describe(SlackInteractionsHelpers_1.default, () => {
    let respond;
    beforeAll(() => {
        respond = jest.fn();
    });
    describe(SlackInteractionsHelpers_1.default.welcomeMessage, () => {
        it('should test book_new_trip action', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_trip_booking_controller_1.default, 'startTripBooking').mockResolvedValue(null);
            const payload = SlackInteractions_mock_1.createPayload('book_new_trip');
            yield SlackInteractionsHelpers_1.default.welcomeMessage(payload, respond);
            expect(user_trip_booking_controller_1.default.startTripBooking).toHaveBeenCalledWith(payload, respond);
        }));
        it('should test view_trips_itinerary action', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(itinerary_controller_1.default, 'start').mockResolvedValue(null);
            const payload = SlackInteractions_mock_1.createPayload('view_trips_itinerary');
            yield SlackInteractionsHelpers_1.default.welcomeMessage(payload, respond);
            expect(itinerary_controller_1.default.start).toHaveBeenCalledWith(payload, respond);
        }));
        it('should test Welcome message default action', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload();
            yield SlackInteractionsHelpers_1.default.welcomeMessage(payload, respond);
            expect(respond).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('Thank you'),
            }));
        }));
    });
    describe(SlackInteractionsHelpers_1.default.handleItineraryActions, () => {
        let itineraryRespond;
        beforeEach(() => {
            itineraryRespond = SlackInteractions_mock_1.respondMock();
            jest.spyOn(reschedule_helper_1.default, 'sendTripRescheduleModal').mockResolvedValue();
        });
        it('should trigger dispalyTripRequestInteractive prompt', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('value', 'view');
            jest.spyOn(ViewTripHelper_1.default, 'displayTripRequest').mockResolvedValue();
            yield SlackInteractionsHelpers_1.default.handleItineraryActions(payload, itineraryRespond);
            expect(ViewTripHelper_1.default.displayTripRequest).toHaveBeenCalled();
        }));
        it('should trigger reschedule dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload('value', 'reschedule');
            yield SlackInteractionsHelpers_1.default.handleItineraryActions(payload, itineraryRespond);
            expect(reschedule_helper_1.default.sendTripRescheduleModal).toHaveBeenCalled();
        }));
        it('should trigger cancel trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload(1, 'cancel_trip');
            CancelTripController_1.default.cancelTrip = jest.fn(() => Promise.resolve('message'));
            const result = yield SlackInteractionsHelpers_1.default.handleItineraryActions(payload, itineraryRespond);
            expect(result).toBe(undefined);
            expect(itineraryRespond).toHaveBeenCalledWith('message');
        }));
        it('should trigger trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = SlackInteractions_mock_1.createPayload(1, 'trip');
            CancelTripController_1.default.cancelTrip = jest.fn(() => Promise.resolve('message'));
            const result = yield SlackInteractionsHelpers_1.default.handleItineraryActions(payload, itineraryRespond);
            expect(result).toBe(undefined);
            expect(itineraryRespond).toHaveBeenCalledWith(SlackInteractions_mock_1.responseMessage('Thank you for using Tembea. See you again.'));
        }));
    });
    describe(SlackInteractionsHelpers_1.default.sendCommentDialog, () => {
        beforeEach(() => {
            jest.spyOn(DialogPrompts_1.default, 'sendOperationsApprovalDialog').mockResolvedValue(null);
            jest.spyOn(DialogPrompts_1.default, 'sendOperationsDeclineDialog').mockResolvedValue(null);
            respond = jest.fn();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should handle confirm trip', () => {
            const payload = { actions: [{ name: 'confirmTrip' }] };
            SlackInteractionsHelpers_1.default.sendCommentDialog(payload, respond);
            expect(DialogPrompts_1.default.sendOperationsApprovalDialog).toBeCalledWith(payload, respond);
        });
        it('should handle decline trip', () => {
            const payload = { actions: [{ name: 'declineRequest' }] };
            SlackInteractionsHelpers_1.default.sendCommentDialog(payload);
            expect(DialogPrompts_1.default.sendOperationsDeclineDialog).toBeCalledWith(payload);
        });
        it('should handle default', () => {
            const payload = { actions: [{ name: 'declineRequests' }] };
            SlackInteractionsHelpers_1.default.sendCommentDialog(payload);
            expect(DialogPrompts_1.default.sendOperationsDeclineDialog).not.toHaveBeenCalled();
        });
    });
    describe(SlackInteractionsHelpers_1.default.handleOpsAction, () => {
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xyz');
        });
        it('Should call user cancellation function if trip has been canceled', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({ tripStatus: 'Cancelled' });
            const tripDataMock = SlackInteractions_mock_1.createTripActionWithOptionsMock('assignProvider_1');
            const sendUserCancellationSpy = jest.spyOn(OpsTripActions_1.default, 'sendUserCancellation').mockResolvedValue({});
            yield SlackInteractionsHelpers_1.default.handleOpsAction(tripDataMock);
            expect(sendUserCancellationSpy).toHaveBeenCalled();
        }));
        it('Should call select trip action when trip is not cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({ tripStatus: 'Pending' });
            jest.spyOn(DialogPrompts_1.default, 'sendSelectProviderDialog').mockResolvedValue({});
            const tripDataMock = SlackInteractions_mock_1.createTripActionWithOptionsMock('assignProvider_1');
            const handleSelectProviderAction = jest.spyOn(SlackInteractionsHelpers_1.default, 'handleSelectProviderAction');
            yield SlackInteractionsHelpers_1.default.handleOpsAction(tripDataMock);
            expect(handleSelectProviderAction).toHaveBeenCalled();
        }));
        it('Should call selectDriverAndCab when assign cab option is selected', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({ tripStatus: 'Pending' });
            jest.spyOn(DialogPrompts_1.default, 'sendSelectProviderDialog').mockResolvedValue({});
            const tripDataMock = SlackInteractions_mock_1.createTripActionWithOptionsMock('assignCab_1');
            const selectDriverAndCab = jest.spyOn(OpsDialogPrompts_1.default, 'selectDriverAndCab')
                .mockResolvedValue();
            yield SlackInteractionsHelpers_1.default.handleOpsAction(tripDataMock);
            expect(selectDriverAndCab).toHaveBeenCalled();
        }));
    });
    describe(SlackInteractionsHelpers_1.default.handleFeedbackAction, () => {
        beforeEach(() => {
            jest.spyOn(DialogPrompts_1.dialogPrompts, 'sendFeedbackDialog').mockResolvedValue(null);
            respond = jest.fn();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should send the feedback dialog', () => {
            const payload = { actions: [{ name: 'feedback' }] };
            SlackInteractionsHelpers_1.default.handleFeedbackAction(payload);
            expect(DialogPrompts_1.dialogPrompts.sendFeedbackDialog).toBeCalled();
        });
    });
    describe(SlackInteractionsHelpers_1.default.handleGetFeedbackAction, () => {
        beforeEach(() => {
            jest.spyOn(feedback_service_1.feedbackService, 'createFeedback').mockResolvedValue({ userId: 1, feedback: 'feedback' });
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ id: 1 });
            jest.spyOn(feedbackHelper_1.default, 'sendFeedbackSuccessmessage').mockResolvedValue(null);
            respond = jest.fn();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should send success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                team: { id: 'ekekke' },
                channel: { id: 'ekeekk' },
                user: { id: 'keek' },
                actions: [{ name: 'feedback' }],
                submission: { feedback: 'jeejeje' },
                state: '{"actionTs":"kekekeekk"}'
            };
            yield SlackInteractionsHelpers_1.default.handleGetFeedbackAction(payload, respond);
            expect(feedbackHelper_1.default.sendFeedbackSuccessmessage).toBeCalled();
        }));
    });
});
//# sourceMappingURL=SlackInteractions.spec.js.map