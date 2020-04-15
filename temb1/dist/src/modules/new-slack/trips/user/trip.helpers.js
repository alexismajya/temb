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
const slack_block_models_1 = require("../../models/slack-block-models");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const actions_1 = __importStar(require("../user/actions"));
const blocks_1 = __importDefault(require("./blocks"));
const slack_helpers_1 = __importDefault(require("../../../new-slack/helpers/slack-helpers"));
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const user_trip_helpers_1 = __importDefault(require("./user-trip-helpers"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
exports.getWelcomeMessage = (slackId) => __awaiter(void 0, void 0, void 0, function* () {
    const welcome = 'Welcome to Tembea!';
    const homeBase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId, true);
    const homeBaseMessage = homeBase
        ? `_Your current home base is ${slackHelpers_1.default.getLocationCountryFlag(homeBase.country.name)} *${homeBase.name}*_`
        : '`Please set your location to continue`';
    const tembeaGreeting = '*I am your trip operations assistant at Andela*\nWhat would you like to do today?';
    return `${welcome}\n${homeBaseMessage}\n${tembeaGreeting}`;
});
class TripHelpers {
    static getWelcomeMessage(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const welcomeMessage = yield exports.getWelcomeMessage(slackId);
            const headerText = new slack_block_models_1.SlackText(welcomeMessage, slack_block_models_1.TextTypes.markdown);
            const header = new slack_block_models_1.Block().addText(headerText);
            const mainButtons = [
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Schedule a Trip'), 'bookNewtrip', actions_1.default.scheduleATrip, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('See Trip Itinerary'), 'viewTripsItinerary', actions_1.itineraryActions.viewTripsItinerary, SlackMessageModels_1.SlackActionButtonStyles.primary),
                new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Change Location'), 'changeLocation', actions_1.default.changeLocation, SlackMessageModels_1.SlackActionButtonStyles.primary),
                slack_helpers_1.default.getCancelButton(actions_1.default.cancel),
            ];
            const newTripBlock = new slack_block_models_1.ActionBlock(blocks_1.default.start);
            newTripBlock.addElements(mainButtons);
            const blocks = [header, newTripBlock];
            const message = new slack_block_models_1.BlockMessage(blocks);
            return message;
        });
    }
    static changeLocation(payload, customNav) {
        return __awaiter(this, void 0, void 0, function* () {
            let navigation;
            const slackId = payload.user.id;
            const homeBases = yield homebase_service_1.homebaseService.getAllHomebases(true);
            const userHomeBase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            const filteredHomeBases = homebase_service_1.homebaseService.filterHomebase(userHomeBase, homeBases);
            const headerText = new slack_block_models_1.SlackText('Please choose your current location', slack_block_models_1.TextTypes.markdown);
            const header = new slack_block_models_1.Block().addText(headerText);
            const mainBlock = filteredHomeBases.map((homeBase) => {
                const homeBaseCountryFlag = slackHelpers_1.default.getLocationCountryFlag(homeBase.country.name);
                return new slack_block_models_1.ButtonElement(`${homeBaseCountryFlag} ${homeBase.name}`, homeBase.id.toString(), `${actions_1.default.changeLocation}_${homeBase.id}`, SlackMessageModels_1.SlackActionButtonStyles.primary);
            });
            const locationBlock = new slack_block_models_1.ActionBlock(blocks_1.default.selectLocation);
            locationBlock.addElements(mainBlock);
            if (customNav)
                navigation = customNav;
            else
                navigation = user_trip_helpers_1.default.getTripNavBlock('back_to_launch');
            const blocks = [header, locationBlock, navigation];
            const message = new slack_block_models_1.BlockMessage(blocks);
            return message;
        });
    }
    static selectLocation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, actions: [{ value: homebaseId }] } = payload;
            yield user_service_1.default.updateDefaultHomeBase(slackId, Number(homebaseId));
            return TripHelpers.getWelcomeMessage(slackId);
        });
    }
}
exports.default = TripHelpers;
//# sourceMappingURL=trip.helpers.js.map