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
const app_event_service_1 = __importDefault(require("./app-event.service"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const trip_events_handlers_1 = __importDefault(require("./trip-events.handlers"));
const Notifications_1 = __importDefault(require("../slack/SlackPrompts/Notifications"));
var TravelEvents;
(function (TravelEvents) {
    TravelEvents["travelCompletedNewTrip"] = "TRAVEL_COMPLETED_NEW_TRIP";
    TravelEvents["travelCancelledByRider"] = "TRAVEL_CANCELLED_BY_RIDER";
})(TravelEvents = exports.TravelEvents || (exports.TravelEvents = {}));
class TravelEventHandlers {
    static init() {
        app_event_service_1.default.subscribe(TravelEvents.travelCompletedNewTrip, TravelEventHandlers.handleCompletedTrip);
        app_event_service_1.default.subscribe(TravelEvents.travelCancelledByRider, TravelEventHandlers.handleTravelCancelledByRider);
    }
    static handleCompletedTrip({ data, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield trip_events_handlers_1.default.managerTripApproval({ data, botToken });
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static handleTravelCancelledByRider({ data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload, trip, respond } = data;
                yield Notifications_1.default.sendManagerCancelNotification(payload, trip, respond);
                yield Notifications_1.default.sendOpsCancelNotification(payload, trip, respond);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.default = TravelEventHandlers;
//# sourceMappingURL=travel-events.handlers.js.map