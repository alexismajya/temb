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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripRequestService } from '../../__services__/trip-request.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var UpdateTripProviderModalComponent = /** @class */ (function () {
    function UpdateTripProviderModalComponent(dialogRef, data, tripRequestService, analytics) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.tripRequestService = tripRequestService;
        this.analytics = analytics;
        this.tripProviderDetails = this.data.tripProviderDetails;
        this.submitBtnSpinnerLoading = false;
        this.providerUpdateForm = new FormGroup({
            provider: new FormControl(this.tripProviderDetails.providers[0], Validators.required)
        });
    }
    UpdateTripProviderModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    UpdateTripProviderModalComponent.prototype.changeSubmitSpinnerState = function (state) {
        this.submitBtnSpinnerLoading = state;
    };
    UpdateTripProviderModalComponent.prototype.updateTripProvider = function () {
        var _this = this;
        this.changeSubmitSpinnerState(true);
        var activeTripId = this.data.tripProviderDetails.activeTripId;
        var providerId = this.providerUpdateForm.value.provider.id;
        this.tripRequestService.confirmRequest(activeTripId, {
            providerId: providerId, comment: 'Updating trip\'s provider'
        })
            .subscribe(function () {
            _this.analytics.sendEvent(eventsModel.Trips, modelActions.UPDATE);
            _this.dialogRef.close();
        });
    };
    UpdateTripProviderModalComponent = __decorate([
        Component({
            selector: 'app-update-provider-trip',
            templateUrl: './update-trip-provider-modal.component.html',
            styleUrls: [
                './update-trip-provider-modal.component.scss'
            ]
        }),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, TripRequestService,
            GoogleAnalyticsService])
    ], UpdateTripProviderModalComponent);
    return UpdateTripProviderModalComponent;
}());
export { UpdateTripProviderModalComponent };
//# sourceMappingURL=update-trip-provider-modal.component.js.map