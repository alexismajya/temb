"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prefix = 'user_trip_';
const userTripActions = Object.freeze({
    scheduleATrip: `${prefix}schedule`,
    changeLocation: `${prefix}change_location`,
    forMe: `${prefix}for_me`,
    forSomeone: `${prefix}for_someone`,
    setReason: `${prefix}set_reason`,
    getDepartment: `${prefix}get_department`,
    back: `${prefix}back`,
    reasonDialog: `${prefix}get_reason`,
    addExtraPassengers: `${prefix}add_extra_passengers`,
    noPassengers: `${prefix}no_passengers`,
    setPassenger: `${prefix}set_passenger`,
    pickupModalSubmit: `${prefix}pickup_modal_submit`,
    destDialog: `${prefix}get_destination`,
    sendDest: `${prefix}select_destination`,
    selectLocation: `${prefix}select_location`,
    selectPickupLocation: `${prefix}select_pickup_location`,
    selectDestinationLocation: `${prefix}select_destination_location`,
    confirmTripRequest: `${prefix}confirm_trip_request`,
    cancelTripRequest: `${prefix}cancel_trip_request`,
    cancel: `${prefix}cancel`,
    payment: `${prefix}payment`,
    reschedule: `${prefix}reschedule`,
    editTripRequest: `${prefix}edit`,
    editRequestModalSubmit: `${prefix}edit_modal_submit`,
    sendDestEdit: `${prefix}select_destination_edit`,
});
exports.itineraryActions = Object.freeze({
    viewTripsItinerary: `${prefix}itineraty`,
    pastTrips: `${prefix}past_trips`,
    upcomingTrips: `${prefix}upcoming_trips`,
    reschedule: `${prefix}reschedule`,
    cancelTrip: `${prefix}cancel_trip`,
    page: `${prefix}page`,
    skipPage: `${prefix}skip_page`,
});
exports.default = userTripActions;
//# sourceMappingURL=actions.js.map