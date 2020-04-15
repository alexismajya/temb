const prefix = 'travel_trip_';

const travelTripsActions = Object.freeze({
  startTravel: `${prefix}start_travel`,
  embassyVisit: `${prefix}embassy_visit`,
  airportTransfer: `${prefix}airport_transfer`,
  changeLocation: `${prefix}change_location`,
  cancel: `${prefix}cancel`,
  submitTripDetails: `${prefix}submit_embassy_trip_details`,
  confirmTravel: `${prefix}confrim_travel_request`,
  addNote: `${prefix}add_trip_notes`,
  viewTrip: `${prefix}view_trip`,
  rescheduleTrip: `${prefix}reschedule_trip`,
  cancelTrip: `${prefix}cancel_trip`,
  submitNotes: `${prefix}submit_notes`,
  addLocations: `${prefix}add_locations`,
  submitDestination: `${prefix}submit_destination`,
  viewTripDone: `${prefix}view_trip_done`,
  cancelTravelTripRequest: `${prefix}cancel_travel_trip_request`,
  comfirmTravelTripRequest: `${prefix}comfirm_travel_trip_request`,
  travelTripNote: `${prefix}trip_note`,
  submitContactDetails: `${prefix}submit_contact_details`,
  submitFlightDetails: `${prefix}submit_flight_details`,
  reschedule: `${prefix}reschedule`,
  cancelTravelTrip: `${prefix}cancel_travel_trip`,
  bookedTrip: `${prefix}booked_trip`,
  back: `${prefix}back`,
  editTravel: `${prefix}edit_travel_request`,
  submitEditedContactDetails: `${prefix}submit_edited_contact_details`,
  editEmbassyVisit: `${prefix}edit_embassy_visit`,
});

export default travelTripsActions;
