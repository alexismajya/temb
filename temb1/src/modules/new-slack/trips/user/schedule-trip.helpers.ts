import { TripTypes } from '../../../../database/models/trip-request';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { homebaseService } from '../../../homebases/homebase.service';
import  tripService  from '../../../trips/trip.service';
import appEvents from '../../../events/app-event.service';
import { tripEvents } from '../../../events/trip-events.contants';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import Homebase from '../../../../database/models/homebase';
import PreviewTripBooking from '../user/preview-trip-booking-helper';

export interface ITripProps {
  passengers: number;
  tripType: TripTypes;
  tripNote: string;
  distance: number;
  reason: string;
  departmentId: number;
}

export interface IBackgroundResponseProps {
  userId: string;
  teamId?: string;
  responseUrl?: string;
}

export default class ScheduleTripHelpers {
  private static getTripProps = (tripDetails: ITripProps) => ({
    noOfPassengers: tripDetails.passengers,
    tripType: tripDetails.tripType,
    tripNote: tripDetails.tripNote,
    distance: tripDetails.distance,
    reason: tripDetails.reason,
    departmentId: tripDetails.departmentId,
  })

  static async createTripRequest(tripDetails: any, props: IBackgroundResponseProps) {
    const {
      dateTime: departureTime, forMe, rider,
    } = tripDetails;

    const requester = await SlackHelpers.findOrCreateUserBySlackId(props.userId, props.teamId);
    const { pickupName, destinationName, originId, destinationId } = await PreviewTripBooking
    .getOtherPickupAndDestination(tripDetails);
    const riderUser = !forMe && rider ? await SlackHelpers
      .findOrCreateUserBySlackId(rider, props.teamId) : requester;
    const homebase = await homebaseService.getHomeBaseBySlackId(riderUser.slackId) as Homebase;

    const trip = await tripService.createRequest({
      departureTime,
      originId,
      destinationId,
      riderId: riderUser.id,
      name: `From ${pickupName} to ${destinationName} on ${departureTime}`,
      tripStatus: 'Pending',
      requestedById: requester.id,
      homebaseId: homebase.id,
      ...ScheduleTripHelpers.getTripProps(tripDetails),
    });

    const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(props.teamId);
    appEvents.broadcast({
      name: tripEvents.newTripRequested, data: { botToken, data: trip },
    });
    return trip;
  }
}
