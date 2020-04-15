"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_trip_booking_controller_1 = __importDefault(require("./user/user-trip-booking-controller"));
const user_trip_edit_controller_1 = __importDefault(require("./user/user-trip-edit-controller"));
const itinerary_controller_1 = __importDefault(require("./user/itinerary.controller"));
const actions_1 = __importStar(require("./user/actions"));
const blocks_1 = __importStar(require("./user/blocks"));
const constants_1 = __importStar(require("./manager/constants"));
const trip_controller_1 = __importDefault(require("./manager/trip.controller"));
const trip_controller_2 = __importDefault(require("./user/trip.controller"));
const actions_2 = __importDefault(require("./travel/actions"));
const blocks_2 = __importDefault(require("./travel/blocks"));
const travel_controller_1 = __importDefault(require("./travel/travel.controller"));
const SlackInteractionsHelpers_1 = __importDefault(require("../../slack/helpers/slackHelpers/SlackInteractionsHelpers"));
const trip_router_extensions_1 = __importDefault(require("./trip-router.extensions"));
const userTripRoutes = [
    {
        route: { actionId: actions_1.default.scheduleATrip, blockId: blocks_1.default.start },
        handler: user_trip_booking_controller_1.default.startTripBooking,
    },
    {
        route: { actionId: actions_1.default.forMe, blockId: blocks_1.default.start },
        handler: user_trip_booking_controller_1.default.forMe,
    },
    {
        route: { actionId: actions_1.default.forSomeone, blockId: blocks_1.default.start },
        handler: user_trip_booking_controller_1.default.forMe,
    },
    {
        route: { actionId: actions_1.default.back, blockId: blocks_1.default.navBlock },
        handler: user_trip_booking_controller_1.default.back,
    },
    {
        route: { actionId: actions_1.default.cancel },
        handler: user_trip_booking_controller_1.default.cancel,
    },
    {
        route: { actionId: actions_1.default.setPassenger, blockId: blocks_1.default.setRider },
        handler: user_trip_booking_controller_1.default.saveRider,
    },
    {
        route: { actionId: actions_1.default.addExtraPassengers, blockId: blocks_1.default.addPassengers },
        handler: user_trip_booking_controller_1.default.saveExtraPassengers,
    },
    {
        route: { actionId: actions_1.default.noPassengers, blockId: blocks_1.default.addPassengers },
        handler: user_trip_booking_controller_1.default.saveExtraPassengers,
    },
    {
        route: { blockId: blocks_1.default.selectDepartment },
        handler: user_trip_booking_controller_1.default.saveDepartment,
    },
    {
        route: { actionId: actions_1.default.sendDest, blockId: blocks_1.default.getDestFields },
        handler: user_trip_booking_controller_1.default.sendDestinations,
    },
    {
        route: { actionId: actions_1.default.sendDestEdit, blockId: blocks_1.default.getDestFields },
        handler: user_trip_booking_controller_1.default.sendDestinations,
    },
    {
        route: { blockId: blocks_1.default.confirmLocation },
        handler: user_trip_booking_controller_1.default.confirmLocation,
    },
    {
        route: { actionId: actions_1.default.confirmTripRequest, blockId: blocks_1.default.confirmTrip },
        handler: user_trip_booking_controller_1.default.confirmTripRequest,
    },
    {
        route: { actionId: actions_1.default.cancelTripRequest, blockId: blocks_1.default.confirmTrip },
        handler: user_trip_booking_controller_1.default.cancel,
    },
    {
        route: { actionId: actions_1.default.editTripRequest, blockId: blocks_1.default.confirmTrip },
        handler: user_trip_edit_controller_1.default.editRequest,
    },
    {
        route: { actionId: actions_1.itineraryActions.viewTripsItinerary, blockId: blocks_1.default.start },
        handler: itinerary_controller_1.default.start,
    },
    {
        route: { actionId: actions_1.itineraryActions.pastTrips, blockId: blocks_1.itineraryBlocks.start },
        handler: itinerary_controller_1.default.getPast,
    },
    {
        route: { actionId: actions_1.itineraryActions.upcomingTrips, blockId: blocks_1.itineraryBlocks.start },
        handler: itinerary_controller_1.default.getUpcoming,
    },
    {
        route: {
            actionId: new RegExp(`^(${actions_1.itineraryActions.reschedule}|${actions_1.itineraryActions.cancelTrip})_\\d+$`, 'g'),
            blockId: new RegExp(`^${blocks_1.itineraryBlocks.tripActions}_\\d+$`, 'g'),
        },
        handler: itinerary_controller_1.default.handleRescheduleOrCancel,
    },
    {
        route: {
            actionId: new RegExp(`^${actions_1.itineraryActions.page}_\\d+$`, 'g'),
            blockId: blocks_1.itineraryBlocks.pagination,
        },
        handler: itinerary_controller_1.default.nextOrPrevPage,
    },
    {
        route: { actionId: actions_1.itineraryActions.skipPage, blockId: blocks_1.itineraryBlocks.pagination },
        handler: itinerary_controller_1.default.skipPage,
    },
    {
        route: { blockId: constants_1.managerTripBlocks.confirmTripRequest },
        handler: trip_controller_1.default.approve,
    },
    {
        route: { actionId: constants_1.default.editApprovedTrip },
        handler: SlackInteractionsHelpers_1.default.handleOpsAction,
    },
    {
        route: { actionId: actions_1.default.changeLocation },
        handler: trip_controller_2.default.changeLocation,
    },
    {
        route: { actionId: actions_2.default.changeLocation },
        handler: trip_controller_2.default.changeLocation,
    },
    {
        route: { blockId: blocks_1.default.selectLocation },
        handler: trip_controller_2.default.selectLocation,
    },
    {
        route: { actionId: actions_2.default.airportTransfer, blockId: blocks_2.default.start },
        handler: travel_controller_1.default.createTravel.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.editTravel },
        handler: travel_controller_1.default.createTravel.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.cancel, blockId: blocks_2.default.start },
        handler: travel_controller_1.default.cancel.bind(travel_controller_1.default),
    },
    {
        route: {
            actionId: actions_2.default.cancelTravelTripRequest,
            blockId: blocks_2.default.confirmTravelTrip,
        },
        handler: travel_controller_1.default.cancel.bind(travel_controller_1.default),
    },
    {
        route: { blockId: blocks_2.default.bookedTrip },
        handler: travel_controller_1.default.handleItineraryActions.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.cancel, blockId: blocks_2.default.bookedTrip },
        handler: travel_controller_1.default.cancel.bind(travel_controller_1.default),
    },
    {
        route: { blockId: blocks_2.default.viewTrip },
        handler: travel_controller_1.default.doneViewingTrip.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.changeLocation, blockId: blocks_2.default.start },
        handler: travel_controller_1.default.changeLocation.bind(travel_controller_1.default),
    },
    {
        route: { blockId: blocks_2.default.selectLocation },
        handler: travel_controller_1.default.selectLocation.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.back, blockId: blocks_2.default.navBlock },
        handler: travel_controller_1.default.back.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.embassyVisit, blockId: blocks_2.default.start },
        handler: travel_controller_1.default.createTravel.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.editEmbassyVisit },
        handler: travel_controller_1.default.createTravel.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.confirmTravel, blockId: blocks_2.default.confirmTrip },
        handler: travel_controller_1.default.confirmRequest.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.addNote, blockId: blocks_2.default.confirmTrip },
        handler: travel_controller_1.default.addTripNotes.bind(travel_controller_1.default),
    },
    {
        route: { actionId: actions_2.default.cancel, blockId: blocks_2.default.confirmTrip },
        handler: travel_controller_1.default.cancel.bind(travel_controller_1.default),
    },
    {
        route: {
            actionId: actions_2.default.submitDestination,
            blockId: blocks_2.default.confirmLocation,
        },
        handler: travel_controller_1.default.getLocationInfo.bind(travel_controller_1.default),
    },
    ...trip_router_extensions_1.default,
];
exports.default = (slackRouter) => {
    userTripRoutes.forEach((route) => {
        slackRouter.action(route.route, route.handler);
    });
};
//# sourceMappingURL=trip-router.js.map