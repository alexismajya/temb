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
const SlackController_1 = __importDefault(require("../SlackController"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const DialogPrompts_1 = __importDefault(require("../SlackPrompts/DialogPrompts"));
const InteractivePrompts_1 = __importDefault(require("../SlackPrompts/InteractivePrompts"));
const TripActionsController_1 = __importDefault(require("../TripManagement/TripActionsController"));
const cache_1 = __importDefault(require("../../shared/cache"));
const TravelTripHelper_1 = __importStar(require("../helpers/slackHelpers/TravelTripHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const RouteManagement_1 = __importDefault(require("../RouteManagement"));
const UserInputValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator"));
const JoinRouteInteractions_1 = __importDefault(require("../RouteManagement/JoinRoute/JoinRouteInteractions"));
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const cleanData_1 = __importDefault(require("../../../helpers/cleanData"));
const ProvidersController_1 = __importDefault(require("../RouteManagement/ProvidersController"));
const SlackInteractionsHelpers_1 = __importDefault(require("../helpers/slackHelpers/SlackInteractionsHelpers"));
const handler_1 = require("../helpers/slackHelpers/handler");
const InteractivePromptSlackHelper_1 = __importDefault(require("../helpers/slackHelpers/InteractivePromptSlackHelper"));
const provider_service_1 = require("../../providers/provider.service");
const user_service_1 = __importDefault(require("../../users/user.service"));
const travelHelper_1 = __importDefault(require("../helpers/slackHelpers/TravelTripHelper/travelHelper"));
const seeAvailableRoute_controller_1 = __importDefault(require("../../new-slack/routes/user/seeAvailableRoute.controller"));
class SlackInteractions {
    static launch(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { user: { id: slackId }, actions: [{ value: action }] } = payload;
            let message;
            try {
                switch (action) {
                    case 'back_to_launch':
                        message = yield SlackController_1.default.getWelcomeMessage(slackId);
                        break;
                    case 'back_to_travel_launch':
                        message = yield SlackController_1.default.getTravelCommandMsg(slackId);
                        break;
                    case 'back_to_routes_launch':
                        message = yield SlackController_1.default.getRouteCommandMsg(slackId);
                        break;
                    case 'leave_route':
                        message = yield SlackController_1.default.leaveRoute(payload, respond);
                        break;
                    default:
                        message = new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea');
                }
                respond(message);
            }
            catch (err) {
                respond(new SlackMessageModels_1.SlackInteractiveMessage(err.message));
            }
        });
    }
    static handleTripActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                const { callback_id: callbackId } = payload;
                const errors = (callbackId === 'operations_reason_dialog_trips')
                    ? TripActionsController_1.default.runCabValidation(payload) : [];
                if (errors && errors.length > 0)
                    return { errors };
                yield TripActionsController_1.default.changeTripStatus(payload);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static handleSelectCabActions(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, actions } = payload;
            const { id: providerId } = yield provider_service_1.providerService.getProviderBySlackId(slackId);
            const tripId = actions[0].value;
            const { providerId: assignedProviderId } = yield trip_service_1.default.getById(tripId);
            if (providerId === assignedProviderId) {
                return DialogPrompts_1.default.sendSelectCabDialog(payload);
            }
            return respond(new SlackMessageModels_1.SlackInteractiveMessage(':x: This trip has been assigned to another provider'));
        });
    }
    static handleSelectCabAndDriverAction(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data && data.callback_id === 'providers_approval_trip') {
                TripActionsController_1.default.completeTripRequest(data);
            }
            else {
                ProvidersController_1.default.handleProviderRouteApproval(data, respond);
            }
        });
    }
    static bookTravelTripStart(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { user: { id }, actions } = payload;
            const { name } = actions[0];
            switch (name) {
                case 'cancel':
                    respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea. See you again.'));
                    break;
                case 'changeLocation__travel':
                    InteractivePrompts_1.default.changeLocation(payload, respond);
                    break;
                default:
                    yield cache_1.default.save(TravelTripHelper_1.getTravelKey(id), 'tripType', name);
                    return DialogPrompts_1.default.sendTripDetailsForm(payload, 'travelTripContactDetailsForm', 'travel_trip_contactDetails');
            }
        });
    }
    static handleTravelTripActions(data, respond) {
        const payload = cleanData_1.default.trim(data);
        return handler_1.handleActions(payload, respond, TravelTripHelper_1.default, travelHelper_1.default);
    }
    static startRouteActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            cache_1.default.save('url', 'response_url', data.response_url);
            const payload = cleanData_1.default.trim(data);
            const state = JSON.parse(payload.state || '""');
            payload.store = state;
            const action = state.action || payload.actions[0].value;
            const errors = UserInputValidator_1.default.validateStartRouteSubmission(payload);
            if (errors)
                return errors;
            switch (action) {
                case 'my_current_route':
                    yield JoinRouteInteractions_1.default.sendCurrentRouteMessage(payload, respond);
                    break;
                case 'request_new_route':
                    DialogPrompts_1.default.sendLocationForm(payload);
                    break;
                case 'view_available_routes':
                    yield seeAvailableRoute_controller_1.default.seeAvailableRoutes(payload, respond);
                    break;
                case 'change_location':
                    yield InteractivePrompts_1.default.changeLocation(payload, respond);
                    break;
                default:
                    respond(SlackInteractionsHelpers_1.default.goodByeMessage());
                    break;
            }
        });
    }
    static handleRouteActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                const callBackName = payload.callback_id.split('_')[2];
                const routeHandler = RouteManagement_1.default[callBackName];
                if (routeHandler) {
                    const errors = RouteManagement_1.default.runValidations(payload);
                    if (errors && errors.length > 0)
                        return { errors };
                    return routeHandler(payload, respond);
                }
                respond(SlackInteractionsHelpers_1.default.goodByeMessage());
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
            }
        });
    }
    static completeTripResponse(data, respond) {
        try {
            const payload = cleanData_1.default.trim(data);
            const { value } = payload.actions[0];
            InteractivePromptSlackHelper_1.default.sendCompletionResponse(respond, value, payload.user.id);
        }
        catch (error) {
            bugsnagHelper_1.default.log(error);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Error:bangbang: : '
                + 'We could not complete this process please try again.'));
        }
    }
    static handleProviderApproval(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return DialogPrompts_1.default.sendSelectCabDialog(payload);
        });
    }
    static handleChangeLocation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, actions: [data] } = payload;
            const { name: homebaseId, value: stateString } = data;
            const state = JSON.parse(stateString);
            yield user_service_1.default.updateDefaultHomeBase(slackId, Number(homebaseId));
            yield SlackInteractions.restorePreviousState(state, slackId, respond);
        });
    }
    static restorePreviousState(state, slackId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin } = state;
            let msg = {};
            switch (origin) {
                case 'routes':
                    msg = yield SlackController_1.default.getRouteCommandMsg(slackId);
                    break;
                case 'travel':
                    msg = yield SlackController_1.default.getTravelCommandMsg(slackId);
                    break;
                default:
                    msg = yield SlackController_1.default.getWelcomeMessage(slackId);
            }
            respond(msg);
        });
    }
}
exports.default = SlackInteractions;
//# sourceMappingURL=index.js.map