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
const validationSchemasExetension_1 = require("../../../middlewares/validationSchemasExetension");
const base_notification_1 = require("./base.notification");
const whatsapp_service_1 = __importDefault(require("../../../modules/notifications/whatsapp/whatsapp.service"));
class WhatsAppNotification extends base_notification_1.BaseNotification {
    constructor(whatsapp = whatsapp_service_1.default) {
        super();
        this.whatsapp = whatsapp;
    }
    notifyNewTripRequest(provider, tripDetails, teamDetails) {
        throw new Error('Method not implemented.');
    }
    sendVerificationMessage(provider, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (validationSchemasExetension_1.phoneNoRegex.test(provider.phoneNo)) {
                const message = {
                    body: `Hello *${provider.name}* \n Click on this link to activate your account: \n ${options.origin}/provider/${this.generateToken({ id: provider.id })}`,
                    to: `${provider.phoneNo}`,
                };
                yield this.whatsapp.send(message);
            }
        });
    }
}
exports.WhatsAppNotification = WhatsAppNotification;
//# sourceMappingURL=whatsapp.notfication.js.map