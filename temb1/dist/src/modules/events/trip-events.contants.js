"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripEvents = Object.freeze({
    newTripRequested: 'NEW_TRIP_REQUESTED',
    autoApprovalNotification: 'AUTOMATED_APPROVAL_NOTIFICATION',
    takeOffReminder: 'TRIP_TAKE_OFF_REMINDER',
    tripCompleted: 'TRIP_COMPLETED',
    managerApprovedTrip: 'MANAGER_APPROVED_TRIP',
    managerDeclinedTrip: 'MANAGER_DECLINED_TRIP',
    rescheduled: 'TRIP_RESCHEDULED',
});
var TripSocketEvents;
(function (TripSocketEvents) {
    TripSocketEvents["newTripApproved"] = "NEW_TRIP_APPROVED";
    TripSocketEvents["newTripPushNotification"] = "TRIP_APPROVAL_PUSH_NOTIFICATION";
})(TripSocketEvents = exports.TripSocketEvents || (exports.TripSocketEvents = {}));
//# sourceMappingURL=trip-events.contants.js.map