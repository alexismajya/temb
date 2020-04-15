import appEvents, { IEventPayload } from './app-event.service';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import TripEventsHandlers from './trip-events.handlers';
import SlackNotifications from '../slack/SlackPrompts/Notifications';

export enum TravelEvents {
  travelCompletedNewTrip = 'TRAVEL_COMPLETED_NEW_TRIP',
  travelCancelledByRider = 'TRAVEL_CANCELLED_BY_RIDER',
}

export default class TravelEventHandlers {
  static init() {
    appEvents.subscribe(TravelEvents.travelCompletedNewTrip,
      TravelEventHandlers.handleCompletedTrip);
    appEvents.subscribe(TravelEvents.travelCancelledByRider,
      TravelEventHandlers.handleTravelCancelledByRider);
  }

  static async handleCompletedTrip({ data, botToken }: IEventPayload) {
    try {
      await TripEventsHandlers.managerTripApproval({ data, botToken });
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }

  static async handleTravelCancelledByRider({ data }: IEventPayload) {
    try {
      const { payload, trip, respond } = data;
      await SlackNotifications.sendManagerCancelNotification(payload, trip, respond);
      await SlackNotifications.sendOpsCancelNotification(payload, trip, respond);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }
}
