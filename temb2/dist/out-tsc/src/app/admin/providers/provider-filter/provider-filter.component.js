var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from '../../__services__/providers.service';
var ProviderFilterComponent = /** @class */ (function () {
    function ProviderFilterComponent(providerService, ngZone, router) {
        var _this = this;
        this.providerService = providerService;
        this.ngZone = ngZone;
        this.router = router;
        this.providers = [];
        this.providersPrefix = 'admin/providers';
        this.getProvidersData = function () {
            _this.providerService.getProviders(1000, 1).subscribe(function (providerData) {
                var providers = providerData.data.providers;
                _this.providers = providers;
            });
        };
    }
    ProviderFilterComponent.prototype.ngOnInit = function () {
        this.getProvidersData();
    };
    ProviderFilterComponent.prototype.onProviderSelected = function (provider) {
        var _this = this;
        var providerUrl = this.providersPrefix + "/" + provider.name + "/" + provider.id;
        this.ngZone.run(function () { return _this.router.navigateByUrl(providerUrl); });
    };
    ProviderFilterComponent = __decorate([
        Component({
            selector: 'app-provider-filter',
            templateUrl: './provider-filter.component.html',
            styleUrls: ['../../cabs/cab-inventory/cab-inventory.component.scss']
        }),
        __metadata("design:paramtypes", [ProviderService,
            NgZone,
            Router])
    ], ProviderFilterComponent);
    return ProviderFilterComponent;
}());
export { ProviderFilterComponent };
//# sourceMappingURL=provider-filter.component.js.map