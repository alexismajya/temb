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
const moment_1 = __importDefault(require("moment"));
const DialogPrompts_1 = __importDefault(require("../../DialogPrompts"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const SlackDialogModels_1 = require("../../../SlackModels/SlackDialogModels");
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const TripJobs_1 = __importDefault(require("../../../../../services/jobScheduler/jobs/TripJobs"));
const RateTripController_1 = __importDefault(require("../../../TripManagement/RateTripController"));
const cleanData_1 = __importDefault(require("../../../../../helpers/cleanData"));
class TripInteractions {
    static tripCompleted(data, respond, trip) {
        const payload = cleanData_1.default.trim(data);
        const { actions: [{ name }] } = payload;
        switch (name) {
            case 'trip_taken':
                TripInteractions.hasCompletedTrip(payload, respond, trip);
                break;
            case 'not_taken':
                TripInteractions.hasNotTakenTrip(payload, respond);
                break;
            case 'still_on_trip':
                TripInteractions.isOnTrip(payload, respond);
                break;
            default:
                break;
        }
    }
    static isOnTrip(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { actions: [{ value }] } = payload;
            yield trip_service_1.default.updateRequest(value, { tripStatus: 'InTransit' });
            const trip = yield trip_service_1.default.getById(value);
            const scheduleSpan = process.env.NODE_ENV === 'development' ? 'minutes' : 'hours';
            const newScheduleTime = moment_1.default(new Date()).add(1, scheduleSpan).format();
            TripJobs_1.default.scheduleCompletionReminder(trip, newScheduleTime, 0);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Okay! We\'ll check later.'));
        });
    }
    static hasCompletedTrip(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { actions: [{ value }] } = payload;
            yield trip_service_1.default.updateRequest(value, { tripStatus: 'Completed' });
            const ratingMessage = yield RateTripController_1.default.sendRatingMessage(value, 'rate_trip');
            respond(ratingMessage);
        });
    }
    static hasNotTakenTrip(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { actions: [{ value }] } = payload;
            yield trip_service_1.default.updateRequest(value, { tripStatus: 'Cancelled' });
            const dialog = new SlackDialogModels_1.SlackDialog('trip_not_taken', 'Reason', 'Submit', true, value);
            const textarea = new SlackDialogModels_1.SlackDialogTextarea('Reason', 'tripNotTakenReason', 'Reason for not taking trip');
            dialog.addElements([textarea]);
            yield DialogPrompts_1.default.sendDialog(dialog, payload);
        });
    }
    static reasonForNotTakingTrip(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { submission } = payload;
            yield trip_service_1.default.updateRequest(payload.state, submission);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
        });
    }
}
exports.default = TripInteractions;
//# sourceMappingURL=TripInteractions.js.map