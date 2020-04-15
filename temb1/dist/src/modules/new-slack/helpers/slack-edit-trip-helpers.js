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
const slack_helpers_1 = __importDefault(require("./slack-helpers"));
const slack_block_models_1 = require("../models/slack-block-models");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const actions_1 = __importDefault(require("../trips/user/actions"));
class EditTripHelpers {
    static getEditRequestModal(tripDetails, responseUrl, allDepartments, homebaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reason, passengers, dateTime, department, pickup, othersPickup, rider, id } = tripDetails;
            const [riderInfo, userReason] = EditTripHelpers.getRiderAndReason(rider || id, reason);
            const [morePassengers, date, time] = EditTripHelpers.getPassengersAndTime(passengers, dateTime);
            const departments = EditTripHelpers.getDepartmentsEdit(allDepartments, department);
            const addresses = yield slack_helpers_1.default.getAddresses(homebaseName);
            const [pickupInfo, othersOptionPickup,] = EditTripHelpers.getPickupEdit(addresses, pickup, othersPickup);
            const modal = EditTripHelpers.createEditTripRequestModal(riderInfo, userReason, morePassengers, departments, date, time, pickupInfo, othersOptionPickup, responseUrl);
            return modal;
        });
    }
    static generateSelectedOption(option) {
        const defaultOption = typeof (option) !== 'undefined' ? option : 'Others';
        const selOption = [];
        selOption.push(defaultOption.toString());
        const selectedOption = slack_helpers_1.default.toSlackSelectOptions(selOption);
        return selectedOption[0];
    }
    static getPickupEdit(addresses, pickup, othersPickup) {
        const addressOptions = slack_helpers_1.default.toSlackSelectOptions(addresses);
        const selPickup = addresses.find((address) => address === pickup);
        const selectedPickup = EditTripHelpers.generateSelectedOption(selPickup);
        const pickupInfo = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select Pickup Location', 'pickup', selectedPickup).addOptions(addressOptions), 'PickUp Location', 'pickup');
        const othersOptionPickup = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter pickup location', 'othersPickup', false, othersPickup || ''), 'Others?', 'othersPickup', true, 'e.g Westlands, Nairobi');
        return [pickupInfo, othersOptionPickup];
    }
    static getDepartmentsEdit(allDepartments, department) {
        const depToUse = allDepartments.map(({ text }) => text);
        const departs = slack_helpers_1.default.toSlackSelectOptions(depToUse);
        const selDepartment = depToUse.filter((text) => text === department);
        const selectedDepartment = slack_helpers_1.default.toSlackSelectOptions(selDepartment);
        const departments = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select Department', 'department', selectedDepartment[0]).addOptions(departs), 'Select Department', 'department');
        return departments;
    }
    static getPassengers(passengers) {
        const noOfPassengers = slack_helpers_1.default.toSlackDropdown(slackHelpers_1.default.noOfPassengers(0));
        const selectedPassenger = EditTripHelpers.generateSelectedOption(passengers - 1);
        const morePassengers = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Any more passengers', 'passengers', selectedPassenger).addOptions(noOfPassengers), 'Any more passengers', 'passengers');
        return morePassengers;
    }
    static getRiderAndReason(userId, reason) {
        const rider = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.userSelect, 'Select a rider', 'rider', undefined, userId), 'Rider?', 'rider');
        const userReason = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('reason', 'reason', true, reason), 'Reason', 'reason');
        return [rider, userReason];
    }
    static getPassengersAndTime(passengers, dateTime) {
        const morePassengers = EditTripHelpers.getPassengers(passengers);
        const [requestDate, requestTime] = dateTime.split(' ');
        const date = new slack_block_models_1.InputBlock(new slack_block_models_1.DatePicker(requestDate, 'select a date', 'date'), 'Pickup Details || Select Date', 'date');
        const time = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('HH:mm', 'time', false, requestTime), 'Pickup Details || Time', 'time');
        return [morePassengers, date, time];
    }
    static createEditTripRequestModal(rider, userReason, morePassengers, departments, date, time, pickupInfo, othersOptionPickup, responseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = slack_block_models_1.Modal.createModal({
                modalTitle: 'Edit Trip Request',
                modalOptions: {
                    submit: 'Submit',
                    close: 'Cancel',
                },
                inputBlocks: [
                    rider, userReason, morePassengers, departments, date, time, pickupInfo,
                    othersOptionPickup
                ],
                callbackId: actions_1.default.editRequestModalSubmit,
                metadata: JSON.stringify({ origin: responseUrl }),
            });
            return modal;
        });
    }
}
exports.default = EditTripHelpers;
//# sourceMappingURL=slack-edit-trip-helpers.js.map