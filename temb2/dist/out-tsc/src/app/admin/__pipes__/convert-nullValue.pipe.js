var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var ConvertNullValue = /** @class */ (function () {
    function ConvertNullValue() {
    }
    ConvertNullValue.prototype.transform = function (value, fallback) {
        if (fallback === void 0) { fallback = ''; }
        if (value === null) {
            return fallback;
        }
        return value;
    };
    ConvertNullValue = __decorate([
        Pipe({
            name: 'convertNullValue'
        })
    ], ConvertNullValue);
    return ConvertNullValue;
}());
export { ConvertNullValue };
//# sourceMappingURL=convert-nullValue.pipe.js.map