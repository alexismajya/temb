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
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const SlackDialogModels_1 = require("../SlackModels/SlackDialogModels");
const dateHelper_1 = __importDefault(require("../../../helpers/dateHelper"));
const utils_1 = __importDefault(require("../../../utils"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const events_1 = __importDefault(require("../events"));
const slackEvents_1 = require("../events/slackEvents");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const InteractivePromptSlackHelper_1 = __importDefault(require("../helpers/slackHelpers/InteractivePromptSlackHelper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../helpers/slack/updatePastMessageHelper"));
class RescheduleTripController {
    static runValidations(date, user, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield slackHelpers_1.default.fetchUserInformationFromSlack(user.id, slackBotOauthToken);
            const errors = [];
            if (!dateHelper_1.default.validateDateTime(date)) {
                errors.push(new SlackDialogModels_1.SlackDialogError('time', 'The time should be in the 24 hours format hh:mm'));
            }
            if (dateHelper_1.default.dateChecker(date, userInfo.tz_offset) < 0) {
                errors.push(new SlackDialogModels_1.SlackDialogError('newMonth', 'This date seems to be in the past!'), new SlackDialogModels_1.SlackDialogError('newDate', 'This date seems to be in the past!'), new SlackDialogModels_1.SlackDialogError('time', 'This date seems to be in the past!'));
            }
            return errors;
        });
    }
    static rescheduleTrip(tripId, newDate, payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield trip_service_1.default.getById(tripId, true);
                if (trip) {
                    const { user: { id: slackUserId }, team: { id: teamId } } = payload;
                    const slackInfo = yield slackHelpers_1.default.getUserInfoFromSlack(slackUserId, teamId);
                    const departureTime = utils_1.default.formatDateForDatabase(newDate, slackInfo.tz);
                    const newTrip = yield trip_service_1.default.updateRequest(tripId, { departureTime });
                    const requestType = 'reschedule';
                    events_1.default.raise(slackEvents_1.slackEventNames.NEW_TRIP_REQUEST, payload, newTrip, respond, requestType);
                    const message = yield InteractivePromptSlackHelper_1.default.sendRescheduleCompletion({}, trip.rider.slackId);
                    const state = payload.state.split(' ');
                    const origin = Object.assign({}, state);
                    const newMessage = yield updatePastMessageHelper_1.default.newUpdateMessage(origin[1], message);
                    return newMessage;
                }
                return InteractivePromptSlackHelper_1.default.sendTripError();
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return InteractivePromptSlackHelper_1.default.sendRescheduleError(tripId);
            }
        });
    }
}
exports.default = RescheduleTripController;
//# sourceMappingURL=RescheduleTripController.js.map