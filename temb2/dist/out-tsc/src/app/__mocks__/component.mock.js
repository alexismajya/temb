import { Component, EventEmitter } from '@angular/core';
export function MockComponent(selector, options) {
    if (options === void 0) { options = {}; }
    var metadata = {
        selector: selector,
        template: options.template || '',
        inputs: options.inputs || [],
        outputs: options.outputs || [],
        exportAs: options.exportAs || ''
    };
    var Mock = /** @class */ (function () {
        function Mock() {
            var _this = this;
            metadata.outputs.forEach(function (method) {
                _this[method] = new EventEmitter();
            });
        }
        return Mock;
    }());
    return Component(metadata)(Mock);
}
//# sourceMappingURL=component.mock.js.map