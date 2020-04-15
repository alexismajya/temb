import {
  SlackInteractiveMessage, SlackSelectActionWithSlackContent,
  SlackAttachment, SlackButtonAction, SlackCancelButtonAction,
  SlackSelectAction
} from '../SlackModels/SlackMessageModels';
import Notifications from './Notifications';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import createNavButtons from '../../../helpers/slack/navButtons';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import previewTripDetailsAttachment
  from '../helpers/slackHelpers/TravelTripHelper/previewTripDetailsAttachment';
import PreviewScheduleTrip from '../helpers/slackHelpers/previewScheduleTripAttachments';
import { homebaseService } from '../../homebases/homebase.service';

class InteractivePrompts {
  static sendBookNewTripResponse(payload, respond) {
    const attachment = new SlackAttachment();
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('yes', 'For Me', 'true'),
      new SlackButtonAction('no', 'For Someone', 'false')
    ]);
    attachment.addOptionalProps('book_new_trip');
    const navAttachment = createNavButtons('back_to_launch', 'back_to_launch');
    const message = new SlackInteractiveMessage('Who are you booking for?', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  static async changeLocation(payload, respond) {
    const origin = payload.actions[0].name.split('__')[1];
    const slackId = payload.user.id;
    const state = { origin };
    const attachment = new SlackAttachment();

    const homeBases = await homebaseService.getAllHomebases(true);
    const userHomeBase = await homebaseService.getHomeBaseBySlackId(slackId);

    const filteredHomeBases = userHomeBase ? homeBases.filter(
      (currentHomeBase) => currentHomeBase.name !== userHomeBase.name
    ) : homeBases;

    attachment.addFieldsOrActions(
      'actions', filteredHomeBases.map((homeBase) => {
        const homeBaseCountryFlag = SlackHelpers.getLocationCountryFlag(homeBase.country.name);
        return new SlackButtonAction(
          homeBase.id.toString(), `${homeBaseCountryFlag} ${homeBase.name}`, JSON.stringify(state)
        );
      })
    );
    attachment.addOptionalProps('change_location', 'fallback', '#FFCCAA', 'default');
    const fallBack = origin ? `back_to_${origin}_launch` : 'back_to_launch';
    const navAttachment = createNavButtons('back_to_launch', fallBack);
    const message = new SlackInteractiveMessage('Please choose your current location', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  static sendTripItinerary(payload, respond) {
    const attachment = new SlackAttachment();
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('history', 'Trip History', 'view_trips_history'),
      new SlackButtonAction(
        'upcoming',
        'Upcoming Trips ',
        'view_upcoming_trips'
      )
    ]);
    attachment.addOptionalProps('trip_itinerary', 'fallback', '#FFCCAA', 'default');
    const navAttachment = createNavButtons('back_to_launch', 'back_to_launch');
    const message = new SlackInteractiveMessage('*Please choose an option*', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  /**
   * @description Replaces the trip notification message with an approval or decline message
   * @param  {boolean} decline Is this a decline or approval?
   * @param  {Object} tripInformation The object containing all the trip information
   * @param  {string} timeStamp The timestamp of the trip request notification
   * @param  {string} channel The channel id to which the notification was sent
   * @param {string} slackBotOauthToken The team bot token
   */
  static async sendManagerDeclineOrApprovalCompletion(
    decline, tripInformation, timeStamp, channel, slackBotOauthToken
  ) {
    const { requester } = tripInformation;
    const attachments = [
      new SlackAttachment(decline ? 'Trip Declined' : 'Trip Approved'),
      new SlackAttachment(
        decline
          ? ':x: You have declined this trip'
          : ':white_check_mark: You have approved this trip'
      )
    ];
    const fields = Notifications.notificationFields(tripInformation);

    attachments[0].addOptionalProps('callback');
    attachments[1].addOptionalProps('callback');
    attachments[0].addFieldsOrActions('fields', fields);

    await InteractivePrompts.messageUpdate(
      channel,
      (decline
        ? `You have just declined the trip from <@${requester.slackId}>`
        : `You have just approved the trip from <@${requester.slackId}>`),
      timeStamp,
      attachments,
      slackBotOauthToken
    );
  }

  /**
   * @description Update a previously sent message
   * @param  {string} channel The channel to which the original message was sent
   * @param  {string} text The message text
   * @param  {string} timeStamp The time stamp of the original message
   * @param  {array} attachments The attachments
   * @param {string} slackBotOauthToken The team bot token
   */
  static async messageUpdate(channel, text, timeStamp, attachments, slackBotOauthToken, blocks) {
    await WebClientSingleton.getWebClient(slackBotOauthToken).chat.update({
      channel,
      text,
      ts: timeStamp,
      attachments,
      blocks
    });
  }

  static sendRiderSelectList(payload, respond) {
    const attachments = new SlackAttachment();

    attachments.addFieldsOrActions('actions', [
      new SlackSelectActionWithSlackContent('rider', 'Select a passenger')
    ]);
    attachments.addOptionalProps('schedule_trip_rider');
    // add navigation buttons
    const navAttachment = createNavButtons('welcome_message', 'book_new_trip');

    const message = new SlackInteractiveMessage(
      'Who are you booking the ride for?', [attachments, navAttachment],
      payload.channel.id, payload.user.id
    );
    respond(message);
  }

  static sendAddPassengersResponse(respond, forSelf = 'true') {
    const attachment = new SlackAttachment();
    const passengerNumbers = SlackHelpers.noOfPassengers();

    attachment.addFieldsOrActions('actions', [
      new SlackSelectAction('addPassenger', 'No. of passengers', passengerNumbers),
      new SlackButtonAction('no', 'No', 1)]);

    attachment.addOptionalProps('schedule_trip_addPassengers');

    /* if rider is self navigate to for me/for someone option when 'Back' is clicked,
       else navigate to 'select rider' option
    */
    const navAttachment = createNavButtons(forSelf === 'true'
      ? 'welcome_message' : 'schedule_trip_reason', 'book_new_trip');

    const message = new SlackInteractiveMessage(
      'Any more passengers?', [attachment, navAttachment]
    );
    respond(message);
  }

  static sendSelectDestination(respond) {
    const attachment = new SlackAttachment();
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('selectDestination', 'Destination', 'true'),
    ]);
    const navAttachment = createNavButtons('schedule_trip_addPassengers', 'called_back_button');

    attachment.addOptionalProps('schedule_trip_destinationSelection');
    const message = new SlackInteractiveMessage('*Select Destination*', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  static sendPreviewTripResponse(tripDetails) {
    const hoursBefore = tripDetails.tripType === 'Airport Transfer' ? 3 : 2;
    const tripType = tripDetails.tripType === 'Airport Transfer' ? 'flight' : 'appointment';
    const attachment = new SlackAttachment(
      '',
      `N.B. Pickup time is fixed at ${hoursBefore}hrs before ${tripType} time`,
      '', '', '', 'default', 'warning'
    );
    const fields = previewTripDetailsAttachment(tripDetails);

    const actions = [
      new SlackButtonAction('confirmTripRequest', 'Confirm Trip Request', 'confirm'),
      new SlackButtonAction('Add Trip Note', tripDetails.tripNote ? 'Update Trip Note'
        : 'Add Trip Note', tripDetails.tripNote ? 'update_note' : 'trip_note'),
      new SlackCancelButtonAction(
        'Cancel Trip Request',
        'cancel',
        'Are you sure you want to cancel this trip request',
        'cancel_request'
      ),

    ];

    attachment.addFieldsOrActions('actions', actions);
    attachment.addFieldsOrActions('fields', fields);
    attachment.addOptionalProps('travel_trip_confirmation', 'fallback', undefined, 'default');

    const message = new SlackInteractiveMessage('*Trip request preview*', [
      attachment]);
    return message;
  }

  static async sendScheduleTripResponse(tripDetails, respond) {
    const fields = await PreviewScheduleTrip.previewScheduleTripAttachments(tripDetails);
    const attachment = new SlackAttachment(
      '',
      'Trip Summary',
      '', '', '', 'default', 'info'
    );

    const actions = [
      new SlackButtonAction('confirmTripRequest', 'Confirm Trip', 'confirm'),
      new SlackCancelButtonAction(
        'Cancel Trip',
        'cancel',
        'Are you sure you want to cancel this schedule trip',
        'cancel_request'
      )
    ];
    const message = new SlackInteractiveMessage('*Trip request preview*', [
      attachment
    ]);
    attachment.addFieldsOrActions('actions', actions);
    attachment.addFieldsOrActions('fields', fields);
    attachment.addOptionalProps('schedule_trip_confirmation', 'fallback', undefined, 'default');
    respond(message);
  }
}

export default InteractivePrompts;
