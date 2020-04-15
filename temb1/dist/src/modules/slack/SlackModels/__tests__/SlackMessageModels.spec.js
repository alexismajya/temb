"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../SlackMessageModels");
describe('Slack Message models test', () => {
    it('should create SlackInteractiveMessage object', () => {
        const result = new SlackMessageModels_1.SlackInteractiveMessage('text', 'attached', 'channel');
        expect(result).toHaveProperty('text', 'text');
        expect(result).toHaveProperty('attachments', 'attached');
        expect(result).toHaveProperty('channel', 'channel');
    });
    it('should create SlackAttachment object', () => {
        const result = new SlackMessageModels_1.SlackAttachment('title', 'text', 'author', 'icon', 'img', 'type', 'color');
        result.addOptionalProps('callback');
        result.addFieldsOrActions('fields', [{}]);
        result.addMarkdownIn(['text']);
        expect(result).toHaveProperty('title', 'title');
        expect(result).toHaveProperty('text', 'text');
        expect(result).toHaveProperty('author_name', 'author');
        expect(result).toHaveProperty('author_icon', 'icon');
        expect(result).toHaveProperty('image_url', 'img');
        expect(result).toHaveProperty('fallback', 'fallback');
        expect(result).toHaveProperty('callback_id', 'callback');
        expect(result).toHaveProperty('fields', [{}]);
        expect(result).toHaveProperty('mrkdwn_in', ['text']);
    });
    it('should create SlackAttachmentField object', () => {
        const result = new SlackMessageModels_1.SlackAttachmentField('AttachmentTitle', 'AttachValue', 'short');
        expect(result).toHaveProperty('title', 'AttachmentTitle');
        expect(result).toHaveProperty('value', 'AttachValue');
        expect(result).toHaveProperty('short', 'short');
    });
    it('should create SlackAction object', () => {
        const result = new SlackMessageModels_1.SlackAction('ActionName', 'ActionText', 'ActionType');
        expect(result).toHaveProperty('name', 'ActionName');
        expect(result).toHaveProperty('text', 'ActionText');
        expect(result).toHaveProperty('type', 'ActionType');
    });
    it('should create SlackButtonAction object', () => {
        const result = new SlackMessageModels_1.SlackButtonAction('buttonName', 'buttonText', 'buttonValue');
        expect(result).toHaveProperty('name', 'buttonName');
        expect(result).toHaveProperty('text', 'buttonText');
        expect(result).toHaveProperty('value', 'buttonValue');
    });
    it('should create SlackCancelButtonAction object', () => {
        const result = new SlackMessageModels_1.SlackCancelButtonAction();
        expect(result).toHaveProperty('name', 'cancel');
        expect(result).toHaveProperty('text', 'Cancel');
        expect(result).toHaveProperty('value', 'cancel');
        expect(result).toHaveProperty('confirm');
    });
    it('should create SlackSelectAction object', () => {
        const result = new SlackMessageModels_1.SlackSelectAction('selectSlack', 'selectSlackText');
        expect(result).toHaveProperty('name', 'selectSlack');
        expect(result).toHaveProperty('text', 'selectSlackText');
    });
    it('should create SlackSelectActionWithSlackContent object', () => {
        const result = new SlackMessageModels_1.SlackSelectActionWithSlackContent('slack', 'slackText');
        expect(result).toHaveProperty('name', 'slack');
        expect(result).toHaveProperty('text', 'slackText');
    });
});
describe('SlackButtons Attachment Test', () => {
    it('createButtons test', () => {
        const list = [{ label: 'people', value: 'pValue' }, { label: 'peo', value: 'pValue' }];
        const result = SlackMessageModels_1.SlackButtonsAttachmentFromAList.createButtons(list);
        expect(result[0]).toHaveProperty('name', 'people');
    });
    it('createAttachments List test', () => {
        const list = [{ label: 'people', value: 'pValue' }, { label: 'peo', value: 'pValue' }];
        const result = SlackMessageModels_1.SlackButtonsAttachmentFromAList.createAttachments(list, 'callback');
        expect(result[0]).toHaveProperty('actions');
    });
});
//# sourceMappingURL=SlackMessageModels.spec.js.map