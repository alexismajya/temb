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
const slack_block_models_1 = require("../../models/slack-block-models");
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const actions_1 = require("./actions");
const blocks_1 = require("./blocks");
const user_trip_helpers_1 = __importDefault(require("./user-trip-helpers"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const TripItineraryHelper_1 = __importDefault(require("../../../slack/helpers/slackHelpers/TripItineraryHelper"));
const constants_1 = require("../../../../helpers/constants");
const dateHelpers_1 = require("../../../slack/helpers/dateHelpers");
const slackEvents_1 = require("../../../slack/events/slackEvents");
const DialogPrompts_1 = __importDefault(require("../../../slack/SlackPrompts/DialogPrompts"));
const pagination_helpers_1 = __importDefault(require("../../helpers/pagination-helpers"));
class ItineraryHelpers {
    static createStartMessage() {
        const headerText = new slack_block_models_1.MarkdownText('*Please, choose an option*');
        const header = new slack_block_models_1.Block().addText(headerText);
        const mainButtons = [
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Trip History'), 'pastTrips', actions_1.itineraryActions.pastTrips, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Upcoming Trips'), 'upcomingTrips', actions_1.itineraryActions.upcomingTrips, SlackMessageModels_1.SlackActionButtonStyles.primary),
        ];
        const newTripBlock = new slack_block_models_1.ActionBlock(blocks_1.itineraryBlocks.start);
        newTripBlock.addElements(mainButtons);
        const navigation = user_trip_helpers_1.default.getTripNavBlock('back_to_launch');
        const blocks = [header, newTripBlock, navigation];
        const message = new slack_block_models_1.BlockMessage(blocks);
        return message;
    }
    static getPastTripsMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = payload.user.id;
            const headerText = new slack_block_models_1.MarkdownText('*Your trip history for the last 30 days*');
            const header = new slack_block_models_1.Block().addText(headerText);
            const pageNumber = pagination_helpers_1.default.getPageNumber(payload);
            const pastTrips = yield TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId(userId, constants_1.TRIP_LIST_TYPE.PAST, pageNumber);
            if (!pastTrips) {
                return new slack_block_models_1.SlackText('Something went wrong getting trips');
            }
            if (!pastTrips.data.length) {
                return new slack_block_models_1.SlackText('You have no past trips');
            }
            const blocks = pastTrips.data.map((trip) => ItineraryHelpers.pastTripBlockMessage(userId, trip));
            const divider = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.divider);
            const flattened = blocks.map((block) => [...block, divider]).reduce((a, b) => a.concat(b));
            const paginationBlock = pagination_helpers_1.default.addPaginationButtons(pastTrips, 'pastTrips', actions_1.itineraryActions.page, blocks_1.itineraryBlocks.pagination, actions_1.itineraryActions.skipPage);
            if (paginationBlock) {
                flattened.push(...paginationBlock);
            }
            const navBlock = user_trip_helpers_1.default.getTripNavBlock('back_to_itinerary_trips');
            const message = new slack_block_models_1.BlockMessage([header, divider, ...flattened, divider, navBlock]);
            return message;
        });
    }
    static getUpcomingTripsMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = payload.user.id;
            const headerText = new slack_block_models_1.MarkdownText('*Your Upcoming Trips*');
            const header = new slack_block_models_1.Block().addText(headerText);
            const pageNumber = pagination_helpers_1.default.getPageNumber(payload);
            const upcomingTrips = yield TripItineraryHelper_1.default.getPaginatedTripRequestsBySlackUserId(userId, constants_1.TRIP_LIST_TYPE.UPCOMING, pageNumber);
            if (!upcomingTrips) {
                return new slack_block_models_1.SlackText('Something went wrong getting trips');
            }
            if (!upcomingTrips.data.length) {
                return new slack_block_models_1.SlackText('You have no upcoming trips');
            }
            const blocks = upcomingTrips.data.map((trip) => ItineraryHelpers.upcomingTripBlockMessage(userId, trip));
            const divider = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.divider);
            const flattened = blocks.map((block) => [...block, divider]).reduce((a, b) => a.concat(b));
            const paginationBlock = pagination_helpers_1.default.addPaginationButtons(upcomingTrips, 'upcomingTrips', actions_1.itineraryActions.page, blocks_1.itineraryBlocks.pagination, actions_1.itineraryActions.skipPage);
            if (paginationBlock) {
                flattened.push(...paginationBlock);
                flattened.push(divider);
            }
            const navBlock = user_trip_helpers_1.default.getTripNavBlock('back_to_itinerary_trips');
            const message = new slack_block_models_1.BlockMessage([header, divider, ...flattened, navBlock]);
            return message;
        });
    }
    static triggerPage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actions: [{ value: requestType, action_id: actionId }] } = payload;
            if (payload.actions && payload.actions[0].action_id === 'user_trip_skip_page') {
                new slack_block_models_1.SlackText('Noted...');
                return yield DialogPrompts_1.default.sendSkipPage(payload, requestType, actionId);
            }
        });
    }
    static tripBlockDetails(userId, trip) {
        const heading = new slack_block_models_1.SectionBlock();
        const journey = `*From ${trip.origin.address} To ${trip.destination.address}*`;
        const time = `Departure Time:  ${dateHelpers_1.getSlackDateTimeString(trip.departureTime)}`;
        const requestedBy = userId === trip.requester.slackId
            ? `*Requested By: ${trip.requester.name} (You)*`
            : `*Requested By: ${trip.requester.name}*`;
        const rider = `Rider: ${trip.rider.name}`;
        const tripStatus = `*Status: ${trip.tripStatus}*`;
        heading.addFields([
            new slack_block_models_1.MarkdownText(journey), new slack_block_models_1.SlackText(time),
            new slack_block_models_1.MarkdownText(rider), new slack_block_models_1.MarkdownText(requestedBy),
            new slack_block_models_1.MarkdownText(tripStatus),
        ]);
        return heading;
    }
    static pastTripBlockMessage(userId, trip) {
        const headingSide = ItineraryHelpers.tripBlockDetails(userId, trip);
        return [headingSide];
    }
    static upcomingTripBlockMessage(userId, trip) {
        const headingSide = ItineraryHelpers.tripBlockDetails(userId, trip);
        const mainButtons = [
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Reschedule'), trip.id.toString(), `${actions_1.itineraryActions.reschedule}_${trip.id}`, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.CancelButtonElement('Cancel Trip', trip.id.toString(), `${actions_1.itineraryActions.cancelTrip}_${trip.id}`, {
                title: 'Are you sure?',
                description: 'Do you really want to cancel',
                confirmText: 'Yes',
                denyText: 'No',
            }),
        ];
        const actions = new slack_block_models_1.ActionBlock(`${blocks_1.itineraryBlocks.tripActions}_${trip.id}`);
        actions.addElements(mainButtons);
        return [headingSide, actions];
    }
    static cancelTrip(payload, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            try {
                const trip = yield trip_service_1.default.getById(Number(tripId), true);
                if (!trip) {
                    message = 'Trip not found';
                }
                else {
                    yield trip_service_1.default.updateRequest(tripId, { tripStatus: 'Cancelled' });
                    const { origin: { address: originAddress }, destination: { address: destinationAdress }, } = trip;
                    message = `Success! Your Trip request from ${originAddress} to ${destinationAdress} has been cancelled`;
                    if (trip.approvedById) {
                        slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.RIDER_CANCEL_TRIP, payload, trip);
                        slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.NOTIFY_OPS_CANCELLED_TRIP, payload, trip);
                    }
                }
            }
            catch (error) {
                message = `Request could not be processed, ${error.message}`;
            }
            return new slack_block_models_1.MarkdownText(message);
        });
    }
}
exports.default = ItineraryHelpers;
//# sourceMappingURL=itinerary.helpers.js.map