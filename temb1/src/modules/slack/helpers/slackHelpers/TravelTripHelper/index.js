import InteractivePrompts from '../../../SlackPrompts/InteractivePrompts';
import { SlackInteractiveMessage } from '../../../SlackModels/SlackMessageModels';
import Cache from '../../../../shared/cache';
import ScheduleTripController from '../../../TripManagement/ScheduleTripController';
import createTravelTripDetails from './createTravelTripDetails';
import bugsnagHelper from '../../../../../helpers/bugsnagHelper';
import LocationMapHelpers from '../../../../../helpers/googleMaps/locationsMapHelpers';
import SlackEvents from '../../../events';
import { slackEventNames } from '../../../events/slackEvents';
import LocationPrompts from '../../../SlackPrompts/LocationPrompts';
import GoogleMapsError from '../../../../../helpers/googleMaps/googleMapsError';
import CleanData from '../../../../../helpers/cleanData';
import Validators from '../../../../../helpers/slack/UserInputValidator/Validators';
import Notifications from '../../../SlackPrompts/Notifications';
import InteractivePromptSlackHelper from '../InteractivePromptSlackHelper';
import travelHelper from './travelHelper';
import UpdateSlackMessageHelper from '../../../../../helpers/slack/updatePastMessageHelper';
import { homebaseService } from '../../../../homebases/homebase.service';
import { getTimezone } from '../../dateHelpers';
import DateDialogHelper from '../../../../../helpers/dateHelper';
import tripService from '../../../../trips/trip.service';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import TripHelpers from '../../../../new-slack/trips/travel/travel.helpers';

export const getTravelKey = (id) => `TRAVEL_REQUEST_${id}`;

class TravelTripHelper {
  static async contactDetails(data, respond) {
    try {
      const payload = CleanData.trim(data);
      const errors = ScheduleTripController.validateTravelContactDetailsForm(payload);
      if (errors.length > 0) { return { errors }; }
      const { user: { id }, submission } = payload;
      await Cache.save(getTravelKey(id), 'contactDetails', submission);
      const props = {
        payload,
        respond,
        attachmentCallbackId: 'travel_trip_department',
        navButtonCallbackId: 'back_to_launch',
        navButtonValue: 'back_to_travel_launch'
      };
      return InteractivePrompts.sendListOfDepartments(props, 'false');
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
    }
  }

  static async checkVerifiable(payload, respond) {
    try {
      const verifiable = await travelHelper.getPickupType(payload.submission);
      if (verifiable) respond(verifiable);
    } catch (err) {
      if (err instanceof GoogleMapsError && err.code === GoogleMapsError.UNAUTHENTICATED) {
        const message = InteractivePromptSlackHelper.openDestinationDialog();
        respond(message);
      }
    }
  }

  static async flightDetails(payload, respond) {
    try {
      const { user: { id } } = payload;
      const errors = await ScheduleTripController.validateTravelDetailsForm(
        payload, 'airport', 'pickup'
      );
      if (errors.length > 0) { return { errors }; }
      await UpdateSlackMessageHelper.updateMessage(payload.state, { text: 'Noted...' });
      const tripDetails = await createTravelTripDetails(payload);
      const homeBase = await homebaseService.getHomeBaseBySlackId(id);
      const userTimeZone = getTimezone(homeBase.name || 'Nairobi');
      tripDetails.dateTime = DateDialogHelper.transformDate(tripDetails.dateTime, userTimeZone);
      tripDetails.flightDateTime = DateDialogHelper.transformDate(tripDetails.flightDateTime, userTimeZone);
      await Cache.save(getTravelKey(id), 'tripDetails', tripDetails);
      await TravelTripHelper.checkVerifiable(payload, respond);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
    }
  }

  static async suggestions(payload, respond) {
    const actionName = payload.actions[0].name;
    if (actionName === 'no') {
      LocationPrompts.errorPromptMessage(respond);
    } else {
      await LocationMapHelpers.locationSuggestions(payload, respond, actionName, 'travel_trip');
    }
  }

  static async destinationSelection(payload, respond) {
    const newPayload = { ...payload };
    newPayload.state = JSON.stringify(payload);
    const valueName = payload.actions[0].value;
    if (valueName === 'cancel') {
      respond(new SlackInteractiveMessage('Thank you for using Tembea'));
    } else {
      await LocationMapHelpers.callDestinationSelection(newPayload, respond);
    }
  }

  static async destinationConfirmation(payload, respond) {
    try {
      const errors = await ScheduleTripController.validateTravelDetailsForm(
        payload, 'airport', 'destination'
      );
      if (errors.length > 0) { return { errors }; }
      const { user: { id } } = payload;
      const { tripDetails } = await Cache.fetch(getTravelKey(id));
      const { submission: { destination, othersDestination } } = payload;
      errors.push(...Validators.checkOriginAnDestination(tripDetails.pickup,
        destination, 'pickup', 'destination'));
      if (errors.length > 0) return { errors };
      await UpdateSlackMessageHelper.updateMessage(payload.state, { text: 'Noted...' });
      tripDetails.destination = destination;
      tripDetails.othersDestination = othersDestination;
      await Cache.save(getTravelKey(id), 'tripDetails', tripDetails);
      await travelHelper.getDestinationType(payload, respond);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Please try again'));
    }
  }

  static sendDetails(payload, respond) {
    if (payload.actions[0].value === 'cancel') {
      return InteractivePromptSlackHelper.sendCancelRequestResponse(respond);
    }
    if (payload.actions[0].value === 'trip_note') {
      return travelHelper.notesRequest(payload, respond);
    }
  }

  static async confirmation(payload, respond) {
    try {
      const { user: { id } } = payload;
      const { tripDetails } = await Cache.fetch(getTravelKey(id));
      if (payload.actions[0].value === 'confirm') {
        await TravelTripHelper.processTripCompletion(payload, tripDetails, respond);
      } else {
        await travelHelper.checkNoteStatus(payload, respond);
      }
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
    }
  }

  static async processTripCompletion(payload, tripDetails, respond) {
    try {
      const tripRequest = await ScheduleTripController.createTravelTripRequest(
        payload, tripDetails
      );
      if (tripDetails.destination === 'To Be Decided' || tripDetails.pickup === 'To Be Decided') {
        await travelHelper.riderRequest(payload, tripDetails, respond);
      }

      await TravelTripHelper.sendCompletedResponseToOps(
        tripRequest, tripDetails, respond, payload
      );
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }

  static async requesterToBeDecidedNotification(payload, respond) {
    const { user: { id } } = payload;
    const valueName = payload.actions[0].value;
    let message;
    if (valueName === 'yay') {
      message = ':smiley:';
    } else {
      const { tripDetails: { rider } } = await Cache.fetch(getTravelKey(id));
      message = `Waiting for <@${rider}>'s response...`;
    }
    respond(new SlackInteractiveMessage(message));
  }

  static async completeTravelConfirmation(payload, respond) {
    try {
      const {
        user: { id: riderID }, submission: { confirmedLocation }, team: { id: teamID }
      } = payload;
      const { waitingRequester } = await Cache.fetch(getTravelKey(riderID));
      const { tripDetails } = await Cache.fetch(getTravelKey(waitingRequester));
      const { location, updatedTripDetails } = travelHelper.updateLocationInfo(
        tripDetails, confirmedLocation
      );
      const tripRequest = await ScheduleTripController.createTravelTripRequest(
        payload, updatedTripDetails
      );

      await Cache.save(getTravelKey(waitingRequester), 'tripDetails', updatedTripDetails);
      await Notifications.sendOperationsRiderlocationConfirmation({
        riderID, teamID, confirmedLocation, waitingRequester, location
      }, respond);

      return TravelTripHelper.sendCompletedResponseToOps(
        tripRequest, updatedTripDetails, respond, payload
      );
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
    }
  }

  static async sendCompletedResponseToOps(tripRequest, tripData, respond, payload) {
    InteractivePromptSlackHelper.sendCompletionResponse(respond, tripRequest.id, tripData.rider);
    const [trip, botToken] = await Promise.all([
      tripService.getById(tripRequest.id, true),
      teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id),
    ]);
    SlackEvents.raise(slackEventNames.NEW_TRAVEL_TRIP_REQUEST, trip, botToken);
  }

  static async tripNotesAddition(payload, respond) {
    const { user: { id }, submission: { tripNote } } = payload;
    const { tripDetails } = await Cache.fetch(getTravelKey(id));
    const errors = [];
    errors.push(...Validators.validateDialogSubmission(payload));
    if (errors.length) return { errors };
    tripDetails.tripNote = tripNote;
    await Cache.save(getTravelKey(id), 'tripDetails', tripDetails);
    if (payload.state) {
      const data = { text: 'Noted...' };
      await UpdateSlackMessageHelper.updateMessage(payload.state, data);
    }
    const result = await TripHelpers.getPreviewTripMessage(tripDetails);
    respond(result);
  }
}

export default TravelTripHelper;
