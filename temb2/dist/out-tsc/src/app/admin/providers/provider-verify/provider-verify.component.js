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
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
var ProviderVerifyComponent = /** @class */ (function () {
    function ProviderVerifyComponent(route, providerService, iconRegistry, sanitizer, alert) {
        var _this = this;
        this.route = route;
        this.providerService = providerService;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.alert = alert;
        this.loading = false;
        this.verified = null;
        this.registerIcons = function () {
            var appIcon = [
                { name: 'combined-shape', url: 'assets/combined-shape.svg' },
            ];
            appIcon.forEach(function (item) {
                _this.iconRegistry.addSvgIcon(item.name, _this.sanitizer.bypassSecurityTrustResourceUrl(item.url));
            });
        };
        this.getPayload = function () {
            _this.loading = true;
            var data = { token: _this.token };
            _this.providerService.verify(data).subscribe(function (response) {
                if (response.success) {
                    _this.alert.success(response.message);
                    _this.verified = true;
                    _this.loading = false;
                }
            }, function (error) {
                _this.logError(error);
                _this.verified = false;
                _this.loading = false;
            });
        };
        this.registerIcons();
    }
    ProviderVerifyComponent.prototype.ngOnInit = function () {
        this.token = this.route.snapshot.params.token;
        this.getPayload();
    };
    ProviderVerifyComponent.prototype.logError = function (error) {
        if (error && error.status === 400) {
            var message = error.error.message;
            this.alert.error(message);
        }
    };
    ProviderVerifyComponent = __decorate([
        Component({
            selector: 'app-provider-verify',
            templateUrl: './provider-verify.component.html',
            styleUrls: [
                './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss',
                './provider-verify.component.scss',
            ]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            ProviderService,
            MatIconRegistry,
            DomSanitizer,
            AlertService])
    ], ProviderVerifyComponent);
    return ProviderVerifyComponent;
}());
export { ProviderVerifyComponent };
//# sourceMappingURL=provider-verify.component.js.map