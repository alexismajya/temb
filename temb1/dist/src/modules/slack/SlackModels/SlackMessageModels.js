"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackResponseType = Object.freeze({
    ephemeral: 'ephemeral',
    inChannel: 'in_channel'
});
exports.SlackActionTypes = Object.freeze({
    text: 'text',
    textarea: 'textarea',
    button: 'button',
    select: 'select'
});
exports.SlackActionButtonStyles = Object.freeze({
    primary: 'primary',
    danger: 'danger'
});
exports.SlackKnownDataSources = Object.freeze({
    users: 'users',
    channels: 'channels',
    external: 'external'
});
class SlackInteractiveMessage {
    constructor(text, attachments, channelId, user) {
        this.text = text;
        this.channel = channelId;
        this.user = user;
        this.attachments = attachments;
        this.response_type = exports.SlackResponseType.ephemeral;
    }
}
exports.SlackInteractiveMessage = SlackInteractiveMessage;
class SlackAttachment {
    constructor(title, text, authorName, authorIcon, imageUrl, attachmentType, color) {
        this.title = title;
        this.text = text;
        this.color = color;
        this.attachment_type = attachmentType;
        this.author_name = authorName;
        this.author_icon = authorIcon;
        this.image_url = imageUrl;
        this.fields = [];
        this.actions = [];
        this.mrkdwn_in = [];
    }
    addFieldsOrActions(type, valuesArray) {
        if (Array.isArray(valuesArray)) {
            this[type].push(...valuesArray);
        }
        return this;
    }
    addOptionalProps(callbackId, fallback = 'fallback', color = '#3AAF85', attachmentType = 'default', buttonValue = 'defaultButton') {
        if (callbackId)
            this.callback_id = callbackId;
        if (fallback)
            this.fallback = fallback;
        if (color)
            this.color = color;
        if (attachmentType)
            this.attachment_type = attachmentType;
        if (buttonValue)
            this.buttonValue = buttonValue;
        return this;
    }
    addMarkdownIn(valuesArray) {
        if (Array.isArray(valuesArray)) {
            this.mrkdwn_in.push(...valuesArray);
        }
        return this;
    }
}
exports.SlackAttachment = SlackAttachment;
class SlackAttachmentField {
    constructor(title, value, short) {
        this.title = title;
        this.value = value;
        this.short = short;
    }
}
exports.SlackAttachmentField = SlackAttachmentField;
class SlackAction {
    constructor(name, text, type) {
        this.name = name;
        this.text = text;
        this.type = type;
    }
}
exports.SlackAction = SlackAction;
class SlackButtonAction extends SlackAction {
    constructor(name, text, value, style = exports.SlackActionButtonStyles.primary) {
        super(name, text, exports.SlackActionTypes.button);
        this.style = style;
        this.value = value;
    }
}
exports.SlackButtonAction = SlackButtonAction;
class SlackCancelButtonAction extends SlackButtonAction {
    constructor(text = 'Cancel', value = 'cancel', cancellationText = 'Do you really want to cancel?', name = 'cancel') {
        super(name, text, value, exports.SlackActionButtonStyles.danger);
        {
            const confirmDialogue = {
                title: 'Are you sure?',
                text: cancellationText,
                ok_text: 'Yes',
                dismiss_text: 'No'
            };
            this.confirm = confirmDialogue;
        }
    }
}
exports.SlackCancelButtonAction = SlackCancelButtonAction;
class SlackSelectAction extends SlackAction {
    constructor(name, text, options = []) {
        super(name, text, exports.SlackActionTypes.select, options);
        this.options = options;
    }
}
exports.SlackSelectAction = SlackSelectAction;
class SlackSelectActionWithSlackContent extends SlackAction {
    constructor(name, text, dataSource = exports.SlackKnownDataSources.users) {
        super(name, text, exports.SlackActionTypes.select);
        this.data_source = dataSource;
    }
}
exports.SlackSelectActionWithSlackContent = SlackSelectActionWithSlackContent;
class SlackButtonsAttachmentFromAList {
    static createButtons(list) {
        const createdButtons = list.map((department) => new SlackButtonAction(department.label.toLocaleLowerCase().replace(' ', '_'), department.label, department.value, '#FFCCAA'));
        return createdButtons;
    }
    static createAttachments(list, callbackId) {
        const attachments = [];
        const buttons = this.createButtons(list);
        while (buttons.length > 0) {
            const fiveButtons = buttons.splice(0, 5);
            const slackAttachment = new SlackAttachment();
            slackAttachment.addFieldsOrActions('actions', fiveButtons);
            slackAttachment.addOptionalProps(callbackId);
            attachments.push(slackAttachment);
        }
        return attachments;
    }
}
exports.SlackButtonsAttachmentFromAList = SlackButtonsAttachmentFromAList;
exports.SlackDelayedSuccessResponse = new SlackInteractiveMessage('Thank you. Your request is processing');
exports.SlackFailureResponse = new SlackInteractiveMessage('Sorry, something went wrong. Please try again');
//# sourceMappingURL=SlackMessageModels.js.map