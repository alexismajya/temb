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
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
var DeleteCabModalComponent = /** @class */ (function () {
    function DeleteCabModalComponent(cabService, dialog, alert, data) {
        this.cabService = cabService;
        this.dialog = dialog;
        this.alert = alert;
        this.data = data;
        this.refresh = new EventEmitter();
        this.cab = this.data.cab;
    }
    DeleteCabModalComponent.prototype.closeDialog = function () {
        this.dialog.close();
        this.refresh.emit();
    };
    DeleteCabModalComponent.prototype.delete = function () {
        var _this = this;
        this.cabService.delete(this.cab.id).subscribe(function (response) {
            var success = response.success, message = response.message;
            if (success) {
                _this.alert.success(message);
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
    ], DeleteCabModalComponent.prototype, "refresh", void 0);
    DeleteCabModalComponent = __decorate([
        Component({
            templateUrl: './delete-cab-dialog.component.html',
            styleUrls: ['./delete-cab-dialog.component.scss']
        }),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [CabsInventoryService,
            MatDialogRef,
            AlertService, Object])
    ], DeleteCabModalComponent);
    return DeleteCabModalComponent;
}());
export { DeleteCabModalComponent };
//# sourceMappingURL=delete-cab-dialog.component.js.map