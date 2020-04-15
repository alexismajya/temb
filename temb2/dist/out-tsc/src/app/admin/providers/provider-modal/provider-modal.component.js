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
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var ProviderModalComponent = /** @class */ (function () {
    function ProviderModalComponent(dialogRef, data, providerService, toastService, appEventService, analytics) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.providerService = providerService;
        this.toastService = toastService;
        this.appEventService = appEventService;
        this.analytics = analytics;
        this.loading = false;
    }
    ProviderModalComponent.prototype.ngOnInit = function () { };
    ProviderModalComponent.prototype.editProvider = function (form, id) {
        var _this = this;
        var _a = form.value, email = _a.email, name = _a.name;
        this.loading = true;
        this.providerService.editProvider({ email: email, name: name }, id).subscribe(function (res) {
            _this.loading = false;
            if (res.success) {
                _this.toastService.success(res.message);
                _this.appEventService.broadcast({ name: 'updatedProvidersEvent' });
                _this.analytics.sendEvent(eventsModel.Providers, modelActions.UPDATE);
                _this.closeDialog();
            }
        }, function (error) {
            _this.loading = false;
            _this.toastService.error(error.error.message);
        });
    };
    ProviderModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    ProviderModalComponent = __decorate([
        Component({
            selector: 'app-provider-modal',
            templateUrl: './provider-modal.component.html',
            styleUrls: ['./provider-modal.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss',
                './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, ProviderService,
            AlertService,
            AppEventService,
            GoogleAnalyticsService])
    ], ProviderModalComponent);
    return ProviderModalComponent;
}());
export { ProviderModalComponent };
//# sourceMappingURL=provider-modal.component.js.map