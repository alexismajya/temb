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
const RouteJobs_1 = __importDefault(require("../../../services/jobScheduler/jobs/RouteJobs"));
const route_events_handlers_1 = __importDefault(require("../route-events.handlers"));
const __mocks__1 = require("../../../services/__mocks__");
const RouteUseRecordService_1 = __importDefault(require("../../../services/RouteUseRecordService"));
const BatchUseRecordMock_1 = require("../../../helpers/__mocks__/BatchUseRecordMock");
const app_event_service_1 = __importDefault(require("../app-event.service"));
const route_events_constants_1 = require("../route-events.constants");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const RouteNotifications_1 = __importDefault(require("../../slack/SlackPrompts/notifications/RouteNotifications"));
const Notifications_1 = __importDefault(require("../../slack/SlackPrompts/Notifications"));
const homebase_service_1 = require("../../homebases/homebase.service");
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
describe('RouteEventHandlers', () => {
    let botToken;
    const testPayload = { data: { id: 1 } };
    beforeEach(() => {
        botToken = 'xop-637536516';
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('sendTakeOffAlerts', () => {
        it('should send takeoff alerts to driver and route riders', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockReturnValue(__mocks__1.mockRouteBatchData);
            jest.spyOn(RouteNotifications_1.default, 'sendRouteTripReminder').mockReturnValue();
            jest.spyOn(RouteJobs_1.default, 'scheduleTripCompletionNotification').mockReturnValue();
            jest.spyOn(RouteNotifications_1.default, 'sendWhatsappRouteTripReminder').mockReturnValue();
            jest.spyOn(RouteUseRecordService_1.default, 'create').mockResolvedValue(BatchUseRecordMock_1.recordData);
            yield route_events_handlers_1.default.sendTakeOffAlerts({ botToken, data: { batchId: 1 } });
            expect(routeBatch_service_1.routeBatchService.getRouteBatchByPk).toHaveBeenCalled();
            expect(RouteJobs_1.default.scheduleTripCompletionNotification)
                .toHaveBeenCalledWith(expect.objectContaining({ recordId: BatchUseRecordMock_1.recordData.id }));
            done();
        }));
        it('should handle error when shit happens', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const err = new Error('Shit happened');
            jest.spyOn(bugsnagHelper_1.default, 'log').mockImplementation();
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk')
                .mockRejectedValue(err);
            yield route_events_handlers_1.default.sendTakeOffAlerts(testPayload);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(err);
            done();
        }));
    });
    describe('sendCompletionNotification', () => {
        it('should send trip completion notification to rider', (done) => __awaiter(void 0, void 0, void 0, function* () {
            BatchUseRecordMock_1.route.batch.riders = [{
                    id: 1107,
                    name: 'Test User',
                    slackId: '3244ffeef-d3a8-43a4-8483-df81eda7e0a4',
                    email: 'testUser@gmail.com',
                    routeBatchId: 1025,
                }];
            jest.spyOn(RouteUseRecordService_1.default, 'getByPk').mockReturnValue(BatchUseRecordMock_1.route);
            jest.spyOn(RouteNotifications_1.default, 'sendRouteUseConfirmationNotificationToRider').mockReturnValue('');
            yield route_events_handlers_1.default.sendCompletionNotification(testPayload);
            expect(RouteUseRecordService_1.default.getByPk).toHaveBeenCalled();
            expect(RouteNotifications_1.default.sendRouteUseConfirmationNotificationToRider).toHaveBeenCalled();
            done();
        }));
        it('should do nothing when record details is incomplete', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteUseRecordService_1.default, 'getByPk').mockReturnValue();
            jest.spyOn(RouteNotifications_1.default, 'sendRouteUseConfirmationNotificationToRider').mockReturnValue('');
            yield route_events_handlers_1.default.sendCompletionNotification(Object.assign(Object.assign({}, testPayload), { botToken: 'fdfdfjoj' }));
            expect(RouteNotifications_1.default.sendRouteUseConfirmationNotificationToRider).not.toHaveBeenCalled();
            done();
        }));
    });
    describe('should registe subscribers', () => {
        it('should call the handler', (done) => {
            const testData = { batchId: 3 };
            jest.spyOn(route_events_handlers_1.default, 'sendTakeOffAlerts').mockResolvedValue();
            route_events_handlers_1.default.init();
            app_event_service_1.default.broadcast({ name: route_events_constants_1.routeEvents.takeOffAlert, data: testData });
            setTimeout(() => {
                expect(route_events_handlers_1.default.sendTakeOffAlerts).toHaveBeenCalledWith(testData);
                done();
            }, 3000);
        });
    });
    describe('user leaves route notification', () => {
        it('should send a notification when the user leaves a route', () => __awaiter(void 0, void 0, void 0, function* () {
            const { payload, userName, routeName, riders, } = __mocks__1.mockUserLeavesRouteHandler;
            jest.spyOn(Notifications_1.default, 'sendNotifications').mockResolvedValue();
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue();
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'OPSCHANNEL' });
            yield route_events_handlers_1.default.handleUserLeavesRouteNotification(payload, userName, routeName, riders);
            expect(Notifications_1.default.sendNotifications).toHaveBeenCalled();
        }));
    });
    describe('handle New Route Batch Data', () => {
        const routeTripReminderMock = {
            botToken,
            routeBatch: {
                id: 1,
                takeOff: 'DD:DD',
            },
        };
        it('should schedule take off reminder time', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteJobs_1.default, 'scheduleTakeOffReminder').mockReturnValue();
            yield route_events_handlers_1.default.handleNewRouteBatch(routeTripReminderMock);
            expect(RouteJobs_1.default.scheduleTakeOffReminder).toHaveBeenCalledWith(routeTripReminderMock);
            done();
        }));
    });
});
//# sourceMappingURL=route-event.handlers.spec.js.map