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
const user_trip_helpers_1 = __importDefault(require("./user-trip-helpers"));
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const trip_helpers_1 = __importDefault(require("./trip.helpers"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const ScheduleTripInputHandlers_1 = require("../../../../helpers/slack/ScheduleTripInputHandlers");
const cache_1 = __importDefault(require("../../../shared/cache"));
const interactions_1 = __importDefault(require("./interactions"));
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const actions_1 = __importDefault(require("./actions"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../../../slack/helpers/slackHelpers/InteractivePromptSlackHelper"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const schedule_trip_helpers_1 = __importDefault(require("./schedule-trip.helpers"));
const itinerary_controller_1 = __importDefault(require("./itinerary.controller"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const schemas_1 = require("../schemas");
const travel_helpers_1 = __importDefault(require("../travel/travel.helpers"));
const department_service_1 = require("../../../departments/department.service");
const homebase_service_1 = require("../../../homebases/homebase.service");
class UserTripBookingController {
    static startTripBooking(payload, respond) {
        const message = user_trip_helpers_1.default.createStartMessage();
        respond(message);
    }
    static forMe(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const forMe = payload.actions[0].action_id === actions_1.default.forMe;
            yield cache_1.default.save(ScheduleTripInputHandlers_1.getTripKey(payload.user.id), 'forMe', forMe);
            if (forMe) {
                const state = { origin: payload.response_url };
                yield interactions_1.default.sendTripReasonForm(payload, state);
            }
            else {
                const message = user_trip_helpers_1.default.getRiderSelectMessage();
                respond(message);
            }
        });
    }
    static saveRider(payload, optional = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const rider = payload.actions === undefined ? optional : payload.actions[0].selected_user;
            yield slackHelpers_1.default.findOrCreateUserBySlackId(rider, payload.team.id);
            yield cache_1.default.save(ScheduleTripInputHandlers_1.getTripKey(payload.user.id), 'rider', rider);
            const state = { origin: payload.response_url };
            if (payload.actions) {
                yield interactions_1.default.sendTripReasonForm(payload, state);
            }
        });
    }
    static handleReasonSubmit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.submission) {
                const result = yield user_trip_helpers_1.default.setReason(payload.user.id, payload.submission);
                if (result && result.errors)
                    return result;
            }
            yield interactions_1.default.sendAddPassengers(payload.state);
        });
    }
    static saveExtraPassengers(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let noOfPassengers = payload.actions[0].value
                ? payload.actions[0].value
                : payload.actions[0].selected_option.value;
            noOfPassengers = +noOfPassengers + 1;
            yield cache_1.default.save(ScheduleTripInputHandlers_1.getTripKey(payload.user.id), 'passengers', noOfPassengers);
            const message = yield user_trip_helpers_1.default.getDepartmentListMessage(payload);
            respond(message);
        });
    }
    static saveDepartment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value, text } = payload.actions[0];
            const user = yield user_service_1.default.getUserBySlackId(payload.user.id);
            yield cache_1.default.saveObject(ScheduleTripInputHandlers_1.getTripKey(payload.user.id), {
                homeBaseName: user.homebase.name,
                departmentId: value,
                department: text.text
            });
            return interactions_1.default.sendPickupModal(user.homebase.name, payload);
        });
    }
    static sendDestinations(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = { origin: payload.response_url };
            const isEdit = payload.actions[0].action_id === actions_1.default.sendDestEdit;
            const { homeBaseName, destination, othersDestination } = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(payload.user.id));
            const fields = yield slack_helpers_1.default.getDestinationFields(homeBaseName, destination, othersDestination, isEdit);
            yield interactions_1.default.sendDetailsForm(payload, state, {
                title: 'Destination Details',
                submitLabel: 'Submit',
                callbackId: actions_1.default.destDialog,
                fields
            });
        });
    }
    static saveDestination(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_trip_helpers_1.default.handleDestinationDetails(payload.user, payload.submission);
                yield interactions_1.default.sendPostDestinationMessage(payload);
            }
            catch (err) {
                return err;
            }
        });
    }
    static confirmLocation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = payload.actions[0].selected_option.text.text;
            const type = payload.actions[0].action_id === actions_1.default.selectPickupLocation
                ? 'pickup'
                : 'destination';
            const message = yield user_trip_helpers_1.default.handleLocationVerfication(payload.user, location, type);
            const response = payload.response_url;
            yield updatePastMessageHelper_1.default.newUpdateMessage(response, message);
        });
    }
    static confirmTripRequest(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: userId }, team: { id: teamId } } = payload;
                const tripDetails = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(userId));
                const trip = yield schedule_trip_helpers_1.default.createTripRequest(tripDetails, {
                    userId,
                    teamId
                });
                yield cache_1.default.delete(ScheduleTripInputHandlers_1.getTripKey(userId));
                const riderSlackId = `${tripDetails.forMe ? tripDetails.id : tripDetails.rider}`;
                InteractivePromptSlackHelper_1.default.sendCompletionResponse(respond, trip.id, riderSlackId);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new slack_block_models_1.BlockMessage([
                    new slack_block_models_1.Block().addText('Unsuccessful request. Kindly Try again')
                ]));
            }
        });
    }
    static paymentRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.submission) {
                const result = yield user_trip_helpers_1.default.savePayment(payload);
                if (result && result.errors)
                    return result;
            }
            const message = new slack_block_models_1.BlockMessage([
                new slack_block_models_1.Block().addText('Thank you for using Tembea')
            ]);
            yield updatePastMessageHelper_1.default.updateMessage(payload.state, message);
        });
    }
    static back(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, actions: [{ value: action }] } = payload;
            switch (action) {
                case 'back_to_travel_launch':
                    respond(yield travel_helpers_1.default.getStartMessage(payload.user.id));
                    break;
                case 'back_to_launch':
                    respond(yield trip_helpers_1.default.getWelcomeMessage(slackId));
                    break;
                case 'back_to_itinerary_trips':
                    return itinerary_controller_1.default.start(payload, respond);
                case actions_1.default.forMe:
                    return UserTripBookingController.startTripBooking(payload, respond);
                case actions_1.default.forSomeone:
                    return UserTripBookingController.handleReasonSubmit(payload, respond);
                case actions_1.default.addExtraPassengers:
                    respond(user_trip_helpers_1.default.getAddPassengersMessage());
                    break;
                case actions_1.default.getDepartment:
                    respond(yield user_trip_helpers_1.default.getDepartmentListMessage(payload));
                    break;
                default:
                    respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea'));
                    break;
            }
        });
    }
    static updateState(state, data = { text: 'Noted' }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield updatePastMessageHelper_1.default.updateMessage(state, data);
        });
    }
    static cancel(payload, respond) {
        const message = new slack_block_models_1.BlockMessage([
            new slack_block_models_1.Block().addText('Thank you for using Tembea')
        ]);
        respond(message);
    }
    static savePickupDetails(payload, submission, respond, context, isEdit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = yield slack_helpers_1.default.getUserInfo(payload.user.id, context.botToken);
                const pickUpSchema = schemas_1.getTripPickupSchema(userInfo.tz);
                const pickupDetails = slack_helpers_1.default.modalValidator(submission, pickUpSchema);
                respond.clear();
                yield user_trip_helpers_1.default.handlePickUpDetails(payload.user, pickupDetails);
                yield interactions_1.default.sendPostPickUpMessage(payload, pickupDetails, isEdit);
            }
            catch (err) {
                const errors = err.errors || { date: 'An unexpected error occured' };
                return respond.error(errors);
            }
        });
    }
    static fetchDepartments(userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slackHomebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(userId);
            const { name: homebaseName } = slackHomebase;
            const departmentsList = yield department_service_1.departmentService.getDepartmentsForSlack(teamId, slackHomebase.id);
            const allDepartments = departmentsList.map(({ label, value }) => ({ text: label, value }));
            return [allDepartments, homebaseName];
        });
    }
}
exports.default = UserTripBookingController;
//# sourceMappingURL=user-trip-booking-controller.js.map