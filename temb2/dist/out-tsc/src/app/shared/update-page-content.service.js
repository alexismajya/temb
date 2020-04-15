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
import { AlertService } from './alert.service';
import { AppEventService } from './app-events.service';
var UpdatePageContentService = /** @class */ (function () {
    function UpdatePageContentService(appEventService, alert) {
        this.appEventService = appEventService;
        this.alert = alert;
    }
    UpdatePageContentService.prototype.triggerSuccessUpdateActions = function (name, message) {
        this.alert.success(message);
        this.appEventService.broadcast({ name: name });
    };
    UpdatePageContentService = __decorate([
        Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [AppEventService,
            AlertService])
    ], UpdatePageContentService);
    return UpdatePageContentService;
}());
export { UpdatePageContentService };
//# sourceMappingURL=update-page-content.service.js.map