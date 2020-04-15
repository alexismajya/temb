"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prefix = 'user_trip_';
const userTripBlocks = Object.freeze({
    start: `${prefix}book_trip_start`,
    selectDepartment: `${prefix}select_department`,
    selectRider: `${prefix}select_rider`,
    selectNumberOfPassengers: `${prefix}select_no_of_passengers`,
    navBlock: `${prefix}nav_block`,
    addPassengers: `${prefix}add_passengers`,
    setRider: `${prefix}set_rider`,
    confirmLocation: `${prefix}confirm_location`,
    getDestFields: `${prefix}set_destination`,
    confirmTrip: `${prefix}confirm_trip_request`,
    managerconfirmTrip: `${prefix}manager_confirm_trip_request`,
    selectLocation: `${prefix}select_location`,
});
exports.itineraryBlocks = Object.freeze({
    start: `${prefix}itinerary_start`,
    tripActions: `${prefix}itinerary_action`,
    pagination: `${prefix}pagination`,
});
exports.default = userTripBlocks;
//# sourceMappingURL=blocks.js.map