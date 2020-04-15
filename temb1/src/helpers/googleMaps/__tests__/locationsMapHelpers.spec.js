import googleClient from '@google/maps';
import GoogleMapsMock from '../__mocks__/GoogleMapsMock';
import { teamDetailsService } from '../../../modules/teamDetails/teamDetails.service';
import SlackClientMock from '../../../modules/slack/__mocks__/SlackClientMock';
import LocationPrompts from '../../../modules/slack/SlackPrompts/LocationPrompts';
import GoogleMapsSuggestions from '../../../services/googleMaps/GoogleMapsSuggestions';
import GoogleMapsStatic from '../../../services/googleMaps/GoogleMapsStatic';
import { RoutesHelper } from '../googleMapsHelpers';
import bugsnagHelper from '../../bugsnagHelper';
import Cache from '../../../modules/shared/cache';
import LocationHelpers from '../locationsMapHelpers';
import DialogPrompts from '../../../modules/slack/SlackPrompts/DialogPrompts';

jest.mock('../../../utils/WebClientSingleton.js');
jest.mock('../../../modules/slack/events/index.js');
jest.mock('@google/maps');

jest.mock('../../../modules/slack/events/', () => ({
  slackEvents: jest.fn(() => ({
    raise: jest.fn(),
    handle: jest.fn()
  })),
}));

const mockedCreateClient = { placesNearby: jest.fn() };
SlackClientMock();
GoogleMapsMock();

jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue({});

const pickUpString = 'pickup';
const destinationString = 'destination';
const pickupPayload = {
  submission: {
    pickup: 'Nairobi',
    othersPickup: ''
  }
};

const destinationPayload = {
  submission: {
    destination: 'Kisumu',
    othersDestination: '',
  }
};

const pickupOthers = {
  submission: {
    pickup: 'Others',
    othersPickup: 'Allsops'
  }
};

const destinationOthers = {
  submission: {
    destination: 'Others',
    othersDestination: 'Kigali',
  }
};

describe('Tests for google maps locations', () => {
  let respond;
  beforeEach(() => {
    respond = jest.fn();
    googleClient.createClient.mockImplementation(() => (mockedCreateClient));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should check trip type and return required response', () => {
    expect(LocationHelpers
      .checkTripType(pickUpString, pickupPayload.submission)).toEqual('Nairobi');
    expect(LocationHelpers
      .checkTripType(destinationString, destinationPayload.submission)).toEqual('Kisumu');

    expect(LocationHelpers.checkTripType(pickUpString, pickupOthers.submission)).toEqual('Allsops');
    expect(LocationHelpers
      .checkTripType(destinationString, destinationOthers.submission)).toEqual('Kigali');
  });

  it('should call sendMapSuggestionsResponse', async () => {
    const payload = {
      type: 'dialog_submission',
      submission: {
        location: 'test location'
      }
    };
    GoogleMapsSuggestions.getPlacesAutoComplete = jest.fn().mockResolvedValue(
      { predictions: [{ description: 'Test Location', place_id: 'xxxxx' }] }
    );
    GoogleMapsStatic.getLocationScreenshot = jest.fn().mockReturnValue('staticMapUrl');
    LocationPrompts.sendMapSuggestionsResponse = jest.fn().mockReturnValue({});
    await LocationHelpers.locationVerify(payload.submission, respond, pickUpString, 'travel_trip');
    expect(LocationPrompts.sendMapSuggestionsResponse).toHaveBeenCalled();
  });

  it('Should not return "other" if destination or pick up is other', () => {
    const tripData = {
      destination: 'Others', othersDestination: 'Nairobi', pickup: 'Others', othersPickup: 'Dojo'
    };
    const newTripData = {
      destination: 'Nairobi', othersDestination: 'Nairobi', pickup: 'Dojo', othersPickup: 'Dojo'
    };
    const returnData = LocationHelpers.tripCompare(tripData);
    expect(returnData).toEqual(newTripData);
  });
});

describe('Tests for google maps suggestions', () => {
  let respond;
  beforeEach(() => {
    respond = jest.fn();
    googleClient.createClient.mockImplementation(() => (mockedCreateClient));
  });

  it('should call sendMapSuggestionsResponse', async () => {
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
    GoogleMapsStatic.getLocationScreenshot = jest.fn().mockReturnValue('staticMapUrl');
    Cache.saveObject = jest.fn().mockResolvedValue({});
    LocationPrompts.sendMapSuggestionsResponse = jest.fn().mockReturnValue({});
    LocationHelpers.sendResponse = jest.fn().mockReturnValue({});
    await LocationHelpers.locationSuggestions(payload, respond, 'pickupBtn');
    expect(LocationHelpers.sendResponse).toHaveBeenCalled();
  });

  it('should call sendLocationCoordinatesNotFound', async () => {
    const payload = {
      submission: { coordinates: '1,1' }
    };

    jest.spyOn(RoutesHelper, 'getAddressDetails')
      .mockImplementation().mockResolvedValueOnce(null);

    LocationPrompts.sendLocationCoordinatesNotFound = jest.fn().mockReturnValueOnce({});

    await LocationHelpers.locationSuggestions(payload, respond, 'pickupBtn');

    expect(LocationPrompts.sendLocationCoordinatesNotFound).toHaveBeenCalled();
  });

  it('should catch thrown errors', async () => {
    const payload = {
      type: 'dialog_submission',
      submission: {
        location: 'test location'
      }
    };
    RoutesHelper.getReverseGeocodePayload = jest.fn().mockImplementation(() => {
      throw new Error('Dummy error');
    });
    bugsnagHelper.log = jest.fn().mockReturnValue({});
    await LocationHelpers.locationSuggestions(payload, respond, pickUpString);
    expect(bugsnagHelper.log).toHaveBeenCalled();
  });
});

describe('helper functions', () => {
  let respond;
  beforeEach(() => {
    respond = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const locationData = {
    address: 'Nairobi', latitude: '1234567', longitude: '34567890'
  };
  const payload = {
    user: {
      id: '1'
    }
  };
  const stateLocation = 'destinationAddress';
  const trip = 'travel_trip';

  it('it should call sendMapsConfirmationResponse', async () => {
    Cache.save = jest.fn().mockReturnValue({});
    LocationPrompts.sendMapsConfirmationResponse = jest.fn().mockReturnValue({});
    await LocationHelpers.locationPrompt(locationData, respond, payload, stateLocation, trip);
    expect(LocationPrompts.sendMapsConfirmationResponse).toBeCalled();
    expect(Cache.save).toBeCalled();
  });

  describe('callRiderLocationConfirmation', () => {
    it('Should call sendTripDetailsForm', async () => {
      const sendTripDetailsForm = jest.spyOn(DialogPrompts,
        'sendTripDetailsForm').mockImplementation(() => Promise.resolve());
      await LocationHelpers.callRiderLocationConfirmation(payload, respond, 'Pickup');

      expect(sendTripDetailsForm).toHaveBeenCalledWith(payload, 'riderLocationConfirmationForm',
        'travel_trip_completeTravelConfirmation', 'Confirm Pickup');
    });
    it('should respond and call bugsnug of error caught', async () => {
      DialogPrompts.sendTripDetailsForm = jest.fn().mockImplementation(() => {
        throw new Error('Dummy error');
      });
      bugsnagHelper.log = jest.fn().mockReturnValue({});
      await LocationHelpers.callRiderLocationConfirmation(payload, respond, 'Pickup');
      expect(respond).toHaveBeenCalled();
      expect(bugsnagHelper.log).toHaveBeenCalled();
    });
  });

  describe('getMarker', () => {
    it('should get marker object', () => {
      const location = 'Andela Nairobi';
      const label = 'Dodjo';
      const marker = LocationHelpers.getMarker(location, label);
      expect(marker).toBeDefined();
      expect(marker.color).toEqual('blue');
      expect(marker.label).toEqual('Dodjo');
    });
  });

  describe('getPredictionsOnMap', () => {
    it('should return predictions and url', async () => {
      jest.spyOn(GoogleMapsSuggestions, 'getPlacesAutoComplete').mockResolvedValue({
        predictions: [{
          description: 'Nakuru Road'
        }]
      });
      jest.spyOn(GoogleMapsStatic, 'getLocationScreenshot').mockResolvedValue('https://maps.googleapis.com/maps/api/staticmap');

      const predictions = await LocationHelpers.getPredictionsOnMap('Nakuru', 'Nairobi');
      expect(predictions).toBeDefined();
      expect(predictions.predictions).toEqual([{ description: 'Nakuru Road' }]);
    });

    it('should return false when there is no prediction found', async () => {
      const predictions = await LocationHelpers.getPredictionsOnMap('Nakuru', 'Nairobi');
      expect(predictions).toBe(false);
    });
  });

  describe('getLocationPredictions', () => {
    it('should return predictions', () => {
      jest.spyOn(GoogleMapsSuggestions, 'getPlacesAutoComplete').mockResolvedValue({
        predictions: [{
          description: 'Nakuru Road'
        }]
      });
    });
  });
});
