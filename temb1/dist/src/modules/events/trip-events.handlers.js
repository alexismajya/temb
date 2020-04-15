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
const Notifications_1 = __importDefault(require("../slack/SlackPrompts/Notifications"));
const trip_events_contants_1 = require("./trip-events.contants");
const TripNotifications_1 = __importDefault(require("../slack/SlackPrompts/notifications/TripNotifications"));
const TripJobs_1 = __importDefault(require("../../services/jobScheduler/jobs/TripJobs"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const trip_service_1 = __importDefault(require("../trips/trip.service"));
const trip_request_1 = require("../../database/models/trip-request");
const trip_helpers_1 = __importDefault(require("../new-slack/trips/manager/trip.helpers"));
const web_socket_event_service_1 = __importDefault(require("./web-socket-event.service"));
class TripEventsHandlers {
    static init() {
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.newTripRequested, (arg) => TripEventsHandlers.handleNewTripCreated(arg, 'newTrip'));
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.autoApprovalNotification, TripEventsHandlers.handleAutoApproval);
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.takeOffReminder, TripEventsHandlers.handleTakeOffReminder);
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.tripCompleted, TripEventsHandlers.handleTripCompletion);
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.managerApprovedTrip, TripEventsHandlers.managerTripApproval);
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.managerDeclinedTrip, TripEventsHandlers.managerTripDeclined);
        app_event_service_1.default.subscribe(trip_events_contants_1.tripEvents.rescheduled, (arg) => TripEventsHandlers.handleNewTripCreated(arg, 'rescheduled'));
    }
    static handleNewTripCreated({ data, botToken }, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripDetails = yield trip_service_1.default.getById(data.id, true);
                yield Promise.all([
                    trip_helpers_1.default.sendManagerTripRequestNotification(tripDetails, botToken, type),
                    TripJobs_1.default.scheduleAutoApprove({ botToken, data: tripDetails }),
                ]);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static handleAutoApproval({ data, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripDetails = yield trip_service_1.default.getById(data.id, true);
                if (tripDetails.tripStatus === trip_request_1.TripStatus.pending) {
                    yield Notifications_1.default.sendOpsApprovalNotification(tripDetails, botToken);
                }
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static handleTakeOffReminder({ data, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripDetails = yield trip_service_1.default.getById(data.id, true);
                yield TripNotifications_1.default.sendTripReminderNotifications(tripDetails, botToken);
                yield TripJobs_1.default.scheduleCompletionReminder({ botToken, data: tripDetails });
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static handleTripCompletion({ data, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield trip_service_1.default.getById(data.id, true);
                yield TripNotifications_1.default.sendCompletionNotification(trip, botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static getSocketService(io) {
        return new web_socket_event_service_1.default(io);
    }
    static managerTripApproval({ data, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield trip_service_1.default.getById(data.id, true);
                yield Notifications_1.default.sendOperationsTripRequestNotification(trip, botToken);
                TripEventsHandlers.getSocketService().broadcast(trip_events_contants_1.TripSocketEvents.newTripApproved, trip);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static managerTripDeclined({ data, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield trip_service_1.default.getById(data.id, true);
                yield Notifications_1.default.sendRequesterDeclinedNotification(trip, botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.default = TripEventsHandlers;
//# sourceMappingURL=trip-events.handlers.js.map