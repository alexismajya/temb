import { SlackText, MarkdownText, TextTypes, Block, ButtonElement, BlockTypes,
  BlockMessage, CancelButtonElement, ActionBlock, SectionBlock,
} from '../../models/slack-block-models';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import { itineraryActions } from './actions';
import { itineraryBlocks } from './blocks';
import UserTripHelpers from './user-trip-helpers';
import tripService from '../../../trips/trip.service';
import TripItineraryHelper from '../../../slack/helpers/slackHelpers/TripItineraryHelper';
import { TRIP_LIST_TYPE } from '../../../../helpers/constants';
import { getSlackDateTimeString } from '../../../slack/helpers/dateHelpers';
import { slackEventNames, SlackEvents } from '../../../slack/events/slackEvents';
import DialogPrompts from '../../../slack/SlackPrompts/DialogPrompts';
import PaginationHelpers from '../../helpers/pagination-helpers';

export default class ItineraryHelpers {
  static createStartMessage() {
    const headerText = new MarkdownText('*Please, choose an option*');
    const header = new Block().addText(headerText);
    const mainButtons = [
      new ButtonElement(new SlackText('Trip History'), 'pastTrips',
      itineraryActions.pastTrips, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Upcoming Trips'), 'upcomingTrips',
      itineraryActions.upcomingTrips, SlackActionButtonStyles.primary),
    ];

    const newTripBlock = new ActionBlock(itineraryBlocks.start);
    newTripBlock.addElements(mainButtons);

    const navigation = UserTripHelpers.getTripNavBlock('back_to_launch');

    const blocks = [header, newTripBlock, navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  static async getPastTripsMessage(payload: any) {
    const userId = payload.user.id;
    const headerText = new MarkdownText('*Your trip history for the last 30 days*');
    const header = new Block().addText(headerText);
    const pageNumber = PaginationHelpers.getPageNumber(payload);
    const pastTrips = await TripItineraryHelper.getPaginatedTripRequestsBySlackUserId(
      userId, TRIP_LIST_TYPE.PAST, pageNumber);

    if (!pastTrips) { return new SlackText('Something went wrong getting trips'); }
    if (!pastTrips.data.length) { return new SlackText('You have no past trips'); }

    // create an array of block messages based on the result above
    const blocks = pastTrips.data.map((trip) =>
      ItineraryHelpers.pastTripBlockMessage(userId, trip),
    );
    const divider = new Block(BlockTypes.divider);
    const flattened = blocks.map((block) => [...block, divider]).reduce((a, b) => a.concat(b));
    // add pagination buttons if total trips exceeds page limit
    const paginationBlock = PaginationHelpers.addPaginationButtons(pastTrips, 'pastTrips',
      itineraryActions.page, itineraryBlocks.pagination, itineraryActions.skipPage,
    );
    if (paginationBlock) {
      flattened.push(...paginationBlock);
    }
    const navBlock = UserTripHelpers.getTripNavBlock('back_to_itinerary_trips');
    const message = new BlockMessage([header, divider, ...flattened, divider, navBlock]);
    return message;
  }

  static async getUpcomingTripsMessage(payload: any) {
    const userId = payload.user.id;
    const headerText = new MarkdownText('*Your Upcoming Trips*');
    const header = new Block().addText(headerText);
    const pageNumber = PaginationHelpers.getPageNumber(payload);
    const upcomingTrips = await TripItineraryHelper.getPaginatedTripRequestsBySlackUserId(
      userId, TRIP_LIST_TYPE.UPCOMING, pageNumber);

    if (!upcomingTrips) { return new SlackText('Something went wrong getting trips'); }
    if (!upcomingTrips.data.length) { return new SlackText('You have no upcoming trips'); }

    const blocks = upcomingTrips.data.map((trip) =>
      ItineraryHelpers.upcomingTripBlockMessage(userId, trip),
    );
    const divider = new Block(BlockTypes.divider);
    const flattened = blocks.map((block) => [...block, divider]).reduce((a, b) => a.concat(b));
    const paginationBlock = PaginationHelpers.addPaginationButtons(upcomingTrips, 'upcomingTrips',
    itineraryActions.page, itineraryBlocks.pagination, itineraryActions.skipPage);
    if (paginationBlock) {
      flattened.push(...paginationBlock);
      flattened.push(divider);
    }
    const navBlock = UserTripHelpers.getTripNavBlock('back_to_itinerary_trips');
    const message = new BlockMessage([header, divider, ...flattened, navBlock]);
    return message;
  }

  static async triggerPage(payload: any) {
    const { actions: [{ value: requestType, action_id: actionId }] } = payload;
    if (payload.actions && payload.actions[0].action_id === 'user_trip_skip_page') {
      new SlackText('Noted...');
      return await DialogPrompts.sendSkipPage(payload, requestType, actionId);
    }
  }

  static tripBlockDetails(userId: number, trip: any) {
    const heading = new SectionBlock();
    const journey = `*From ${trip.origin.address} To ${trip.destination.address}*`;
    const time = `Departure Time:  ${getSlackDateTimeString(trip.departureTime)}`;
    const requestedBy = userId === trip.requester.slackId
        ? `*Requested By: ${trip.requester.name} (You)*`
        : `*Requested By: ${trip.requester.name}*`;
    const rider = `Rider: ${trip.rider.name}`;
    const tripStatus = `*Status: ${trip.tripStatus}*`;

    heading.addFields([
      new MarkdownText(journey), new SlackText(time),
      new MarkdownText(rider), new MarkdownText(requestedBy),
      new MarkdownText(tripStatus),
    ]);
    return heading;
  }

  // Past block message
  static pastTripBlockMessage(userId: number, trip: any) {
    const headingSide = ItineraryHelpers.tripBlockDetails(userId, trip);
    return [headingSide];
  }

  // Upcoming block message
  static upcomingTripBlockMessage(userId: number, trip: any) {
    const headingSide = ItineraryHelpers.tripBlockDetails(userId, trip);
    const mainButtons = [
      new ButtonElement(new SlackText('Reschedule'), trip.id.toString(),
        `${itineraryActions.reschedule}_${trip.id}`, SlackActionButtonStyles.primary,
      ),
      new CancelButtonElement('Cancel Trip', trip.id.toString(),
        `${itineraryActions.cancelTrip}_${trip.id}`,
        {
          title: 'Are you sure?',
          description: 'Do you really want to cancel',
          confirmText: 'Yes',
          denyText: 'No',
        },
      ),
    ];
    const actions = new ActionBlock(`${itineraryBlocks.tripActions}_${trip.id}`);
    actions.addElements(mainButtons);
    return [headingSide, actions];
  }

  static async cancelTrip(payload: any, tripId: any) {
    let message;
    try {
      const trip = await tripService.getById(Number(tripId), true);

      if (!trip) {
        message = 'Trip not found';
      } else {
        await tripService.updateRequest(tripId, { tripStatus: 'Cancelled' });
        const {
          origin: { address: originAddress },
          destination: { address: destinationAdress },
        } = trip;

        message = `Success! Your Trip request from ${originAddress} to ${destinationAdress} has been cancelled`;
        // Raise slack events to notify manager and ops that the trip has been cancelled
        if (trip.approvedById) {
          SlackEvents.raise(slackEventNames.RIDER_CANCEL_TRIP, payload, trip);
          SlackEvents.raise(slackEventNames.NOTIFY_OPS_CANCELLED_TRIP, payload, trip);
        }
      }
    } catch (error) {
      message = `Request could not be processed, ${error.message}`;
    }
    return new MarkdownText(message);
  }
}
