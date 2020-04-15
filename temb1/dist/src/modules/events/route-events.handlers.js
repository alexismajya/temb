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
const route_events_constants_1 = require("./route-events.constants");
const RouteUseRecordService_1 = __importDefault(require("../../services/RouteUseRecordService"));
const RouteJobs_1 = __importDefault(require("../../services/jobScheduler/jobs/RouteJobs"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const RouteNotifications_1 = __importDefault(require("../slack/SlackPrompts/notifications/RouteNotifications"));
const homebase_service_1 = require("../homebases/homebase.service");
const routeBatch_service_1 = require("../routeBatches/routeBatch.service");
const web_socket_event_service_1 = __importDefault(require("./web-socket-event.service"));
class RouteEventHandlers {
    static init() {
        app_event_service_1.default.subscribe(route_events_constants_1.routeEvents.takeOffAlert, RouteEventHandlers.sendTakeOffAlerts);
        app_event_service_1.default.subscribe(route_events_constants_1.routeEvents.completionNotification, RouteEventHandlers.sendCompletionNotification);
        app_event_service_1.default.subscribe(route_events_constants_1.routeEvents.newRouteBatchCreated, RouteEventHandlers.handleNewRouteBatch);
        app_event_service_1.default.subscribe(route_events_constants_1.RouteSocketEvents.newRouteRequest, RouteEventHandlers.handleNewRouteRequest);
    }
    static sendTakeOffAlerts({ data: { id: batchId }, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const batchWithRiders = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(batchId, true);
                if (batchWithRiders.riders && batchWithRiders.riders.length > 0) {
                    const record = yield RouteUseRecordService_1.default.create(batchId);
                    const { riders, takeOff, driver } = batchWithRiders;
                    RouteNotifications_1.default.sendWhatsappRouteTripReminder(driver, batchWithRiders);
                    yield Promise.all(riders.map((rider) => {
                        RouteNotifications_1.default.sendRouteTripReminder({ rider, batch: batchWithRiders }, botToken);
                    }));
                    RouteJobs_1.default.scheduleTripCompletionNotification({
                        takeOff, botToken, recordId: record.id,
                    });
                }
            }
            catch (_) {
                bugsnagHelper_1.default.log(_);
            }
        });
    }
    static sendCompletionNotification({ data: { id: recordId }, botToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield RouteUseRecordService_1.default.getByPk(recordId, true);
            if (record && record.batch && record.batch.riders && record.batch.riders.length > 0) {
                const { riders } = record.batch;
                yield Promise.all(riders.map((rider) => RouteNotifications_1.default.sendRouteUseConfirmationNotificationToRider({ rider, record }, botToken)));
            }
        });
    }
    static handleUserLeavesRouteNotification(payload, userName, routeName, riders) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, } = payload;
            const { channel: channelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            yield RouteNotifications_1.default.sendUserLeavesRouteMessage(channelId, payload, userName, { routeName, riders });
        });
    }
    static handleNewRouteBatch(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return RouteJobs_1.default.scheduleTakeOffReminder(data);
        });
    }
    static getSocketService(io) {
        return new web_socket_event_service_1.default(io);
    }
    static handleNewRouteRequest({ data }) {
        try {
            RouteEventHandlers.getSocketService().broadcast(route_events_constants_1.RouteSocketEvents.newRouteRequest, data);
        }
        catch (err) {
            bugsnagHelper_1.default.log(err);
        }
    }
}
exports.default = RouteEventHandlers;
//# sourceMappingURL=route-events.handlers.js.map