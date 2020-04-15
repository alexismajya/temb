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
const actions_1 = __importDefault(require("./actions"));
const blocks_1 = __importDefault(require("./blocks"));
const schemas_1 = require("../schemas");
const TravelTripHelper_1 = require("../../../slack/helpers/slackHelpers/TravelTripHelper");
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const trip_request_1 = require("../../../../database/models/trip-request");
const dateHelpers_1 = require("../../../slack/helpers/dateHelpers");
const slack_block_models_1 = require("../../models/slack-block-models");
const travel_helpers_1 = __importDefault(require("./travel.helpers"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const interactions_1 = __importDefault(require("./interactions"));
const utils_1 = __importDefault(require("../../../../utils"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const department_service_1 = require("../../../../modules/departments/department.service");
const reschedule_helper_1 = __importDefault(require("../user/reschedule.helper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const cleanData_1 = __importDefault(require("../../../../helpers/cleanData"));
class TravelTripController {
    constructor(bugsnagErrorHelper = bugsnagHelper_1.default, travelHelpers = travel_helpers_1.default, cache = cache_1.default, newSlackHelpers = slack_helpers_1.default, interactions = interactions_1.default, utils = utils_1.default, dateDialogHelper = dateHelper_1.default, departmentService = department_service_1.departmentService, rescheduleHelper = reschedule_helper_1.default, updateSlackMessageHelper = updatePastMessageHelper_1.default) {
        this.bugsnagErrorHelper = bugsnagErrorHelper;
        this.travelHelpers = travelHelpers;
        this.cache = cache;
        this.newSlackHelpers = newSlackHelpers;
        this.interactions = interactions;
        this.utils = utils;
        this.dateDialogHelper = dateDialogHelper;
        this.departmentService = departmentService;
        this.rescheduleHelper = rescheduleHelper;
        this.updateSlackMessageHelper = updateSlackMessageHelper;
    }
    createTravel(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let isEdit;
            let tripType;
            switch (payload.actions[0].action_id) {
                case actions_1.default.embassyVisit:
                case actions_1.default.editEmbassyVisit:
                    tripType = trip_request_1.TripTypes.embassyVisit;
                    isEdit = payload.actions[0].action_id === actions_1.default.editEmbassyVisit;
                    break;
                case actions_1.default.airportTransfer:
                case actions_1.default.editTravel:
                    tripType = trip_request_1.TripTypes.airportTransfer;
                    isEdit = payload.actions[0].action_id === actions_1.default.editTravel;
                    break;
            }
            yield this.cache.save(TravelTripHelper_1.getTravelKey(payload.user.id), 'tripType', tripType);
            const travelDetails = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(payload.user.id));
            yield this.interactions.sendContactDetailsModal(payload, travelDetails, isEdit);
        });
    }
    changeLocation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.travelHelpers.changeLocation(payload);
            respond(message);
        });
    }
    selectLocation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.travelHelpers.selectLocation(payload);
            respond(message);
        });
    }
    cancel(payload, respond) {
        respond(this.interactions.simpleTextResponse('Thank you for using Tembea'));
    }
    startTravelTripBooking(payload, respond) {
        const message = this.travelHelpers.getStartMessage(payload);
        respond(message);
    }
    confirmRequest(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: userId }, team: { id: teamId } } = payload;
                const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
                yield this.travelHelpers.processTripRequest(tripPayload, { teamId, userId }, payload.response_url);
            }
            catch (err) {
                this.bugsnagErrorHelper.log(err);
                respond(this.interactions.simpleTextResponse('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    addTripNotes(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const addNoteModal = yield this.interactions.sendAddNoteModal(payload);
            respond(addNoteModal);
        });
    }
    getLocationInfo(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(payload.user.id));
            const locationModal = yield this.interactions.sendLocationModal(payload, tripPayload);
            respond(locationModal);
        });
    }
    viewTrip(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, actions: [{ value }] } = payload;
            const action = new slack_block_models_1.ActionBlock(blocks_1.default.viewTrip).addElements([
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Done'), value, actions_1.default.viewTripDone),
            ]);
            const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(payload.user.id));
            const tripView = yield this.travelHelpers
                .createTravelSummary(tripPayload, userId, true, action);
            respond(tripView);
        });
    }
    doneViewingTrip(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, actions: [{ value }] } = payload;
            const message = this.travelHelpers.getCompletionResponse(userId, value);
            respond(message);
        });
    }
    submitContactDetails(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEdit = payload.view.callback_id === actions_1.default.submitEditedContactDetails;
                const validated = this.newSlackHelpers.modalValidator(submission, schemas_1.contactDetailsSchema);
                const { tripType, tripDetails } = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(payload.user.id));
                const tripDetailsModal = yield this.travelHelpers.getTripDetailsModal(payload, tripDetails, isEdit);
                const flightDetailsModal = yield this.travelHelpers.getFlightDetailsModal(payload, tripDetails, isEdit);
                const department = yield this.departmentService.getById(validated.department);
                yield this.cache.save(TravelTripHelper_1.getTravelKey(payload.user.id), 'contactDetails', Object.assign(Object.assign({}, validated), { department }));
                if (tripType === 'Airport Transfer') {
                    respond.update(flightDetailsModal);
                }
                else {
                    respond.update(tripDetailsModal);
                }
            }
            catch (err) {
                respond.error(err.errors);
            }
        });
    }
    submitTripDetails(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: userId } } = payload;
                const timezone = dateHelpers_1.getTimezone(context.homebase.name);
                const validationSchema = schemas_1.getTravelTripSchema(timezone);
                const validated = this.newSlackHelpers.modalValidator(submission, validationSchema);
                respond.clear();
                const preformattedDate = moment_1.default(`${validated.date} ${validated.time}`).format('DD/MM/YYYY HH:mm');
                const pickUpTime = this.utils.removeHoursFromDate(2, preformattedDate);
                const dateTime = this.dateDialogHelper.transformDate(pickUpTime, timezone);
                const embassyVisitDateTime = this.dateDialogHelper.transformDate(preformattedDate, timezone);
                yield this.cache.save(TravelTripHelper_1.getTravelKey(userId), 'tripDetails', Object.assign(Object.assign({}, validated), { dateTime, embassyVisitDateTime }));
                const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
                const tripSummary = yield this.travelHelpers.createTravelSummary(tripPayload, userId);
                const { origin: url } = JSON.parse(payload.view.private_metadata);
                yield this.updateSlackMessageHelper.sendMessage(url, tripSummary);
            }
            catch (err) {
                respond.error(err.errors);
            }
        });
    }
    submitNotes(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId } } = payload;
            const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
            yield this.cache.save(TravelTripHelper_1.getTravelKey(userId), 'tripDetails', Object.assign(Object.assign({}, tripPayload.tripDetails), { tripNotes: submission.notes }));
            respond.clear();
            const payloadWithNotes = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
            const tripSummary = yield this.travelHelpers.createTravelSummary(payloadWithNotes, userId);
            const { origin: url } = JSON.parse(payload.view.private_metadata);
            yield this.updateSlackMessageHelper.sendMessage(url, tripSummary);
        });
    }
    submitLocationInfo(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, team: { id: teamId } } = payload;
            const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
            yield this.cache.save(TravelTripHelper_1.getTravelKey(userId), 'tripDetails', Object.assign(Object.assign({}, tripPayload.tripDetails), submission));
            respond.clear();
            const payloadWithLocationInfo = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
            const { origin: url } = JSON.parse(payload.view.private_metadata);
            yield this.travelHelpers.processTripRequest(payloadWithLocationInfo, { teamId, userId }, url);
        });
    }
    submitFlightDetails(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: userId } } = payload;
                const timezone = dateHelpers_1.getTimezone(context.homebase.name);
                const flightDetailsSchema = schemas_1.getFlightDetailsSchema(timezone);
                const validatedData = this.newSlackHelpers.modalValidator(submission, flightDetailsSchema);
                respond.clear();
                const preformattedDate = moment_1.default(`${validatedData.date} ${validatedData.time}`)
                    .format('DD/MM/YYYY HH:mm');
                const pickupTime = this.utils.removeHoursFromDate(3, preformattedDate);
                const dateTime = this.dateDialogHelper.transformDate(pickupTime, timezone);
                const flightDateTime = this.dateDialogHelper.transformDate(preformattedDate, timezone);
                yield this.cache.save(TravelTripHelper_1.getTravelKey(userId), 'tripDetails', Object.assign(Object.assign({}, validatedData), { flightDateTime, dateTime }));
                const tripPayload = yield this.cache.fetch(TravelTripHelper_1.getTravelKey(userId));
                const preview = yield this.travelHelpers.createTravelSummary(tripPayload, userId);
                const { origin: url } = JSON.parse(payload.view.private_metadata);
                yield this.updateSlackMessageHelper.sendMessage(url, preview);
            }
            catch (error) {
                respond.error(error.errors);
            }
        });
    }
    handleItineraryActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { actions: [{ action_id, value }] } = payload;
            let message;
            switch (action_id) {
                case actions_1.default.viewTrip:
                    message = yield this.viewTrip(payload, respond);
                    break;
                case actions_1.default.reschedule:
                    message = yield this.rescheduleHelper.sendTripRescheduleModal(payload, value);
                    break;
                case actions_1.default.cancelTravelTrip:
                    message = yield this.travelHelpers.cancelTrip(payload, value);
                    break;
                default:
                    message = this.interactions.goodByeMessage();
            }
            if (message)
                respond(message);
        });
    }
    back(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, actions: [{ value: action }] } = payload;
            switch (action) {
                case 'back_to_launch':
                    respond(yield this.travelHelpers.getStartMessage(slackId));
                    break;
                default:
                    respond(this.interactions.simpleTextResponse('Thank you for using Tembea'));
                    break;
            }
        });
    }
}
exports.TravelTripController = TravelTripController;
const travelTripController = new TravelTripController();
exports.default = travelTripController;
//# sourceMappingURL=travel.controller.js.map