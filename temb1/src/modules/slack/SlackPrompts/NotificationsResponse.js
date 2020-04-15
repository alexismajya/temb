import SlackHelpers from '../../../helpers/slack/slackHelpers';
import {
  SlackAttachment,
  SlackAttachmentField,
  SlackButtonAction,
  SlackInteractiveMessage,
  SlackSelectAction
} from '../SlackModels/SlackMessageModels';
import { getSlackDateString, checkBeforeSlackDateString } from '../helpers/dateHelpers';
import { homebaseService } from '../../homebases/homebase.service';
import { HOMEBASE_NAMES } from '../../../helpers/constants';
import tripService from '../../trips/trip.service';
import { MarkdownText, SectionBlock }
  from '../../new-slack/models/slack-block-models';
import { TripTypes } from '../../../database/models/trip-request';

class NotificationsResponse {
  static async getOpsTripRequestMessage(data) {
    const { id } = data;
    const { department: { head: { slackId } } } = data;
    const actions = await NotificationsResponse.generateOperationsRequestActions(id, slackId);
    return NotificationsResponse.responseForOperations(data, actions, 'trips_cab_selection');
  }

  static responseForOperations(data, actions, callbackId) {
    const { tripStatus, tripType } = data;
    const color = tripStatus && tripStatus
      .toLowerCase().startsWith('ca') ? 'good' : undefined;

    if (tripType === TripTypes.regular) {
      return NotificationsResponse.prepareOperationsDepartmentResponse(data, color,
        actions, callbackId);
    }

    return this.travelOperationsDepartmentResponse(data, color, actions, callbackId);
  }

  static riderInfoResponse(rider, requester) {
    const riderInfo = rider.slackId !== requester.slackId
      ? `<@${requester.slackId}> requested a trip for <@${rider.slackId}>`
      : `<@${requester.slackId}> requested a trip`;
    return riderInfo;
  }

  static travelOperationsDepartmentResponse(trip, color, actions, callbackId) {
    const {
      tripStatus, requester, pickup, departureTime, rider, destination,
      department, noOfPassengers, tripType, tripNote
    } = trip;
    const riderInfo = this.riderInfoResponse(rider, requester);

    const detailedAttachment = new SlackAttachment(
      'Travel trip request', riderInfo, null, null, null, 'default', color
    );
    const fields = [
      new SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
      new SlackAttachmentField('Department', department.name, true),
      new SlackAttachmentField('Pickup Location', pickup.address, true),
      new SlackAttachmentField('Destination', destination.address, true),
      new SlackAttachmentField('Pick-Up Time', getSlackDateString(departureTime), true),
      new SlackAttachmentField('Number of Passengers', noOfPassengers, true),
      new SlackAttachmentField('Trip Type', tripType, true),
      new SlackAttachmentField('Status', tripStatus, true),
      new SlackAttachmentField('Trip Notes', !tripNote ? 'No Trip Notes' : tripNote, true),
    ];
    detailedAttachment.addFieldsOrActions('actions', actions);
    detailedAttachment.addFieldsOrActions('fields', fields);
    detailedAttachment.addOptionalProps(callbackId, '', undefined, 'default');

    return new SlackInteractiveMessage(
      '', [detailedAttachment], trip.homebase.channel
    );
  }

  static prepareOperationsDepartmentResponse(trip, color, actions, callbackId) {
    const {
      tripStatus, requester, pickup, departureTime,
      rider, destination, managerComment, department
    } = trip;

    const riderInfo = this.riderInfoResponse(rider, requester);

    const detailedAttachment = new SlackAttachment(
      'Manager approved trip request', riderInfo, null, null, null, 'default', color
    );
    const fields = [
      new SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
      new SlackAttachmentField('Department', department.name, true),
      new SlackAttachmentField('Pickup Location', pickup.address, true),
      new SlackAttachmentField('Destination', destination.address, true),
      new SlackAttachmentField('Departure', checkBeforeSlackDateString(departureTime), true),
      new SlackAttachmentField('Status', tripStatus, true),
      new SlackAttachmentField('Manager Comment', managerComment)
    ];

    detailedAttachment.addFieldsOrActions('actions', actions);
    detailedAttachment.addFieldsOrActions('fields', fields);
    detailedAttachment.addOptionalProps(callbackId, 'fallback', undefined, 'default');

    return new SlackInteractiveMessage(
      `<@${trip.department.head.slackId}> just approved this trip. Its ready for your action :smiley:`,
      [detailedAttachment], trip.homebase.channel
    );
  }

  static async responseForRequester(data, slackChannelId, isOps) {
    const {
      origin: pickup, destination, createdAt: requestDate,
      departureTime, tripStatus, managerComment
    } = data;
    const text = await NotificationsResponse.getMessageHeader(data, isOps);
    const detailedAttachment = new SlackAttachment(
      'Approved', text, null, null, null, 'default', '#29b016'
    );

    const attachments = NotificationsResponse.getRequesterAttachment(
      pickup, destination, requestDate, departureTime, tripStatus, managerComment
    );
    attachments.unshift(detailedAttachment);
    return new SlackInteractiveMessage('Trip Approved', attachments, slackChannelId);
  }


  static getRequesterAttachment(pickup, destination,
    requestDate, departureDate, tripStatus, managerComment) {
    const detailedAttachment = new SlackAttachment(
      '*Trip Details*', null, null, null, null, 'default', '#29b016'
    );

    const fields = [
      new SlackAttachmentField('Pickup', pickup.address, true),
      new SlackAttachmentField('Destination', destination.address, true),
      new SlackAttachmentField('Request Date', getSlackDateString(requestDate), true),
      new SlackAttachmentField('Departure Date', getSlackDateString(departureDate), true),
      new SlackAttachmentField('Trip Status', tripStatus, true),
      new SlackAttachmentField('Reason', managerComment, true)
    ];
    detailedAttachment.addFieldsOrActions('fields', fields);

    return [detailedAttachment];
  }


  static async getMessageHeader(trip, isOps) {
    const { origin = trip.pickup, destination } = trip;
    const isApproved = await SlackHelpers.isRequestApproved(trip.id);
    const [opsEnd, mgrEnd] = [
      '\nThe request is now ready for confirmation.',
      '\nThe request has now been forwarded to the operations team for confirmation.'
    ];
    const messageHeader = `Your request from *${origin.address}* to *${destination.address}*`
      + ` has been approved by ${isApproved.approvedBy}.${isOps ? opsEnd : mgrEnd}`;

    return messageHeader;
  }

  static async generateOperationsRequestActions(id, slackId, homebase) {
    const options = [
      {
        text: 'Confirm and assign Cab and Driver',
        value: `assignCab_${id}`,
      },
      {
        text: 'Confirm and assign provider',
        value: `confirmTrip_${id}`,
      }
    ];
    const selectAction = await NotificationsResponse.getOpsSelectAction(slackId, id, options, homebase);
    const actions = [
      selectAction,
      new SlackButtonAction('declineRequest', 'Decline', id, 'danger')
    ];
    return actions;
  }

  static generateOpsApprovalActions(tripId) {
    const actions = [
      new SlackButtonAction('approveDelayedRequest', 'Approve', `${tripId}`, 'primary'),
      new SlackButtonAction('declineDelayedRequest', 'Decline', tripId, 'danger')
    ];
    return actions;
  }

  static async getOpsSelectAction(slackId, id, options) {
    let selectAction = new SlackSelectAction(
      'assign-cab-or-provider',
      'Confirm request options',
      options
    );

    const { name } = await homebaseService.getHomeBaseBySlackId(slackId);
    if (name === HOMEBASE_NAMES.KAMPALA) {
      selectAction = new SlackButtonAction(
        'assign-cab-or-provider',
        'Confirm and assign cab and driver',
        `assignCab_${id}`
      );
    }
    return selectAction;
  }

  static async getOpsTripBlocksFields(id) {
    let fields = [];
    const trip = await tripService.getById(id, true);
    fields = [
      new MarkdownText(`*Passenger*:\n ${trip.rider.name}`),
      new MarkdownText(`*Pickup Location*:\n ${trip.origin.address}`),
      new MarkdownText(`*Destination*:\n ${trip.destination.address}`),
      new MarkdownText(`*Provider*:\n ${trip.provider.name}`),
      new MarkdownText(`*Driver Name*:\n ${trip.driver.driverName}`),
      new MarkdownText(`*Driver Contact*:\n ${trip.driver.driverPhoneNo}`),
      new MarkdownText(`*Vehicle*:\n ${trip.cab.regNumber}`),
      new MarkdownText(`*Vehicle model*:\n ${trip.cab.model}`),
      new MarkdownText(`*Distance*:\n ${trip.distance}`),
      new MarkdownText(`*Trip Completion Date*:\n ${getSlackDateString(trip.updatedAt)}`)
    ];
    return fields;
  }

  static async getOpsProviderTripsFields(providers) {
    const fields = providers.map((provider) => {
      const providerBlock = new SectionBlock();
      const providerInfo = [
        new MarkdownText(`*Provider*: ${provider.name}\n`),
        new MarkdownText(`*Trips*: ${provider.trips}\n`),
        new MarkdownText(`*Percentage*: ${provider.percantage}%\n`)
      ];
      providerBlock.addFields(providerInfo);
      return providerBlock;
    });
    return fields;
  }
}

export default NotificationsResponse;
