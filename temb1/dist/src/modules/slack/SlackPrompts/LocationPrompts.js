"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const navButtons_1 = __importDefault(require("../../../helpers/slack/navButtons"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
class LocationPrompts {
    static sendLocationSuggestionsResponse(staticMapUrl, predictedLocations) {
        const title = predictedLocations.length
            ? 'Locations on the map are marked in the order they appear on the list'
            : 'The location you searched for is not in the acceptable radius :disappointed:';
        const attachment = new SlackMessageModels_1.SlackAttachment('', title, '', '', predictedLocations.length ? staticMapUrl : '');
        attachment.addFieldsOrActions('actions', [
            predictedLocations.length
                ? new SlackMessageModels_1.SlackSelectAction('predictedLocations', 'Select Home location', predictedLocations)
                : new SlackMessageModels_1.SlackButtonAction('retry', 'Try Again', 'retry'),
            new SlackMessageModels_1.SlackButtonAction('no', predictedLocations.length ? 'Location not listed' : 'Enter Location Coordinates', 'no')
        ]);
        attachment.addOptionalProps(predictedLocations.length
            ? 'new_route_suggestions' : 'new_route_locationNotFound', '', '#3AAF85');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch');
        return new SlackMessageModels_1.SlackInteractiveMessage('*Select Home location*', [attachment, navAttachment]);
    }
    static sendMapSuggestionsResponse(locationData) {
        const { staticMapUrl, predictedLocations, pickupOrDestination, buttonType, tripType } = locationData;
        const errorMessage = 'Sorry, we could not find the location you entered :disappointed:. '
            + `However, :smiley: you may proceed to enter the same ${pickupOrDestination} location details`
            + ' and book the trip by pressing the button below';
        const title = 'Locations on the map are marked in the order they appear on the list';
        const attachment = new SlackMessageModels_1.SlackAttachment('', predictedLocations.length ? title : errorMessage, '', '', predictedLocations.length ? staticMapUrl : '');
        const button = new SlackMessageModels_1.SlackButtonAction('no', 'Location not listed', `no_${pickupOrDestination}`);
        const dropdown = new SlackMessageModels_1.SlackSelectAction(`${buttonType}Btn`, `${pickupOrDestination} location`, predictedLocations);
        attachment.addFieldsOrActions('actions', predictedLocations.length ? [dropdown] : [button]);
        attachment.addOptionalProps(predictedLocations.length
            ? `${tripType}_suggestions` : `${tripType}_locationNotFound`, '', '#3AAF85', 'default', buttonType);
        return new SlackMessageModels_1.SlackInteractiveMessage(`*Select your ${pickupOrDestination} location*`, [attachment]);
    }
    static errorPromptMessage(respond) {
        respond(new SlackMessageModels_1.SlackInteractiveMessage('Sorry, we could not find the location. :disappointed: Contact support for assistance.'));
    }
    static sendLocationConfirmationResponse(respond, staticMapUrl, locationName, locationGeometry) {
        const attachment = new SlackMessageModels_1.SlackAttachment('', locationName, '', '', staticMapUrl);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('confirmHome', 'Confirm home location', locationGeometry)
        ]);
        attachment.addOptionalProps('new_route_handleBusStopRoute');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('*Confirm your home location*', [attachment, navAttachment]);
        respond(message);
    }
    static sendMapsConfirmationResponse(respond, locationData, trip) {
        const { staticMapUrl, address, locationGeometry, actionType } = locationData;
        const attachment = new SlackMessageModels_1.SlackAttachment('', address, '', '', staticMapUrl);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction(`confirm${trip}`, `Confirm ${trip} location`, locationGeometry)
        ]);
        let message;
        if (trip === 'pickup') {
            attachment.addOptionalProps(`${actionType}_destinationSelection`);
            message = new SlackMessageModels_1.SlackInteractiveMessage('Confirm your pickup location', [attachment]);
        }
        else {
            attachment.addOptionalProps(`${actionType}_detailsConfirmation`);
            message = new SlackMessageModels_1.SlackInteractiveMessage('Confirm your Destination location', [attachment]);
        }
        respond(message);
    }
    static sendLocationCoordinatesNotFound(respond) {
        const title = 'The coordinates you entered do not point to any location on Google maps';
        const attachment = new SlackMessageModels_1.SlackAttachment('', title);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('no', 'Enter Google Plus Code', 'no')
        ]);
        attachment.addOptionalProps('new_route_locationNotFound', '', '#CD0000');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('Select your home location', [attachment, navAttachment]);
        respond(message);
    }
    static sendTripSuggestionsResponse(staticMapUrl, predictedLocations, locationType, buttonValue) {
        const title = 'Locations on the map are marked in the order they appear on the list';
        const attachment = new SlackMessageModels_1.SlackAttachment('', title, '', '', predictedLocations.length ? staticMapUrl : '');
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackSelectAction(`${buttonValue}Btn`, `${locationType} location`, predictedLocations),
            new SlackMessageModels_1.SlackButtonAction('no', 'Location not listed', 'no')
        ]);
        attachment.addOptionalProps(predictedLocations.length
            ? 'schedule_trip_tripSuggestions'
            : 'schedule_trip_locationNotFound', '', '#3AAF85', 'default', buttonValue);
        return new SlackMessageModels_1.SlackInteractiveMessage(`Select your ${locationType} location`, [attachment]);
    }
    static sendTravelConfirmationResponse(respond, staticMapUrl, locationName, locationGeometry, type) {
        const attachment = new SlackMessageModels_1.SlackAttachment('', locationName, '', '', staticMapUrl);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction(`confirm${type}`, `Confirm ${type} location`, locationGeometry)
        ]);
        let message;
        if (type === 'pickup') {
            attachment.addOptionalProps('schedule_trip_destinationSelection');
            message = new SlackMessageModels_1.SlackInteractiveMessage('Confirm your pickup location', [attachment]);
        }
        else {
            attachment.addOptionalProps('schedule_trip_detailsConfirmation');
            message = new SlackMessageModels_1.SlackInteractiveMessage('Confirm your Destination location', [attachment]);
        }
        respond(message);
    }
    static sendDatbaseLocationSuggestionResponse(SuggestedLocations) {
        const title = 'These are location recently used by other fellows.';
        const attachment = new SlackMessageModels_1.SlackAttachment('', title, '', '');
        attachment.addFieldsOrActions('actions', [
            SuggestedLocations.length
                ? new SlackMessageModels_1.SlackSelectAction('DatabaseSuggestions', 'Select Home location', SuggestedLocations)
                : new SlackMessageModels_1.SlackButtonAction('retry', 'Try Again', 'retry'),
            new SlackMessageModels_1.SlackButtonAction('not_listed', 'Location not listed', 'no')
        ]);
        attachment.addOptionalProps('new_route_handleBusStopRoute', '', '#3AAF85');
        const navAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch');
        return new SlackMessageModels_1.SlackInteractiveMessage('*Select Home location*', [attachment, navAttachment]);
    }
}
exports.default = LocationPrompts;
//# sourceMappingURL=LocationPrompts.js.map