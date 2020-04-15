"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_socket_event_service_1 = __importDefault(require("../modules/events/web-socket-event.service"));
const trip_events_contants_1 = require("../modules/events/trip-events.contants");
const route_events_constants_1 = require("../modules/events/route-events.constants");
const pushNotificationHelper_1 = __importDefault(require("./pushNotificationHelper"));
exports.default = () => {
    new web_socket_event_service_1.default().subscribe(trip_events_contants_1.TripSocketEvents.newTripPushNotification, pushNotificationHelper_1.default.sendPushNotification);
    new web_socket_event_service_1.default().subscribe(route_events_constants_1.RouteSocketEvents.newRouteRequestNotification, pushNotificationHelper_1.default.sendPushNotification);
};
//# sourceMappingURL=eventListeners.js.map