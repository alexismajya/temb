import { ensureSlackText, SlackText, BlockMessage, ActionBlock, SectionBlock,
  MarkdownText, TextTypes, PlainText, ButtonElement } from './slack-block-models';

describe('slack-block-models', () => {
  describe(ActionBlock, () => {
    const block = new ActionBlock('test');

    it('addElements: should add more elements', () => {
      block.elements = [
        new ButtonElement('button1', '1', 'hello'),
        new ButtonElement('button2', '2', 'world'),
      ];
      block.addElements([new ButtonElement('button3', '3', 'tembea')]);

      const elements = block.elements as ButtonElement[];
      expect(elements.length).toEqual(3);
      expect(elements[0].action_id).toEqual('hello');
    });
  });

  describe(SectionBlock, () => {
    let block: SectionBlock;

    beforeAll(() => {
      block = new SectionBlock();
    });

    it('addFields: should add fields', () => {
      block.fields = [new SlackText('hello')];
      block.addFields([new MarkdownText('Another Hello')]);
      expect(block.fields.length).toEqual(2);
    });
  });

  describe(ensureSlackText, () => {
    it('should return slack text when given a string', () => {
      const text = ensureSlackText('Kigali');
      expect(text).toEqual({ type: TextTypes.plain, text: 'Kigali' });
    });

    it('should return slack text as it was passed in', () => {
      const text = ensureSlackText(new MarkdownText('hello'));
      expect(text.type).toEqual(TextTypes.markdown);
    });
  });

  describe(BlockMessage, () => {
    it('should add channel to the block message', () => {
      const message = new BlockMessage([], 'operations', 'text');
      expect(message.channel).toEqual('operations');
    });
  });

  describe(PlainText, () => {
    it('should return a slack text that accepts emojis', () => {
      const text = new PlainText('Hello', true);
      expect(text.emoji).toBeTruthy();
    });
  });
});
