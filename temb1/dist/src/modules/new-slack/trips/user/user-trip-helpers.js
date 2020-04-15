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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = __importDefault(require("../../../shared/cache"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const slack_block_models_1 = require("../../models/slack-block-models");
const slack_helpers_1 = __importStar(require("../../helpers/slack-helpers"));
const ScheduleTripInputHandlers_1 = require("../../../../helpers/slack/ScheduleTripInputHandlers");
const department_service_1 = require("../../../departments/department.service");
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const location_helpers_1 = __importStar(require("../../helpers/location-helpers"));
const schemas_1 = require("../schemas");
const actions_1 = __importDefault(require("./actions"));
const blocks_1 = __importDefault(require("./blocks"));
const preview_trip_booking_helper_1 = __importDefault(require("./preview-trip-booking-helper"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const homebase_service_1 = require("../../../homebases/homebase.service");
class UserTripHelpers {
    static createStartMessage() {
        const headerText = new slack_block_models_1.MarkdownText('*Who are you booking for?*');
        const header = new slack_block_models_1.Block().addText(headerText);
        const mainButtons = [
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('For Me'), 'forMe', actions_1.default.forMe, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('For Someone'), 'forSomeone', actions_1.default.forSomeone, SlackMessageModels_1.SlackActionButtonStyles.primary)
        ];
        const newTripBlock = new slack_block_models_1.ActionBlock(blocks_1.default.start);
        newTripBlock.addElements(mainButtons);
        const navigation = UserTripHelpers.getTripNavBlock('back_to_launch');
        const blocks = [header, newTripBlock, new slack_block_models_1.Block(slack_block_models_1.BlockTypes.divider), navigation];
        const message = new slack_block_models_1.BlockMessage(blocks);
        return message;
    }
    static getAddPassengersMessage(forSelf = 'true') {
        const noOfPassengers = slack_helpers_1.default.toSlackDropdown(slackHelpers_1.default.noOfPassengers());
        const textBlock = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('*Any more passengers?*'));
        const passengersActions = new slack_block_models_1.ActionBlock(blocks_1.default.addPassengers);
        const selectPassengers = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'No. of passengers', actions_1.default.addExtraPassengers);
        selectPassengers.addOptions(noOfPassengers);
        const noButton = new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('No'), '0', actions_1.default.noPassengers, 'primary');
        passengersActions.addElements([selectPassengers, noButton]);
        const backActionId = forSelf === 'true' ? actions_1.default.forMe : actions_1.default.forSomeone;
        const navigation = this.getTripNavBlock(backActionId);
        const blocks = [textBlock, passengersActions, slack_helpers_1.sectionDivider, navigation];
        const message = new slack_block_models_1.BlockMessage(blocks);
        return message;
    }
    static getTripNavBlock(value) {
        return slack_helpers_1.default.getNavBlock(blocks_1.default.navBlock, actions_1.default.back, value);
    }
    static getRiderSelectMessage() {
        const options = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.userSelect, 'Select a passenger', actions_1.default.setPassenger);
        const header = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
            .addText(new slack_block_models_1.MarkdownText('*Who are you booking the ride for?*'));
        const actions = new slack_block_models_1.ActionBlock(blocks_1.default.setRider).addElements([options]);
        const navigation = this.getTripNavBlock(actions_1.default.forMe);
        const message = new slack_block_models_1.BlockMessage([header, actions, slack_helpers_1.sectionDivider, navigation]);
        return message;
    }
    static getDepartmentListMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { forMe } = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(payload.user.id));
            const personify = forMe ? 'your' : "passenger's";
            const header = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
                .addText(new slack_block_models_1.MarkdownText(`*Please select ${personify} department.*`));
            const slackHomebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id);
            const departmentsList = yield department_service_1.departmentService.getDepartmentsForSlack(payload.team.id, slackHomebase.id);
            const departmentBlock = new slack_block_models_1.ActionBlock(blocks_1.default.selectDepartment);
            const departmentButtons = departmentsList.map((department) => new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText(department.label), department.value.toString(), `${actions_1.default.getDepartment}_${department.value}`, SlackMessageModels_1.SlackActionButtonStyles.primary));
            departmentBlock.addElements(departmentButtons);
            const navigation = this.getTripNavBlock(actions_1.default.addExtraPassengers);
            const message = new slack_block_models_1.BlockMessage([header, departmentBlock, slack_helpers_1.sectionDivider, navigation]);
            return message;
        });
    }
    static getPostForMeMessage(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userValue = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(userId));
            let message;
            if (userValue.forMe) {
                message = this.getAddPassengersMessage();
            }
            else {
                message = this.getRiderSelectMessage();
            }
            return message;
        });
    }
    static createContToDestMsg(payload, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const header = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
                .addText(new slack_block_models_1.MarkdownText('*Please click to continue*'));
            const continueBlock = new slack_block_models_1.ActionBlock(blocks_1.default.getDestFields);
            continueBlock.addElements([
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Enter Destination'), 'select_destination', !isEdit ? actions_1.default.sendDest : actions_1.default.sendDestEdit, SlackMessageModels_1.SlackActionButtonStyles.primary)
            ]);
            const navigation = this.getTripNavBlock(actions_1.default.getDepartment);
            const message = new slack_block_models_1.BlockMessage([header, continueBlock, slack_helpers_1.sectionDivider, navigation]);
            return message;
        });
    }
    static createTripSummaryMsg(tripDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = yield preview_trip_booking_helper_1.default.getPreviewFields(tripDetails);
            const header = new slack_block_models_1.SectionBlock()
                .addText(new slack_block_models_1.SlackText('Trip request preview'))
                .addFields(fields);
            const previewActionsBlock = new slack_block_models_1.ActionBlock(blocks_1.default.confirmTrip);
            previewActionsBlock.addElements([
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Confirm'), 'confirm', actions_1.default.confirmTripRequest, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Edit'), 'edit', actions_1.default.editTripRequest, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.CancelButtonElement('Cancel', 'cancel', actions_1.default.cancelTripRequest, {
                    title: 'Are you sure?',
                    description: 'Do you really want to cancel this trip request',
                    confirmText: 'Yes',
                    denyText: 'No'
                })
            ]);
            const message = new slack_block_models_1.BlockMessage([header, previewActionsBlock]);
            return message;
        });
    }
    static getLocationVerificationMsg(location, userId, selectActionId, backActionValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationOptions = {
                selectBlockId: blocks_1.default.confirmLocation,
                selectActionId,
                navBlockId: blocks_1.default.navBlock,
                navActionId: actions_1.default.back,
                backActionValue,
            };
            return location_helpers_1.default.getLocationVerificationMsg(location, userId, locationOptions);
        });
    }
    static getPostPickupMessage(payload, submission, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = submission.pickup !== 'Others'
                ? this.createContToDestMsg(payload, isEdit)
                : yield this.getLocationVerificationMsg(submission.othersPickup, payload.user.id, actions_1.default.selectPickupLocation, actions_1.default.getDepartment);
            return !message ? this.createContToDestMsg(payload, isEdit) : message;
        });
    }
    static getPostDestinationMessage(payload, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripDetails = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(payload.user.id));
            const destination = payload.submission !== undefined
                ? payload.submission.destination
                : submission.destination;
            const othersDestination = payload.submission !== undefined
                ? payload.submission.othersDestination
                : submission.othersDestination;
            const message = destination !== 'Others'
                ? yield this.createTripSummaryMsg(tripDetails)
                : yield this.getLocationVerificationMsg(othersDestination, payload.user.id, actions_1.default.selectDestinationLocation, actions_1.default.sendDest);
            return !message ? this.createTripSummaryMsg(tripDetails) : message;
        });
    }
    static setReason(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let submission;
            try {
                submission = slack_helpers_1.default.dialogValidator(data, schemas_1.tripReasonSchema);
                yield cache_1.default.save(ScheduleTripInputHandlers_1.getTripKey(userId), 'reason', submission.reason);
                return submission;
            }
            catch (err) {
                return err;
            }
        });
    }
    static handlePickUpDetails(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripData = yield UserTripHelpers.updateTripData(user, data);
            yield cache_1.default.saveObject(ScheduleTripInputHandlers_1.getTripKey(user.id), tripData);
        });
    }
    static handleLocationVerfication(user, location, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeIds = yield UserTripHelpers.getCachedPlaceIds(user.id);
            const { lat, lng } = yield location_helpers_1.default.handleLocationVerfication(placeIds, location);
            const updateTripData = yield location_helpers_1.default.updateLocation(type, user.id, placeIds[location], lat, lng, location);
            yield cache_1.default.saveObject(ScheduleTripInputHandlers_1.getTripKey(user.id), updateTripData);
            const tripDetails = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(user.id));
            const message = this.getPostVerficationMsg(type, tripDetails);
            return message;
        });
    }
    static getCachedPlaceIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeIds = yield cache_1.default.fetch(location_helpers_1.getPredictionsKey(userId));
            return placeIds;
        });
    }
    static getPostVerficationMsg(type, tripDetails) {
        const message = type === 'pickup'
            ? this.createContToDestMsg() : this.createTripSummaryMsg(tripDetails);
        return message;
    }
    static hasErrors(submission) {
        return submission && submission.errors;
    }
    static handleDestinationDetails(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pickup, othersPickup } = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(user.id));
            const thePickup = pickup === 'Others' ? othersPickup : pickup;
            const submission = slack_helpers_1.default.dialogValidator(data, schemas_1.createUserDestinationSchema(thePickup));
            const tripDetails = yield location_helpers_1.default.getDestinationCoordinates(user.id, submission);
            yield cache_1.default.saveObject(ScheduleTripInputHandlers_1.getTripKey(user.id), tripDetails);
        });
    }
    static updateTripData(user, { date, time, pickup, othersPickup }, tripType = 'Regular Trip') {
        return __awaiter(this, void 0, void 0, function* () {
            const userTripDetails = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(user.id));
            const userTripData = Object.assign({}, userTripDetails);
            const pickupCoords = yield location_helpers_1.default.getCoordinates(pickup);
            if (pickupCoords) {
                const { location: { longitude, latitude }, id } = pickupCoords;
                Object.assign(userTripData, {
                    pickupId: id,
                    pickupLat: latitude,
                    pickupLong: longitude
                });
            }
            Object.assign(userTripData, {
                id: user.id,
                name: user.name,
                dateTime: `${date} ${time}`,
                pickup,
                othersPickup,
                departmentId: userTripDetails.departmentId,
                department: userTripDetails.department,
                tripType
            });
            return userTripData;
        });
    }
    static savePayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submission, state } = payload;
                submission.price = parseFloat(submission.price);
                slack_helpers_1.default.dialogValidator(submission, schemas_1.tripPaymentSchema);
                const { tripId } = JSON.parse(state);
                const { price } = submission;
                yield trip_service_1.default.updateRequest(tripId, { cost: price });
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.default = UserTripHelpers;
//# sourceMappingURL=user-trip-helpers.js.map