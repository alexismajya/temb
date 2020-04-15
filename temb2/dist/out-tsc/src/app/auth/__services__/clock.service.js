var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
var ClockService = /** @class */ (function () {
    function ClockService() {
        // This clock will emit every 20 seconds.
        this.clock = interval(20000);
    }
    ClockService.prototype.getClock = function () {
        return this.clock.pipe(map(function () { return Date.now(); }));
    };
    ClockService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ClockService);
    return ClockService;
}());
export { ClockService };
//# sourceMappingURL=clock.service.js.map