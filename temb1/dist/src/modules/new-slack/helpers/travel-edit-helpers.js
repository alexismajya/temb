"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slack_block_models_1 = require("../models/slack-block-models");
const blocks_1 = __importDefault(require("../trips/travel/blocks"));
const actions_1 = __importDefault(require("../trips/travel/actions"));
const SlackMessageModels_1 = require("../../slack/SlackModels/SlackMessageModels");
class TravelEditHelpers {
    static generateSelectedOption(option) {
        const selectedOption = [option.toString()];
        const chosenOption = selectedOption.map((chosen) => ({
            text: new slack_block_models_1.SlackText(chosen), value: chosen,
        }));
        return chosenOption;
    }
    static checkIsEditTripDetails(tripDetails, isEdit) {
        const [cachedDate, cachedPickup, cachedDestination, cachedTime, cachedReason, cachedDateTime, cachedEmbassyVisitDateTime,] = isEdit ? [
            tripDetails.date, tripDetails.pickup, tripDetails.destination,
            tripDetails.time, tripDetails.reason, tripDetails.dateTime,
            tripDetails.embassyVisitDateTime,
        ] : ['', '', '', '', '', '', ''];
        return [
            cachedDate, cachedPickup, cachedDestination, cachedTime, cachedReason,
            cachedDateTime, cachedEmbassyVisitDateTime,
        ];
    }
    static checkIsEditFlightDetails(tripDetails, isEdit) {
        const [cachedDate, cachedFlightNumber, cachedTime, cachedPickup, cachedDestination, cachedReason, cachedFlightDateTime, cachedDateTime,] = isEdit ? [
            tripDetails.date, tripDetails.flightNumber, tripDetails.time,
            tripDetails.pickup, tripDetails.destination, tripDetails.reason,
            tripDetails.flightDateTime, tripDetails.dateTime,
        ] : ['', '', '', '', '', '', '', ''];
        return [
            cachedDate, cachedFlightNumber, cachedTime, cachedPickup, cachedDestination,
            cachedReason, cachedFlightDateTime, cachedDateTime,
        ];
    }
    static createTravelSummaryMenu(tripPayload, tripType) {
        const actionBlock = new slack_block_models_1.ActionBlock(blocks_1.default.confirmTrip).addElements([
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Confirm Trip Request'), 'confirm', actions_1.default.confirmTravel, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Add Trip Note'), tripPayload.tripDetails.tripNotes ? 'udpate_note'
                : 'trip_note', actions_1.default.addNote, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Edit Trip Request'), 'edit', tripType === 'Airport Transfer'
                ? actions_1.default.editTravel
                : actions_1.default.editEmbassyVisit, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.CancelButtonElement('Cancel Travel Request', 'cancel', actions_1.default.cancel, {
                title: 'Are you sure?',
                description: 'Are you sure you want to cancel this trip request',
                confirmText: 'Yes',
                denyText: 'No',
            }),
        ]);
        return actionBlock;
    }
}
exports.default = TravelEditHelpers;
//# sourceMappingURL=travel-edit-helpers.js.map