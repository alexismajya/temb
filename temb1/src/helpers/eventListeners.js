import WebSocketEvents from '../modules/events/web-socket-event.service';
import { TripSocketEvents } from '../modules/events/trip-events.contants';
import { RouteSocketEvents } from '../modules/events/route-events.constants';
import pushNotificationHelper from './pushNotificationHelper';

export default () => {
  new WebSocketEvents().subscribe(
    TripSocketEvents.newTripPushNotification, pushNotificationHelper.sendPushNotification,
  );
  new WebSocketEvents().subscribe(
    RouteSocketEvents.newRouteRequestNotification, pushNotificationHelper.sendPushNotification,
  );
};
