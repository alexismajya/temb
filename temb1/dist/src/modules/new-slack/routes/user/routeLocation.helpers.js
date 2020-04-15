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
const actions_1 = __importDefault(require("../actions"));
const blocks_1 = __importDefault(require("../blocks"));
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const googleMapsHelpers_1 = require("../../../../helpers/googleMaps/googleMapsHelpers");
const GoogleMapsPlaceDetails_1 = __importDefault(require("../../../../services/googleMaps/GoogleMapsPlaceDetails"));
const GoogleMapsStatic_1 = __importDefault(require("../../../../services/googleMaps/GoogleMapsStatic"));
const cache_1 = __importDefault(require("../../../shared/cache"));
class RouteLocationHelpers {
    static confirmLocationMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerText = new slack_block_models_1.MarkdownText('*Confirm your home location*');
            const heading = new slack_block_models_1.Block().addText(headerText);
            const detailsBlock = yield RouteLocationHelpers.getPlaceDetails(payload);
            const navBlock = slack_helpers_1.default.getNavBlock(blocks_1.default.navBlock, actions_1.default.back, 'back_to_routes_launch');
            const message = new slack_block_models_1.BlockMessage([heading, ...detailsBlock, navBlock]);
            return message;
        });
    }
    static getPlaceDetails(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield googleMapsHelpers_1.RoutesHelper.getReverseGeocodePayloadOnBlock(payload);
            const { geometry: { location: { lat: latitude } } } = place;
            const { geometry: { location: { lng: longitude } } } = place;
            const locationGeometry = `${latitude},${longitude}`;
            const placeDetails = yield GoogleMapsPlaceDetails_1.default.getPlaceDetails(place.place_id);
            const address = `${placeDetails.result.name}, ${placeDetails.result.formatted_address}`;
            const locationMarker = new googleMapsHelpers_1.Marker('red', 'H');
            locationMarker.addLocation(locationGeometry);
            const staticMapString = GoogleMapsStatic_1.default.getLocationScreenshot([locationMarker]);
            yield cache_1.default.save(payload.user.id, 'homeAddress', { address, latitude, longitude });
            const homeLocation = new slack_block_models_1.Block().addText(new slack_block_models_1.MarkdownText(`*${address}*`));
            const imageBlock = new slack_block_models_1.ImageBlock('Map route', staticMapString, 'Map route');
            const confirmButton = [new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Confirm home location'), locationGeometry, actions_1.default.confirmLocation, SlackMessageModels_1.SlackActionButtonStyles.primary)];
            const confirmLocAction = new slack_block_models_1.ActionBlock(blocks_1.default.confirmHomeLocation);
            confirmLocAction.addElements(confirmButton);
            return [homeLocation, imageBlock, confirmLocAction];
        });
    }
}
exports.default = RouteLocationHelpers;
//# sourceMappingURL=routeLocation.helpers.js.map