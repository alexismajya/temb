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
const SlackMessageModels_1 = require("./SlackModels/SlackMessageModels");
const slackValidations_1 = require("./helpers/slackHelpers/slackValidations");
const slack_block_models_1 = require("../new-slack/models/slack-block-models");
const WebClientSingleton_1 = __importDefault(require("../../utils/WebClientSingleton"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const homebase_service_1 = require("../homebases/homebase.service");
const address_service_1 = require("../addresses/address.service");
const slackHelpers_1 = __importDefault(require("../../helpers/slack/slackHelpers"));
const user_service_1 = __importDefault(require("../users/user.service"));
const route_service_1 = require("../routes/route.service");
const routeBatch_service_1 = require("../routeBatches/routeBatch.service");
const route_events_handlers_1 = __importDefault(require("../events/route-events.handlers"));
const slack_helpers_1 = __importDefault(require("../new-slack/helpers/slack-helpers"));
const travel_helpers_ts_1 = __importDefault(require("../new-slack/trips/travel/travel.helpers.ts"));
class SlackController {
    static launch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { user_id: slackId } } = req;
            const message = yield SlackController.getWelcomeMessage(slackId);
            return res.status(200).json(message);
        });
    }
    static greetings() {
        return new SlackMessageModels_1.SlackAttachment('I am your trip operations assistant at Andela', 'What would you like to do today?', 'Tembea', '', '');
    }
    static createChangeLocationBtn(callback) {
        return new SlackMessageModels_1.SlackButtonAction(`changeLocation${callback ? '__'.concat(callback) : ''}`, 'Change Location', 'change_location');
    }
    static getHomeBaseMessage(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId, true);
            const homeBaseMessage = homeBase
                ? `_Your current home base is ${slackHelpers_1.default.getLocationCountryFlag(homeBase.country.name)} *${homeBase.name}*_`
                : '`Please set your location to continue`';
            return homeBaseMessage;
        });
    }
    static getWelcomeMessage(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = SlackController.greetings();
            const homeBaseMessage = yield SlackController.getHomeBaseMessage(slackId);
            const actions = homeBaseMessage !== '`Please set your location to continue`' ? [
                new SlackMessageModels_1.SlackButtonAction('book', 'Schedule a Trip', 'book_new_trip'),
                new SlackMessageModels_1.SlackButtonAction('view', 'See Trip Itinerary', 'view_trips_itinerary')
            ] : [];
            attachment.addFieldsOrActions('actions', [
                ...actions,
                SlackController.createChangeLocationBtn(''),
                new SlackMessageModels_1.SlackCancelButtonAction()
            ]);
            attachment.addOptionalProps('welcome_message', '/fallback', '#3AA3E3');
            return new SlackMessageModels_1.SlackInteractiveMessage(`Welcome to Tembea! \n ${homeBaseMessage}`, [attachment]);
        });
    }
    static getTravelCommandMsg(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBaseMessage = yield SlackController.getHomeBaseMessage(slackId);
            const attachment = SlackController.greetings();
            const actions = homeBaseMessage !== '`Please set your location to continue`'
                ? [new SlackMessageModels_1.SlackButtonAction('Airport Transfer', 'Airport Transfer', 'airport_transfer'),
                    new SlackMessageModels_1.SlackButtonAction('Embassy Visit', 'Embassy Visit', 'embassy_visit'),
                ] : [];
            attachment.addFieldsOrActions('actions', [
                ...actions,
                SlackController.createChangeLocationBtn('travel'),
                new SlackMessageModels_1.SlackCancelButtonAction()
            ]);
            attachment.addOptionalProps('travel_trip_start', '/fallback', '#3AA3E3');
            return new SlackMessageModels_1.SlackInteractiveMessage(`Welcome to Tembea! \n ${homeBaseMessage}`, [attachment]);
        });
    }
    static getRouteCommandMsg(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBaseMessage = yield SlackController.getHomeBaseMessage(slackId);
            if (!homeBaseMessage.includes('Nairobi') && homeBaseMessage !== '`Please set your location to continue`') {
                return new SlackMessageModels_1.SlackInteractiveMessage('>*`The route functionality is not supported for your current location`*'
                    .concat('\nThank you for using Tembea! See you again.'));
            }
            const attachment = SlackController.greetings();
            const actions = homeBaseMessage !== '`Please set your location to continue`'
                ? [
                    new SlackMessageModels_1.SlackButtonAction('My Current Route', 'My Current Route', 'my_current_route'),
                    new SlackMessageModels_1.SlackButtonAction('Request New Route', 'Request New Route', 'request_new_route'),
                    new SlackMessageModels_1.SlackButtonAction('See Available Routes', 'See Available Routes', 'view_available_routes'),
                ] : [];
            attachment.addFieldsOrActions('actions', [
                ...actions,
                SlackController.createChangeLocationBtn('routes'),
                new SlackMessageModels_1.SlackCancelButtonAction()
            ]);
            attachment.addOptionalProps('tembea_route', '/fallback', '#3AA3E3');
            return new SlackMessageModels_1.SlackInteractiveMessage(`Welcome to Tembea! \n ${homeBaseMessage}`, [attachment]);
        });
    }
    static handleSlackCommands(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { text, user_id: slackId, team_id: teamId } } = req;
            yield slackHelpers_1.default.findOrCreateUserBySlackId(slackId, teamId);
            if (!text)
                return next();
            if (slackValidations_1.isSlackSubCommand((text.toLowerCase()), 'route')) {
                const response = yield SlackController.getRouteCommandMsg(slackId);
                res.status(200)
                    .json(response);
            }
            else if (slackValidations_1.isSlackSubCommand((text.toLowerCase()), 'travel')) {
                const response = yield travel_helpers_ts_1.default.getStartMessage(slackId);
                res.status(200)
                    .json(response);
            }
        });
    }
    static getChannels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query: { type = 'private_channel' } } = req;
                const { locals: { botToken } } = res;
                const { channels } = yield WebClientSingleton_1.default
                    .getWebClient(botToken).conversations.list({
                    types: type
                });
                const channelList = channels.map(({ id, name, purpose }) => ({
                    id, name, description: purpose.value,
                }));
                return responseHelper_1.default.sendResponse(res, 200, true, 'Request was successful', channelList);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static handleExternalSelect(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.parse(req.body.payload);
            let options = [];
            if (payload.type === 'block_suggestion') {
                switch (payload.block_id) {
                    case 'destination':
                        options = yield SlackController.getEmbassySelectOptions(payload);
                        break;
                    case 'pickup':
                        options = yield SlackController.getMatchingAddress(payload);
                        break;
                    default:
                        res.send(new Error(`Block id: ${payload.block_id} is not supported`));
                }
            }
            else {
                res.send(new Error(`Invalid payload type: ${payload.type}`));
            }
            res.send({ options });
        });
    }
    static getEmbassySelectOptions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const embassies = yield homebase_service_1.homebaseService.getHomeBaseEmbassies(payload.user.id, payload.value);
            return [
                { text: new slack_block_models_1.SlackText('Decide later'), value: 'To Be Decided' },
                ...slack_helpers_1.default.toSlackSelectOptions(embassies, { textProp: 'name', valueProp: 'name' }),
            ];
        });
    }
    static getMatchingAddress(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id);
            const addresses = yield address_service_1.addressService
                .searchAddressListByHomebase(homebase.name, payload.value);
            return [
                { text: new slack_block_models_1.SlackText('Decide later'), value: 'To Be Decided' },
                ...slack_helpers_1.default.toSlackSelectOptions(addresses, undefined, true),
            ];
        });
    }
    static leaveRoute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: slackId } } = payload;
                const { routeBatchId, id: userId } = yield user_service_1.default.getUserBySlackId(slackId);
                if (routeBatchId) {
                    yield user_service_1.default.updateUser(userId, { routeBatchId: null });
                    const { routeId, riders } = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, true);
                    const { name: routeName } = yield route_service_1.routeService.getRouteById(routeId, false);
                    const slackMessage = new SlackMessageModels_1.SlackInteractiveMessage(`Hey <@${slackId}>, You have successfully left the route \`${routeName}\`.`);
                    yield route_events_handlers_1.default.handleUserLeavesRouteNotification(payload, slackId, routeName, riders);
                    return slackMessage;
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Something went wrong, please try again');
            }
        });
    }
}
exports.default = SlackController;
//# sourceMappingURL=SlackController.js.map