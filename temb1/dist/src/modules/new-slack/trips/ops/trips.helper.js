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
const trip_helpers_1 = __importDefault(require("../manager/trip.helpers"));
const constants_1 = __importStar(require("../manager/constants"));
const Notifications_1 = __importDefault(require("../../../slack/SlackPrompts/Notifications"));
const slack_block_models_1 = require("../../models/slack-block-models");
class TripHelpers {
    static getDelayedTripApprovalMessage(trip) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requester, department, homebase } = trip;
            const channel = homebase.channel;
            const message = yield trip_helpers_1.default.getApprovalPromptMessage(trip, channel, {
                headerText: `Hello Ops, <@${requester.slackId}> has requested the trip attached below, but `
                    + `<@${department.head.slackId}> has delayed to respond to the request `
                    + ':slightly_frowning_face:.\n Please respond to it:pray:',
                blockId: constants_1.managerTripBlocks.confirmTripRequest,
                approveActionId: constants_1.default.approve,
                declineActionId: constants_1.default.decline,
            });
            return message;
        });
    }
    static getOpsApprovalMessageForManager(data, channelId) {
        const { origin, destination } = data;
        const text = `The request from *${origin.address}* to *${destination.address}* `
            + `has been approved by <@${data.approver.slackId}> `
            + 'from Ops because you delayed to approve it.\nThe request is now ready for confirmation.';
        const head = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText('Ops approved'));
        const fields = Notifications_1.default.notificationFields(data);
        const main = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(text))
            .addFields(fields);
        return new slack_block_models_1.BlockMessage([head, main], channelId);
    }
}
exports.default = TripHelpers;
//# sourceMappingURL=trips.helper.js.map