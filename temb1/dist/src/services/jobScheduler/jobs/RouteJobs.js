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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const route_events_constants_1 = require("../../../modules/events/route-events.constants");
const scheduler_1 = __importDefault(require("../../../modules/shared/scheduler"));
class RouteJobs {
    static scheduleTakeOffReminder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeBatch, botToken } = payload;
            const allowance = process.env.NODE_ENV === 'production' ? { minutes: -15 } : { minutes: -1 };
            const time = RouteJobs.getTodayTime(routeBatch.takeOff, allowance);
            scheduler_1.default.schedule({
                cron: {
                    isSequential: false,
                    repeatTime: time,
                },
                isRecurring: true,
                payload: {
                    key: `${route_events_constants_1.routeEvents.takeOffAlert}__${routeBatch.id}`,
                    args: {
                        name: route_events_constants_1.routeEvents.takeOffAlert,
                        data: {
                            botToken,
                            data: { id: routeBatch.id },
                        },
                    },
                },
            });
        });
    }
    static scheduleTripCompletionNotification(payload) {
        const { recordId, takeOff, botToken } = payload;
        const allowance = process.env.NODE_ENV === 'production' ? { hours: 2 } : { minutes: 1 };
        const time = RouteJobs.getTodayTime(takeOff, allowance);
        scheduler_1.default.schedule({
            cron: {
                isSequential: false,
                repeatTime: time,
            },
            isRecurring: true,
            payload: {
                key: `${route_events_constants_1.routeEvents.completionNotification}__${recordId}`,
                args: {
                    name: route_events_constants_1.routeEvents.completionNotification,
                    data: { botToken, data: { id: recordId } },
                },
            },
        });
    }
    static getTodayTime(time, { hours = 0, minutes = 0, seconds = 0 }, tz = 'Africa/Nairobi') {
        const date = moment_timezone_1.default(new Date(), 'MM/DD/YYYY')
            .format('MM/DD/YYYY');
        const timeAdded = { hours, minutes, seconds };
        return moment_timezone_1.default.tz(`${date} ${time}`, 'MM/DD/YYYY HH:mm', tz)
            .add(timeAdded)
            .format('DD-MM HH:mm');
    }
}
exports.default = RouteJobs;
//# sourceMappingURL=RouteJobs.js.map