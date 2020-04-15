import googleClient from '@google/maps';
import GoogleMapsMock from '../../../../helpers/googleMaps/__mocks__/GoogleMapsMock';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import SlackClientMock from '../../__mocks__/SlackClientMock';
import LocationPrompts from '../../SlackPrompts/LocationPrompts';
import RouteInputHandlers from '../RouteInputHandler';
import GoogleMapsStatic from '../../../../services/googleMaps/GoogleMapsStatic';
import { RoutesHelper } from '../../../../helpers/googleMaps/googleMapsHelpers';
import DialogPrompts from '../../SlackPrompts/DialogPrompts';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import Cache from '../../../shared/cache';
import UserInputValidator from '../../../../helpers/slack/UserInputValidator';
import GoogleMapsService from '../../../../services/googleMaps';
import RouteInputHandlerHelper from '../RouteInputHandlerHelper';
import PreviewPrompts from '../../SlackPrompts/PreviewPrompts';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import dummyMockData from './dummyMockData';
import { SlackInteractiveMessage } from '../../SlackModels/SlackMessageModels';
import { slackEventNames } from '../../events/slackEvents';
import SlackEvents from '../../events';
import AisService from '../../../../services/AISService';
import NewLocationHelpers from '../../../new-slack/helpers/location-helpers';
import { homebaseService } from '../../../homebases/homebase.service';

jest.mock('@google/maps');

const mockedCreateClient = { placesNearby: jest.fn() };
SlackClientMock();
GoogleMapsMock();

describe('RouteInputHandler Tests', () => {
  const respond = jest.fn();
  beforeEach(() => {
    jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue({});
    jest.spyOn(googleClient, 'createClient').mockReturnValue(mockedCreateClient);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks();
  });

  describe('RouteInputHandler.home Tests', () => {
    it('should call sendLocationSuggestionsResponse', async () => {
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
      jest.spyOn(NewLocationHelpers, 'getLocationVerificationMsg').mockReturnValue({});
      await RouteInputHandlers.home(payload, respond);
      expect(NewLocationHelpers.getLocationVerificationMsg).toHaveBeenCalledWith(
        location, userId, options
      );
    });

    it('should catch thrown errors', async () => {
      const payload = {
        type: 'dialog_submission',
        submission: {
          location: 'test location'
        }
      };
      jest.spyOn(NewLocationHelpers, 'getLocationVerificationMsg')
        .mockRejectedValue(new Error('Dummy error'));
      bugsnagHelper.log = jest.fn().mockReturnValue({});
      await RouteInputHandlers.home(payload, respond);
      expect(bugsnagHelper.log).toHaveBeenCalled();
    });
  });

  describe('RouteInputHandler.suggestion Tests', () => {
    it('should call sendLocationConfirmationResponse', async () => {
      const payload = {
        user: { id: 1 },
        type: 'dialog_submission',
        actions: [{
          selected_options: [{ value: 'xxxxx' }]
        }]
      };

      jest.spyOn(RoutesHelper, 'getAddressDetails').mockResolvedValue({
        plus_code: { geometry: { location: { lat: 1, lng: 1 } }, best_street_address: 'Test Location Address' }
      });
      jest.spyOn(GoogleMapsStatic, 'getLocationScreenshot').mockReturnValue('staticMapUrl');
      jest.spyOn(Cache, 'saveObject').mockResolvedValue({});
      jest.spyOn(LocationPrompts, 'sendLocationConfirmationResponse').mockReturnValue({});

      await RouteInputHandlers.suggestions(payload, respond);
      expect(LocationPrompts.sendLocationConfirmationResponse).toHaveBeenCalled();
    });

    it('should call sendLocationCoordinatesNotFound', async () => {
      const payload = {
        submission: { coordinates: '1,1' }
      };

      jest.spyOn(RoutesHelper, 'getAddressDetails')
        .mockResolvedValueOnce(null);
      jest.spyOn(LocationPrompts, 'sendLocationCoordinatesNotFound').mockReturnValueOnce({});

      await RouteInputHandlers.suggestions(payload, respond);

      expect(LocationPrompts.sendLocationCoordinatesNotFound).toHaveBeenCalled();
    });

    it('should catch thrown errors', async () => {
      const payload = {
        submission: {
          coordinated: '1,1'
        }
      };
      jest.spyOn(RoutesHelper, 'getAddressDetails')
        .mockRejectedValue(new Error('Dummy error'));
      jest.spyOn(bugsnagHelper, 'log').mockReturnValue(null);

      await RouteInputHandlers.suggestions(payload, respond);
      expect(bugsnagHelper.log).toHaveBeenCalled();
    });
  });

  describe('RouteInputHandler.sendLocationCoordinatesForm tests', () => {
    it('should call sendLocationCoordinatesForm', async () => {
      const payload = {
        actions: [{ value: 'no' }]
      };
      jest.spyOn(DialogPrompts, 'sendLocationCoordinatesForm').mockReturnValue({});

      await RouteInputHandlers.locationNotFound(payload, respond);
      expect(DialogPrompts.sendLocationCoordinatesForm).toHaveBeenCalled();
    });

    it('should call sendLocationForm', async () => {
      const payload = {
        actions: [{ value: 'retry' }]
      };
      jest.spyOn(DialogPrompts, 'sendLocationForm').mockReturnValue({});

      await RouteInputHandlers.locationNotFound(payload, respond);
      expect(DialogPrompts.sendLocationForm).toHaveBeenCalled();
    });
  });

  describe('RouteInputHandler.runValidations tests', () => {
    it('should return coordinates validation errors if they exist', async () => {
      const payload = {
        submission: { coordinates: '1,1' }
      };
      jest.spyOn(UserInputValidator, 'validateCoordinates')
        .mockImplementation().mockReturnValueOnce([]);
      const errors = await RouteInputHandlers.runValidations(payload);
      expect(errors.length).toEqual(0);
    });

    it('should catch validation errors', async () => {
      const payload = {
        submission: { coordinates: 'bad coordinates' }
      };

      jest.spyOn(UserInputValidator, 'validateCoordinates')
        .mockImplementation().mockReturnValueOnce(['error']);

      const errors = await RouteInputHandlers.runValidations(payload);
      expect(errors.length).toEqual(1);
    });
  });
  describe(RouteInputHandlers.continueWithTheFlow, () => {
    it('it should call the home route handler function', async (done) => {
      jest.clearAllMocks();
      const payload = { user: { id: 1 } };
      const respond2 = jest.fn();
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ newRouteRequest: 'test' });
      jest.spyOn(RouteInputHandlers, 'home').mockResolvedValue({});
      await RouteInputHandlers.continueWithTheFlow(payload, respond2);
      expect(Cache.fetch).toBeCalled();
      expect(RouteInputHandlers.home).toBeCalled();
      done();
    });
  });
  describe('RouteInputHandler: Bus Stop handler', () => {
    let payload;
    beforeEach(() => {
      payload = {
        channel: {},
        team: { id: 1 },
        user: { id: 1 },
        actions: [{ value: '12' }],
        submission:
          {
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
        jest.spyOn(DialogPrompts, 'sendBusStopForm').mockResolvedValue({});
        jest.spyOn(Cache, 'save').mockResolvedValue();
        jest.spyOn(GoogleMapsService, 'mapResultsToCoordinates').mockResolvedValue(
          [{
            label: 'USIU Stage',
            text: 'USIU Stage',
            value: '-1.2249681,36.8853843'
          }]
        );
        jest.spyOn(RouteInputHandlerHelper, 'generateResolvedBusList').mockResolvedValue([{
          label: 'Andela Nairobi',
          text: 'Andela Nairobi',
          value: '1.2345,-0.3456'
        }]);
      });
      afterEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
      });
      it('handleBusStopRoute throw error', async () => {
        await RouteInputHandlers.handleBusStopRoute(payload, respond);
        expect(respond).toHaveBeenCalled();
      });

      it('handleBusStopRoute: send dialog', async () => {
        const maps = new GoogleMapsService();
        jest.spyOn(maps, 'findNearestBusStops').mockImplementation([{}]);
        payload.actions[0].value = '23,23';
        await RouteInputHandlers.handleBusStopRoute(payload, respond);
        expect(DialogPrompts.sendBusStopForm).toHaveBeenCalledTimes(1);
      });

      it('should get the value for the nearest bus stop', async () => {
        const maps = new GoogleMapsService();
        jest.spyOn(maps, 'findNearestBusStops').mockImplementation([{}]);
        payload.actions[0].value = '23,23';

        await RouteInputHandlers.handleBusStopRoute(payload, respond);
        expect(GoogleMapsService.mapResultsToCoordinates).toBeCalled();
      });

      it('should send bus stop Dialog form ', async () => {
        payload.actions[0].value = '23,23';
        await RouteInputHandlers.handleBusStopRoute(payload, respond);
        expect(DialogPrompts.sendBusStopForm).toBeCalled();
      });

      it('should call continueWithFlow function', async (done) => {
        payload.actions[0].name = 'not_listed';
        jest.spyOn(RouteInputHandlers, 'continueWithTheFlow').mockResolvedValueOnce(null);
        await RouteInputHandlers.handleBusStopRoute(payload, respond);
        expect(RouteInputHandlers.continueWithTheFlow).toBeCalled();
        done();
      });
    });

    describe('handleBusStopSelected', () => {
      beforeEach(() => {
        jest.spyOn(DialogPrompts, 'sendBusStopForm').mockResolvedValue();
        jest.spyOn(GoogleMapsStatic, 'getPathFromDojoToDropOff')
          .mockResolvedValue('https://sampleMapurl');
        jest.spyOn(RoutesHelper, 'getReverseGeocodePayload').mockResolvedValue(dummyMockData.place);
        jest.spyOn(Cache, 'fetch').mockResolvedValue([{}, {}]);
        jest.spyOn(Cache, 'save').mockResolvedValue();
        jest.spyOn(RoutesHelper, 'getPlaceInfo')
          .mockResolvedValue({ plus_code: { locality: { local_address: 'Nairobi, Kenya' } } });
        jest.spyOn(homebaseService, 'getHomeBaseBySlackId')
          .mockResolvedValue({ country: { name: 'Kenya' } });
      });
     
      afterEach(() => {
        jest.resetAllMocks();
      });
      it('handleBusStopSelected error. invalid coordinate', async () => {
        const resp = await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(respond).toHaveBeenCalledTimes(0);
        expect(resp).toEqual({
          errors:
            [{ error: 'You must submit a valid coordinate', name: 'otherBusStop' }]
        });
      });

      it('handleBusStopSelected error. Location in Different homebase', async () => {
        jest.spyOn(homebaseService, 'getHomeBaseBySlackId')
          .mockResolvedValue({ country: { name: 'Rwanda' } });
        payload = {
          ...payload,
          submission: { selectBusStop: '34,45' }
        };
        const resp = await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(respond).toHaveBeenCalledTimes(0);
        expect(resp).toEqual({
          errors:
            [{ error: 'The selected location should be within your homebase country', name: 'selectBusStop' }]
        });
      });

      it('handleBusStopSelected error. both fields submitted', async () => {
        payload = {
          ...payload,
          submission: { otherBusStop: 'san', selectBusStop: 'san', }
        };
        const resp = await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(respond).toHaveBeenCalledTimes(0);
        expect(resp).toEqual({
          errors:
            [{
              error: 'You can not fill in this field if you selected a stop in the drop down',
              name: 'otherBusStop'
            }]
        });
      });

      it('handleBusStopSelected error. none of the fields is submitted', async () => {
        payload = {
          ...payload,
          submission: {}
        };
        const resp = await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(respond).toHaveBeenCalledTimes(0);
        expect(resp).toEqual({
          errors:
            [{ error: 'One of the fields must be filled.', name: 'otherBusStop' }]
        });
      });

      it('handleBusStopSelected with valid coordinates', async () => {
        payload = {
          ...payload,
          submission: { selectBusStop: '34,45' }
        };
        const previewData = {};
        jest.spyOn(RouteInputHandlerHelper, 'resolveDestinationPreviewData')
          .mockReturnValue(previewData);
        jest.spyOn(PreviewPrompts, 'displayDestinationPreview')
          .mockReturnValue({});
        jest.spyOn(RouteInputHandlerHelper, 'savePreviewDataToCache')
          .mockReturnValue({});
        await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(PreviewPrompts.displayDestinationPreview).toHaveBeenCalledWith(previewData);
      });
      it('handleBusStopSelected with invalid distance coordinates', async () => {
        payload = {
          ...payload,
          submission: { selectBusStop: '34,45' }
        };
        const previewData = { validationError: { test: 'AAAAAA' } };
        jest.spyOn(RouteInputHandlerHelper, 'resolveDestinationPreviewData')
          .mockReturnValue(previewData);
        jest.spyOn(PreviewPrompts, 'displayDestinationPreview')
          .mockReturnValue({});
        jest.spyOn(RouteInputHandlerHelper, 'savePreviewDataToCache')
          .mockReturnValue({});
        const result = await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(result).toBe(previewData.validationError);
        expect(PreviewPrompts.displayDestinationPreview).not.toHaveBeenCalled();
      });
      it('handleBusStopSelected should handle error properly', async () => {
        payload = {
          ...payload,
          submission: { selectBusStop: '34,45' }
        };
        const previewData = { validationError: { test: 'AAAAAA' } };
        jest.spyOn(RouteInputHandlerHelper, 'resolveDestinationPreviewData')
          .mockRejectedValue(previewData);
        jest.spyOn(PreviewPrompts, 'displayDestinationPreview')
          .mockReturnValue({});
        jest.spyOn(RouteInputHandlerHelper, 'savePreviewDataToCache')
          .mockReturnValue({});
        jest.spyOn(bugsnagHelper, 'log')
          .mockReturnValue({});
        await RouteInputHandlers.handleBusStopSelected(payload, respond);
        expect(bugsnagHelper.log).toHaveBeenCalled();
        expect(PreviewPrompts.displayDestinationPreview).not.toHaveBeenCalled();
      });
    });
  });

  describe('RouteInputHandlers_handleNewRouteRequest', () => {
    beforeEach(() => {
      jest.spyOn(DialogPrompts, 'sendNewRouteForm').mockResolvedValue();
    });
    it('should handle route request', async () => {
      const payload = { actions: [{ value: 'launchNewRoutePrompt' }] };
      await RouteInputHandlers.handleNewRouteRequest(payload, respond);
      expect(DialogPrompts.sendNewRouteForm).toBeCalled();
    });
  });
  describe('RouteInputHandlers_handlePreviewPartnerInfo', () => {
    const { partnerInfo: { userId, teamId }, locationInfo, partnerInfo } = dummyMockData;
    const placement = {
      client: 'john doe',
      status: 'External Engagements',
      end_date: '2018-11-21T08:04:16.625Z',
      start_date: '2018-11-21T08:04:16.625Z',
    };

    beforeEach(() => {
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue(partnerInfo);
      jest.spyOn(SlackHelpers, 'getUserInfoFromSlack').mockResolvedValue({
        profile: { email: 'john@andela.com' }
      });

      jest.spyOn(AisService, 'getUserDetails').mockResolvedValue({ placement });

      jest.spyOn(Cache, 'fetch').mockResolvedValue({ locationInfo });
      jest.spyOn(PreviewPrompts, 'sendPartnerInfoPreview').mockResolvedValue();
    });

    it('should display a preview of the fellows information', async () => {
      const submission = { managerId: 'Test_567', workingHours: '20:30 - 02:30' };
      const payload = { user: { id: userId }, team: { id: teamId }, submission };
      await RouteInputHandlers.handlePreviewPartnerInfo(payload, respond);
      expect(AisService.getUserDetails).toHaveBeenCalledWith('john@andela.com');
      expect(PreviewPrompts.sendPartnerInfoPreview).toHaveBeenCalledWith(
        expect.any(Object), expect.any(Object), expect.any(Object)
      );
    });
    it('should return an error when user enter invalid date', async () => {
      const submission = { nameOfPartner: '', workingHours: '20:30 - hello' };
      const payload = { user: { id: userId }, team: { id: teamId }, submission };
      const res = await RouteInputHandlers.handlePreviewPartnerInfo(payload, respond);
      const { errors: [SlackDialogError] } = res;
      const { name, error } = SlackDialogError;
      expect(name).toEqual('workingHours');
      expect(error).toEqual('Invalid date');
    });
  });
  describe('RouteInputHandlers_handlePartnerForm', () => {
    const { partnerInfo: { userId, teamId } } = dummyMockData;
    beforeEach(() => {
      jest.spyOn(RouteInputHandlerHelper, 'handleRouteRequestSubmission')
        .mockResolvedValue({ id: userId });
    });
    it('should submit the preview form', async () => {
      const payload = { team: { id: teamId } };
      await RouteInputHandlers.handlePartnerForm(payload, respond);
      expect(RouteInputHandlerHelper.handleRouteRequestSubmission).toBeCalled();
    });

    it('should throw an error when it cannot trigger notification', async () => {
      jest.spyOn(RouteInputHandlerHelper, 'handleRouteRequestSubmission').mockResolvedValue();
      const payload = { team: { id: null } };
      const res = await RouteInputHandlers.handlePartnerForm(payload, respond);
      expect(res).toBeFalsy();
    });
  });

  describe('handleNewRouteRequest', () => {
    let payload;
    beforeEach(() => {
      payload = {
        team: { id: 'AAAAAA' },
        actions: [{}]
      };
    });

    it('should notify manager when submission is valid', async () => {
      jest.spyOn(RouteInputHandlerHelper, 'handleRouteRequestSubmission')
        .mockResolvedValue({ id: 'BBBBBB' });
      jest.spyOn(SlackEvents, 'raise').mockReturnValue();
      await RouteInputHandlers.handlePartnerForm(payload, respond);
      expect(SlackEvents.raise.mock.calls[0][0]).toBe(slackEventNames.NEW_ROUTE_REQUEST);
      expect(respond).toHaveBeenCalledWith(
        new SlackInteractiveMessage('Your Route Request has been successfully submitted')
      );
    });
  });
});
