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
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_mocks_1 = require("./twilio.mocks");
const whatsapp_service_1 = require("./whatsapp.service");
describe('WhatsappService', () => {
    let options;
    let whatsapp;
    beforeAll(() => {
        options = {
            defaultSender: '+2341112333',
            twilioOptions: {
                accountSid: 'AC123',
                authToken: 'token',
            },
        };
        whatsapp = new whatsapp_service_1.WhatsappService(twilio_mocks_1.mockTwilioClient, options.defaultSender);
    });
    it('should be defined', () => {
        expect(whatsapp).toBeDefined();
    });
    describe('send', () => {
        it('should send a message to specified number', () => __awaiter(void 0, void 0, void 0, function* () {
            const phone = '+2348027555908';
            const message = 'Hi, welcome to Tembea Whatsapp Service';
            const msg = {
                to: phone,
                body: message,
            };
            const result = yield whatsapp.send(msg);
            expect(result).toBeTruthy();
        }));
    });
});
//# sourceMappingURL=whatapp.service.spec.js.map