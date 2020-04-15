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
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
class EmailService {
    constructor() {
        const apiKey = process.env.MAILGUN_API_KEY;
        const domain = process.env.MAILGUN_DOMAIN;
        if (apiKey && domain) {
            const options = {
                apiKey: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN,
                from: process.env.MAILGUN_SENDER,
            };
            this.client = mailgun_js_1.default(options);
        }
        else {
            bugsnagHelper_1.default.log('Either MAILGUN_API_KEY or '
                + 'MAILGUN_DOMAIN has not been set in the .env ');
        }
    }
    sendMail(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                const res = yield this.client.messages().send(mailOptions);
                return res;
            }
            return 'failed';
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=EmailService.js.map