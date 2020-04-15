var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderModalComponent } from '../provider-modal/provider-modal.component';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import SubscriptionHelper from '../../../utils/unsubscriptionHelper';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var ProviderCardComponent = /** @class */ (function () {
    function ProviderCardComponent(dialog, providerService, alert, appEventService, analytics) {
        this.dialog = dialog;
        this.providerService = providerService;
        this.alert = alert;
        this.appEventService = appEventService;
        this.analytics = analytics;
        this.showOptions = new EventEmitter();
    }
    ProviderCardComponent.prototype.ngOnInit = function () { };
    ProviderCardComponent.prototype.openEditModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(ProviderModalComponent, {
            width: '620px', panelClass: 'small-modal-panel-class',
            data: { name: this.providerName, email: this.email, id: this.providerId }
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.hidden = !_this.hidden;
        });
    };
    ProviderCardComponent.prototype.deleteProvider = function (id) {
        var _this = this;
        this.providerService.deleteProvider(id).subscribe(function (res) {
            if (res.success) {
                _this.appEventService.broadcast({ name: 'providerDeletedEvent' });
                _this.alert.success(res.message);
                _this.analytics.sendEvent(eventsModel.Providers, modelActions.DELETE);
            }
        }, function (error) {
            _this.alert.error(error.error.message);
        });
    };
    ProviderCardComponent.prototype.showDeleteModal = function () {
        var _this = this;
        this.dialog.open(ConfirmModalComponent, {
            data: { displayText: "delete provider " + this.providerName + "  ", confirmText: 'Yes' }
        });
        this.confirmDeleteSubscription = this.appEventService.subscribe('confirmProviderDelete', function () {
            return _this.deleteProvider(_this.providerId);
        });
        this.closeDialogSubscription = this.appEventService.subscribe('closeConfirmationDialog', function () {
            return _this.hidden = !_this.hidden;
        });
    };
    ProviderCardComponent.prototype.showMoreOptions = function () {
        this.hidden = !this.hidden;
        this.showOptions.emit();
    };
    ProviderCardComponent.prototype.ngOnDestroy = function () {
        SubscriptionHelper.unsubscribeHelper([this.closeDialogSubscription, this.confirmDeleteSubscription]);
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], ProviderCardComponent.prototype, "showOptions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ProviderCardComponent.prototype, "username", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ProviderCardComponent.prototype, "providerName", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ProviderCardComponent.prototype, "email", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProviderCardComponent.prototype, "showMoreIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProviderCardComponent.prototype, "hidden", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProviderCardComponent.prototype, "providerId", void 0);
    ProviderCardComponent = __decorate([
        Component({
            selector: 'app-provider-card',
            templateUrl: './provider-card.component.html',
            styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            ProviderService,
            AlertService,
            AppEventService,
            GoogleAnalyticsService])
    ], ProviderCardComponent);
    return ProviderCardComponent;
}());
export { ProviderCardComponent };
//# sourceMappingURL=provider-card.component.js.map