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
const actions_1 = __importDefault(require("./actions"));
const address_service_1 = require("../../../addresses/address.service");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const SlackViews_1 = __importDefault(require("../../extensions/SlackViews"));
const homebase_service_1 = require("../../../../modules/homebases/homebase.service");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const department_service_1 = require("../../../../modules/departments/department.service");
class Interactions {
    constructor(addressService = address_service_1.addressService, departmentService = department_service_1.departmentService, teamDetailsService = teamDetails_service_1.teamDetailsService, getSlackViews = SlackViews_1.default, homebaseService = homebase_service_1.homebaseService, newSlackHelpers = slack_helpers_1.default) {
        this.addressService = addressService;
        this.departmentService = departmentService;
        this.teamDetailsService = teamDetailsService;
        this.getSlackViews = getSlackViews;
        this.homebaseService = homebaseService;
        this.newSlackHelpers = newSlackHelpers;
    }
    sendContactDetailsModal(payload, travelDetails = null, isEdit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = yield this.getContactDetailsModal(payload, travelDetails, isEdit);
            const token = yield this.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return this.getSlackViews(token).open(payload.trigger_id, modal);
        });
    }
    sendAddNoteModal(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = this.getAddNoteModal(payload);
            const token = yield this.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return this.getSlackViews(token).open(payload.trigger_id, modal);
        });
    }
    sendLocationModal(payload, tripData) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = yield this.getLocationModal(payload, tripData);
            const token = yield this.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return this.getSlackViews(token).open(payload.trigger_id, modal);
        });
    }
    static checkIsEditContact(isEdit, travelDetails) {
        const [cachedRider, cachedDepartmentId, cachedDepartmentName, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,] = isEdit ? [
            travelDetails.contactDetails.rider, travelDetails.contactDetails.department.id,
            travelDetails.contactDetails.department.name, travelDetails.contactDetails.passengers,
            travelDetails.contactDetails.riderPhoneNo, travelDetails.contactDetails.travelTeamPhoneNo,
        ] : ['', '', '', '', '', ''];
        return [
            cachedRider, cachedDepartmentId, cachedDepartmentName,
            cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,
        ];
    }
    getContactDetailsModal(payload, travelDetails, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [cachedRider, cachedDepartmentId, cachedDepartmentName, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,] = Interactions.checkIsEditContact(isEdit, travelDetails);
            const { user: { id: userId } } = payload;
            const homebase = yield this.homebaseService.getHomeBaseBySlackId(userId);
            const { rows: departments } = yield this.departmentService.getAllDepartments(100, 1, homebase.id);
            const selectedDepartment = departments.filter(({ name }) => name === cachedDepartmentName);
            const chosenDepartment = this.newSlackHelpers.toSlackSelectOptions(selectedDepartment, { textProp: 'name', valueProp: 'id' });
            const departmentSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select a department', 'department', isEdit ? chosenDepartment[0] : null);
            departmentSelect.addOptions(this.newSlackHelpers.toSlackSelectOptions(departments, { textProp: 'name', valueProp: 'id' }));
            const modal = Interactions.generateContactDetailsModal(payload, isEdit, cachedRider, departmentSelect, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo);
            return modal;
        });
    }
    static generateContactDetailsModal(payload, isEdit, cachedRider, departmentSelect, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo) {
        const rider = new slack_block_models_1.InputBlock(new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.userSelect, 'Select a rider', 'rider', undefined, isEdit ? cachedRider : undefined), 'For Who?', 'rider');
        const [department, passengers, riderPhoneNo, travelTeamPhoneNo,] = Interactions.getRideInfo(isEdit, departmentSelect, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo);
        const modal = new slack_block_models_1.Modal(isEdit ? 'Edit Contact Details' : 'Contact Details', {
            submit: 'Submit',
            close: 'Cancel',
        }).addBlocks([rider, department, passengers, riderPhoneNo, travelTeamPhoneNo])
            .addCallbackId(isEdit
            ? actions_1.default.submitEditedContactDetails : actions_1.default.submitContactDetails)
            .addMetadata(JSON.stringify({ origin: payload.response_url }));
        return modal;
    }
    static getRideInfo(isEdit, departmentSelect, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo) {
        const department = new slack_block_models_1.InputBlock(departmentSelect, 'Departments', 'department');
        const passengers = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter the total number of passengers', 'passengers', false, isEdit ? cachedPassengers.toString() : ''), 'Number of Passengers', 'passengers', false, 'e.g; 2');
        const riderPhoneNo = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter passenger\'s phone number', 'riderPhoneNo', false, isEdit ? cachedriderPhoneNo : ''), 'Passenger phone number', 'riderPhoneNo', false, 'e.g +250717665593');
        const travelTeamPhoneNo = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter travel team phone number', 'travelTeamPhoneNo', false, isEdit ? cachedtravelTeamPhoneNo : ''), 'Travel team phone number', 'travelTeamPhoneNo', false, 'e.g +250717665593');
        return [department, passengers, riderPhoneNo, travelTeamPhoneNo];
    }
    getAddNoteModal(payload) {
        const noteField = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Eg. I always travel in First Class', 'notes', true), 'Add Trip Notes', 'notes');
        return new slack_block_models_1.Modal('Trip Notes', { submit: 'Submit', close: 'Cancel' })
            .addBlocks([noteField])
            .addCallbackId(actions_1.default.submitNotes)
            .addMetadata(JSON.stringify({ origin: payload.response_url }));
    }
    getLocationModal(payload, tripData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingLocation = 'To Be Decided';
            const { contactDetails: { rider }, tripDetails: { pickup, destination } } = tripData;
            const embassies = yield this.homebaseService.getHomeBaseEmbassies(rider);
            const homebase = yield this.homebaseService.getHomeBaseBySlackId(rider);
            const addresses = yield this.addressService.getAddressListByHomebase(homebase.name);
            const destinationSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select an embassy', 'destination');
            destinationSelect.addOptions(this.newSlackHelpers
                .toSlackSelectOptions(embassies, { textProp: 'name', valueProp: 'name' }));
            const pickupSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select a pickup location', 'pickup');
            pickupSelect.addOptions(addresses
                .map((address) => ({ text: new slack_block_models_1.SlackText(address), value: address })));
            const destinationInput = new slack_block_models_1.InputBlock(destinationSelect, 'Destination', 'destination');
            const pickupInput = new slack_block_models_1.InputBlock(pickupSelect, 'Pickup Location', 'pickup');
            const modal = new slack_block_models_1.Modal('Trip Locations', { submit: 'Submit', close: 'Cancel' })
                .addCallbackId(actions_1.default.addLocations)
                .addMetadata(JSON.stringify({ origin: payload.response_url }));
            if (pickup === pendingLocation && destination !== pendingLocation) {
                modal.addBlocks([pickupInput]);
            }
            else if (pickup !== pendingLocation && destination === pendingLocation) {
                modal.addBlocks([destinationInput]);
            }
            else {
                modal.addBlocks([pickupInput, destinationInput]);
            }
            return modal;
        });
    }
    goodByeMessage() {
        return new slack_block_models_1.SlackText('Thank you for using Tembea. See you again.');
    }
    simpleTextResponse(message) {
        return new slack_block_models_1.BlockMessage([new slack_block_models_1.Block().addText(message)]);
    }
}
exports.Interactions = Interactions;
const interactions = new Interactions();
exports.default = interactions;
//# sourceMappingURL=interactions.js.map