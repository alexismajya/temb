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
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const InteractivePrompts_1 = __importDefault(require("../../SlackPrompts/InteractivePrompts"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const slack_block_models_1 = require("../../../new-slack/models/slack-block-models");
class FeedbackHelper {
    sendFeedbackSuccessmessage(teamId, channelId, actionTs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                yield InteractivePrompts_1.default.messageUpdate(channelId, undefined, actionTs, undefined, slackBotOauthToken, [new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.SlackText(':white_check_mark: Thanks ! We\'ve successfully received your feedback', slack_block_models_1.TextTypes.markdown))]);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
}
exports.FeedbackHelper = FeedbackHelper;
exports.default = new FeedbackHelper();
//# sourceMappingURL=feedbackHelper.js.map