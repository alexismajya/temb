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
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const InteractivePromptsHelpers_1 = __importDefault(require("../helpers/slackHelpers/InteractivePromptsHelpers"));
const InteractivePrompts_1 = __importDefault(require("../SlackPrompts/InteractivePrompts"));
class OpsTripActions {
    static sendUserCancellation(channel, botToken, trip, userId, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = 'Trip cancelled';
            const tripDetailsAttachment = new SlackMessageModels_1.SlackAttachment(message);
            const detailsAttachment = new SlackMessageModels_1.SlackAttachment(`:negative_squared_cross_mark: <@${userId}> already cancelled this trip`);
            detailsAttachment.addOptionalProps('', '', 'danger');
            tripDetailsAttachment.addOptionalProps('', '', 'danger');
            tripDetailsAttachment.addFieldsOrActions('fields', InteractivePromptsHelpers_1.default.addOpsNotificationTripFields(trip));
            try {
                yield InteractivePrompts_1.default.messageUpdate(channel, message, timeStamp, [tripDetailsAttachment, detailsAttachment], botToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.default = OpsTripActions;
//# sourceMappingURL=OpsTripActions.js.map