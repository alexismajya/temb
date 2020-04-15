var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseInventoryComponent } from './../../base-inventory/base-inventory.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppEventService } from '../../../shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';
var DriverInventoryComponent = /** @class */ (function (_super) {
    __extends(DriverInventoryComponent, _super);
    function DriverInventoryComponent(driversService, appEventsService, activatedRoute, dialog) {
        var _this = _super.call(this, appEventsService, activatedRoute, dialog) || this;
        _this.driversService = driversService;
        _this.appEventsService = appEventsService;
        _this.activatedRoute = activatedRoute;
        _this.dialog = dialog;
        _this.drivers = [];
        _this.displayText = 'No Drivers yet';
        _this.createText = 'Add a Driver';
        _this.driverInfoEventEmitter = new EventEmitter();
        return _this;
    }
    DriverInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.driversSubscription = this.activatedRoute.params.subscribe(function (data) { return _this.updateInventory.call(_this, data); });
        this.createSubscription = this.appEventsService.subscribe('newDriver', function () { return _this.getInventory.call(_this); });
        this.deleteSubscription = this.appEventsService.subscribe('driverDeletedEvent', function () { return _this.getInventory.call(_this); });
        this.updateSubscription = this.appEventsService.subscribe('updatedDriversEvent', function () { return _this.getInventory.call(_this); });
    };
    DriverInventoryComponent.prototype.loadData = function (size, page, sort, providerId) {
        var _this = this;
        this.driversService.get(size, page, sort, providerId).subscribe(function (driversData) {
            var _a = driversData.data, data = _a.data, totalItems = _a.pageMeta.totalItems;
            _this.totalItems = totalItems;
            _this.drivers = data;
            _this.isLoading = false;
            _this.emitData(_this.driverInfoEventEmitter);
        }, function () {
            _this.isLoading = false;
            _this.displayText = "Oops! We're having connection problems.";
        });
    };
    DriverInventoryComponent.prototype.ngOnDestroy = function () {
        if (this.deleteSubscription) {
            this.deleteSubscription.unsubscribe();
        }
        if (this.createSubscription) {
            this.createSubscription.unsubscribe();
        }
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DriverInventoryComponent.prototype, "providerTabRequestType", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], DriverInventoryComponent.prototype, "driverInfoEventEmitter", void 0);
    DriverInventoryComponent = __decorate([
        Component({
            selector: 'app-drivers',
            templateUrl: './driver-inventory.component.html',
            styleUrls: [
                '../../cabs/cab-inventory/cab-inventory.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ]
        }),
        __metadata("design:paramtypes", [DriversInventoryService,
            AppEventService,
            ActivatedRoute,
            MatDialog])
    ], DriverInventoryComponent);
    return DriverInventoryComponent;
}(BaseInventoryComponent));
export { DriverInventoryComponent };
//# sourceMappingURL=driver-inventory.component.js.map