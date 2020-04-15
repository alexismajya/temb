"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("./SlackMessageModels");
class SlackDialogModel {
    constructor(triggerId, dialog) {
        this.trigger_id = triggerId;
        this.dialog = dialog;
    }
}
exports.SlackDialogModel = SlackDialogModel;
class SlackDialog {
    constructor(callbackId, title, submitLabel, notifyOnCancel, state) {
        this.callback_id = callbackId;
        this.title = title;
        this.submit_label = submitLabel;
        this.notify_on_cancel = notifyOnCancel;
        this.state = state;
    }
    addElements(elements) {
        if (Array.isArray(elements)) {
            if (this.elements && this.elements.length > 0) {
                this.elements.push(...elements);
            }
            else {
                this.elements = elements;
            }
        }
    }
}
exports.SlackDialog = SlackDialog;
class SlackDialogElement {
    constructor(label, name) {
        this.label = label;
        this.name = name;
    }
}
exports.SlackDialogElement = SlackDialogElement;
class SlackDialogError {
    constructor(name, error) {
        this.name = name;
        this.error = error;
    }
}
exports.SlackDialogError = SlackDialogError;
class SlackDialogTextarea extends SlackDialogElement {
    constructor(label, name, placeholder, hint, value) {
        super(label, name);
        this.type = SlackMessageModels_1.SlackActionTypes.textarea;
        this.hint = hint;
        this.placeholder = placeholder;
        this.value = value;
    }
}
exports.SlackDialogTextarea = SlackDialogTextarea;
class SlackDialogText extends SlackDialogElement {
    constructor(label, name, placeholder, optional = false, hint, defaultValue) {
        super(label, name);
        this.type = SlackMessageModels_1.SlackActionTypes.text;
        this.placeholder = placeholder;
        this.hint = hint;
        this.optional = optional;
        this.value = defaultValue;
    }
}
exports.SlackDialogText = SlackDialogText;
class SlackDialogSelect extends SlackDialogElement {
    constructor(label, name) {
        super(label, name);
        this.type = SlackMessageModels_1.SlackActionTypes.select;
    }
}
exports.SlackDialogSelect = SlackDialogSelect;
class SlackDialogSelectElementWithOptions extends SlackDialogSelect {
    constructor(label, name, options, defaultValue) {
        super(label, name);
        this.options = options;
        this.value = defaultValue;
    }
}
exports.SlackDialogSelectElementWithOptions = SlackDialogSelectElementWithOptions;
class SlackDialogSelectElementWithOptionGroups extends SlackDialogSelect {
    constructor(label, name, optionGroups) {
        super(label, name);
        this.option_groups = optionGroups;
    }
}
exports.SlackDialogSelectElementWithOptionGroups = SlackDialogSelectElementWithOptionGroups;
class SlackDialogElementWithDataSource extends SlackDialogSelect {
    constructor(label, name, dataSource = SlackMessageModels_1.SlackKnownDataSources.users) {
        super(label, name);
        this.data_source = dataSource;
    }
}
exports.SlackDialogElementWithDataSource = SlackDialogElementWithDataSource;
//# sourceMappingURL=SlackDialogModels.js.map