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
const app_event_service_1 = __importDefault(require("../app-event.service"));
const weeklyReportSender_1 = __importDefault(require("../../../helpers/email/weeklyReportSender"));
const providerReportSender_1 = __importDefault(require("../../../helpers/email/providerReportSender"));
const reports_events_handlers_1 = require("../reports-events.handlers");
const Notifications_1 = __importDefault(require("../../slack/SlackPrompts/Notifications"));
describe('ReportsEventHandlers', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should register report events subscriptions', () => {
        jest.spyOn(app_event_service_1.default, 'subscribe');
        reports_events_handlers_1.reportEventHandler.init();
        expect(app_event_service_1.default.subscribe).toHaveBeenCalled();
    });
    it('should trigger the send weekly mail method', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(weeklyReportSender_1.default, 'send');
        yield reports_events_handlers_1.reportEventHandler.sendWeeklyReport();
        expect(weeklyReportSender_1.default.send).toHaveBeenCalled();
    }));
    it('should trigger the send  providers report', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(providerReportSender_1.default, 'sendEamilReport');
        jest.spyOn(Notifications_1.default, 'sendOpsProvidersTripsReport');
        yield reports_events_handlers_1.reportEventHandler.sendProvidersReport();
        expect(providerReportSender_1.default.sendEamilReport).toHaveBeenCalled();
        expect(Notifications_1.default.sendOpsProvidersTripsReport).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=reports-events.handlers.spec.js.map