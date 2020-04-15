var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var ConvertTimePipe = /** @class */ (function () {
    function ConvertTimePipe() {
    }
    ConvertTimePipe.prototype.transform = function (time) {
        var _this = this;
        var engagementTimes = (time.split('-'));
        var transformedTime = engagementTimes.map(function (twentyFourHourTime) {
            var hour = (twentyFourHourTime.split(':'))[0];
            var min = (twentyFourHourTime.split(':'))[1];
            var part = _this.getPart(hour);
            min = _this.getMinutes(min);
            hour = _this.getHour(hour);
            return hour + ":" + min + part;
        });
        return transformedTime.join('<span class="text-in-value"> to </span>');
    };
    ConvertTimePipe.prototype.getPart = function (hour) {
        return hour >= 12 ? 'PM' : 'AM';
    };
    ConvertTimePipe.prototype.getMinutes = function (min) {
        return (min + '').length === 1 ? "0" + min : min;
    };
    ConvertTimePipe.prototype.getHour = function (hour) {
        if (hour === '00') {
            hour = 12;
            return hour;
        }
        hour = hour > 12 ? hour - 12 : hour;
        hour = (hour + '').length === 1 ? "0" + hour : hour;
        return hour;
    };
    ConvertTimePipe = __decorate([
        Pipe({
            name: 'convertTime'
        })
    ], ConvertTimePipe);
    return ConvertTimePipe;
}());
export { ConvertTimePipe };
//# sourceMappingURL=convert-time.pipe.js.map