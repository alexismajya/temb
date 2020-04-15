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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slack_block_models_1 = require("../models/slack-block-models");
const slack_helpers_1 = __importStar(require("./slack-helpers"));
const locationsMapHelpers_1 = __importDefault(require("../../../helpers/googleMaps/locationsMapHelpers"));
const cache_1 = __importDefault(require("../../shared/cache"));
const address_service_1 = require("../../addresses/address.service");
const ScheduleTripInputHandlers_1 = require("../../../helpers/slack/ScheduleTripInputHandlers");
const googleMapsHelpers_1 = require("../../../helpers/googleMaps/googleMapsHelpers");
const user_service_1 = __importDefault(require("../../users/user.service"));
const SlackMessageModels_1 = require("../../slack/SlackModels/SlackMessageModels");
const blocks_1 = __importDefault(require("../routes/blocks"));
const actions_1 = __importDefault(require("../routes/actions"));
exports.getPredictionsKey = (userId) => `TRIP_LOCATION_PREDICTIONS_${userId}`;
class NewLocationHelpers {
    static createLocationConfirmMsg(details, { selectBlockId, selectActionId, navBlockId, navActionId, backActionValue }) {
        const header = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
            .addText(new slack_block_models_1.MarkdownText('Please confirm your location'));
        const imgBlock = new slack_block_models_1.ImageBlock('Map', details.url, 'Select Map Location');
        const mapBlock = new slack_block_models_1.ActionBlock(selectBlockId);
        const selectPlace = new slack_block_models_1.SelectElement(slack_block_models_1.ElementTypes.staticSelect, 'Select the nearest location', selectActionId);
        const places = slack_helpers_1.default.toSlackDropdown(details.predictions, {
            text: 'description', value: 'place_id'
        });
        selectPlace.addOptions(places);
        const locationNotListed = new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Location not listed'), 'notListedLoc', actions_1.default.locationNotFound, SlackMessageModels_1.SlackActionButtonStyles.primary);
        if (selectBlockId === blocks_1.default.confirmLocation) {
            mapBlock.addElements([selectPlace, locationNotListed]);
        }
        else {
            mapBlock.addElements([selectPlace]);
        }
        const navigation = slack_helpers_1.default.getNavBlock(navBlockId, navActionId, backActionValue);
        const message = new slack_block_models_1.BlockMessage([header, imgBlock, mapBlock, slack_helpers_1.sectionDivider, navigation]);
        return message;
    }
    static getLocationVerificationMsg(location, userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { homebase: { name } } = yield user_service_1.default.getUserBySlackId(userId);
            const final = {};
            const details = yield locationsMapHelpers_1.default.getPredictionsOnMap(location, name);
            if (!details) {
                return false;
            }
            yield details.predictions.map((prediction) => {
                final[prediction.description] = prediction.place_id;
            });
            yield cache_1.default.saveObject(exports.getPredictionsKey(userId), final);
            return this.createLocationConfirmMsg(details, options);
        });
    }
    static getCoordinates(location) {
        return __awaiter(this, void 0, void 0, function* () {
            const coordinates = location !== 'Others'
                ? yield address_service_1.addressService.findCoordinatesByAddress(location) : null;
            return coordinates;
        });
    }
    static getDestinationCoordinates(userId, { destination, othersDestination }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripData = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(userId));
            const tripDetails = Object.assign({}, tripData);
            const destinationCoords = yield this.getCoordinates(destination);
            if (destinationCoords) {
                const { id, location: { longitude, latitude } } = destinationCoords;
                tripDetails.destinationLat = latitude;
                tripDetails.destinationLong = longitude;
                tripDetails.destinationId = id;
            }
            tripDetails.destination = destination;
            tripDetails.othersDestination = othersDestination;
            return tripDetails;
        });
    }
    static handleLocationVerfication(placeIds, location) {
        return __awaiter(this, void 0, void 0, function* () {
            const pickupCoords = yield googleMapsHelpers_1.RoutesHelper
                .getAddressDetails('placeId', placeIds[location]);
            return pickupCoords.results[0].geometry.location;
        });
    }
    static updateLocation(type, userId, placeId, latitude, longitude, location) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripData = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(userId));
            tripData[`${type}Lat`] = latitude;
            tripData[`${type}Long`] = longitude;
            tripData[`${type}Id`] = placeId;
            tripData[type] = location;
            return tripData;
        });
    }
}
exports.default = NewLocationHelpers;
//# sourceMappingURL=location-helpers.js.map