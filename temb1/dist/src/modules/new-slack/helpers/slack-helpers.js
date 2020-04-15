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
const moment_1 = __importDefault(require("moment"));
const slack_block_models_1 = require("../models/slack-block-models");
const Validators_1 = __importDefault(require("../../../helpers/slack/UserInputValidator/Validators"));
const SlackDialogModels_1 = require("../../slack/SlackModels/SlackDialogModels");
const createTripDetailsForm_1 = require("../../../helpers/slack/createTripDetailsForm");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const WebClientSingleton_1 = __importDefault(require("../../../utils/WebClientSingleton"));
const cache_1 = __importDefault(require("../../shared/cache"));
const actions_1 = __importDefault(require("../trips/user/actions"));
const address_service_1 = require("../../addresses/address.service");
const trip_request_1 = require("../../../database/models/trip-request");
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const homebase_service_1 = require("../../homebases/homebase.service");
const SlackMessageModels_1 = require("../../slack/SlackModels/SlackMessageModels");
exports.sectionDivider = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.divider);
exports.defaultKeyValuePairs = { text: 'text', value: 'value' };
class NewSlackHelpers {
    static getCancelButton(actionId) {
        return new slack_block_models_1.CancelButtonElement('Cancel', 'cancel', actionId, {
            title: 'Are you sure?',
            description: 'Do you really want to cancel',
            confirmText: 'Yes',
            denyText: 'No'
        });
    }
    static getNavButtons(backValue, backActionId) {
        const navigationButtons = [
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('< Back'), backValue, backActionId),
            NewSlackHelpers.getCancelButton(actions_1.default.cancel),
        ];
        return navigationButtons;
    }
    static getNavBlock(blockId, backActionId, backValue) {
        const navButtons = NewSlackHelpers.getNavButtons(backValue, backActionId);
        const navigation = new slack_block_models_1.ActionBlock(blockId);
        navigation.addElements(navButtons);
        return navigation;
    }
    static searchButton(actionId, blockId) {
        const searchBtn = [new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Search'), 'search', actionId, SlackMessageModels_1.SlackActionButtonStyles.primary)];
        const action = new slack_block_models_1.ActionBlock(blockId);
        action.addElements(searchBtn);
        return action;
    }
    static dialogValidator(data, schema) {
        try {
            const results = Validators_1.default.validateSubmission(data, schema);
            return results;
        }
        catch (err) {
            const error = new Error('dialog validation failed');
            error.errors = err.errors.details.map((e) => {
                const key = e.path[0];
                return new SlackDialogModels_1.SlackDialogError(key, e.message || 'the submitted property for this value is invalid');
            });
            throw error;
        }
    }
    static modalValidator(data, schema) {
        try {
            const results = Validators_1.default.validateSubmission(data, schema);
            return results;
        }
        catch (err) {
            const error = new Error('dialog validation failed');
            error.errors = {};
            err.errors.details.forEach((e) => {
                const key = e.path[0];
                error.errors[key] = e.message || 'the submitted property for this value is invalid';
            });
            throw error;
        }
    }
    static hasNeededProps(data, keyPairs) {
        let hasProps = false;
        if (data) {
            const func = Object.prototype.hasOwnProperty;
            hasProps = func.call(data, keyPairs.text) && func.call(data, keyPairs.value);
        }
        return hasProps;
    }
    static toSlackDropdown(data, keyPairs = exports.defaultKeyValuePairs) {
        return data.filter((e) => this.hasNeededProps(e, keyPairs))
            .map((entry) => ({
            text: new slack_block_models_1.SlackText(entry[keyPairs.text].toString()),
            value: entry[keyPairs.value].toString()
        }));
    }
    static getAddresses(homeBaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield address_service_1.addressService.getAddressListByHomebase(homeBaseName);
            addresses.push('Others');
            return addresses;
        });
    }
    static getDestinationFields(homeBaseName, destination, othersDestination, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield NewSlackHelpers.getAddresses(homeBaseName);
            const locations = createTripDetailsForm_1.toLabelValuePairs(addresses);
            const destinationField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Destination location', 'destination', locations, isEdit ? destination : null);
            const othersDestinationField = new SlackDialogModels_1.SlackDialogText('Others?', 'othersDestination', 'Enter destination', true, null, isEdit ? othersDestination : null);
            return [
                destinationField,
                othersDestinationField
            ];
        });
    }
    static getUserInfo(slackId, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `USER_SLACK_INFO_${slackId}`;
            const result = yield cache_1.default.fetch(cacheKey);
            if (result)
                return result;
            const { user } = yield WebClientSingleton_1.default.getWebClient(slackBotOauthToken).users.info({
                user: slackId
            });
            yield cache_1.default.saveObject(cacheKey, user);
            return user;
        });
    }
    static modalParser(data) {
        const parsed = {};
        Object.keys(data).forEach((blockId) => {
            const actionBlock = data[blockId];
            switch (actionBlock[blockId].type) {
                case 'datepicker':
                    parsed[blockId] = actionBlock[blockId].selected_date;
                    break;
                case 'plain_text_input':
                    parsed[blockId] = actionBlock[blockId].value;
                    break;
                case 'users_select':
                    parsed[blockId] = actionBlock[blockId].selected_user;
                    break;
                case 'external_select':
                case 'static_select':
                    parsed[blockId] = actionBlock[blockId].selected_option.value;
                default:
                    break;
            }
        });
        return parsed;
    }
    static getTripState(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield trip_service_1.default.getById(tripId, true);
            const state = {
                currentState: trip.tripStatus,
                lastActionById: trip.requester.slackId,
            };
            switch (trip.tripStatus) {
                case trip_request_1.TripStatus.confirmed:
                    state.lastActionById = trip.confirmer.slackId;
                    break;
                case trip_request_1.TripStatus.approved:
                    state.lastActionById = trip.approver.slackId;
                    break;
                case trip_request_1.TripStatus.declinedByManager:
                case trip_request_1.TripStatus.declinedByOps:
                    state.lastActionById = trip.decliner.slackId;
                    break;
                default:
                    break;
            }
            return state;
        });
    }
    static getPickupModal(homebaseName, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultDate = moment_1.default().format('YYYY-MM-DD');
            const date = new slack_block_models_1.InputBlock(new slack_block_models_1.DatePicker(defaultDate, 'select a date', 'date'), 'Select Date', 'date');
            const time = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('HH:mm', 'time'), 'Time', 'time');
            const addresses = yield NewSlackHelpers.getAddresses(homebaseName);
            const addressOptions = NewSlackHelpers.toSlackSelectOptions(addresses);
            const pickupLocations = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select Pickup Location', 'pickup')
                .addOptions(addressOptions), 'PickUp Location', 'pickup');
            const othersPickup = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter pickup location', 'othersPickup'), 'Others?', 'othersPickup', true, 'e.g Westlands, Nairobi');
            const modal = slack_block_models_1.Modal.createModal({
                modalTitle: 'Pickup Details',
                modalOptions: {
                    submit: 'Submit',
                    close: 'Cancel',
                },
                inputBlocks: [date, time, pickupLocations, othersPickup],
                callbackId: actions_1.default.pickupModalSubmit,
                metadata: JSON.stringify(state),
            });
            return modal;
        });
    }
    static toSlackSelectOptions(data, { textProp, valueProp } = {}, isArrayOfString = false) {
        if (isArrayOfString)
            return data.map((entry) => ({ text: new slack_block_models_1.SlackText(entry), value: entry }));
        return data.map((entry) => {
            let option = null;
            if (typeof entry === 'string') {
                option = {
                    text: new slack_block_models_1.SlackText(entry),
                    value: entry,
                };
            }
            else {
                option = {
                    text: new slack_block_models_1.SlackText(entry[textProp]),
                    value: `${entry[valueProp]}`,
                };
            }
            return option;
        });
    }
    static getHomeBaseMessage(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId, true);
            const homeBaseMessage = homeBase
                ? `_Your current home base is ${slackHelpers_1.default.getLocationCountryFlag(homeBase.country.name)} *${homeBase.name}*_`
                : '`Please set your location to continue`';
            return homeBaseMessage;
        });
    }
    static wrapSlackHandle(slackId) {
        return `<@${slackId}>`;
    }
}
exports.default = NewSlackHelpers;
//# sourceMappingURL=slack-helpers.js.map