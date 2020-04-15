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
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FellowsService } from '../../../__services__/fellows.service';
import { AlertService } from 'src/app/shared/alert.service';
import { GoogleAnalyticsService } from '../../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../../utils/analytics-helper';
var DeleteFellowModalComponent = /** @class */ (function () {
    function DeleteFellowModalComponent(fellowsService, alertService, dialogRef, data, analytics) {
        this.fellowsService = fellowsService;
        this.alertService = alertService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.analytics = analytics;
        this.removeUser = new EventEmitter();
        this.fellow = this.data.fellow;
    }
    DeleteFellowModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DeleteFellowModalComponent.prototype.deleteFellow = function () {
        var _this = this;
        this.fellowsService.removeFellowFromRoute(this.fellow.id).subscribe(function (data) {
            _this.alertService.success(data.message);
            _this.removeUser.emit();
            _this.analytics.sendEvent(eventsModel.Engineers, modelActions.DELETE);
        }, function () {
            _this.alertService.error('Something went terribly wrong, we couldn\`t remove the fellow. Please try again.');
        });
        this.dialogRef.close();
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], DeleteFellowModalComponent.prototype, "removeUser", void 0);
    DeleteFellowModalComponent = __decorate([
        Component({
            templateUrl: './delete-dialog.component.html',
            styleUrls: ['./delete-dialog.component.scss']
        }),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FellowsService,
            AlertService,
            MatDialogRef, Object, GoogleAnalyticsService])
    ], DeleteFellowModalComponent);
    return DeleteFellowModalComponent;
}());
export { DeleteFellowModalComponent };
//# sourceMappingURL=delete-dialog.component.js.map