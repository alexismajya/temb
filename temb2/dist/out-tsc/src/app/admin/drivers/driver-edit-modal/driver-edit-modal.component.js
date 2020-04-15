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
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
var DriverEditModalComponent = /** @class */ (function () {
    function DriverEditModalComponent(toastService, appEventService, data, driverService, dialogRef) {
        this.toastService = toastService;
        this.appEventService = appEventService;
        this.data = data;
        this.driverService = driverService;
        this.dialogRef = dialogRef;
        this.loading = false;
    }
    DriverEditModalComponent.prototype.ngOnInit = function () { };
    DriverEditModalComponent.prototype.editDriver = function (form, id, providerId) {
        var _this = this;
        var _a = form.value, driverName = _a.name, email = _a.email, driverNumber = _a.driverNumber, driverPhoneNo = _a.driverPhoneNo;
        this.loading = true;
        var driverDetails = {
            driverName: driverName, email: email, driverNumber: driverNumber, driverPhoneNo: driverPhoneNo
        };
        this.driverService.updateDriver(driverDetails, id, providerId).subscribe(function (res) {
            _this.loading = false;
            if (res.success) {
                var message = res.message;
                _this.toastService.success(message);
                _this.appEventService.broadcast({ name: 'updatedDriversEvent' });
                _this.closeDialog();
            }
        }, function (error) {
            _this.loading = false;
            _this.toastService.error(error.error.message);
        });
    };
    DriverEditModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DriverEditModalComponent = __decorate([
        Component({
            selector: 'app-driver-edit-modal',
            templateUrl: './driver-edit-modal.component.html',
            styleUrls: ['./driver-edit-modal.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss',
                './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __param(2, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [AlertService,
            AppEventService, Object, DriversInventoryService,
            MatDialogRef])
    ], DriverEditModalComponent);
    return DriverEditModalComponent;
}());
export { DriverEditModalComponent };
//# sourceMappingURL=driver-edit-modal.component.js.map