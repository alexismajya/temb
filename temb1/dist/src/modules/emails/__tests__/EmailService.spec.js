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
const EmailService_1 = __importDefault(require("../EmailService"));
describe('EmailService Module', () => {
    let mail;
    beforeEach(() => {
        mail = new EmailService_1.default();
        mail.client.messages = () => ({
            send: (options) => __awaiter(void 0, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    if (options.to === '')
                        reject(new Error('failed'));
                    resolve({ message: 'Queued. Thank you.' });
                });
            }),
        });
    });
    it('should initialize mail client', () => {
        expect(mail.client).toBeDefined();
        expect(mail.client.apiKey).toBeDefined();
        expect(mail.client.domain).toBeDefined();
    });
    it('should send email', () => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = { from: 'tembea@andela.com', to: 'opsteam@andela.com', html: 'hello' };
        const res = yield mail.sendMail(mailOptions);
        expect(mail.client).toBeDefined();
        expect(res.message).toEqual('Queued. Thank you.');
    }));
    it('should not send email', () => __awaiter(void 0, void 0, void 0, function* () {
        const [apiKey, domain] = [
            process.env.MAILGUN_API_KEY,
            process.env.MAILGUN_DOMAIN,
        ];
        process.env.MAILGUN_API_KEY = '';
        process.env.MAILGUN_DOMAIN = '';
        const mailOptions = { from: '', to: '', html: '' };
        const nmail = new EmailService_1.default();
        const res = yield nmail.sendMail(mailOptions);
        expect(res).toEqual('failed');
        process.env.MAILGUN_API_KEY = apiKey;
        process.env.MAILGUN_DOMAIN = domain;
    }));
});
//# sourceMappingURL=EmailService.spec.js.map