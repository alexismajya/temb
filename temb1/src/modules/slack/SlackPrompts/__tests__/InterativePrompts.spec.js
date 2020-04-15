import InteractivePrompts from '../InteractivePrompts';
import InteractivePromptsHelpers from '../../helpers/slackHelpers/InteractivePromptsHelpers';
import {
  SlackAttachment, SlackSelectAction,
  SlackButtonAction, SlackCancelButtonAction
} from '../../SlackModels/SlackMessageModels';
import {
  sendBookNewTripMock,
  sendCompletionResponseMock,
} from '../__mocks__/InteractivePrompts.mock';
import LocationPrompts from '../LocationPrompts';
import WebClientSingleton from '../../../../utils/WebClientSingleton';
import { createTripData } from '../../SlackInteractions/__mocks__/SlackInteractions.mock';
import PreviewScheduleTrip from '../../helpers/slackHelpers/previewScheduleTripAttachments';
import InteractivePromptSlackHelper from '../../helpers/slackHelpers/InteractivePromptSlackHelper';
import UserService from '../../../users/user.service';
import database from '../../../../database';

jest.mock('../../../slack/events', () => ({
  slackEvents: jest.fn(() => ({
    raise: jest.fn(),
    handle: jest.fn()
  })),
}));

jest.mock('country-list', () => ({
  getCode: () => 'ng',
}));

describe(InteractivePrompts, () => {
  afterAll((done) => database.close().then(done, done));
  describe('Interactive Prompts test', () => {
    let getWebClient;
    const update = jest.fn(() => {});
    beforeEach(() => {
      getWebClient = jest.spyOn(WebClientSingleton, 'getWebClient');
      getWebClient.mockImplementationOnce(() => ({
        chat: { update }
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    beforeAll(async () => {
      const user = {
        name: 'Jane Doe',
        slackId: 'UN5FDBM1U',
        email: 'jane.doe@gmail.com',
        createdAt: '2019-09-10',
        updatedAt: '2019-09-10'
      };
      await UserService.findOrCreateNewUserWithSlackId(user);
    });

    it('should sendBookNewTrip Response', (done) => {
      const respond = jest.fn((value) => value);
      const payload = jest.fn(() => 'respond');
      const result = InteractivePrompts.sendBookNewTripResponse(payload, respond);
      expect(result).toBe(undefined);
      expect(respond).toHaveBeenCalledWith(sendBookNewTripMock);
      done();
    });

    it('should changeLocation', async () => {
      let responseMock;
      const respond = jest.fn((value) => {
        responseMock = value;
        return value;
      });

      const payload = {
        actions: [{ name: 'changeLocation__ng' }],
        user: { id: 'UN5FDBM1U' }
      };
      await InteractivePrompts.changeLocation(payload, respond);
      expect(respond).toHaveBeenCalledWith(responseMock);
    });

    it('should create view open trips response', (done) => {
      const respond = jest.fn((value) => value);
      const result = InteractivePromptSlackHelper.sendCompletionResponse(respond, 1, 'UH1RT223');
      expect(result).toBe(undefined);
      expect(respond).toHaveBeenCalledWith(sendCompletionResponseMock);

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
        pickup: { },
        departureDate: null,
        requestDate: new Date(),
        requester: { dataValues: {} },
        rider: { dataValues: { slackId: 2 } },
      };
      InteractivePrompts.sendManagerDeclineOrApprovalCompletion(true, tripInitial, 'timeStamp', 1);
      expect(update).toHaveBeenCalledTimes(1);
      done();
    });

    it('should SendTripError response', (done) => {
      const result = InteractivePromptSlackHelper.sendTripError();

      expect(result).toHaveProperty('text', 'Dang! I hit an error with this trip');
      done();
    });

    it('should send rider select list', () => {
      const response = jest.fn();
      InteractivePrompts.sendRiderSelectList({ channel: { id: 1 }, user: { id: 2 } }, response);
      expect(response).toBeCalledTimes(1);
    });
  });

  describe('test send add passenger response', () => {
    it('should provide an interface to add passengers', (done) => {
      const respond = jest.fn((value) => value);
      InteractivePrompts.sendAddPassengersResponse(respond);
      expect(respond).toHaveBeenCalled();
      done();
    });
  });

  describe('test send add passenger response with forSelf as [false]', () => {
    it('should provide an interface to add passengers', (done) => {
      const respond = jest.fn((value) => value);
      InteractivePrompts.sendAddPassengersResponse(respond, false);
      expect(respond).toHaveBeenCalled();
      done();
    });
  });

  describe('test send preview response and cancel response', () => {
    beforeEach(() => {
      InteractivePromptsHelpers.generatePreviewTripResponse = jest.fn(() => 'called');
    });

    it('should return preview response', () => {
      const tripDetailsMock = {
        tripType: 'Airport Transfer',
      };
      const result = InteractivePrompts.sendPreviewTripResponse(tripDetailsMock);
      expect(result).toBeDefined();
    });
  });

  describe('LocationPrompts', () => {
    let fieldsOrActionsSpy;
    let optionalPropsSpy;

    beforeEach(() => {
      fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
      optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    describe('sendLocationSuggestionResponse', () => {
      const backButtonAction = new SlackButtonAction(
        'back', '< Back', 'back_to_routes_launch', '#FFCCAA'
      );
      const cancelButtonAction = new SlackCancelButtonAction();

      it('should sendLocationSuggestionResponse: atleast one prediction location', () => {
        const predictedLocations = [{ text: 'Location1', value: 'place_id' }];
        const selectedActions = new SlackSelectAction('predictedLocations',
          'Select Home location', predictedLocations);
        const buttonAction = new SlackButtonAction('no', 'Location not listed', 'no');
        LocationPrompts.sendLocationSuggestionsResponse(
          'https://staticMap',
          predictedLocations
        );
        expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
        expect(fieldsOrActionsSpy).toBeCalledWith('actions', [backButtonAction, cancelButtonAction]);
        expect(optionalPropsSpy).toBeCalledWith('new_route_suggestions', '', '#3AAF85');
        expect(optionalPropsSpy).toBeCalledWith('back_to_launch', undefined, '#4285f4');
      });

      it('sendLocationSuggestionResponse: empty PredictionLocations', () => {
        const selectedActions = new SlackButtonAction('retry', 'Try Again', 'retry');
        const buttonAction = new SlackButtonAction('no', 'Enter Location Coordinates', 'no');
        LocationPrompts.sendLocationSuggestionsResponse(
          'https://staticMap',
          []
        );
        expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
        expect(fieldsOrActionsSpy).toBeCalledWith('actions', [backButtonAction, cancelButtonAction]);
        expect(optionalPropsSpy).toBeCalledWith('new_route_locationNotFound', '', '#3AAF85');
        expect(optionalPropsSpy).toBeCalledWith('back_to_launch', undefined, '#4285f4');
      });
    });

    describe('sendMapSuggestionsResponse', () => {
      it('should sendMapSuggestionsResponse: atleast one prediction location', () => {
        const predictedLocations = [{ text: 'Location1', value: 'place_id' }];

        const selectedActions = new SlackSelectAction('pickupBtn',
          'Pick Up location', predictedLocations);

        const staticMapUrl = 'https://staticMap';

        const locationData = {
          staticMapUrl,
          predictedLocations,
          pickupOrDestination: 'Pick Up',
          buttonType: 'pickup',
          tripType: 'travel_trip'
        };
        fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
        optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');

        LocationPrompts.sendMapSuggestionsResponse(locationData);
        expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions]);
        expect(optionalPropsSpy).toBeCalledWith('travel_trip_suggestions',
          '', '#3AAF85', 'default', 'pickup');

        // No predicted location
        const localData = {
          staticMapUrl,
          predictedLocations: [],
          pickupOrDestination: 'Pick Up',
          buttonType: 'pickup',
          tripType: 'travel_trip'
        };
        LocationPrompts.sendMapSuggestionsResponse(localData);
        expect(optionalPropsSpy).toBeCalledWith('travel_trip_locationNotFound',
          '', '#3AAF85', 'default', 'pickup');
      });
    });

    it('should sendLocationConfirmationResponse', () => {
      const respond = jest.fn((value) => value);
      LocationPrompts.sendLocationConfirmationResponse(
        respond,
        'https://staticMap',
        'test location',
        '1,1'
      );
      expect(respond).toBeCalled();
    });

    it('Should call respond', () => {
      const respond = jest.fn((value) => value);
      LocationPrompts.errorPromptMessage(respond);
      expect(respond).toBeCalled();
    });

    describe('sendMapsConfirmationResponse', () => {
      const respond = jest.fn((value) => value);
      const locationData = {
        staticMapUrl: 'https://staticMap', address: 'test location', locationGeometry: '1,1', actionType: 'travel_trip'
      };

      LocationPrompts.sendMapsConfirmationResponse(
        respond,
        locationData,
        'pickup'
      );
      expect(respond).toBeCalled();

      LocationPrompts.sendMapsConfirmationResponse(
        respond,
        locationData,
        'Pick up'
      );
      expect(respond).toBeCalled();
    });

    it('Should call respond', () => {
      const respond = jest.fn((value) => value);
      LocationPrompts.errorPromptMessage(respond);
      expect(respond).toBeCalled();
    });

    it('should sendLocationCoordinatesNotFound', () => {
      const respond = jest.fn((value) => value);
      LocationPrompts.sendLocationCoordinatesNotFound(respond);
      expect(respond).toBeCalled();
    });

    describe('InteractivePrompts_sendScheduleTripHistory', () => {
      beforeEach(() => {
        fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
        optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
      });

      afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should create view open schedule trips response', async () => {
        const tripDetails = createTripData();
        const respond = jest.fn((value) => value);
        jest.spyOn(PreviewScheduleTrip, 'previewScheduleTripAttachments').mockResolvedValue();
        await InteractivePrompts.sendScheduleTripResponse(tripDetails, respond);
        const confirm = new SlackButtonAction('confirmTripRequest', 'Confirm Trip', 'confirm');
        const cancel = new SlackCancelButtonAction(
          'Cancel Trip',
          'cancel',
          'Are you sure you want to cancel this schedule trip',
          'cancel_request'
        );

        expect(fieldsOrActionsSpy).toBeCalledWith('actions', [confirm, cancel]);
        expect(optionalPropsSpy).toBeCalledWith('schedule_trip_confirmation', 'fallback', undefined, 'default');
        expect(respond).toBeCalled();
      });
    });
    describe('InteractivePrompts_sendCancelRequestResponse', () => {
      it('should create view open schedule trips response', async () => {
        const respond = jest.fn((value) => value);
        const result = await InteractivePromptSlackHelper.sendCancelRequestResponse(respond);
        expect(result).toBe(undefined);
        expect(respond).toHaveBeenCalled();
      });
    });
    describe('InteractivePrompts_openDestinationDialog', () => {
      beforeEach(() => {
        fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
        optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
      });

      afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should create view open schedule trips response', async () => {
        await InteractivePromptSlackHelper.openDestinationDialog();
        expect(optionalPropsSpy).toBeCalledWith('travel_trip_destinationSelection',
          'fallback', undefined, 'default');
      });
    });
    describe('InteractivePrompts_sendSelectDestination', () => {
      it('should create select destination button', async () => {
        optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
        const respond = jest.fn((value) => value);
        const result = await InteractivePrompts.sendSelectDestination(respond);
        expect(result).toBe(undefined);
        expect(respond).toHaveBeenCalled();
        expect(optionalPropsSpy).toBeCalledWith('schedule_trip_destinationSelection');
      });
    });
  });
});
