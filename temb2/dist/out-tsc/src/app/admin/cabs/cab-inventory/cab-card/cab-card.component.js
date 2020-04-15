var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createDialogOptions } from './../../../../utils/helpers';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddCabsModalComponent } from '../../add-cab-modal/add-cab-modal.component';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { openDialog } from 'src/app/utils/generic-helpers';
var CabCardComponent = /** @class */ (function () {
    function CabCardComponent(dialog, cabService, alert) {
        this.dialog = dialog;
        this.cabService = cabService;
        this.alert = alert;
        this.refreshWindow = new EventEmitter();
        this.showOptions = new EventEmitter();
    }
    CabCardComponent.prototype.ngOnInit = function () { };
    CabCardComponent.prototype.delete = function (cabId) {
        var _this = this;
        this.cabService.delete(cabId).subscribe(function (response) {
            var success = response.success, message = response.message;
            if (success) {
                _this.alert.success(message);
                _this.refreshWindow.emit();
            }
            else {
                _this.alert.error(message);
            }
        });
    };
    CabCardComponent.prototype.showCabDeleteModal = function (cabId) {
        var _this = this;
        var dialogReference = openDialog(this.dialog, 'delete this cab');
        dialogReference.componentInstance.executeFunction.subscribe(function () {
            _this.delete(cabId);
        });
    };
    CabCardComponent.prototype.showCabEditModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddCabsModalComponent, createDialogOptions({
            id: this.id,
            model: this.model,
            regNumber: this.regNumber,
            capacity: this.capacity,
        }, '620px', 'small-modal-panel-class'));
        dialogRef.afterClosed().subscribe(function () {
            _this.hidden = !_this.hidden;
        });
    };
    CabCardComponent.prototype.showMoreOptions = function () {
        this.showOptions.emit();
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CabCardComponent.prototype, "refreshWindow", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], CabCardComponent.prototype, "showOptions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CabCardComponent.prototype, "id", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CabCardComponent.prototype, "model", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CabCardComponent.prototype, "regNumber", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CabCardComponent.prototype, "capacity", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CabCardComponent.prototype, "providerId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CabCardComponent.prototype, "hidden", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CabCardComponent.prototype, "showMoreIcon", void 0);
    CabCardComponent = __decorate([
        Component({
            selector: 'app-cab-card',
            templateUrl: './cab-card.component.html',
            styleUrls: ['./cab-card.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            CabsInventoryService,
            AlertService])
    ], CabCardComponent);
    return CabCardComponent;
}());
export { CabCardComponent };
//# sourceMappingURL=cab-card.component.js.map