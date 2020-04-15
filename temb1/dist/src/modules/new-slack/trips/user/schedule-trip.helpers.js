"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const app_event_service_1 = __importDefault(require("../../../events/app-event.service"));
const trip_events_contants_1 = require("../../../events/trip-events.contants");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const preview_trip_booking_helper_1 = __importDefault(require("../user/preview-trip-booking-helper"));
class ScheduleTripHelpers {
    static createTripRequest(tripDetails, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dateTime: departureTime, forMe, rider, } = tripDetails;
            const requester = yield slackHelpers_1.default.findOrCreateUserBySlackId(props.userId, props.teamId);
            const { pickupName, destinationName, originId, destinationId } = yield preview_trip_booking_helper_1.default
                .getOtherPickupAndDestination(tripDetails);
            const riderUser = !forMe && rider ? yield slackHelpers_1.default
                .findOrCreateUserBySlackId(rider, props.teamId) : requester;
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(riderUser.slackId);
            const trip = yield trip_service_1.default.createRequest(Object.assign({ departureTime,
                originId,
                destinationId, riderId: riderUser.id, name: `From ${pickupName} to ${destinationName} on ${departureTime}`, tripStatus: 'Pending', requestedById: requester.id, homebaseId: homebase.id }, ScheduleTripHelpers.getTripProps(tripDetails)));
            const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(props.teamId);
            app_event_service_1.default.broadcast({
                name: trip_events_contants_1.tripEvents.newTripRequested, data: { botToken, data: trip },
            });
            return trip;
        });
    }
}
exports.default = ScheduleTripHelpers;
ScheduleTripHelpers.getTripProps = (tripDetails) => ({
    noOfPassengers: tripDetails.passengers,
    tripType: tripDetails.tripType,
    tripNote: tripDetails.tripNote,
    distance: tripDetails.distance,
    reason: tripDetails.reason,
    departmentId: tripDetails.departmentId,
});
//# sourceMappingURL=schedule-trip.helpers.js.map