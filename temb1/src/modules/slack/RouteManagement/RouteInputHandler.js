import bugsnagHelper from '../../../helpers/bugsnagHelper';
import Cache from '../../shared/cache';
import DialogPrompts from '../SlackPrompts/DialogPrompts';
import LocationPrompts from '../SlackPrompts/LocationPrompts';
import PreviewPrompts from '../SlackPrompts/PreviewPrompts';
import { Marker, RoutesHelper } from '../../../helpers/googleMaps/googleMapsHelpers';
import GoogleMapsService from '../../../services/googleMaps';
import GoogleMapsStatic from '../../../services/googleMaps/GoogleMapsStatic';
import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import validateBusStop from '../../../helpers/googleMaps/busStopValidation';
import UserInputValidator from '../../../helpers/slack/UserInputValidator';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import SlackEvents from '../events';
import { slackEventNames } from '../events/slackEvents';
import RouteInputHandlerHelper, { getNewRouteKey } from './RouteInputHandlerHelper';
import { getFellowEngagementDetails } from '../helpers/formHelper';
import InteractivePromptSlackHelper from '../helpers/slackHelpers/InteractivePromptSlackHelper';
import UpdateSlackMessageHelper from '../../../helpers/slack/updatePastMessageHelper';
import NewLocationHelpers from '../../new-slack/helpers/location-helpers';
import userRouteActions from '../../new-slack/routes/actions';
import userRouteBlocks from '../../new-slack/routes/blocks';

export default class RouteInputHandlers {
  static async home(payload, respond) {
    try {
      const { submission: { location: locationSearchString } } = payload;
      if (payload.type === 'dialog_submission') {
        const result = await RouteInputHandlerHelper
          .checkIfAddressExistOnDatabase(payload, respond, locationSearchString);
        if (result) return;
      }

      const { user: { id: userId }, submission: { location } } = payload;
      const locationOptions = {
        selectBlockId: userRouteBlocks.confirmLocation,
        selectActionId: userRouteActions.pickupLocation,
        navBlockId: userRouteBlocks.navBlock,
        navActionId: userRouteActions.back,
        backActionValue: 'back_to_routes_launch',
      };

      const message = await NewLocationHelpers.getLocationVerificationMsg(location, userId, locationOptions);
      respond(message);
    } catch (error) {
      respond(InteractivePromptSlackHelper.sendError());
      bugsnagHelper.log(error);
    }
  }

  static async suggestions(payload, respond) {
    try {
      const place = await RoutesHelper.getReverseGeocodePayload(payload);
      if (!place) {
        // inform user if coordinates did not point to a location
        LocationPrompts.sendLocationCoordinatesNotFound(respond);
        return;
      }

      const { plus_code: { geometry: { location: { lat: latitude } } } } = place;
      const { plus_code: { geometry: { location: { lng: longitude } } } } = place;
      const locationGeometry = `${latitude},${longitude}`;

      const address = `${place.plus_code.best_street_address}`;
      const locationMarker = new Marker('red', 'H');
      locationMarker.addLocation(locationGeometry);
      const staticMapString = GoogleMapsStatic.getLocationScreenshot([locationMarker]);
      // Convert the string to a URL by removing spaces and replacing with %20
      const staticMapUrl = RouteInputHandlerHelper.convertStringToUrl(staticMapString);
      await Cache.save(getNewRouteKey(payload.user.id), 'homeAddress', { address, latitude, longitude });

      LocationPrompts
        .sendLocationConfirmationResponse(respond, staticMapUrl, address, locationGeometry);
    } catch (error) {
      InteractivePromptSlackHelper.sendError();
      bugsnagHelper.log(error);
    }
  }

  static locationNotFound(payload, respond) {
    const { value } = payload.actions[0];
    if (value === 'no') {
      respond(new SlackInteractiveMessage('Noted...'));
      return DialogPrompts.sendLocationCoordinatesForm(payload);
    }

    if (value === 'retry') {
      respond(new SlackInteractiveMessage('Noted...'));
      return DialogPrompts.sendLocationForm(payload);
    }
  }

  static async handleBusStopRoute(payload, respond) {
    try {
      if (payload.actions[0].name === 'not_listed') {
        RouteInputHandlers.continueWithTheFlow(payload, respond);
        return;
      }
      const { value: location } = payload.actions[0].name === 'DatabaseSuggestions'
        ? JSON.parse(payload.actions[0].selected_options[0].value)
        : payload.actions[0];
      const maps = new GoogleMapsService();
      const result = await maps.findNearestBusStops(location);

      if (payload.actions[0].name === 'DatabaseSuggestions') {
        await RouteInputHandlerHelper.cacheLocationAddress(payload);
      }

      const busStageList = GoogleMapsService.mapResultsToCoordinates(result);

      const resolvedList = await RouteInputHandlerHelper.generateResolvedBusList(busStageList, location, payload);
      if (resolvedList) {
        return DialogPrompts.sendBusStopForm(payload, resolvedList);
      }
      respond(
        new SlackInteractiveMessage('Sorry, we could not find a bus-stop close to your location')
      );
    } catch (e) {
      bugsnagHelper.log(e);
      respond(new SlackInteractiveMessage(
        'Unsuccessful request. Please Try again, Request Timed out'
      ));
    }
  }

  static async handleBusStopSelected(payload, respond) {
    try {
      let locationGeometry;
      const { user } = payload;
      const { otherBusStop, selectBusStop } = payload.submission;
      if (otherBusStop) {
        const newPayload = { ...payload, submission: { coordinates: otherBusStop } };
        locationGeometry = await RouteInputHandlerHelper.coordinatesFromPlusCodes(newPayload);
      }
      const busStopCoordinate = selectBusStop || locationGeometry;
      const errors = await validateBusStop(locationGeometry, selectBusStop, user);
      if (errors) return errors;
      const previewData = await RouteInputHandlerHelper.resolveDestinationPreviewData(
        payload, busStopCoordinate
      );
      const { validationError } = previewData;
      if (validationError) return validationError;
      await UpdateSlackMessageHelper.updateMessage(payload.state, { text: 'Noted...' });
      await RouteInputHandlerHelper.savePreviewDataToCache(payload.user.id, previewData);
      const previewMessage = PreviewPrompts.displayDestinationPreview(previewData);
      respond(previewMessage);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static runValidations(payload) {
    if (payload.submission && (payload.submission.coordinates || payload.submission.otherBusStop)) {
      const errors = [];
      errors.push(...UserInputValidator.validateCoordinates(payload));
      return errors;
    }
  }

  static async handleNewRouteRequest(payload) {
    const { value } = payload.actions[0];
    if (value === 'launchNewRoutePrompt') {
      return DialogPrompts.sendNewRouteForm(payload);
    }
  }

  static async handlePreviewPartnerInfo(payload, respond) {
    const { user: { id: userId }, team: { id: teamId } } = payload;
    const [requester, cached, partnerInfo] = await Promise.all([
      SlackHelpers.findOrCreateUserBySlackId(userId, teamId),
      await Cache.fetch(getNewRouteKey(userId)),
      await getFellowEngagementDetails(userId, teamId)
    ]);

    const { locationInfo } = cached;
    const { submission } = payload;
    const errors = UserInputValidator.validateEngagementForm(submission);
    if (errors) return errors;

    await UpdateSlackMessageHelper.updateMessage(payload.state, { text: 'Noted...' });
    if (locationInfo) {
      const message = await PreviewPrompts.sendPartnerInfoPreview({ ...payload, partnerName: partnerInfo.partnerStatus }, locationInfo, requester);
      respond(message);
    }
  }

  static async handlePartnerForm(payload, respond) {
    try {
      const { team: { id: teamId } } = payload;
      const routeRequest = await RouteInputHandlerHelper.handleRouteRequestSubmission(payload);
      SlackEvents.raise(
        slackEventNames.NEW_ROUTE_REQUEST,
        respond,
        {
          routeRequestId: routeRequest.id,
          teamId
        }
      );
      respond(new SlackInteractiveMessage('Your Route Request has been successfully submitted'));
    } catch (e) {
      bugsnagHelper.log(e);
      respond(new SlackInteractiveMessage(
        'Unsuccessful request. Please Try again, Request Timed out'
      ));
    }
  }

  static async continueWithTheFlow(payload, respond) {
    const { newRouteRequest: result } = await Cache.fetch(payload.user.id);
    const newPayload = { ...payload, submission: { location: result } };
    return RouteInputHandlers.home(newPayload, respond);
  }
}
