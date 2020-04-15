var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteDriverDialogComponent } from 'src/app/admin/drivers/delete-driver-dialog/delete-driver-dialog.component';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import { DriverEditModalComponent } from '../driver-edit-modal/driver-edit-modal.component';
var DriverCardComponent = /** @class */ (function () {
    function DriverCardComponent(dialog, alert, appEventService) {
        this.dialog = dialog;
        this.alert = alert;
        this.appEventService = appEventService;
        this.showOptions = new EventEmitter();
        this.refreshWindow = new EventEmitter();
    }
    DriverCardComponent.prototype.ngOnInit = function () { };
    DriverCardComponent.prototype.openEditModal = function () {
        var _this = this;
        this.editDialogRef = this.dialog.open(DriverEditModalComponent, {
            width: '620px', panelClass: 'small-modal-panel-class',
            data: {
                name: this.driverName, email: this.driverEmail,
                driverNumber: this.driverNumber, driverPhoneNo: this.driverPhoneNo,
                id: this.id, providerId: this.providerId
            }
        });
        this.editDialogRef.afterClosed().subscribe(function () {
            _this.refreshWindow.emit();
        });
    };
    DriverCardComponent.prototype.showMoreOptions = function () {
        this.hidden = !this.hidden;
        this.showOptions.emit();
    };
    DriverCardComponent.prototype.showDeleteModal = function () {
        var _this = this;
        this.dialogRef = this.dialog.open(DeleteDriverDialogComponent, {
            panelClass: 'delete-cab-modal',
            data: {
                driver: {
                    id: this.id,
                    name: this.driverName,
                    email: this.driverEmail,
                    phoneNo: this.driverPhoneNo,
                    providerId: this.driverProviderId
                }
            }
        });
        this.dialogRef.afterClosed().subscribe(function () {
            _this.refreshWindow.emit();
        });
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], DriverCardComponent.prototype, "showOptions", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], DriverCardComponent.prototype, "refreshWindow", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], DriverCardComponent.prototype, "id", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], DriverCardComponent.prototype, "providerId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DriverCardComponent.prototype, "driverName", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], DriverCardComponent.prototype, "showMoreIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DriverCardComponent.prototype, "driverPhoneNo", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DriverCardComponent.prototype, "driverEmail", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], DriverCardComponent.prototype, "driverProviderId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DriverCardComponent.prototype, "driverNumber", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], DriverCardComponent.prototype, "hidden", void 0);
    DriverCardComponent = __decorate([
        Component({
            selector: 'app-driver-card',
            templateUrl: './driver-card.component.html',
            styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss', './driver-card.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            AlertService,
            AppEventService])
    ], DriverCardComponent);
    return DriverCardComponent;
}());
export { DriverCardComponent };
//# sourceMappingURL=driver-card.component.js.map