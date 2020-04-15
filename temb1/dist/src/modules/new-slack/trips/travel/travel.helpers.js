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
const moment_1 = __importDefault(require("moment"));
const blocks_1 = __importDefault(require("./blocks"));
const actions_1 = __importDefault(require("./actions"));
const actions_2 = __importDefault(require("../user/actions"));
const slack_block_models_1 = require("../../models/slack-block-models");
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const TravelTripHelper_1 = require("../../../slack/helpers/slackHelpers/TravelTripHelper");
const trip_request_1 = require("../../../../database/models/trip-request");
const travel_events_handlers_1 = require("../../../events/travel-events.handlers");
const dateHelpers_1 = require("../../../slack/helpers/dateHelpers");
const address_service_1 = require("../../../addresses/address.service");
const slack_helpers_1 = __importStar(require("../../helpers/slack-helpers"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const cache_1 = __importDefault(require("../../../shared/cache"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const trip_detail_service_1 = __importDefault(require("../../../trips/trip-detail.service"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const app_event_service_1 = __importDefault(require("../../../events/app-event.service"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const travel_edit_helpers_1 = __importDefault(require("../../helpers/travel-edit-helpers"));
const travel_helpers_1 = __importDefault(require("../../helpers/travel-helpers"));
class TravelHelpers {
    constructor(addressService = address_service_1.addressService, newSlackHelpers = slack_helpers_1.default, homebaseService = homebase_service_1.homebaseService, slackHelpers = slackHelpers_1.default, cache = cache_1.default, tripService = trip_service_1.default, teamDetailsService = teamDetails_service_1.teamDetailsService, tripDetailsService = trip_detail_service_1.default, userService = user_service_1.default, appEvents = app_event_service_1.default, updateSlackMessageHelper = updatePastMessageHelper_1.default) {
        this.addressService = addressService;
        this.newSlackHelpers = newSlackHelpers;
        this.homebaseService = homebaseService;
        this.slackHelpers = slackHelpers;
        this.cache = cache;
        this.tripService = tripService;
        this.teamDetailsService = teamDetailsService;
        this.tripDetailsService = tripDetailsService;
        this.userService = userService;
        this.appEvents = appEvents;
        this.updateSlackMessageHelper = updateSlackMessageHelper;
        this.createTripRequest = (tripPayload, opts) => __awaiter(this, void 0, void 0, function* () {
            const details = this.getDetailsFromPayload(tripPayload);
            const { id: detailsId } = yield this.tripDetailsService.createDetails(details);
            const tripRequest = this.getRequestPropsFromPayload(tripPayload, detailsId, opts);
            return this.tripService.createRequest(tripRequest);
        });
        this.getWelcomeMessage = (slackId) => __awaiter(this, void 0, void 0, function* () {
            const welcome = 'Welcome to Tembea! :tembea';
            const homeBaseMessage = yield this.newSlackHelpers.getHomeBaseMessage(slackId);
            const tembeaGreeting = '*I am your trip operations assistant at Andela*\nWhat would you like to do today?';
            return `${welcome}\n${homeBaseMessage}\n${tembeaGreeting}`;
        });
        this.getRequestPropsFromPayload = (tripPayload, detailsId, opts) => ({
            tripDetailId: detailsId,
            tripType: tripPayload.tripType,
            tripStatus: trip_request_1.TripStatus.pending,
            name: `From ${tripPayload.tripDetails.pickup} to ${tripPayload.tripDetails.destination} on `
                + `${tripPayload.tripDetails.dateTime}`,
            noOfPassengers: tripPayload.contactDetails.passengers,
            reason: tripPayload.tripDetails.reason,
            departureTime: tripPayload.tripDetails.dateTime,
            tripNote: tripPayload.tripDetails.tripNotes,
            riderId: opts.rider.id,
            departmentId: tripPayload.contactDetails.department.id,
            requestedById: opts.requester.id,
            homebaseId: opts.requester.homebase.id,
            originId: opts.origin.id,
            destinationId: opts.destination.id,
            distance: '',
        });
        this.getDetailsFromPayload = (payload) => ({
            riderPhoneNo: payload.contactDetails.riderPhoneNo,
            travelTeamPhoneNo: payload.contactDetails.travelTeamPhoneNo,
            flightNumber: payload.tripDetails.flightNumber,
        });
    }
    getStartMessage(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const welcomeMessage = yield this.getWelcomeMessage(slackId);
            const headerText = new slack_block_models_1.SlackText(welcomeMessage, slack_block_models_1.TextTypes.markdown);
            const header = new slack_block_models_1.Block().addText(headerText);
            const mainButtons = [
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Airport Transfer'), 'airportTransfer', actions_1.default.airportTransfer, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Embassy Visit'), 'embassyVisit', actions_1.default.embassyVisit, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Change Location'), 'changeLocation', actions_1.default.changeLocation, SlackMessageModels_1.SlackActionButtonStyles.primary),
                this.newSlackHelpers.getCancelButton(actions_2.default.cancel),
            ];
            const newTripBlock = new slack_block_models_1.ActionBlock(blocks_1.default.start);
            newTripBlock.addElements(mainButtons);
            const blocks = [header, newTripBlock];
            const message = new slack_block_models_1.BlockMessage(blocks);
            return message;
        });
    }
    getTripDetailsModal(payload, tripDetails, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [cachedDate, cachedPickup, cachedDestination, cachedTime, cachedReason,] = travel_edit_helpers_1.default.checkIsEditTripDetails(tripDetails, isEdit);
            const { destinationSelect, pickupSelect, } = yield this.getTripDetailsSelects(payload, cachedPickup, cachedDestination, isEdit);
            const defaultDate = moment_1.default().format('YYYY-MM-DD');
            const destination = new slack_block_models_1.InputBlock(destinationSelect, 'Destination', 'destination');
            const pickup = new slack_block_models_1.InputBlock(pickupSelect, 'Pickup Location', 'pickup');
            const appointmentDate = new slack_block_models_1.InputBlock(new slack_block_models_1.DatePicker(isEdit ? cachedDate : defaultDate, 'select a date', 'date'), 'Interview Date', 'date');
            const appointmentTime = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('HH:mm', 'time', false, isEdit ? cachedTime : ''), 'Interview Time', 'time');
            const textarea = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter reason for booking the trip', 'reason', true, isEdit ? cachedReason : ''), 'Reason', 'reason');
            return new slack_block_models_1.Modal(isEdit ? 'Edit Trip Details' : 'Trip Details', {
                submit: 'Submit',
                close: 'Cancel',
            }).addBlocks([pickup, destination, appointmentDate, appointmentTime, textarea])
                .addCallbackId(actions_1.default.submitTripDetails)
                .addMetadata(payload.view.private_metadata);
        });
    }
    createTravelSummary(tripPayload, userSlackId, useActions, customActions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tripType } = tripPayload;
            const header = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('*Trip request preview*'));
            const [trip, hoursBefore] = tripType === 'Airport Transfer'
                ? ['flight', 3] : ['appointment', 2];
            const NB = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(`*N.B.* Pickup time is fixed at ${hoursBefore} hrs before ${trip} time`));
            const contactInfo = this.createContactInfoBlock(userSlackId, tripPayload);
            const tripInfo = this.createTripInfoBlock(tripPayload);
            let actions;
            const actionBlock = travel_edit_helpers_1.default.createTravelSummaryMenu(tripPayload, tripType);
            actions = useActions ? customActions : actionBlock;
            return new slack_block_models_1.BlockMessage([header, NB, slack_helpers_1.sectionDivider, contactInfo, tripInfo, actions], '', `Hello, <@${userSlackId}>, here is your trip preview`);
        });
    }
    processTripRequest(tripPayload, opts, responseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingLocation = 'To Be Decided';
            const botToken = yield this.teamDetailsService.getTeamDetailsBotOauthToken(opts.teamId);
            const { contactDetails: { rider: userSlackId }, tripDetails: { destination, pickup }, } = tripPayload;
            if (destination === pendingLocation || pickup === pendingLocation) {
                const confimLocationMessage = this.sendRiderlocationConfirmNotification(tripPayload);
                yield this.updateSlackMessageHelper.sendMessage(responseUrl, confimLocationMessage);
            }
            else {
                const [requester, rider, destinazion, origin] = yield Promise.all([
                    yield this.userService.getUserBySlackId(opts.userId),
                    yield this.userService.getUserBySlackId(userSlackId),
                    yield this.addressService.findOrCreateAddress(destination),
                    yield this.addressService.findOrCreateAddress(pickup),
                ]);
                const trip = yield this.createTripRequest(tripPayload, {
                    requester,
                    rider,
                    origin,
                    destination: destinazion,
                });
                const completionMessage = this.getCompletionResponse(userSlackId, trip.id);
                yield this.updateSlackMessageHelper.sendMessage(responseUrl, completionMessage);
                const tripDetailsWithId = Object.assign(Object.assign({}, tripPayload.tripDetails), { id: trip.id });
                yield this.cache.save(TravelTripHelper_1.getTravelKey(userSlackId), 'tripDetails', tripDetailsWithId);
                this.appEvents.broadcast({
                    name: travel_events_handlers_1.TravelEvents.travelCompletedNewTrip,
                    data: {
                        botToken,
                        data: trip,
                    },
                });
            }
        });
    }
    sendRiderlocationConfirmNotification(data) {
        const { contactDetails: { rider }, tripDetails: { pickup, destination } } = data;
        const pendingLocation = 'To Be Decided';
        let header;
        if (pickup === pendingLocation && destination !== pendingLocation) {
            header = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('Please confirm your *pickup* location'));
        }
        else if (pickup !== pendingLocation && destination === pendingLocation) {
            header = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('Please confirm your *destination* location'));
        }
        else {
            header = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText('Please confirm your *pickup* and *destination* locations'));
        }
        const actions = new slack_block_models_1.ActionBlock(blocks_1.default.confirmLocation).addElements([
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Submit destination'), 'destination', actions_1.default.submitDestination),
            new slack_block_models_1.CancelButtonElement('Cancel Travel Request', 'cancel', actions_1.default.cancel, {
                title: 'Are you sure?',
                description: 'Are you sure you want to cancel this travel request',
                confirmText: 'Yes',
                denyText: 'No',
            }),
        ]);
        const message = new slack_block_models_1.BlockMessage([header, actions], '', `<@${rider}>,
    please complete location information for your requested trip`);
        return message;
    }
    createContactInfoBlock(userSlackId, payload) {
        return new slack_block_models_1.SectionBlock().addFields([
            new slack_block_models_1.MarkdownText(`*Passenger*\n<@${userSlackId}>`),
            new slack_block_models_1.MarkdownText(`*Passenger\'s Phone Number*\n${payload.contactDetails.riderPhoneNo}`),
            new slack_block_models_1.MarkdownText(`*Department*\n${payload.contactDetails.department.name}`),
            new slack_block_models_1.MarkdownText(`*Number of Passengers*\n${payload.contactDetails.passengers}`),
            new slack_block_models_1.MarkdownText(`*Travel Team Phone Number*\n${payload.contactDetails.travelTeamPhoneNo}`),
        ]);
    }
    createTripInfoBlock(payload) {
        const { tripType, tripDetails } = payload;
        const timeFieldName = `${tripType === 'Airport Transfer' ? 'Flight' : 'Appointment'} Time`;
        const travelDateTime = tripDetails.flightDateTime || tripDetails.embassyVisitDateTime;
        const fields = [
            new slack_block_models_1.MarkdownText(`*Trip Type*\n${tripType}`),
            new slack_block_models_1.MarkdownText(`*Pickup Location*\n${tripDetails.pickup}`),
            new slack_block_models_1.MarkdownText(`*Destination*\n${tripDetails.destination}`),
            new slack_block_models_1.MarkdownText(`*Pickup Time*\n${dateHelpers_1.checkBeforeSlackDateString(tripDetails.dateTime)}`),
            new slack_block_models_1.MarkdownText(`*${timeFieldName}*\n${dateHelpers_1.checkBeforeSlackDateString(travelDateTime)}`),
            new slack_block_models_1.MarkdownText(`*Trip Notes*\n${tripDetails.tripNotes || 'No trip notes'}`),
        ];
        if (tripDetails.flightNumber)
            fields.push(new slack_block_models_1.MarkdownText(`*Flight Number* \n${tripDetails.flightNumber}`));
        return new slack_block_models_1.SectionBlock().addFields(fields);
    }
    getTripDetailsSelects(payload, cachedPickup, cachedDestination, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const chosenDestination = travel_edit_helpers_1.default.generateSelectedOption(cachedDestination);
            const chosenPickup = travel_edit_helpers_1.default.generateSelectedOption(cachedPickup);
            const destinationSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.externalSelect, 'Select an embassy', 'destination', isEdit ? chosenDestination[0] : null);
            const pickupSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.externalSelect, 'Select a pickup location', 'pickup', isEdit ? chosenPickup[0] : null);
            return { destinationSelect, pickupSelect };
        });
    }
    changeLocation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const slackId = payload.user.id;
            const homeBases = yield this.homebaseService.getAllHomebases(true);
            const userHomeBase = yield this.homebaseService.getHomeBaseBySlackId(slackId);
            const filteredHomeBases = this.homebaseService.filterHomebase(userHomeBase, homeBases);
            const headerText = new slack_block_models_1.SlackText('Please choose your current location', slack_block_models_1.TextTypes.markdown);
            const header = new slack_block_models_1.Block().addText(headerText);
            const mainBlock = filteredHomeBases.map((homeBase) => {
                const homeBaseCountryFlag = this.slackHelpers.getLocationCountryFlag(homeBase.country.name);
                return new slack_block_models_1.ButtonElement(`${homeBaseCountryFlag} ${homeBase.name}`, homeBase.id.toString(), `${actions_1.default.changeLocation}_${homeBase.id}`, SlackMessageModels_1.SlackActionButtonStyles.primary);
            });
            const locationBlock = new slack_block_models_1.ActionBlock(blocks_1.default.selectLocation);
            locationBlock.addElements(mainBlock);
            const navigation = this.getTripNavBlock('back_to_launch');
            const blocks = [header, locationBlock, navigation];
            const message = new slack_block_models_1.BlockMessage(blocks);
            return message;
        });
    }
    getTripNavBlock(value) {
        return this.newSlackHelpers.getNavBlock(blocks_1.default.navBlock, actions_1.default.back, value);
    }
    selectLocation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, actions: [{ value: homebaseId }] } = payload;
            yield this.userService.updateDefaultHomeBase(slackId, Number(homebaseId));
            return this.getStartMessage(slackId);
        });
    }
    getFlightDetailsModal(payload, tripDetails, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [cachedDate, cachedFlightNumber, cachedTime, cachedPickup, cachedDestination, cachedReason,] = travel_edit_helpers_1.default.checkIsEditFlightDetails(tripDetails, isEdit);
            const { pickupSelect, destinationSelect } = yield this.getDestinationSelection(payload, cachedPickup, cachedDestination, isEdit);
            const [pickup, destination, flightNumber, flightDate, time, textarea,] = travel_helpers_1.default.generateFlightDetailsModal(isEdit, pickupSelect, destinationSelect, cachedFlightNumber, cachedDate, cachedTime, cachedReason);
            return new slack_block_models_1.Modal(isEdit ? 'Edit Flight Details' : 'Flight Details', {
                submit: 'Submit',
                close: 'Cancel',
            }).addBlocks([flightNumber, flightDate, time, pickup, destination, textarea])
                .addCallbackId(actions_1.default.submitFlightDetails)
                .addMetadata(payload.view.private_metadata);
        });
    }
    getDestinationSelection(payload, cachedPickup, cachedDestination, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId } } = payload;
            const homebase = yield this.homebaseService.getHomeBaseBySlackId(userId);
            const addresses = yield this.addressService.getAddressListByHomebase(homebase.name);
            const toBeDecidedOption = { text: new slack_block_models_1.SlackText('Decide later'), value: 'To Be Decided' };
            const chosenDestination = travel_edit_helpers_1.default.generateSelectedOption(cachedDestination);
            const chosenPickup = travel_edit_helpers_1.default.generateSelectedOption(cachedPickup);
            const pickupSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.externalSelect, 'Select a pickup location', 'pickup', isEdit ? chosenPickup[0] : null);
            const destinationSelect = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select destination', 'destination', isEdit ? chosenDestination[0] : null);
            destinationSelect.addOptions([toBeDecidedOption,
                ...addresses.map((address) => ({
                    text: new slack_block_models_1.SlackText(address), value: address,
                }))]);
            return { pickupSelect, destinationSelect };
        });
    }
    getCompletionResponse(riderId, tripId) {
        const headerText = new slack_block_models_1.MarkdownText(`Success! Trip request for <@${riderId}> has been submitted.`);
        const header = new slack_block_models_1.SectionBlock().addText(headerText);
        const actionButtons = new slack_block_models_1.ActionBlock(blocks_1.default.bookedTrip).addElements([new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('View'), `${tripId}`, actions_1.default.viewTrip, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Reschedule'), `${tripId}`, actions_1.default.reschedule, SlackMessageModels_1.SlackActionButtonStyles.primary),
            new slack_block_models_1.CancelButtonElement('Cancel Trip', `${tripId}`, actions_1.default.cancelTravelTrip, {
                title: 'Are you sure?',
                description: 'Are you sure you want to cancel this trip?',
                confirmText: 'Yes',
                denyText: 'No',
            }),
            this.newSlackHelpers.getCancelButton(actions_1.default.cancel),
        ]);
        const message = new slack_block_models_1.BlockMessage([header, actionButtons]);
        return message;
    }
    cancelTrip(payload, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            try {
                const trip = yield this.tripService.getById(Number(tripId), true);
                if (!trip) {
                    message = 'Trip not found';
                }
                else {
                    yield this.tripService.updateRequest(tripId, { tripStatus: 'Cancelled' });
                    const { origin: { address: originAddress }, destination: { address: destinationAdress }, } = trip;
                    message = `Success! Your Trip request from ${originAddress} to ${destinationAdress} has been cancelled`;
                    this.appEvents.broadcast({
                        name: travel_events_handlers_1.TravelEvents.travelCancelledByRider,
                        data: { data: { payload, trip } },
                    });
                }
            }
            catch (error) {
                message = `Request could not be processed, ${error.message}`;
            }
            return new slack_block_models_1.MarkdownText(message);
        });
    }
}
exports.TravelHelpers = TravelHelpers;
const travelHelpers = new TravelHelpers();
exports.default = travelHelpers;
//# sourceMappingURL=travel.helpers.js.map