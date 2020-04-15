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
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
var DriverModalComponent = /** @class */ (function () {
    function DriverModalComponent(dialogRef, data, appEventService, providerService, toastService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.appEventService = appEventService;
        this.providerService = providerService;
        this.toastService = toastService;
        this.loading = false;
    }
    DriverModalComponent_1 = DriverModalComponent;
    DriverModalComponent.createDriverObject = function (data) {
        var createObject = {};
        var _a = data.value, email = _a.email, driverName = _a.driverName, driverPhoneNo = _a.driverPhoneNo, driverNumber = _a.driverNumber;
        if (!email) {
            createObject.driverName = driverName;
            createObject.driverPhoneNo = driverPhoneNo;
            createObject.driverNumber = driverNumber;
            return createObject;
        }
        createObject = data.value;
        return createObject;
    };
    DriverModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DriverModalComponent.prototype.addDriver = function (form) {
        var _this = this;
        var driverObject = DriverModalComponent_1.createDriverObject(form);
        driverObject.providerId = this.data.providerId;
        this.loading = true;
        this.providerService.addDriver(driverObject).subscribe(function (res) {
            if (res.success) {
                _this.appEventService.broadcast({ name: 'newDriver' });
                _this.toastService.success(res.message);
                _this.closeDialog();
            }
        }, function (error) {
            _this.loading = false;
            _this.toastService.error(error.error.message);
        });
    };
    var DriverModalComponent_1;
    DriverModalComponent = DriverModalComponent_1 = __decorate([
        Component({
            selector: 'app-driver-modal',
            templateUrl: './driver-modal.component.html',
            styleUrls: ['./driver-modal.component.scss', '../../cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, AppEventService,
            ProviderService,
            AlertService])
    ], DriverModalComponent);
    return DriverModalComponent;
}());
export { DriverModalComponent };
//# sourceMappingURL=driver-modal.component.js.map