"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../slack/SlackModels/SlackMessageModels");
exports.BlockTypes = Object.freeze({
    section: 'section',
    divider: 'divider',
    actions: 'actions',
    image: 'image',
    input: 'input',
});
exports.ElementTypes = Object.freeze({
    button: 'button',
    channelSelect: 'channels_select',
    userSelect: 'users_select',
    staticSelect: 'static_select',
    datePicker: 'datepicker',
    textInput: 'plain_text_input',
    multiSelect: 'multi_static_select',
    externalSelect: 'external_select',
});
exports.TextTypes = Object.freeze({
    plain: 'plain_text',
    markdown: 'mrkdwn',
});
class BlockMessage {
    constructor(blocks, channel, text) {
        this.blocks = blocks;
        this.channel = channel;
        this.text = text;
    }
}
exports.BlockMessage = BlockMessage;
class SlackText {
    constructor(text, type = exports.TextTypes.plain) {
        this.text = text;
        this.type = type;
    }
}
exports.SlackText = SlackText;
class PlainText extends SlackText {
    constructor(text, emoji = false) {
        super(text, exports.TextTypes.plain);
        this.emoji = emoji;
    }
}
exports.PlainText = PlainText;
class MarkdownText extends SlackText {
    constructor(text) {
        super(text, exports.TextTypes.markdown);
    }
}
exports.MarkdownText = MarkdownText;
exports.ensureSlackText = (text) => (typeof text === 'string'
    ? new SlackText(text) : text);
class Block {
    constructor(type = exports.BlockTypes.section, block_id) {
        this.type = type;
        this.block_id = block_id;
    }
    addText(text) {
        this.text = exports.ensureSlackText(text);
        return this;
    }
}
exports.Block = Block;
class SectionBlock extends Block {
    constructor(blockId) {
        super(exports.BlockTypes.section, blockId);
    }
    addFields(fields) {
        if (this.fields && this.fields.length > 0) {
            this.fields = this.fields.concat([...fields]);
            return this;
        }
        this.fields = [...fields];
        return this;
    }
    addAccessory(accessory) {
        this.accessory = accessory;
        return this;
    }
}
exports.SectionBlock = SectionBlock;
class ActionBlock extends Block {
    constructor(blockId) {
        super(exports.BlockTypes.actions, blockId);
    }
    addElements(elements) {
        if (this.elements && this.elements.length > 0) {
            this.elements = this.elements.concat([...elements]);
            return this;
        }
        this.elements = [...elements];
        return this;
    }
}
exports.ActionBlock = ActionBlock;
class InputBlock extends Block {
    constructor(element, label, blockId, optional = false, hint) {
        super(exports.BlockTypes.input, blockId);
        this.optional = optional;
        this.element = element;
        this.label = exports.ensureSlackText(label);
        this.hint = exports.ensureSlackText(hint);
    }
}
exports.InputBlock = InputBlock;
class ImageBlock extends Block {
    constructor(title, imageUrl, altText) {
        super(exports.BlockTypes.image);
        this.title = exports.ensureSlackText(title);
        this.image_url = imageUrl;
        this.alt_text = altText;
    }
}
exports.ImageBlock = ImageBlock;
class Element {
    constructor(type) {
        this.type = type;
    }
}
exports.Element = Element;
class TextInput extends Element {
    constructor(placeholder, action_id, multiline = false, initial_value) {
        super(exports.ElementTypes.textInput);
        this.action_id = action_id;
        this.multiline = multiline;
        this.initial_value = initial_value;
        this.placeholder = exports.ensureSlackText(placeholder);
    }
}
exports.TextInput = TextInput;
class ButtonElement extends Element {
    constructor(text, value, actionId, style = SlackMessageModels_1.SlackActionButtonStyles.primary, confirm) {
        super(exports.ElementTypes.button);
        this.text = exports.ensureSlackText(text);
        this.value = value;
        this.action_id = actionId;
        this.style = style;
        this.confirm = confirm;
    }
}
exports.ButtonElement = ButtonElement;
class CancelButtonElement extends ButtonElement {
    constructor(text, value, actionId, options) {
        const confirm = {
            title: exports.ensureSlackText(options.title),
            text: exports.ensureSlackText(options.description),
            confirm: exports.ensureSlackText(options.confirmText),
            deny: exports.ensureSlackText(options.denyText),
        };
        super(text, value, actionId, SlackMessageModels_1.SlackActionButtonStyles.danger, confirm);
    }
}
exports.CancelButtonElement = CancelButtonElement;
class SelectElement extends Element {
    constructor(type, placeholder, actionId, initialOption, initialUser) {
        super(type);
        this.action_id = actionId;
        this.placeholder = exports.ensureSlackText(placeholder);
        initialOption ? this.initial_option = initialOption : this.initial_user = initialUser;
    }
    addOptions(options) {
        this.options = options;
        return this;
    }
}
exports.SelectElement = SelectElement;
class DatePicker extends Element {
    constructor(initial_date, placeholder, action_id) {
        super(exports.ElementTypes.datePicker);
        this.initial_date = initial_date;
        this.action_id = action_id;
        this.placeholder = exports.ensureSlackText(placeholder);
    }
}
exports.DatePicker = DatePicker;
const defaultModalOptions = {
    submit: 'Submit',
    close: 'Cancel',
    clearOnClose: true,
    notifyOnClose: false,
};
class Modal {
    constructor(title, options = defaultModalOptions) {
        this.type = 'modal';
        this.title = exports.ensureSlackText(title);
        this.submit = exports.ensureSlackText(options.submit);
        this.close = exports.ensureSlackText(options.close);
        this.clear_on_close = options.clearOnClose;
        this.notify_on_close = options.notifyOnClose;
    }
    addCallbackId(callbackId) {
        this.callback_id = callbackId;
        return this;
    }
    addBlocks(blocks) {
        this.blocks = blocks;
        return this;
    }
    addMetadata(metadata) {
        this.private_metadata = metadata;
        return this;
    }
    static createModal(opts) {
        const modal = new Modal(opts.modalTitle, opts.modalOptions).addBlocks(opts.inputBlocks)
            .addCallbackId(opts.callbackId)
            .addMetadata(opts.metadata);
        return modal;
    }
}
exports.Modal = Modal;
//# sourceMappingURL=slack-block-models.js.map