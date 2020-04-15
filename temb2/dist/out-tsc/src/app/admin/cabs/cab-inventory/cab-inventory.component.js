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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
import { BaseInventoryComponent } from '../../base-inventory/base-inventory.component';
var CabInventoryComponent = /** @class */ (function (_super) {
    __extends(CabInventoryComponent, _super);
    function CabInventoryComponent(cabService, appEventsService, activatedRoute, dialog) {
        var _this = _super.call(this, appEventsService, activatedRoute, dialog) || this;
        _this.cabService = cabService;
        _this.appEventsService = appEventsService;
        _this.activatedRoute = activatedRoute;
        _this.dialog = dialog;
        _this.cabs = [];
        _this.displayText = 'No Vehicles yet';
        _this.createText = 'Add a New Vehicle';
        _this.cabsInfoEventEmitter = new EventEmitter();
        return _this;
    }
    CabInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.vehiclesSubscription = this.activatedRoute.params.subscribe(function (data) { return _this.updateInventory(data); });
        this.updateSubscription = this.appEventsService.subscribe('newCab', function () { return _this.getInventory(); });
        this.updateSubscription = this.appEventsService.subscribe('updateCab', function () { return _this.getInventory(); });
    };
    CabInventoryComponent.prototype.loadData = function (size, page, sort, providerId) {
        var _this = this;
        this.cabService.get(size, page, sort, providerId).subscribe(function (cabsData) {
            _this.providerId = providerId;
            var _a = cabsData.data, data = _a.data, totalItems = _a.pageMeta.totalItems;
            _this.totalItems = totalItems;
            _this.cabs = data;
            _this.isLoading = false;
            _this.appEventsService.broadcast({
                name: 'updateHeaderTitle',
                content: {
                    badgeSize: _this.totalItems,
                    actionButton: _this.createText,
                    headerTitle: _this.providerName + " Vehicles",
                    providerId: _this.providerId
                }
            });
            _this.emitData(_this.cabsInfoEventEmitter);
        }, function () {
            _this.isLoading = false;
            _this.displayText = "Oops! We're having connection problems.";
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CabInventoryComponent.prototype, "providerTabRequestType", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CabInventoryComponent.prototype, "cabsInfoEventEmitter", void 0);
    CabInventoryComponent = __decorate([
        Component({
            selector: 'app-cabs',
            templateUrl: './cab-inventory.component.html',
            styleUrls: [
                './cab-inventory.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ]
        }),
        __metadata("design:paramtypes", [CabsInventoryService,
            AppEventService,
            ActivatedRoute,
            MatDialog])
    ], CabInventoryComponent);
    return CabInventoryComponent;
}(BaseInventoryComponent));
export { CabInventoryComponent };
//# sourceMappingURL=cab-inventory.component.js.map