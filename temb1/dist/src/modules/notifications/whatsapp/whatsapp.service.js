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
const twilio_1 = __importDefault(require("twilio"));
class WhatsappService {
    constructor(twilioClient, defaultSender) {
        this.twilioClient = twilioClient;
        this.twilioNumberPrefix = 'whatsapp:';
        this.sender = `${this.twilioNumberPrefix}${defaultSender}`;
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validateMessage(message)) {
                try {
                    const result = yield this.twilioClient.create({
                        body: message.body,
                        from: this.sender,
                        to: `${this.twilioNumberPrefix}${message.to}`,
                    });
                    return true;
                }
                catch (err) {
                }
            }
        });
    }
    validateMessage(message) {
        if (message && message.body !== null && message.to != null)
            return true;
    }
}
exports.WhatsappService = WhatsappService;
const getTwilioOptions = () => ({
    accountSid: process.env.TEMBEA_TWILIO_SID,
    authToken: process.env.TEMBEA_TWILIO_TOKEN,
});
const getWhatsappOptions = () => ({
    twilioOptions: getTwilioOptions(),
    defaultSender: process.env.TEMBEA_TWILIO_SENDER,
});
const getTwilioClient = (options) => {
    return twilio_1.default(options.accountSid, options.authToken).messages;
};
const whatsappOptions = getWhatsappOptions();
const twilioClient = getTwilioClient(whatsappOptions.twilioOptions);
const whatsappService = new WhatsappService(twilioClient, whatsappOptions.defaultSender);
exports.default = whatsappService;
//# sourceMappingURL=whatsapp.service.js.map