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
const itinerary_helpers_1 = __importDefault(require("./itinerary.helpers"));
const actions_1 = require("./actions");
const reschedule_helper_1 = __importDefault(require("./reschedule.helper"));
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const schemas_1 = require("../schemas");
class ItineraryController {
    static start(payload, respond) {
        const message = itinerary_helpers_1.default.createStartMessage();
        respond(message);
    }
    static getPast(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield itinerary_helpers_1.default.getPastTripsMessage(payload);
            respond(message);
        });
    }
    static getUpcoming(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield itinerary_helpers_1.default.getUpcomingTripsMessage(payload);
            respond(message);
        });
    }
    static handleRescheduleOrCancel(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value, action_id: actionId } = payload.actions[0];
            let message;
            if (actionId.startsWith(actions_1.itineraryActions.reschedule)) {
                message = yield reschedule_helper_1.default.sendTripRescheduleModal(payload, value);
            }
            else {
                message = yield itinerary_helpers_1.default.cancelTrip(payload, value);
            }
            if (message)
                respond(message);
        });
    }
    static nextOrPrevPage(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = payload.actions[0];
            let message;
            if (value.includes('pastTrips')) {
                message = yield itinerary_helpers_1.default.getPastTripsMessage(payload);
            }
            else if (value.includes('upcomingTrips')) {
                message = yield itinerary_helpers_1.default.getUpcomingTripsMessage(payload);
            }
            if (message)
                respond(message);
        });
    }
    static skipPage(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            yield itinerary_helpers_1.default.triggerPage(payload);
        });
    }
    static handleSkipPage(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                team: { id: data.team.id, domain: data.team.domain },
                user: { id: data.user.id, name: data.user.name, team_id: data.team.id },
                actions: [
                    {
                        action_id: `user_trip_page_${data.submission.pageNumber}`,
                        block_id: 'user_trip_pagination',
                        value: `${data.state}_page_${data.submission.pageNumber}`,
                    },
                ],
            };
            ItineraryController.nextOrPrevPage(payload, respond);
        });
    }
    static handleRescheduleRequest(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = yield slack_helpers_1.default.getUserInfo(payload.user.id, context.botToken);
                const data = slack_helpers_1.default.modalValidator(submission, schemas_1.getDateAndTimeSchema(userInfo.tz));
                yield reschedule_helper_1.default.completeReschedule(payload, data, context);
                respond.clear();
            }
            catch (err) {
                const errors = err.errors || { date: 'An unexpected error occured' };
                return respond.error(errors);
            }
        });
    }
}
exports.default = ItineraryController;
//# sourceMappingURL=itinerary.controller.js.map