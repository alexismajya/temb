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
import { RouteRequestService } from '../../__services__/route-request.service';
import { AppEventService } from '../../../shared/app-events.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var RouteApproveDeclineModalComponent = /** @class */ (function () {
    function RouteApproveDeclineModalComponent(dialogRef, authService, routeService, appEventService, analytics, data) {
        this.dialogRef = dialogRef;
        this.authService = authService;
        this.routeService = routeService;
        this.appEventService = appEventService;
        this.analytics = analytics;
        this.data = data;
        this.disableOtherInput = false;
        this.auto = null;
    }
    RouteApproveDeclineModalComponent.prototype.ngOnInit = function () {
        this.loading = false;
    };
    RouteApproveDeclineModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    RouteApproveDeclineModalComponent.prototype.approve = function (values) {
        this.setLoading(true);
        var routeName = values.routeName, takeOff = values.takeOff, comment = values.comment;
        var routeDetails = { routeName: routeName, takeOff: takeOff };
        var routeRequestId = this.data.routeRequestId;
        delete this.selectedProvider.user.slackId;
        this.handleAction(this.routeService.approveRouteRequest(routeRequestId, comment, routeDetails, this.selectedProvider));
    };
    RouteApproveDeclineModalComponent.prototype.decline = function (values) {
        this.setLoading(true);
        var routeRequestId = this.data.routeRequestId;
        var comment = values.comment;
        this.handleAction(this.routeService.declineRequest(routeRequestId, comment));
    };
    RouteApproveDeclineModalComponent.prototype.handleAction = function (action) {
        var _this = this;
        action.subscribe(function () {
            _this.closeDialog();
            _this.appEventService.broadcast({ name: 'updateRouteRequestStatus' });
            _this.analytics.sendEvent(eventsModel.RouteRequest, modelActions.UPDATE);
        }, function () { return _this.setLoading(false); });
    };
    RouteApproveDeclineModalComponent.prototype.setLoading = function (value) {
        this.loading = value;
    };
    RouteApproveDeclineModalComponent.prototype.setAuto = function (event) {
        this.auto = event;
    };
    RouteApproveDeclineModalComponent.prototype.clearRouteFields = function (event) {
        var value = event.target.value;
        if (value === '') {
            this.disableOtherInput = false;
            this.approveForm.form.patchValue(this.selectedProviderOption);
        }
    };
    RouteApproveDeclineModalComponent.prototype.clickedRouteProviders = function (event) {
        this.selectedProvider = event;
        this.disableOtherInput = true;
        this.approveForm.form.patchValue(event);
    };
    __decorate([
        ViewChild('approveForm'),
        __metadata("design:type", NgForm)
    ], RouteApproveDeclineModalComponent.prototype, "approveForm", void 0);
    RouteApproveDeclineModalComponent = __decorate([
        Component({
            templateUrl: 'route-approve-decline-modal.component.html',
            styleUrls: ['route-approve-decline-modal.component.scss']
        }),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            AuthService,
            RouteRequestService,
            AppEventService,
            GoogleAnalyticsService, Object])
    ], RouteApproveDeclineModalComponent);
    return RouteApproveDeclineModalComponent;
}());
export { RouteApproveDeclineModalComponent };
//# sourceMappingURL=route-approve-decline-modal.component.js.map