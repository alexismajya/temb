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
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
var TripApproveDeclineModalComponent = /** @class */ (function () {
    function TripApproveDeclineModalComponent(dialogRef, authService, tripRequestService, appEventService, alert, data) {
        this.dialogRef = dialogRef;
        this.authService = authService;
        this.tripRequestService = tripRequestService;
        this.appEventService = appEventService;
        this.alert = alert;
        this.data = data;
        this.cols = 3;
        this.rowHeight = '3:1';
        this.disableOtherInput = false;
        this.selectedCabOption = { driverName: '', driverPhoneNo: '', regNumber: '' };
        this.auto = null;
    }
    TripApproveDeclineModalComponent.prototype.ngOnInit = function () {
        this.loading = false;
        this.account = this.authService.getCurrentUser();
    };
    TripApproveDeclineModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    TripApproveDeclineModalComponent.prototype.confirm = function (values) {
        var _this = this;
        values.providerId = this.providerId;
        this.loading = true;
        var tripId = this.data.tripId;
        this.tripRequestService.confirmRequest(tripId, values)
            .subscribe(function () {
            _this.closeDialog();
            _this.appEventService.broadcast({ name: 'reInitializeTripRequest' });
        });
    };
    TripApproveDeclineModalComponent.prototype.decline = function (values) {
        var _this = this;
        this.loading = true;
        var tripId = this.data.tripId;
        var comment = values.comment;
        this.tripRequestService.declineRequest(tripId, comment)
            .subscribe(function () {
            _this.closeDialog();
            _this.appEventService.broadcast({ name: 'reInitializeTripRequest' });
        });
    };
    TripApproveDeclineModalComponent.prototype.setAuto = function (event) {
        this.auto = event;
    };
    TripApproveDeclineModalComponent.prototype.clearFields = function (event) {
        var value = event.target.value;
        if (value === '') {
            this.disableOtherInput = false;
            this.approveForm.form.patchValue(this.selectedCabOption);
        }
    };
    TripApproveDeclineModalComponent.prototype.clickedProviders = function (event) {
        this.providerId = event.providerUserId;
        this.invalidProviderSelected = false;
        this.disableOtherInput = true;
        this.approveForm.form.patchValue(event);
    };
    TripApproveDeclineModalComponent.prototype.handleInvalidProvider = function () {
        this.invalidProviderSelected = true;
        return this.alert.error('Provider selected doesnt exist');
    };
    __decorate([
        ViewChild('approveForm'),
        __metadata("design:type", NgForm)
    ], TripApproveDeclineModalComponent.prototype, "approveForm", void 0);
    TripApproveDeclineModalComponent = __decorate([
        Component({
            templateUrl: 'trip-approve-decline-modal.component.html',
            styleUrls: ['trip-approve-decline-modal.component.scss']
        }),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            AuthService,
            TripRequestService,
            AppEventService,
            AlertService, Object])
    ], TripApproveDeclineModalComponent);
    return TripApproveDeclineModalComponent;
}());
export { TripApproveDeclineModalComponent };
//# sourceMappingURL=trip-approve-decline-modal.component.js.map