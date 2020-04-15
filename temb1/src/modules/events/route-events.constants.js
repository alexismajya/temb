export const routeSchedules = Object.freeze({
  takeOffReminder: 'BATCH_TRIP_REMINDER',
  completionNotification: 'ROUTE_TRIP_COMPLETED'
});

export const routeEvents = Object.freeze({
  takeOffAlert: 'ROUTE_TAKE_OFF_ALERT',
  newRouteBatchCreated: 'NEW_ROUTE_BATCH_CREATED',
  completionNotification: 'ROUTE_TRIP_COMPLETED',
});

export const RouteSocketEvents = Object.freeze({
  newRouteRequest: 'NEW_ROUTE_REQUEST',
  newRouteRequestNotification: 'NEW_ROUTE_REQUEST_NOTIFICATION',
});
