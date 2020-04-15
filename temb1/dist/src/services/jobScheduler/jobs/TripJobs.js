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
const trip_events_contants_1 = require("../../../modules/events/trip-events.contants");
const scheduler_1 = __importDefault(require("../../../modules/shared/scheduler"));
const environment_1 = __importDefault(require("../../../config/environment"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const getNotificationTimeout = (dateTime, op, timeout) => {
    return moment_1.default(dateTime)[op](timeout, 'minutes').toISOString();
};
class TripJobs {
}
exports.default = TripJobs;
TripJobs.scheduleCompletionReminder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = getNotificationTimeout(payload.data.departureTime, 'add', environment_1.default.TRIP_COMPLETION_TIMEOUT);
        yield scheduler_1.default.schedule({
            time,
            isRecurring: false,
            payload: {
                key: `${trip_events_contants_1.tripEvents.tripCompleted}_${payload.data.id}`,
                args: {
                    name: trip_events_contants_1.tripEvents.tripCompleted,
                    data: {
                        data: { id: payload.data.id },
                        botToken: payload.botToken,
                    },
                },
            },
        });
    }
    catch (err) {
        bugsnagHelper_1.default.log(err);
    }
});
TripJobs.scheduleTakeOffReminder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = getNotificationTimeout(payload.data.departureTime, 'subtract', environment_1.default.TAKEOFF_TIMEOUT);
        yield scheduler_1.default
            .schedule({
            time,
            isRecurring: false,
            payload: {
                key: `${trip_events_contants_1.tripEvents.takeOffReminder}_${payload.data.id}`,
                args: {
                    name: trip_events_contants_1.tripEvents.takeOffReminder,
                    data: {
                        data: { id: payload.data.id },
                        botToken: payload.botToken,
                    },
                },
            },
        });
    }
    catch (err) {
        bugsnagHelper_1.default.log(err);
    }
});
TripJobs.scheduleAutoApprove = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const time = getNotificationTimeout(payload.data.departureTime, 'subtract', environment_1.default.TRIP_AUTO_APPROVE_TIMEOUT);
        const eventPayload = {
            name: trip_events_contants_1.tripEvents.autoApprovalNotification,
            data: {
                data: { id: payload.data.id },
                botToken: payload.botToken,
            },
        };
        yield scheduler_1.default.schedule({
            time,
            payload: {
                key: `${trip_events_contants_1.tripEvents.autoApprovalNotification}__${payload.data.id}`,
                args: eventPayload,
            },
        });
    }
    catch (error) {
        bugsnagHelper_1.default.log(error);
    }
});
//# sourceMappingURL=TripJobs.js.map