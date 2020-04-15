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
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const slackValidations_1 = require("./slackValidations");
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const InteractivePromptSlackHelper_1 = __importDefault(require("./InteractivePromptSlackHelper"));
const reschedule_controller_1 = require("../../../new-slack/trips/user/reschedule.controller");
class TripRescheduleHelper {
    static respondRescheduleError(timedOut, approved) {
        if (timedOut) {
            return InteractivePromptSlackHelper_1.default.passedTimeOutLimit();
        }
        if (approved) {
            return InteractivePromptSlackHelper_1.default.rescheduleConfirmedApprovedError();
        }
    }
    static sendTripRescheduleDialog(payload, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripRequest = yield trip_service_1.default.getById(requestId);
                const approved = slackValidations_1.isTripRequestApproved(tripRequest);
                const timedOut = slackValidations_1.isTripRescheduleTimedOut(tripRequest);
                const rescheduleError = TripRescheduleHelper.respondRescheduleError(timedOut, approved);
                if (!timedOut && !approved) {
                    yield reschedule_controller_1.RescheduleController.sendRescheduleModal(payload, requestId);
                }
                return rescheduleError;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return InteractivePromptSlackHelper_1.default.sendTripError();
            }
        });
    }
}
exports.default = TripRescheduleHelper;
//# sourceMappingURL=rescheduleHelper.js.map