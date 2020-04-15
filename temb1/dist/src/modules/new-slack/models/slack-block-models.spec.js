"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slack_block_models_1 = require("./slack-block-models");
describe('slack-block-models', () => {
    describe(slack_block_models_1.ActionBlock, () => {
        const block = new slack_block_models_1.ActionBlock('test');
        it('addElements: should add more elements', () => {
            block.elements = [
                new slack_block_models_1.ButtonElement('button1', '1', 'hello'),
                new slack_block_models_1.ButtonElement('button2', '2', 'world'),
            ];
            block.addElements([new slack_block_models_1.ButtonElement('button3', '3', 'tembea')]);
            const elements = block.elements;
            expect(elements.length).toEqual(3);
            expect(elements[0].action_id).toEqual('hello');
        });
    });
    describe(slack_block_models_1.SectionBlock, () => {
        let block;
        beforeAll(() => {
            block = new slack_block_models_1.SectionBlock();
        });
        it('addFields: should add fields', () => {
            block.fields = [new slack_block_models_1.SlackText('hello')];
            block.addFields([new slack_block_models_1.MarkdownText('Another Hello')]);
            expect(block.fields.length).toEqual(2);
        });
    });
    describe(slack_block_models_1.ensureSlackText, () => {
        it('should return slack text when given a string', () => {
            const text = slack_block_models_1.ensureSlackText('Kigali');
            expect(text).toEqual({ type: slack_block_models_1.TextTypes.plain, text: 'Kigali' });
        });
        it('should return slack text as it was passed in', () => {
            const text = slack_block_models_1.ensureSlackText(new slack_block_models_1.MarkdownText('hello'));
            expect(text.type).toEqual(slack_block_models_1.TextTypes.markdown);
        });
    });
    describe(slack_block_models_1.BlockMessage, () => {
        it('should add channel to the block message', () => {
            const message = new slack_block_models_1.BlockMessage([], 'operations', 'text');
            expect(message.channel).toEqual('operations');
        });
    });
    describe(slack_block_models_1.PlainText, () => {
        it('should return a slack text that accepts emojis', () => {
            const text = new slack_block_models_1.PlainText('Hello', true);
            expect(text.emoji).toBeTruthy();
        });
    });
});
//# sourceMappingURL=slack-block-models.spec.js.map