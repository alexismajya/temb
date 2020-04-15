// tslint:disable: variable-name
import { SlackActionButtonStyles } from '../../slack/SlackModels/SlackMessageModels';

// constants
export const BlockTypes = Object.freeze({
  section: 'section',
  divider: 'divider',
  actions: 'actions',
  image: 'image',
  input: 'input',
});

export const ElementTypes = Object.freeze({
  button: 'button',
  channelSelect: 'channels_select',
  userSelect: 'users_select',
  staticSelect: 'static_select',
  datePicker: 'datepicker',
  textInput: 'plain_text_input',
  multiSelect: 'multi_static_select',
  externalSelect: 'external_select',
});

export const TextTypes = Object.freeze({
  plain: 'plain_text',
  markdown: 'mrkdwn',
});

export class BlockMessage<T extends Block> {
  constructor(
    public readonly blocks: T[],
    public readonly channel?: string,
    public readonly text?: string) { }
}

export class SlackText {
  constructor(public readonly text: string, public readonly type = TextTypes.plain) { }
}

export class PlainText extends SlackText {
  constructor(text: string, public readonly emoji = false) {
    super(text, TextTypes.plain);
  }
}

export class MarkdownText extends SlackText {
  constructor(text: string) {
    super(text, TextTypes.markdown);
  }
}

export const ensureSlackText = (text: string | SlackText) => (typeof text === 'string'
  ? new SlackText(text) : text);

// block and children
export class Block {
  text: SlackText;
  elements: Element[] | any[];

  constructor(public readonly type = BlockTypes.section, public readonly block_id?: string) {}
  addText(text: string | SlackText) {
    this.text = ensureSlackText(text);
    return this;
  }
}

export class SectionBlock extends Block {
  fields: SlackText[];
  accessory: any;

  constructor(blockId?: string) {
    super(BlockTypes.section, blockId);
  }

  addFields(fields: SlackText[]) {
    if (this.fields && this.fields.length > 0) {
      this.fields = this.fields.concat([...fields]);
      return this;
    }
    this.fields = [...fields];
    return this;
  }

  addAccessory(accessory: any) {
    this.accessory = accessory;
    return this;
  }
}

export class ActionBlock extends Block {
  elements: Element[];
  accessory: any;
  constructor(blockId: string) {
    super(BlockTypes.actions, blockId);
  }

  addElements<T extends Element>(elements: T[]) {
    if (this.elements && this.elements.length > 0) {
      this.elements = this.elements.concat([...elements]);
      return this;
    }
    this.elements = [...elements];
    return this;
  }
}

export class InputBlock<T extends Element> extends Block {
  label: SlackText;
  hint: SlackText;
  element: T;
  constructor(element: T,
    label: string, blockId: string, public readonly optional = false, hint?: string) {
    super(BlockTypes.input, blockId);
    this.element = element;
    this.label = ensureSlackText(label);
    this.hint = ensureSlackText(hint);
  }
}

export class ImageBlock extends Block {
  title: SlackText;
  image_url: string;
  alt_text: string;
  constructor(title: string | SlackText, imageUrl: string, altText: string) {
    super(BlockTypes.image);
    this.title = ensureSlackText(title);
    this.image_url = imageUrl;
    this.alt_text = altText;
  }
}

export class Element {
  constructor(public readonly type: string) { }
}

export class TextInput extends Element {
  placeholder: SlackText;
  constructor(
    placeholder: string,
    public action_id: string,
    public readonly multiline = false,
    public readonly initial_value?: string,
  ) {
    super(ElementTypes.textInput);
    this.placeholder = ensureSlackText(placeholder);
  }
}

interface IConfirmArgs {
  title: SlackText;
  text: SlackText;
  confirm: SlackText;
  deny: SlackText;
}

export class ButtonElement extends Element {
  text: SlackText;
  value: string;
  action_id: string;
  style: string;
  confirm: any;

  constructor(text: string | SlackText, value: string,
    actionId: string, style : string = SlackActionButtonStyles.primary, confirm?: IConfirmArgs) {
    super(ElementTypes.button);
    this.text = ensureSlackText(text);
    this.value = value;
    this.action_id = actionId;
    this.style = style;
    this.confirm = confirm;
  }
}

/**
 * NOTE: It does not support markdown texts
 */
export interface IConfirmOptions {
  title: string;
  description: string;
  confirmText: string;
  denyText: string;
}

/**
 *
 */
export class CancelButtonElement extends ButtonElement {
  constructor(text: string | SlackText, value: string,
    actionId: string, options: IConfirmOptions) {
    const confirm = {
      title: ensureSlackText(options.title),
      text: ensureSlackText(options.description),
      confirm: ensureSlackText(options.confirmText),
      deny: ensureSlackText(options.denyText),
    };
    super(text, value, actionId, SlackActionButtonStyles.danger, confirm);
  }
}
interface InitialOption {
  text: SlackText;
  value: string;
}
export class SelectElement extends Element {
  action_id: string;
  placeholder: SlackText;
  options: any[];
  initial_option?: InitialOption;
  initial_user: string;
  constructor(
    type: string, placeholder: string, actionId: string,
    initialOption?: InitialOption, initialUser?: string,
  ) {
    super(type);
    this.action_id = actionId;
    this.placeholder = ensureSlackText(placeholder);
    initialOption ? this.initial_option = initialOption : this.initial_user = initialUser;
  }

  addOptions<T>(options: T[]) {
    this.options = options;
    return this;
  }
}

export class DatePicker extends Element {
  placeholder: SlackText;

  constructor(public initial_date: string, placeholder: string, public action_id: string) {
    super(ElementTypes.datePicker);
    this.placeholder = ensureSlackText(placeholder);
  }
}

export interface IModalOptions {
  submit?: string;
  close?: string;
  clearOnClose?: boolean;
  notifyOnClose?: boolean;
}

const defaultModalOptions = {
  submit: 'Submit',
  close: 'Cancel',
  clearOnClose: true,
  notifyOnClose: false,
};

export interface IModalBuilderOptions {
  modalTitle: string;
  modalOptions: IModalOptions;
  inputBlocks: InputBlock<any>[];
  callbackId: string;
  metadata?: string;
}

export class Modal {
  type: string;
  title: SlackText;
  submit: SlackText;
  close: SlackText;
  clear_on_close: boolean;
  notify_on_close: boolean;
  callback_id: string;
  blocks: any;
  private_metadata: string;

  constructor(title: string, options: IModalOptions = defaultModalOptions) {
    this.type = 'modal';
    this.title = ensureSlackText(title);
    this.submit = ensureSlackText(options.submit);
    this.close = ensureSlackText(options.close);
    this.clear_on_close = options.clearOnClose;
    this.notify_on_close = options.notifyOnClose;
  }

  addCallbackId(callbackId: string) {
    this.callback_id = callbackId;
    return this;
  }

  addBlocks<T extends Block>(blocks: T[]) {
    this.blocks = blocks;
    return this;
  }

  addMetadata(metadata: string) {
    this.private_metadata = metadata;
    return this;
  }

  static createModal(opts: IModalBuilderOptions) {
    const modal = new Modal(opts.modalTitle, opts.modalOptions).addBlocks(opts.inputBlocks)
      .addCallbackId(opts.callbackId)
      .addMetadata(opts.metadata);
    return modal;
  }
}
