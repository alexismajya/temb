export const tripEvents = Object.freeze({
  newTripRequested: 'NEW_TRIP_REQUESTED',
  autoApprovalNotification: 'AUTOMATED_APPROVAL_NOTIFICATION',
  takeOffReminder: 'TRIP_TAKE_OFF_REMINDER',
  tripCompleted: 'TRIP_COMPLETED',
  managerApprovedTrip: 'MANAGER_APPROVED_TRIP',
  managerDeclinedTrip: 'MANAGER_DECLINED_TRIP',
  rescheduled: 'TRIP_RESCHEDULED',
});

export enum TripSocketEvents {
  newTripApproved = 'NEW_TRIP_APPROVED',
  newTripPushNotification = 'TRIP_APPROVAL_PUSH_NOTIFICATION',
}
