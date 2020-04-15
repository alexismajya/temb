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
import { DriversInventoryService } from 'src/app/admin/__services__/drivers-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';
var DeleteDriverDialogComponent = /** @class */ (function () {
    function DeleteDriverDialogComponent(driverService, dialog, alert, appEventService, data) {
        this.driverService = driverService;
        this.dialog = dialog;
        this.alert = alert;
        this.appEventService = appEventService;
        this.data = data;
        this.refresh = new EventEmitter();
        this.driver = this.data.driver;
    }
    DeleteDriverDialogComponent.prototype.closeDialog = function () {
        this.dialog.close();
        this.refresh.emit();
    };
    DeleteDriverDialogComponent.prototype.delete = function () {
        var _this = this;
        var _a = this.driver, driverId = _a.id, providerId = _a.providerId;
        this.driverService.deleteDriver(providerId, driverId).subscribe(function (response) {
            var success = response.success, message = response.message;
            if (success) {
                _this.alert.success(message);
                _this.appEventService.broadcast({ name: 'driverDeletedEvent' });
            }
            else {
                _this.alert.error(message);
            }
        });
        this.closeDialog();
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], DeleteDriverDialogComponent.prototype, "refresh", void 0);
    DeleteDriverDialogComponent = __decorate([
        Component({
            templateUrl: './delete-driver-dialog.component.html',
            styleUrls: ['./delete-driver-dialog.component.scss']
        }),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [DriversInventoryService,
            MatDialogRef,
            AlertService,
            AppEventService, Object])
    ], DeleteDriverDialogComponent);
    return DeleteDriverDialogComponent;
}());
export { DeleteDriverDialogComponent };
//# sourceMappingURL=delete-driver-dialog.component.js.map