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
import { RoutesInventoryService } from 'src/app/admin/__services__/routes-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { UpdatePageContentService } from 'src/app/shared/update-page-content.service';
import { ProviderService } from '../../../__services__/providers.service';
import { GoogleAnalyticsService } from '../../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../../utils/analytics-helper';
var RoutesInventoryEditModalComponent = /** @class */ (function () {
    function RoutesInventoryEditModalComponent(dialogRef, alert, data, routeService, updatePage, providerService, analytics) {
        this.dialogRef = dialogRef;
        this.alert = alert;
        this.data = data;
        this.routeService = routeService;
        this.updatePage = updatePage;
        this.providerService = providerService;
        this.analytics = analytics;
        this.providers = [];
    }
    RoutesInventoryEditModalComponent.prototype.ngOnInit = function () {
        this.loading = false;
        this.getProviders();
    };
    RoutesInventoryEditModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    RoutesInventoryEditModalComponent.prototype.getProviders = function () {
        var _this = this;
        this.providerService.getProviders().subscribe(function (res) {
            if (res.success) {
                _this.providers = res.data.providers;
            }
        });
    };
    RoutesInventoryEditModalComponent.prototype.editRoute = function (data) {
        var _this = this;
        this.loading = true;
        var _a = this.data, id = _a.id, name = _a.name, takeOff = _a.takeOff, capacity = _a.capacity, batch = _a.batch, status = _a.status;
        var providerId = data.providerId;
        var routeDetails = { name: name, takeOff: takeOff, providerId: providerId, capacity: capacity, batch: batch, status: status };
        this.routeService.changeRouteStatus(id, routeDetails).subscribe(function (res) {
            if (res.success) {
                _this.updatePage.triggerSuccessUpdateActions('updateRouteInventory', res.message);
                _this.analytics.sendEvent(eventsModel.Routes, modelActions.UPDATE);
                _this.dialogRef.close();
            }
        }, function (err) {
            _this.alert.error('Something went wrong');
            _this.dialogRef.close();
        });
    };
    RoutesInventoryEditModalComponent = __decorate([
        Component({
            templateUrl: './routes-inventory-edit-modal.component.html',
            styleUrls: ['./routes-inventory-edit-modal.component.scss']
        }),
        __param(2, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            AlertService, Object, RoutesInventoryService,
            UpdatePageContentService,
            ProviderService,
            GoogleAnalyticsService])
    ], RoutesInventoryEditModalComponent);
    return RoutesInventoryEditModalComponent;
}());
export { RoutesInventoryEditModalComponent };
//# sourceMappingURL=routes-inventory-edit-modal.component.js.map