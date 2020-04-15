import {
  SlackButtonAction,
  SlackSelectAction,
  SlackAttachment,
  SlackInteractiveMessage
} from '../../SlackModels/SlackMessageModels';
import LocationPrompts from '../LocationPrompts';


describe('sendTripSuggestionsResponse', () => {
  let fieldsOrActionsSpy;
  let optionalPropsSpy;
  beforeEach(() => {
    fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
    optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it('should call schedule_trip_tripSuggestions: atleast one location is found', () => {
    const predictedLocations = [{
      text: 'Location1',
      value: 'place_id'
    }];

    const selectedActions = new SlackSelectAction('pickupBtn',
      'Pick Up location', predictedLocations);

    const buttonAction = new SlackButtonAction('no', 'Location not listed', 'no');
    const staticMapUrl = 'https://staticMap';
    const locationData = {
      staticMapUrl,
      predictedLocations,
      pickupOrDestination: 'Pick Up',
      buttonType: 'pickup',
      tripType: 'schedule_trip',
      locationType: 'Pick Up'
    };

    const result = LocationPrompts
      .sendTripSuggestionsResponse(staticMapUrl, predictedLocations,
        locationData.locationType, locationData.buttonType);
    expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
    expect(optionalPropsSpy).toBeCalledWith('schedule_trip_tripSuggestions',
      '', '#3AAF85', 'default', 'pickup');
    expect(result).toBeInstanceOf(SlackInteractiveMessage);
  });
  it('should call schedule_trip_locationNotFound: no location is found', () => {
    const predictedLocations = [];

    const selectedActions = new SlackSelectAction('pickupBtn',
      'Pick Up location', predictedLocations);

    const buttonAction = new SlackButtonAction('no', 'Location not listed', 'no');
    const staticMapUrl = 'https://staticMap';
    const locationData = {
      staticMapUrl,
      predictedLocations,
      pickupOrDestination: 'Pick Up',
      buttonType: 'pickup',
      tripType: 'schedule_trip',
      locationType: 'Pick Up'
    };

    const result = LocationPrompts
      .sendTripSuggestionsResponse(staticMapUrl, predictedLocations,
        locationData.locationType, locationData.buttonType);
    expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
    expect(optionalPropsSpy).toBeCalledWith('schedule_trip_locationNotFound',
      '', '#3AAF85', 'default', 'pickup');
    expect(result).toBeInstanceOf(SlackInteractiveMessage);
  });
});

describe('sendTravelConfirmationResponse', () => {
  let fieldsOrActionsSpy;
  let optionalPropsSpy;
  let respond;
  beforeEach(() => {
    fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
    optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
    respond = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it('should call schedule_trip_destinationSelection: for confirming your pickup', () => {
    const predictedLocations = [{
      text: 'Location1',
      value: 'place_id'
    }];

    const staticMapUrl = 'https://staticMap';
    const locationData = {
      staticMapUrl,
      predictedLocations,
      pickupOrDestination: 'Pick Up',
      buttonType: 'pickup',
      tripType: 'schedule_trip',
      locationType: 'Pick Up',
      locationGeomentry: { lat: 1.333, lng: 12.3333 }
    };
    const buttonAction = new SlackButtonAction(`confirm${locationData.buttonType}`,
      'Confirm pickup location', locationData.locationGeomentry);

    LocationPrompts
      .sendTravelConfirmationResponse(respond, staticMapUrl, predictedLocations,
        locationData.locationGeomentry, locationData.buttonType);
    expect(fieldsOrActionsSpy).toBeCalledWith('actions', [buttonAction]);
    expect(optionalPropsSpy).toBeCalledWith('schedule_trip_destinationSelection');
    expect(respond).toBeCalled();
  });
  
  it('should call schedule_trip_destinationSelection: for confirming your pickup', () => {
    const predictedLocations = [{
      text: 'Location1',
      value: 'place_id'
    }];

    const staticMapUrl = 'https://staticMap';
    const locationData = {
      staticMapUrl,
      predictedLocations,
      pickupOrDestination: 'Pick Up',
      buttonType: 'destination',
      tripType: 'schedule_trip',
      locationType: 'Pick Up',
      locationGeomentry: {
        lat: 1.333,
        lng: 12.3333
      }
    };
    const buttonAction = new SlackButtonAction(`confirm${locationData.buttonType}`,
      'Confirm destination location', locationData.locationGeomentry);

    LocationPrompts
      .sendTravelConfirmationResponse(respond, staticMapUrl, predictedLocations,
        locationData.locationGeomentry, locationData.buttonType);
    expect(fieldsOrActionsSpy).toBeCalledWith('actions', [buttonAction]);
    expect(optionalPropsSpy).toBeCalledWith('schedule_trip_detailsConfirmation');
    expect(respond).toBeCalled();
  });
});

describe('sendDatbaseLocationSuggestionResponse', () => {
  let fieldsOrActionsSpy;
  let optionalPropsSpy;
  beforeEach(() => {
    fieldsOrActionsSpy = jest.spyOn(SlackAttachment.prototype, 'addFieldsOrActions');
    optionalPropsSpy = jest.spyOn(SlackAttachment.prototype, 'addOptionalProps');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should send a prompt with a list of data from the database', () => {
    const SuggestedLocations = [{
      label: 'Andela Nairobi',
      text: 'Andela Nairobi',
      value: '1.2345,-1.4566'
    },
    {
      label: 'Andela kigali',
      text: 'Andela kigali',
      value: '1.2345,-1.6872'
    }];
    const selectedActions = new SlackSelectAction(
      'DatabaseSuggestions', 'Select Home location', SuggestedLocations
    );
    
    const buttonAction = new SlackButtonAction('not_listed', 'Location not listed', 'no');
    const result = LocationPrompts.sendDatbaseLocationSuggestionResponse(SuggestedLocations);
    expect(fieldsOrActionsSpy).toBeCalledWith('actions', [selectedActions, buttonAction]);
    expect(optionalPropsSpy).toBeCalledWith('new_route_handleBusStopRoute', '', '#3AAF85');
    expect(result).toBeInstanceOf(SlackInteractiveMessage);
  });

  it('should prompt the user to retry when the suggestion list is empty', () => {
    const SuggestedLocations = [];
    const buttonAction = new SlackButtonAction('not_listed', 'Location not listed', 'no');
    const emptyListButtonAction = new SlackButtonAction('retry', 'Try Again', 'retry');
    const result = LocationPrompts.sendDatbaseLocationSuggestionResponse(SuggestedLocations);
    expect(fieldsOrActionsSpy).toBeCalledWith('actions', [emptyListButtonAction, buttonAction]);
    expect(optionalPropsSpy).toBeCalledWith('new_route_handleBusStopRoute', '', '#3AAF85');
    expect(result).toBeInstanceOf(SlackInteractiveMessage);
  });
});
