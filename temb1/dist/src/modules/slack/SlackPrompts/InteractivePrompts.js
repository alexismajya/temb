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
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const Notifications_1 = __importDefault(require("./Notifications"));
const WebClientSingleton_1 = __importDefault(require("../../../utils/WebClientSingleton"));
const navButtons_1 = __importDefault(require("../../../helpers/slack/navButtons"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const previewTripDetailsAttachment_1 = __importDefault(require("../helpers/slackHelpers/TravelTripHelper/previewTripDetailsAttachment"));
const previewScheduleTripAttachments_1 = __importDefault(require("../helpers/slackHelpers/previewScheduleTripAttachments"));
const homebase_service_1 = require("../../homebases/homebase.service");
class InteractivePrompts {
    static sendBookNewTripResponse(payload, respond) {
        const attachment = new SlackMessageModels_1.SlackAttachment();
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('yes', 'For Me', 'true'),
            new SlackMessageModels_1.SlackButtonAction('no', 'For Someone', 'false')
        ]);
        attachment.addOptionalProps('book_new_trip');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_launch');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('Who are you booking for?', [
            attachment, navAttachment
        ]);
        respond(message);
    }
    static changeLocation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const origin = payload.actions[0].name.split('__')[1];
            const slackId = payload.user.id;
            const state = { origin };
            const attachment = new SlackMessageModels_1.SlackAttachment();
            const homeBases = yield homebase_service_1.homebaseService.getAllHomebases(true);
            const userHomeBase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            const filteredHomeBases = userHomeBase ? homeBases.filter((currentHomeBase) => currentHomeBase.name !== userHomeBase.name) : homeBases;
            attachment.addFieldsOrActions('actions', filteredHomeBases.map((homeBase) => {
                const homeBaseCountryFlag = slackHelpers_1.default.getLocationCountryFlag(homeBase.country.name);
                return new SlackMessageModels_1.SlackButtonAction(homeBase.id.toString(), `${homeBaseCountryFlag} ${homeBase.name}`, JSON.stringify(state));
            }));
            attachment.addOptionalProps('change_location', 'fallback', '#FFCCAA', 'default');
            const fallBack = origin ? `back_to_${origin}_launch` : 'back_to_launch';
            const navAttachment = navButtons_1.default('back_to_launch', fallBack);
            const message = new SlackMessageModels_1.SlackInteractiveMessage('Please choose your current location', [
                attachment, navAttachment
            ]);
            respond(message);
        });
    }
    static sendTripItinerary(payload, respond) {
        const attachment = new SlackMessageModels_1.SlackAttachment();
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('history', 'Trip History', 'view_trips_history'),
            new SlackMessageModels_1.SlackButtonAction('upcoming', 'Upcoming Trips ', 'view_upcoming_trips')
        ]);
        attachment.addOptionalProps('trip_itinerary', 'fallback', '#FFCCAA', 'default');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_launch');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('*Please choose an option*', [
            attachment, navAttachment
        ]);
        respond(message);
    }
    static sendManagerDeclineOrApprovalCompletion(decline, tripInformation, timeStamp, channel, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requester } = tripInformation;
            const attachments = [
                new SlackMessageModels_1.SlackAttachment(decline ? 'Trip Declined' : 'Trip Approved'),
                new SlackMessageModels_1.SlackAttachment(decline
                    ? ':x: You have declined this trip'
                    : ':white_check_mark: You have approved this trip')
            ];
            const fields = Notifications_1.default.notificationFields(tripInformation);
            attachments[0].addOptionalProps('callback');
            attachments[1].addOptionalProps('callback');
            attachments[0].addFieldsOrActions('fields', fields);
            yield InteractivePrompts.messageUpdate(channel, (decline
                ? `You have just declined the trip from <@${requester.slackId}>`
                : `You have just approved the trip from <@${requester.slackId}>`), timeStamp, attachments, slackBotOauthToken);
        });
    }
    static messageUpdate(channel, text, timeStamp, attachments, slackBotOauthToken, blocks) {
        return __awaiter(this, void 0, void 0, function* () {
            yield WebClientSingleton_1.default.getWebClient(slackBotOauthToken).chat.update({
                channel,
                text,
                ts: timeStamp,
                attachments,
                blocks
            });
        });
    }
    static sendRiderSelectList(payload, respond) {
        const attachments = new SlackMessageModels_1.SlackAttachment();
        attachments.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackSelectActionWithSlackContent('rider', 'Select a passenger')
        ]);
        attachments.addOptionalProps('schedule_trip_rider');
        const navAttachment = navButtons_1.default('welcome_message', 'book_new_trip');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('Who are you booking the ride for?', [attachments, navAttachment], payload.channel.id, payload.user.id);
        respond(message);
    }
    static sendAddPassengersResponse(respond, forSelf = 'true') {
        const attachment = new SlackMessageModels_1.SlackAttachment();
        const passengerNumbers = slackHelpers_1.default.noOfPassengers();
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackSelectAction('addPassenger', 'No. of passengers', passengerNumbers),
            new SlackMessageModels_1.SlackButtonAction('no', 'No', 1)
        ]);
        attachment.addOptionalProps('schedule_trip_addPassengers');
        const navAttachment = navButtons_1.default(forSelf === 'true'
            ? 'welcome_message' : 'schedule_trip_reason', 'book_new_trip');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('Any more passengers?', [attachment, navAttachment]);
        respond(message);
    }
    static sendSelectDestination(respond) {
        const attachment = new SlackMessageModels_1.SlackAttachment();
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('selectDestination', 'Destination', 'true'),
        ]);
        const navAttachment = navButtons_1.default('schedule_trip_addPassengers', 'called_back_button');
        attachment.addOptionalProps('schedule_trip_destinationSelection');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('*Select Destination*', [
            attachment, navAttachment
        ]);
        respond(message);
    }
    static sendPreviewTripResponse(tripDetails) {
        const hoursBefore = tripDetails.tripType === 'Airport Transfer' ? 3 : 2;
        const tripType = tripDetails.tripType === 'Airport Transfer' ? 'flight' : 'appointment';
        const attachment = new SlackMessageModels_1.SlackAttachment('', `N.B. Pickup time is fixed at ${hoursBefore}hrs before ${tripType} time`, '', '', '', 'default', 'warning');
        const fields = previewTripDetailsAttachment_1.default(tripDetails);
        const actions = [
            new SlackMessageModels_1.SlackButtonAction('confirmTripRequest', 'Confirm Trip Request', 'confirm'),
            new SlackMessageModels_1.SlackButtonAction('Add Trip Note', tripDetails.tripNote ? 'Update Trip Note'
                : 'Add Trip Note', tripDetails.tripNote ? 'update_note' : 'trip_note'),
            new SlackMessageModels_1.SlackCancelButtonAction('Cancel Trip Request', 'cancel', 'Are you sure you want to cancel this trip request', 'cancel_request'),
        ];
        attachment.addFieldsOrActions('actions', actions);
        attachment.addFieldsOrActions('fields', fields);
        attachment.addOptionalProps('travel_trip_confirmation', 'fallback', undefined, 'default');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('*Trip request preview*', [
            attachment
        ]);
        return message;
    }
    static sendScheduleTripResponse(tripDetails, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = yield previewScheduleTripAttachments_1.default.previewScheduleTripAttachments(tripDetails);
            const attachment = new SlackMessageModels_1.SlackAttachment('', 'Trip Summary', '', '', '', 'default', 'info');
            const actions = [
                new SlackMessageModels_1.SlackButtonAction('confirmTripRequest', 'Confirm Trip', 'confirm'),
                new SlackMessageModels_1.SlackCancelButtonAction('Cancel Trip', 'cancel', 'Are you sure you want to cancel this schedule trip', 'cancel_request')
            ];
            const message = new SlackMessageModels_1.SlackInteractiveMessage('*Trip request preview*', [
                attachment
            ]);
            attachment.addFieldsOrActions('actions', actions);
            attachment.addFieldsOrActions('fields', fields);
            attachment.addOptionalProps('schedule_trip_confirmation', 'fallback', undefined, 'default');
            respond(message);
        });
    }
}
exports.default = InteractivePrompts;
//# sourceMappingURL=InteractivePrompts.js.map