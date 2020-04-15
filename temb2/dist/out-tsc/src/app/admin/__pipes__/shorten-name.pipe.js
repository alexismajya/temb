var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var ShortenNamePipe = /** @class */ (function () {
    function ShortenNamePipe() {
        this.defaultOption = {
            max: 8, fallbackText: 'NA'
        };
    }
    ShortenNamePipe.prototype.transform = function (value, args) {
        var _a = __assign({}, this.defaultOption, args), max = _a.max, fallbackText = _a.fallbackText;
        if (!value) {
            return fallbackText;
        }
        var maxTextLength = max;
        var result = value;
        if (value.indexOf(' ') > 0) {
            var regExp = /[\s]+/;
            var splitStr = value.replace(regExp, ' ').split(' ');
            var last = splitStr.pop();
            var initials = splitStr.map(function (item) { return item.charAt(0).toUpperCase(); }).join('.');
            result = initials + "." + last;
            maxTextLength += splitStr.length - 1;
        }
        var ellipse = result.length > maxTextLength;
        return "" + result.substring(0, maxTextLength) + ((ellipse) ? '...' : '');
    };
    ShortenNamePipe = __decorate([
        Pipe({
            name: 'shortenName'
        })
    ], ShortenNamePipe);
    return ShortenNamePipe;
}());
export { ShortenNamePipe };
//# sourceMappingURL=shorten-name.pipe.js.map