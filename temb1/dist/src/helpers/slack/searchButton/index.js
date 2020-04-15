"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../../modules/slack/SlackModels/SlackMessageModels");
exports.default = (callbackId, value) => {
    const searchAttachment = new SlackMessageModels_1.SlackAttachment();
    searchAttachment.addFieldsOrActions('actions', [
        new SlackMessageModels_1.SlackButtonAction('search', 'Search', value, '#FFCCAA'),
    ]);
    searchAttachment.addOptionalProps(callbackId, undefined, '#4285f4');
    return searchAttachment;
};
//# sourceMappingURL=index.js.map