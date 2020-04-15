"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const slack_block_models_1 = require("../models/slack-block-models");
class SlackTravelHelpers {
    static generateFlightDetailsModal(isEdit, pickupSelect, destinationSelect, cachedFlightNumber, cachedDate, cachedTime, cachedReason) {
        const pickup = new slack_block_models_1.InputBlock(pickupSelect, 'Pick-up Location', 'pickup');
        const destination = new slack_block_models_1.InputBlock(destinationSelect, 'Destination', 'destination');
        const flightNumber = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter flight number', 'flightNumber', false, isEdit ? cachedFlightNumber : ''), 'Flight Number', 'flightNumber');
        const defaultDate = moment_1.default().format('YYYY-MM-DD');
        const flightDate = new slack_block_models_1.InputBlock(new slack_block_models_1.DatePicker(isEdit ? cachedDate : defaultDate, 'select date', 'date'), 'Select Flight Date', 'date');
        const time = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('HH:mm', 'time', false, isEdit ? cachedTime : ''), 'Time', 'time');
        const textarea = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter reason for booking the trip', 'reason', true, isEdit ? cachedReason : ''), 'Reason', 'reason');
        return [pickup, destination, flightNumber, flightDate, time, textarea];
    }
}
exports.default = SlackTravelHelpers;
//# sourceMappingURL=travel-helpers.js.map