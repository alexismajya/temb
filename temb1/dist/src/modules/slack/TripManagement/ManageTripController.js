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
const validator_1 = __importDefault(require("validator"));
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const department_service_1 = require("../../departments/department.service");
const SlackDialogModels_1 = require("../SlackModels/SlackDialogModels");
const InteractivePrompts_1 = __importDefault(require("../SlackPrompts/InteractivePrompts"));
const events_1 = __importDefault(require("../events"));
const slackEvents_1 = require("../events/slackEvents");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
class ManageTripController {
    static runValidation(reasonObject) {
        const [field, reason] = Object.entries(reasonObject)[0];
        const errors = [];
        if (reason.trim() === '') {
            errors.push(new SlackDialogModels_1.SlackDialogError(field, 'This field cannot be empty'));
        }
        if (reason.trim().length > 100) {
            errors.push(new SlackDialogModels_1.SlackDialogError(field, 'Character length must be less than or equal to 100'));
        }
        return errors;
    }
    static declineTrip(state, declineReason, respond, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reason = validator_1.default.blacklist(declineReason.trim(), '=\'"\t\b(0)Z').trim();
            try {
                const trip = yield trip_service_1.default.getById(state[2]);
                const head = yield department_service_1.departmentService.getHeadByDeptId(trip.departmentId);
                const ride = trip;
                ride.tripStatus = 'DeclinedByManager';
                ride.managerComment = reason;
                ride.declinedById = head.id;
                yield trip_service_1.default.updateRequest(trip.id, ride);
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                InteractivePrompts_1.default.sendManagerDeclineOrApprovalCompletion(true, ride, state[0], state[1], slackBotOauthToken);
                events_1.default.raise(slackEvents_1.slackEventNames.DECLINED_TRIP_REQUEST, ride, respond, slackBotOauthToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond({ text: 'Dang, something went wrong there.' });
            }
        });
    }
}
exports.default = ManageTripController;
//# sourceMappingURL=ManageTripController.js.map