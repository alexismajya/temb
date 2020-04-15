import { feedbackService } from '../../../feedback/feedback.service';
import userService from '../../../users/user.service';
import WebSocketEvents from '../../../events/web-socket-event.service';
import ItineraryController from '../../../new-slack/trips/user/itinerary.controller';
import SlackInteractions from '../index';
import DialogPrompts, { dialogPrompts } from '../../SlackPrompts/DialogPrompts';
import CancelTripController from '../../TripManagement/CancelTripController';
import Cache from '../../../shared/cache';
import {
  createPayload, respondMock, responseMessage, createTripActionWithOptionsMock
} from '../__mocks__/SlackInteractions.mock';
import TripActionsController from '../../TripManagement/TripActionsController';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import InteractivePrompts from '../../SlackPrompts/InteractivePrompts';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import TravelTripHelper from '../../helpers/slackHelpers/TravelTripHelper';
import RouteInputHandlers from '../../RouteManagement';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';
import SlackController from '../../SlackController';
import ViewTripHelper from '../../helpers/slackHelpers/ViewTripHelper';
import JoinRouteInteractions from '../../RouteManagement/JoinRoute/JoinRouteInteractions';
import tripService from '../../../trips/trip.service';
import OpsTripActions from '../../TripManagement/OpsTripActions';
import ProvidersController from '../../RouteManagement/ProvidersController';
import SlackInteractionsHelpers from '../../helpers/slackHelpers/SlackInteractionsHelpers';
import InteractivePromptSlackHelper from '../../helpers/slackHelpers/InteractivePromptSlackHelper';
import { providerService } from '../../../providers/provider.service';
import SlackNotifications from '../../SlackPrompts/Notifications';
import OpsDialogPrompts from '../../SlackPrompts/OpsDialogPrompts';
import { homebaseService } from '../../../homebases/homebase.service';
import { mockWhatsappOptions } from '../../../notifications/whatsapp/twilio.mocks';
import RescheduleHelper from '../../../new-slack/trips/user/reschedule.helper';
import { SlackInteractiveMessage } from '../../SlackModels/SlackMessageModels';
import UserTripBookingController from '../../../new-slack/trips/user/user-trip-booking-controller';
import SeeAvailableRouteController from '../../../new-slack/routes/user/seeAvailableRoute.controller';
import TripEventsHandlers from '../../../events/trip-events.handlers';
import socketIoMock from '../../__mocks__/socket.ioMock';
import feedbackHelper from '../../helpers/slackHelpers/feedbackHelper';

mockWhatsappOptions();

describe(SlackInteractions, () => {
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

    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xyz');
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socketIoMock))
    );
  });

  describe(SlackInteractions.launch, () => {
    beforeAll(() => {
      respond = jest.fn();
    });

    it('should test back_to_launch', async () => {
      const testResponse = new SlackInteractiveMessage('welcome');
      jest.spyOn(SlackController, 'getWelcomeMessage').mockResolvedValue(testResponse);
      const payload = createPayload('back_to_launch');

      await SlackInteractions.launch(payload, respond);

      expect(respond).toHaveBeenCalledWith(testResponse);
    });

    it('should test leave_route', async () => {
      const testResponse = new SlackInteractiveMessage('leave route');
      jest.spyOn(SlackController, 'leaveRoute').mockResolvedValue(testResponse);
      const payload = createPayload('leave_route');

      await SlackInteractions.launch(payload, respond);

      expect(respond).toHaveBeenCalledWith(testResponse);
    });

    it('should test back_to_launch', async () => {
      const testResponse = new SlackInteractiveMessage('this is travel');
      jest.spyOn(SlackController, 'getTravelCommandMsg').mockResolvedValue(testResponse);
      const payload = createPayload('back_to_travel_launch');

      await SlackInteractions.launch(payload, respond);

      expect(respond).toHaveBeenCalledWith(testResponse);
    });

    it('should test back_to_routes_launch', async () => {
      const testResponse = new SlackInteractiveMessage('this is route launch');
      jest.spyOn(SlackController, 'getRouteCommandMsg').mockResolvedValue(testResponse);
      const payload = createPayload('back_to_routes_launch');

      await SlackInteractions.launch(payload, respond);

      expect(respond).toHaveBeenCalledWith(testResponse);
    });

    it('should test launch default response', async () => {
      const payload = createPayload();
      await SlackInteractions.launch(payload, respond);
      expect(respond).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.stringContaining('Thank you'),
      }));
    });
  });

  describe(SlackInteractions.handleTripActions, () => {
    let response;
    let payload;

    beforeEach(() => {
      payload = {
        callback_id: 'operations_reason_dialog_trips',
        submission:
        {
          confirmationComment: 'yes',
          driverName: 'Valid Name',
          driverPhoneNo: '1234567890',
          regNumber: 'LNS 8367*'
        }
      };
      response = jest.fn();
      jest.spyOn(DialogPrompts, 'sendOperationsApprovalDialog').mockResolvedValue(null);
      jest.spyOn(DialogPrompts, 'sendOperationsDeclineDialog').mockResolvedValue(null);
      jest.spyOn(TripActionsController, 'changeTripStatus').mockResolvedValue({});
      jest.spyOn(TripActionsController, 'runCabValidation').mockReturnValue(null);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should throw an error', async () => {
      payload.actions = [{ name: 'declineRequest' }];
      const error = new Error('not working');
      jest.spyOn(TripActionsController, 'changeTripStatus').mockRejectedValue(error);
      await SlackInteractions.handleTripActions(payload, response);
      expect(response).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.stringContaining('Unsuccessful request'),
      }));
    });

    it('should handle validation error', async () => {
      const errors = [{ message: 'dummy error message' }];
      jest.spyOn(TripActionsController, 'runCabValidation').mockReturnValue([...errors]);
      const error = await SlackInteractions.handleTripActions(payload, response);
      expect(error).toEqual({ errors });
      expect(TripActionsController.changeTripStatus).not.toHaveBeenCalled();
    });

    it('should handle confirmationComment', async () => {
      await SlackInteractions.handleTripActions(payload, response);
      expect(TripActionsController.changeTripStatus).toHaveBeenCalled();
    });

    it('should handle declineComment', async () => {
      payload.submission = { opsDeclineComment: 'fghj' };
      await SlackInteractions.handleTripActions(payload, response);
      expect(TripActionsController.changeTripStatus).toHaveBeenCalled();
    });
  });

  describe(SlackInteractions.bookTravelTripStart, () => {
    beforeEach(() => {
      jest.spyOn(Cache, 'save').mockResolvedValue(null);
    });

    it('should return thank you message', async () => {
      const payload = createPayload('can', 'cancel');
      await SlackInteractions.bookTravelTripStart(payload, respond);
      expect(respond).toHaveBeenCalledWith(
        responseMessage('Thank you for using Tembea. See you again.')
      );
    });

    it('should return thank you message', async () => {
      const payload = createPayload('can', 'airport');
      const sendTripDetailsForm = jest.spyOn(DialogPrompts, 'sendTripDetailsForm');
      sendTripDetailsForm.mockImplementation((value1, value2) => ({ value1, value2 }));

      await SlackInteractions.bookTravelTripStart(payload, respond);
      expect(Cache.save).toHaveBeenCalled();
      expect(sendTripDetailsForm).toHaveBeenCalledWith(payload,
        'travelTripContactDetailsForm', 'travel_trip_contactDetails');
    });

    it('should handle changeLocation via travel command', async () => {
      const payload = createPayload('change_location', 'changeLocation__travel');
      jest.spyOn(InteractivePrompts, 'changeLocation').mockResolvedValue(null);
      await SlackInteractions.bookTravelTripStart(payload, respond);
      expect(InteractivePrompts.changeLocation).toHaveBeenCalled();
    });
  });

  describe(SlackInteractions.handleTravelTripActions, () => {
    beforeEach(() => {
      respond = respondMock();
    });

    it('should call the tripHandler method based on callBackId', () => {
      const payload = createPayload('testBack', 'cancel');
      TravelTripHelper.testBack = jest.fn((value1, value2) => ({ value1, value2 }));

      SlackInteractions.handleTravelTripActions(payload, respond);

      expect(TravelTripHelper.testBack).toHaveBeenCalledWith(payload, respond);
    });

    it('should call the tripHandler method based on callBackId', () => {
      const payload = createPayload('test', 'cancel');

      SlackInteractions.handleTravelTripActions(payload, respond);

      expect(respond).toHaveBeenCalledWith(
        responseMessage('Thank you for using Tembea. See you again.')
      );
    });
  });

  describe(SlackInteractions.startRouteActions, () => {
    beforeEach(() => {
      respond = respondMock();
      DialogPrompts.sendLocationForm = jest.fn();
      jest.spyOn(JoinRouteInteractions, 'handleViewAvailableRoutes').mockResolvedValue();
      jest.spyOn(JoinRouteInteractions, 'sendCurrentRouteMessage').mockResolvedValue();
    });


    it('should test my_current_route action', (done) => {
      const payload = createPayload('my_current_route');
      SlackInteractions.startRouteActions(payload, respond);
      expect(JoinRouteInteractions.sendCurrentRouteMessage).toBeCalled();
      done();
    });

    it('should test view_available_routes action', (done) => {
      const payload = createPayload('view_available_routes');
      jest.spyOn(SeeAvailableRouteController, 'seeAvailableRoutes').mockResolvedValue(payload, respond);
      SlackInteractions.startRouteActions(payload, respond);
      expect(SeeAvailableRouteController.seeAvailableRoutes).toBeCalled();
      done();
    });

    it('should test change location action', async () => {
      jest.spyOn(InteractivePrompts, 'changeLocation').mockResolvedValue();
      const payload = createPayload('change_location');
      await SlackInteractions.startRouteActions(payload, respond);
      expect(InteractivePrompts.changeLocation).toBeCalled();
    });

    it('should test request_new_route action', (done) => {
      const payload = createPayload('request_new_route');
      SlackInteractions.startRouteActions(payload, respond);
      expect(DialogPrompts.sendLocationForm).toHaveBeenCalledWith(payload);
      done();
    });

    it('should call the tripHandler method based on callBackId', () => {
      const payload = createPayload('test', 'cancel');
      SlackInteractions.startRouteActions(payload, respond);

      expect(respond).toHaveBeenCalledWith(
        responseMessage('Thank you for using Tembea. See you again.')
      );
    });
  });

  describe(SlackInteractions.handleRouteActions, () => {
    beforeEach(() => {
      respond = respondMock();
      DialogPrompts.sendLocationForm = jest.fn();
      jest.spyOn(JoinRouteInteractions, 'handleViewAvailableRoutes').mockResolvedValue();
      jest.spyOn(JoinRouteInteractions, 'sendCurrentRouteMessage').mockResolvedValue();
    });

    it('should call handleRouteActions based on the callBackId', async () => {
      const payload = createPayload('testBack', 'cancel');
      RouteInputHandlers.testBack = jest.fn((value1, value2) => ({ value1, value2 }));
      await SlackInteractions.handleRouteActions(payload, respond);

      expect(RouteInputHandlers.testBack).toHaveBeenCalledWith(payload, respond);
    });

    it('should call handleRouteActions based on the callBackId', async () => {
      const payload = createPayload('test', 'cancel');
      await SlackInteractions.handleRouteActions(payload, respond);

      expect(respond).toHaveBeenCalledWith(
        responseMessage('Thank you for using Tembea. See you again.')
      );
    });

    it('should return validation errors if they exist', async () => {
      const payload = { callback_id: 'new_route_runValidations' };
      jest.spyOn(RouteInputHandlers, 'runValidations')
        .mockImplementationOnce().mockReturnValueOnce(['error']);
      const result = await SlackInteractions.handleRouteActions(payload, respond);
      expect(result).toHaveProperty('errors');
    });

    it('should run bugsnag when errors are thrown', async () => {
      // No values in payload will throw an error
      const payload = {};
      jest.spyOn(BugsnagHelper, 'log').mockResolvedValue(null);

      await SlackInteractions.handleRouteActions(payload, respond);

      expect(BugsnagHelper.log).toHaveBeenCalled();
    });
  });

  describe(SlackInteractions.completeTripResponse, () => {
    it('should call sendCompletion interactive messages', () => {
      const message = jest.spyOn(InteractivePromptSlackHelper, 'sendCompletionResponse')
        .mockReturnValue(null);
      SlackInteractions.completeTripResponse(payload1, respond);
      expect(message).toHaveBeenCalled();
    });

    it('should handle errors', () => {
      jest.spyOn(BugsnagHelper, 'log');
      jest.spyOn(InteractivePromptSlackHelper, 'sendCompletionResponse').mockImplementation(() => {
        throw new Error('error');
      });
      SlackInteractions.completeTripResponse(payload1, respond);
      expect(BugsnagHelper.log).toHaveBeenCalled();
      expect(respond).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Error:bangbang: : We could not complete this process please try again.',
      }));
    });
  });

  describe(SlackInteractions.handleSelectProviderAction, () => {
    it('should call selectProviderDialog with payload data for confirmTrip actions', async () => {
      const data = {
        actions: [
          {
            name: 'confirmTrip'
          }
        ],
        channel: { id: 'ABC' },
        team: { id: 'XYZ' }
      };
      const sendSelectProviderDialogSpy = jest.spyOn(DialogPrompts, 'sendSelectProviderDialog')
        .mockResolvedValue();
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue();
      await SlackInteractionsHelpers.handleSelectProviderAction(data);
      expect(sendSelectProviderDialogSpy).toHaveBeenCalled();
    });


    it('should handle provider actions', async () => {
      jest.spyOn(DialogPrompts, 'sendSelectCabDialog').mockResolvedValue();
      const payload = createPayload('accept_route_request');
      await SlackInteractionsHelpers.startProviderActions(payload, respond);
      expect(DialogPrompts.sendSelectCabDialog).toBeCalled();
    });
    it('should handle provider actions', (done) => {
      const payload = createPayload('default');
      SlackInteractionsHelpers.startProviderActions(payload, respond);
      expect(respond).toHaveBeenCalledWith(
        responseMessage('Thank you for using Tembea. See you again.')
      );
      done();
    });

    it('should handle decline request action', async () => {
      const data = {
        actions: [
          {
            name: 'declineRequest'
          }
        ]
      };
      const sendOperationsDeclineDialogSpy = jest.spyOn(DialogPrompts, 'sendOperationsDeclineDialog').mockResolvedValue({});
      await SlackInteractionsHelpers.handleSelectProviderAction(data, respond);
      expect(sendOperationsDeclineDialogSpy).toHaveBeenCalled();
    });

    it('should handle select cab dialog submission', async () => {
      const data = { actions: [{ name: 'confirmTrip' }] };
      const providerDialogSubmissionSpy = jest.spyOn(DialogPrompts, 'sendSelectProviderDialog').mockResolvedValue({});
      await SlackInteractionsHelpers.handleSelectProviderAction(data, respond);
      expect(providerDialogSubmissionSpy).toHaveBeenCalled();
    });
  });

  describe(SlackInteractions.handleSelectCabAndDriverAction, () => {
    it('should identify difference between trip and route request and call trip controller', () => {
      const data = {
        callback_id: 'providers_approval_trip'
      };
      const TripCabControllerSpy = jest.spyOn(TripActionsController, 'completeTripRequest')
        .mockResolvedValue({});

      SlackInteractions.handleSelectCabAndDriverAction(data, respond);
      expect(TripCabControllerSpy).toHaveBeenCalled();
    });

    it('should call difference between trip and route request and call provider controller', () => {
      const ProvidersControllerSpy = jest.spyOn(ProvidersController, 'handleProviderRouteApproval')
        .mockResolvedValue({});
      const data = {
        callback_id: 'providers_approval_route'
      };
      SlackInteractions.handleSelectCabAndDriverAction(data, respond);
      expect(ProvidersControllerSpy).toHaveBeenCalled();
    });
  });

  describe(SlackInteractions.handleSelectCabActions, () => {
    it('Should call user cancellation function if trip has been canceled', async () => {
      jest.spyOn(providerService, 'getProviderBySlackId').mockResolvedValue({ id: 1 });
      jest.spyOn(tripService, 'getById').mockResolvedValue({ providerId: '16' });
      const payload = { user: { id: 1 }, actions: [{ value: 1 }], channel: { id: 1 } };

      await SlackInteractions.handleSelectCabActions(payload, respond);
      expect(providerService.getProviderBySlackId).toHaveBeenCalled();
    });
    it('Should return select cab dialog', async () => {
      jest.spyOn(providerService, 'getProviderBySlackId').mockResolvedValue({ id: '16' });
      jest.spyOn(tripService, 'getById').mockResolvedValue({ providerId: '16' });
      jest.spyOn(DialogPrompts, 'sendSelectCabDialog').mockImplementation();

      const payload = { user: { id: 1 }, actions: [{ value: 1 }], channel: { id: 1 } };
      await SlackInteractions.handleSelectCabActions(payload, respond);
      expect(providerService.getProviderBySlackId).toHaveBeenCalled();
      expect(DialogPrompts.sendSelectCabDialog).toBeCalled();
    });
  });

  describe(SlackInteractions.handleProviderApproval, () => {
    it('Should send select cab dialogue', async () => {
      const payload = { user: { id: 1 }, actions: [{ value: 1 }], channel: { id: 1 } };
      jest.spyOn(DialogPrompts, 'sendSelectCabDialog').mockResolvedValue();

      await SlackInteractions.handleProviderApproval(payload);
      expect(DialogPrompts.sendSelectCabDialog).toBeCalled();
    });
  });
});

describe(SlackController, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe(SlackController.getHomeBaseMessage, () => {
    it('should handle get homebase message', async () => {
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(
        { id: 1, name: 'Nairobi', country: { name: 'Kenya' } }
      );
      const flag = SlackHelpers.getLocationCountryFlag('Kenya');
      const homebaseMessage = await SlackController.getHomeBaseMessage(1);
      expect(homebaseMessage).toContain(`_Your current home base is ${flag} *Nairobi*_`);
    });
    it('should ask user to set their homebase', async () => {
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue();
      const homebaseMessage = await SlackController.getHomeBaseMessage(1);
      expect(homebaseMessage).toContain('`Please set your location to continue`');
    });
  });

  describe(SlackController.createChangeLocationBtn, () => {
    it('should create a change location button', async () => {
      const changeLocationBtn = await SlackController.createChangeLocationBtn('routes');
      expect(changeLocationBtn).toEqual({
        name: 'changeLocation__routes',
        style: 'primary',
        text: 'Change Location',
        type: 'button',
        value: 'change_location'
      });
    });
  });
});

describe(SlackInteractionsHelpers, () => {
  let respond;
  beforeAll(() => {
    respond = jest.fn();
  });

  describe(SlackInteractionsHelpers.welcomeMessage, () => {
    it('should test book_new_trip action', async () => {
      jest.spyOn(UserTripBookingController, 'startTripBooking').mockResolvedValue(null);
      const payload = createPayload('book_new_trip');
      await SlackInteractionsHelpers.welcomeMessage(payload, respond);
      expect(UserTripBookingController.startTripBooking).toHaveBeenCalledWith(payload, respond);
    });

    it('should test view_trips_itinerary action', async () => {
      jest.spyOn(ItineraryController, 'start').mockResolvedValue(null);
      const payload = createPayload('view_trips_itinerary');
      await SlackInteractionsHelpers.welcomeMessage(payload, respond);
      expect(ItineraryController.start).toHaveBeenCalledWith(payload, respond);
    });

    it('should test Welcome message default action', async () => {
      const payload = createPayload();
      await SlackInteractionsHelpers.welcomeMessage(payload, respond);
      expect(respond).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.stringContaining('Thank you'),
      }));
    });
  });

  describe(SlackInteractionsHelpers.handleItineraryActions, () => {
    let itineraryRespond;

    beforeEach(() => {
      itineraryRespond = respondMock();
      jest.spyOn(RescheduleHelper, 'sendTripRescheduleModal').mockResolvedValue();
    });

    it('should trigger dispalyTripRequestInteractive prompt', async () => {
      const payload = createPayload('value', 'view');
      jest.spyOn(ViewTripHelper, 'displayTripRequest').mockResolvedValue();

      await SlackInteractionsHelpers.handleItineraryActions(payload, itineraryRespond);
      expect(ViewTripHelper.displayTripRequest).toHaveBeenCalled();
    });

    it('should trigger reschedule dialog', async () => {
      const payload = createPayload('value', 'reschedule');

      await SlackInteractionsHelpers.handleItineraryActions(payload, itineraryRespond);
      expect(RescheduleHelper.sendTripRescheduleModal).toHaveBeenCalled();
    });

    it('should trigger cancel trip', async () => {
      const payload = createPayload(1, 'cancel_trip');
      CancelTripController.cancelTrip = jest.fn(() => Promise.resolve('message'));

      const result = await SlackInteractionsHelpers.handleItineraryActions(payload, itineraryRespond);
      expect(result).toBe(undefined);
      expect(itineraryRespond).toHaveBeenCalledWith(
        'message'
      );
    });

    it('should trigger trip', async () => {
      const payload = createPayload(1, 'trip');
      CancelTripController.cancelTrip = jest.fn(() => Promise.resolve('message'));

      const result = await SlackInteractionsHelpers.handleItineraryActions(payload, itineraryRespond);
      expect(result).toBe(undefined);
      expect(itineraryRespond).toHaveBeenCalledWith(
        responseMessage('Thank you for using Tembea. See you again.')
      );
    });
  });

  describe(SlackInteractionsHelpers.sendCommentDialog, () => {
    beforeEach(() => {
      jest.spyOn(DialogPrompts, 'sendOperationsApprovalDialog').mockResolvedValue(null);
      jest.spyOn(DialogPrompts, 'sendOperationsDeclineDialog').mockResolvedValue(null);
      respond = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should handle confirm trip', () => {
      const payload = { actions: [{ name: 'confirmTrip' }] };
      SlackInteractionsHelpers.sendCommentDialog(payload, respond);
      expect(DialogPrompts.sendOperationsApprovalDialog).toBeCalledWith(payload, respond);
    });

    it('should handle decline trip', () => {
      const payload = { actions: [{ name: 'declineRequest' }] };
      SlackInteractionsHelpers.sendCommentDialog(payload);
      expect(DialogPrompts.sendOperationsDeclineDialog).toBeCalledWith(payload);
    });

    it('should handle default', () => {
      const payload = { actions: [{ name: 'declineRequests' }] };
      SlackInteractionsHelpers.sendCommentDialog(payload);
      expect(DialogPrompts.sendOperationsDeclineDialog).not.toHaveBeenCalled();
    });
  });

  describe(SlackInteractionsHelpers.handleOpsAction, () => {
    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xyz');
    });

    it('Should call user cancellation function if trip has been canceled', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue({ tripStatus: 'Cancelled' });
      const tripDataMock = createTripActionWithOptionsMock('assignProvider_1');

      const sendUserCancellationSpy = jest.spyOn(
        OpsTripActions, 'sendUserCancellation'
      ).mockResolvedValue({});
      await SlackInteractionsHelpers.handleOpsAction(tripDataMock);
      expect(sendUserCancellationSpy).toHaveBeenCalled();
    });

    it('Should call select trip action when trip is not cancelled', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue({ tripStatus: 'Pending' });
      jest.spyOn(DialogPrompts, 'sendSelectProviderDialog').mockResolvedValue({});
      const tripDataMock = createTripActionWithOptionsMock('assignProvider_1');

      const handleSelectProviderAction = jest.spyOn(SlackInteractionsHelpers,
        'handleSelectProviderAction');
      await SlackInteractionsHelpers.handleOpsAction(tripDataMock);
      expect(handleSelectProviderAction).toHaveBeenCalled();
    });

    it('Should call selectDriverAndCab when assign cab option is selected', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue({ tripStatus: 'Pending' });
      jest.spyOn(DialogPrompts, 'sendSelectProviderDialog').mockResolvedValue({});
      const tripDataMock = createTripActionWithOptionsMock('assignCab_1');

      const selectDriverAndCab = jest.spyOn(OpsDialogPrompts, 'selectDriverAndCab')
        .mockResolvedValue();
      await SlackInteractionsHelpers.handleOpsAction(tripDataMock);
      expect(selectDriverAndCab).toHaveBeenCalled();
    });
  });

  describe(SlackInteractionsHelpers.handleFeedbackAction, () => {
    beforeEach(() => {
      jest.spyOn(dialogPrompts, 'sendFeedbackDialog').mockResolvedValue(null);
      respond = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should send the feedback dialog', () => {
      const payload = { actions: [{ name: 'feedback' }] };
      SlackInteractionsHelpers.handleFeedbackAction(payload);
      expect(dialogPrompts.sendFeedbackDialog).toBeCalled();
    });
  });

  describe(SlackInteractionsHelpers.handleGetFeedbackAction, () => {
    beforeEach(() => {
      jest.spyOn(feedbackService, 'createFeedback').mockResolvedValue({ userId: 1, feedback: 'feedback' });
      jest.spyOn(userService, 'getUserBySlackId').mockResolvedValue({ id: 1 });
      jest.spyOn(feedbackHelper, 'sendFeedbackSuccessmessage').mockResolvedValue(null);
      
      respond = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should send success message', async () => {
      const payload = {
        team: { id: 'ekekke' },
        channel: { id: 'ekeekk' },
        user: { id: 'keek' },
        actions: [{ name: 'feedback' }],
        submission: { feedback: 'jeejeje' },
        state: '{"actionTs":"kekekeekk"}'
      };
      await SlackInteractionsHelpers.handleGetFeedbackAction(payload, respond);
      expect(feedbackHelper.sendFeedbackSuccessmessage).toBeCalled();
    });
  });
});
