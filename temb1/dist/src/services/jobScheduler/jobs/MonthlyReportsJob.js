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
const node_schedule_1 = __importDefault(require("node-schedule"));
const monthlyReportSender_1 = __importDefault(require("../../../helpers/email/monthlyReportSender"));
const app_1 = require("../../../app");
const time = process.env.MONTHLY_EMAIL_TIME || '1:1:1';
const [date, hour, minute] = time.split(':');
class MonthlyReportsJob {
    static scheduleAllMonthlyReports() {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = new node_schedule_1.default.RecurrenceRule();
            rule.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            rule.date = date;
            rule.hour = hour;
            rule.minute = minute;
            node_schedule_1.default.scheduleJob(rule, () => __awaiter(this, void 0, void 0, function* () {
                yield new monthlyReportSender_1.default(app_1.hbs).sendMail();
            }));
        });
    }
}
exports.default = MonthlyReportsJob;
//# sourceMappingURL=MonthlyReportsJob.js.map