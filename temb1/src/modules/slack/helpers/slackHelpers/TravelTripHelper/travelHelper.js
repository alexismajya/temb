import LocationMapHelpers from '../../../../../helpers/googleMaps/locationsMapHelpers';
import GoogleMapsError from '../../../../../helpers/googleMaps/googleMapsError';
import {
  SlackInteractiveMessage,
  SlackAttachment,
  SlackButtonAction
} from '../../../SlackModels/SlackMessageModels';
import Notifications from '../../../SlackPrompts/Notifications';
import InteractivePromptSlackHelper from '../InteractivePromptSlackHelper';
import LocationPrompts from '../../../SlackPrompts/LocationPrompts';
import DialogPrompts from '../../../SlackPrompts/DialogPrompts';
import bugsnagHelper from '../../../../../helpers/bugsnagHelper';
import Cache from '../../../../shared/cache';
import UpdateSlackMessageHelper from '../../../../../helpers/slack/updatePastMessageHelper';
import Services from '../../../../users/user.service';
import TripHelpers from '../../../../new-slack/trips/travel/travel.helpers';

export const getTravelKey = (id) => `TRAVEL_REQUEST_${id}`;

export default class TravelHelper {
  static async getPickupType(data) {
    const { pickup } = data;
    if (pickup !== 'Others') {
      return TripHelpers.getDestinationDialog();
    }
    const verifiable = await LocationMapHelpers
      .locationVerify(data, 'pickup', 'travel_trip');
    return verifiable;
  }

  static async getDestinationType(payload, respond) {
    const { submission: { destination } } = payload;
    if (destination !== 'Others') {
      const confirmDetails = await TravelHelper.detailsConfirmation(payload, respond);
      return confirmDetails;
    }
    try {
      const verifiable = await LocationMapHelpers
        .locationVerify(payload.submission, 'destination', 'travel_trip');
      if (verifiable) respond(verifiable);
    } catch (err) {
      if (err instanceof GoogleMapsError && err.code === GoogleMapsError.UNAUTHENTICATED) {
        const confirmDetails = await TravelHelper.detailsConfirmation(payload, respond);
        respond(confirmDetails);
      }
    }
  }

  static validatePickupDestination(payload, respond) {
    const {
      pickup, teamID, userID, rider
    } = payload;

    const location = (pickup === 'To Be Decided') ? 'pickup' : 'destination';
    Notifications.sendRiderlocationConfirmNotification({
      location, teamID, userID, rider
    }, respond);

    const message = TravelHelper.responseMessage(
      `Travel ${location} confirmation request.`,
      `A request has been sent to <@${rider}> to confirm his ${location} location.`,
      'Once confirmed, you will be notified promptly :smiley:',
      'confirm'
    );
    respond(message);
  }

  static responseMessage(messageTitle, messageTitleBody, messageBody, btnValue = 'confirm') {
    const attachment = new SlackAttachment(
      messageTitleBody,
      messageBody,
      '', '', '', 'default', 'warning'
    );

    const actions = [
      new SlackButtonAction('confirmTripRequest', 'Okay', btnValue),
    ];

    attachment.addFieldsOrActions('actions', actions);
    attachment.addOptionalProps('travel_trip_requesterToBeDecidedNotification',
      'fallback', undefined, 'default');

    const message = new SlackInteractiveMessage(messageTitle,
      [attachment]);
    return message;
  }

  static locationNotFound(payload, respond) {
    const value = payload.actions[0].name;
    if (value === 'no') { LocationPrompts.errorPromptMessage(respond); }
  }

  static async riderLocationConfirmation(payload, respond) {
    const valueName = payload.actions[0].value;
    if (valueName === 'cancel') {
      respond(new SlackInteractiveMessage('Thank you for using Tembea'));
    } else {
      const location = valueName.split('_')[0];
      await LocationMapHelpers.callRiderLocationConfirmation(
        payload, respond, location
      );
      respond(new SlackInteractiveMessage('noted...'));
    }
  }

  static updateLocationInfo(tripDetails, confirmedLocation) {
    let location;
    const updatedTripDetails = { ...tripDetails };
    if (updatedTripDetails.pickup === 'To Be Decided') {
      updatedTripDetails.pickup = confirmedLocation;
      location = 'Pickup';
    } else {
      updatedTripDetails.destination = confirmedLocation;
      location = 'Destination';
    }

    return { updatedTripDetails, location };
  }

  static async riderRequest(payload, tripDetails, respond) {
    const { team: { id: teamID }, user: { id: userID } } = payload;
    const { pickup, destination, rider } = tripDetails;
    await Cache.save(getTravelKey(rider), 'waitingRequester', userID);
    const data = {
      pickup, destination, teamID, userID, rider
    };
    await TravelHelper.validatePickupDestination(data, respond);
  }

  static async tripNotesUpdate(payload, respond) {
    const { user: { id }, submission: { tripNote } } = payload;
    const { tripDetails } = await Cache.fetch(getTravelKey(id));
    tripDetails.tripNote = tripNote;
    await Cache.save(getTravelKey(id), 'tripDetails', tripDetails);
    if (tripDetails.tripNote && payload.state) {
      const data = { text: 'Noted...' };
      await UpdateSlackMessageHelper.updateMessage(payload.state, data);
    }
    const result = await TripHelpers.getPreviewTripMessage(tripDetails, respond);
    respond(result);
  }

  static async notesRequest(payload) {
    const { user: { id } } = payload;
    const { tripDetails: { tripNote } } = await Cache.fetch(getTravelKey(id));
    return DialogPrompts.sendTripNotesDialogForm(payload,
      'travelTripNoteForm', 'travel_trip_tripNotesAddition',
      'Add Trip Notes', tripNote);
  }

  static async checkNoteStatus(payload, respond) {
    switch (payload.actions[0].value) {
      case 'cancel':
        await InteractivePromptSlackHelper.sendCancelRequestResponse(respond);
        break;
      case 'trip_note':
        await TravelHelper.notesRequest(payload, respond);
        break;
      case 'update_note':
        await TravelHelper.notesRequest(payload, respond);
        break;
      default:
    }
  }

  static async detailsConfirmation(payload, respond) {
    try {
      const { user: { id } } = payload;
      const { tripDetails } = await Cache.fetch(getTravelKey(id));
      const requesterData = await Services.getUserBySlackId(id);
      const tripData = LocationMapHelpers.tripCompare(tripDetails);
      tripData.requester = requesterData.name;
      const result = await TripHelpers.getPreviewTripMessage(tripData);
      respond(result);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage(`${error} Unsuccessful request. Please try again`));
    }
  }
}
