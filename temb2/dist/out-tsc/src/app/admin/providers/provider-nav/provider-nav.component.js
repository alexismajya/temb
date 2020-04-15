var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AppEventService } from '../../../shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
var ProviderNavComponent = /** @class */ (function () {
    function ProviderNavComponent(appEventService, activatedRoute) {
        this.appEventService = appEventService;
        this.activatedRoute = activatedRoute;
        this.data = {};
    }
    ProviderNavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.providerId = params.providerId;
        });
    };
    ProviderNavComponent.prototype.tabChanged = function (event) {
        var broadcastPayload = {};
        var textLabel = event.tab.textLabel;
        switch (textLabel) {
            case 'Vehicles':
                broadcastPayload = {
                    headerTitle: this.data.providerVehicles.providerName + " Vehicles",
                    badgeSize: this.data.providerVehicles.totalItems,
                    providerId: this.providerId,
                    actionButton: 'Add a New Vehicle'
                };
                break;
            case 'Drivers':
                broadcastPayload = {
                    headerTitle: this.data.providerDrivers.providerName + " Drivers",
                    badgeSize: this.data.providerDrivers.totalItems,
                    providerId: this.providerId,
                    actionButton: 'Add Driver'
                };
                break;
        }
        this.appEventService.broadcast({
            name: 'updateHeaderTitle',
            content: broadcastPayload
        });
    };
    ProviderNavComponent.prototype.updateProviderHeader = function (event) {
        this.data[event.providerTabRequestType] = event;
    };
    ProviderNavComponent = __decorate([
        Component({
            selector: 'app-provider-nav',
            templateUrl: './provider-nav.component.html',
            styleUrls: ['./provider-nav.component.scss']
        }),
        __metadata("design:paramtypes", [AppEventService,
            ActivatedRoute])
    ], ProviderNavComponent);
    return ProviderNavComponent;
}());
export { ProviderNavComponent };
//# sourceMappingURL=provider-nav.component.js.map