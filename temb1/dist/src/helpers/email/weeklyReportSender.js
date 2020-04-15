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
const weeklyReportGenerator_1 = __importDefault(require("../../modules/report/weeklyReportGenerator"));
const EmailService_1 = __importDefault(require("../../modules/emails/EmailService"));
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
const utils_1 = __importDefault(require("../../utils"));
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
class WeeklyReportSender {
    constructor() {
        this.emailService = new EmailService_1.default();
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUserData = yield this.getWeeklyEmailReport();
                const users = Object.keys(allUserData);
                users.length ? yield this.sendMail(allUserData, users) : '';
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
            }
        });
    }
    getWeeklyEmailReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const lastWeekDate = utils_1.default.getLastWeekStartDate('YYYY-MM-DD');
            const tripData = yield user_service_1.default.getWeeklyCompletedTrips(lastWeekDate);
            const routeTripData = yield user_service_1.default.getWeeklyCompletedRoutes(lastWeekDate);
            return weeklyReportGenerator_1.default.generateEmailData(tripData, routeTripData);
        });
    }
    sendMail(recipientVars, users) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.TEMBEA_MAIL_ADDRESS) {
                yield this.emailService.sendMail({
                    from: `TEMBEA <${process.env.TEMBEA_MAIL_ADDRESS}>`,
                    to: users,
                    subject: 'Weekly Report for Your Taken trips',
                    template: 'weeklyReport',
                    'recipient-variables': recipientVars,
                });
            }
            else {
                bugsnagHelper_1.default.log('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
            }
        });
    }
}
exports.weeklyReportSender = new WeeklyReportSender();
exports.default = exports.weeklyReportSender;
//# sourceMappingURL=weeklyReportSender.js.map