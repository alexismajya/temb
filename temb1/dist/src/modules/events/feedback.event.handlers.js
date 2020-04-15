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
const Notifications_1 = __importDefault(require("../slack/SlackPrompts/Notifications"));
const app_event_service_1 = __importDefault(require("./app-event.service"));
const feedback_event_constants_1 = require("./feedback-event.constants");
class FeedbackEventHandlers {
    init() {
        app_event_service_1.default.subscribe(feedback_event_constants_1.feedbackConstants.feedbackEvent, exports.feedbackEventHandler.sendFeedbackrequest);
    }
    sendFeedbackrequest() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Notifications_1.default.requestFeedbackMessage();
        });
    }
}
exports.feedbackEventHandler = new FeedbackEventHandlers();
exports.default = FeedbackEventHandlers;
//# sourceMappingURL=feedback.event.handlers.js.map