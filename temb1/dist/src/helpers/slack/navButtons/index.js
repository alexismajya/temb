"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../../modules/slack/SlackModels/SlackMessageModels");
exports.default = (callbackId, value, optionsButton = null) => {
    const navAttachment = new SlackMessageModels_1.SlackAttachment();
    const buttons = [new SlackMessageModels_1.SlackButtonAction('back', '< Back', value, '#FFCCAA')];
    if (optionsButton)
        buttons.push(optionsButton);
    buttons.push(new SlackMessageModels_1.SlackCancelButtonAction());
    navAttachment.addFieldsOrActions('actions', buttons);
    navAttachment.addOptionalProps(callbackId, undefined, '#4285f4');
    return navAttachment;
};
//# sourceMappingURL=index.js.map