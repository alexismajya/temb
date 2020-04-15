var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject } from '@angular/core';
import { TOASTR_TOKEN } from 'src/app/shared/toastr.service';
var AlertService = /** @class */ (function () {
    function AlertService(toastr) {
        this.toastr = toastr;
        this.options = {
            positionClass: 'toast-top-center',
            preventDuplicates: true
        };
    }
    AlertService.prototype.success = function (msg, title) {
        this.toastr.success(msg, title, this.options);
    };
    AlertService.prototype.info = function (msg, title) {
        return this.toastr.info(msg, title, this.options);
    };
    AlertService.prototype.warning = function (msg, title) {
        this.toastr.warning(msg, title, this.options);
    };
    AlertService.prototype.error = function (msg, title) {
        this.toastr.error(msg, title, this.options);
    };
    AlertService.prototype.clear = function (toastr) {
        this.toastr.clear(toastr);
    };
    AlertService = __decorate([
        Injectable(),
        __param(0, Inject(TOASTR_TOKEN)),
        __metadata("design:paramtypes", [Object])
    ], AlertService);
    return AlertService;
}());
export { AlertService };
//# sourceMappingURL=alert.service.js.map