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
const slack_block_models_1 = require("../../models/slack-block-models");
const actions_1 = __importDefault(require("./actions"));
const SlackViews_1 = __importDefault(require("../../extensions/SlackViews"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
class RescheduleController {
    static sendRescheduleModal(payload, tripRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = yield RescheduleController.getRescheduleModal(tripRequestId);
            const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return SlackViews_1.default(token).open(payload.trigger_id, modal);
        });
    }
    static getRescheduleModal(tripRequestId) {
        const date = new Date();
        const month = date.getMonth() + 1;
        const organizeDate = `${date.getFullYear()}-${month}-${date.getDate()}`;
        const mainBlock = new slack_block_models_1.InputBlock(new slack_block_models_1.DatePicker(organizeDate, 'select a date', 'date'), 'Select Date', 'date');
        const anotherBlock = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('HH:mm', 'time'), 'Time', 'time');
        const modal = new slack_block_models_1.Modal('Reschedule Trip', {
            submit: 'Reschedule',
            close: 'Cancel',
        }).addBlocks([mainBlock, anotherBlock])
            .addCallbackId(actions_1.default.reschedule)
            .addMetadata(tripRequestId.toString());
        return modal;
    }
}
exports.RescheduleController = RescheduleController;
//# sourceMappingURL=reschedule.controller.js.map