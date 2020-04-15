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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = __importDefault(require("../../modules/emails/EmailService"));
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
const providerMonthlyReport_1 = __importStar(require("../../modules/report/providerMonthlyReport"));
class ProviderReportSender {
    constructor(emailService) {
        this.emailService = emailService;
    }
    sendEamilReport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providersReport = yield providerMonthlyReport_1.default.generateData(providerMonthlyReport_1.CommChannel.email);
                const emails = Object.keys(providersReport);
                if (emails.length) {
                    const promises = emails.map((email) => this.sendMail(email, providersReport[email]));
                    yield Promise.all(promises);
                }
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
            }
        });
    }
    sendMail(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.TEMBEA_MAIL_ADDRESS) {
                yield this.emailService.sendMail({
                    from: `TEMBEA <${process.env.TEMBEA_MAIL_ADDRESS}>`,
                    to: email,
                    subject: 'Montly Report for Your Taken trips',
                    template: 'providers',
                    'h:X-Mailgun-Variables': JSON.stringify(data),
                });
            }
            else {
                bugsnagHelper_1.default.log('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
            }
        });
    }
}
exports.ProviderReportSender = ProviderReportSender;
const providerReportSender = new ProviderReportSender(new EmailService_1.default());
exports.default = providerReportSender;
//# sourceMappingURL=providerReportSender.js.map