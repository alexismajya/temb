"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const SlackPaginationHelper_1 = __importDefault(require("../../../helpers/slack/SlackPaginationHelper"));
const DialogPrompts_1 = __importDefault(require("../SlackPrompts/DialogPrompts"));
exports.responseMessage = (text = 'You have no trip history') => new SlackMessageModels_1.SlackInteractiveMessage(text);
exports.getPageNumber = (payload) => {
    let pageNumber;
    if (payload.submission) {
        ({ pageNumber } = payload.submission);
    }
    if (payload.actions) {
        const tempPageNo = SlackPaginationHelper_1.default.getPageNumber(payload.actions[0].name);
        pageNumber = tempPageNo || 1;
    }
    return pageNumber;
};
exports.triggerPage = (payload, respond) => {
    const { actions: [{ value: requestType }], callback_id: callbackId } = payload;
    if (payload.actions && payload.actions[0].name === 'skipPage') {
        respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
        return DialogPrompts_1.default.sendSkipPage(payload, requestType, callbackId);
    }
    if (payload.actions && payload.actions[0].name === 'search') {
        return DialogPrompts_1.default.sendSearchPage(payload, requestType, callbackId, respond);
    }
};
//# sourceMappingURL=TripItineraryController.js.map