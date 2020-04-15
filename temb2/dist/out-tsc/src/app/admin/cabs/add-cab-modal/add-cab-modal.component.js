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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';
var AddCabsModalComponent = /** @class */ (function () {
    function AddCabsModalComponent(data, dialogRef, cabService, alert, appEventService) {
        this.data = data;
        this.dialogRef = dialogRef;
        this.cabService = cabService;
        this.alert = alert;
        this.appEventService = appEventService;
        this.executeFunction = new EventEmitter();
        this.cabData = this.data;
        this.modalHeader = this.cabData.id ? 'Edit' : 'Add a';
    }
    AddCabsModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddCabsModalComponent.prototype.response = function (responseData, action) {
        if (action === void 0) { action = 'newCab'; }
        if (responseData.success) {
            this.alert.success(responseData.message);
            this.appEventService.broadcast({ name: 'newCab' });
            this.loading = false;
            this.closeDialog();
        }
    };
    AddCabsModalComponent.prototype.addCab = function () {
        var _this = this;
        if (this.cabData.id) {
            return this.editCab(this.cabData);
        }
        this.loading = true;
        this.cabData.providerId = this.data.providerId;
        this.cabService.add(this.cabData)
            .subscribe(function (responseData) { return _this.response(responseData); }, function (error) {
            _this.displayError(error);
        });
    };
    AddCabsModalComponent.prototype.editCab = function (cab) {
        var _this = this;
        var id = cab.id, cabData = __rest(cab, ["id"]);
        this.loading = true;
        this.cabService.update(cabData, id).subscribe(function (responseData) { return _this.response(responseData, 'updateCab'); }, function (error) {
            _this.displayError(error);
        });
    };
    AddCabsModalComponent.prototype.displayError = function (error) {
        var status = error.status;
        this.loading = false;
        switch (status) {
            case 409:
                this.alert.error('A cab with the registration already exists');
                break;
            case 404:
                this.alert.error('A cab with the registration does not exist');
                break;
            default:
                this.alert.error(error.message);
        }
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddCabsModalComponent.prototype, "executeFunction", void 0);
    AddCabsModalComponent = __decorate([
        Component({
            templateUrl: './add-cab-modal.component.html',
            styleUrls: ['./add-cab-modal.component.scss']
        }),
        __param(0, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, MatDialogRef,
            CabsInventoryService,
            AlertService,
            AppEventService])
    ], AddCabsModalComponent);
    return AddCabsModalComponent;
}());
export { AddCabsModalComponent };
//# sourceMappingURL=add-cab-modal.component.js.map