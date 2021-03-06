"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackDialogModels_1 = require("../SlackDialogModels");
describe('Dialog model test', () => {
    it('should return a dialog model object', () => {
        const result = new SlackDialogModels_1.SlackDialogModel('triggerName', 'dialogName');
        expect(result).toHaveProperty('dialog', 'dialogName');
        expect(result).toHaveProperty('trigger_id', 'triggerName');
    });
    it('should return a dialog object', () => {
        const result = new SlackDialogModels_1.SlackDialog('callback', 'title', 'label', 'notify', 'state');
        result.addElements([{ label: 'slack' }]);
        expect(result).toHaveProperty('callback_id', 'callback');
        expect(result).toHaveProperty('notify_on_cancel', 'notify');
        expect(result).toHaveProperty('title', 'title');
        expect(result).toHaveProperty('submit_label', 'label');
        expect(result).toHaveProperty('state', 'state');
        expect(result).toHaveProperty('elements');
    });
    it('should return a slack dialog element object', () => {
        const result = new SlackDialogModels_1.SlackDialogElement('labelNames', 'nameNamed');
        expect(result).toHaveProperty('label', 'labelNames');
        expect(result).toHaveProperty('name', 'nameNamed');
    });
    it('should return dialog error object', () => {
        const result = new SlackDialogModels_1.SlackDialogError('errorName', 'your error');
        expect(result).toHaveProperty('name', 'errorName');
        expect(result).toHaveProperty('error', 'your error');
    });
    it('should return a slack dialog text object', () => {
        const result = new SlackDialogModels_1.SlackDialogText('labelName', 'dialogName', 'place', false, 'hinting');
        expect(result).toHaveProperty('label', 'labelName');
        expect(result).toHaveProperty('name', 'dialogName');
        expect(result).toHaveProperty('placeholder', 'place');
        expect(result).toHaveProperty('optional', false);
        expect(result).toHaveProperty('hint', 'hinting');
    });
    it('should return a slack dialog select object', () => {
        const result = new SlackDialogModels_1.SlackDialogSelect('selectLabel', 'selectName');
        expect(result).toHaveProperty('label', 'selectLabel');
        expect(result).toHaveProperty('name', 'selectName');
    });
    it('should return a slack dialog select element with options', () => {
        const result = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('optionsLabel', 'optionsName', 'myOptions');
        expect(result).toHaveProperty('label', 'optionsLabel');
        expect(result).toHaveProperty('name', 'optionsName');
        expect(result).toHaveProperty('options', 'myOptions');
    });
    it('should return a slack dialog select element with data source', () => {
        const result = new SlackDialogModels_1.SlackDialogElementWithDataSource('dataLabel', 'dataName', 'sourceName');
        expect(result).toHaveProperty('label', 'dataLabel');
        expect(result).toHaveProperty('name', 'dataName');
        expect(result).toHaveProperty('data_source', 'sourceName');
    });
});
//# sourceMappingURL=SlackDialogModels.spec.js.map