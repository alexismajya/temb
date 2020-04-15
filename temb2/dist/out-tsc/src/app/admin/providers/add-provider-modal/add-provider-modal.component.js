var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProviderNotificationChannels, ProviderModel } from '../../../shared/models/provider.model';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import { SlackService } from '../../__services__/slack.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var AddProviderModalComponent = /** @class */ (function () {
    function AddProviderModalComponent(dialogRef, providerService, alert, appEventService, slackService, analytics) {
        this.dialogRef = dialogRef;
        this.providerService = providerService;
        this.alert = alert;
        this.appEventService = appEventService;
        this.slackService = slackService;
        this.analytics = analytics;
        this.slackChannels = [];
        this.executeFunction = new EventEmitter();
        this.provider = new ProviderModel();
        this.notificationChannels = Object.entries(ProviderNotificationChannels)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return ({ key: key, value: value });
        });
    }
    AddProviderModalComponent.prototype.ngOnInit = function () {
        this.loadChannels();
    };
    AddProviderModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddProviderModalComponent.prototype.logError = function (error) {
        if (error && error.status === 404) {
            this.alert.error('Provider user email entered does not exist');
        }
        else if (error && error.status === 409) {
            var message = error.error.message;
            this.alert.error(message);
        }
        else {
            this.alert.error('Something went wrong, please try again');
        }
    };
    AddProviderModalComponent.prototype.addProvider = function (data) {
        var _this = this;
        this.loading = true;
        this.providerService.add(data).subscribe(function (response) {
            if (response.success) {
                _this.alert.success(response.message);
                _this.appEventService.broadcast({ name: 'newProvider' });
                _this.analytics.sendEvent(eventsModel.Providers, modelActions.CREATE);
                _this.dialogRef.close();
                _this.loading = false;
            }
        }, function (error) {
            _this.logError(error);
            _this.loading = false;
        });
    };
    AddProviderModalComponent.prototype.loadChannels = function () {
        var _this = this;
        this.slackService.getChannels().subscribe(function (response) {
            if (response.success) {
                _this.slackChannels = response.data;
            }
        });
    };
    AddProviderModalComponent.prototype.toggleNotificationChannel = function (value) {
        this.provider.notificationChannel = value;
        switch (value) {
            case ProviderNotificationChannels['Slack Channel']:
                break;
            default:
                this.provider.channelId = undefined;
        }
    };
    AddProviderModalComponent.prototype.toggleSlackChannelId = function (value) {
        this.provider.channelId = value;
    };
    Object.defineProperty(AddProviderModalComponent.prototype, "showSlackChannels", {
        get: function () {
            return this.provider.notificationChannel === ProviderNotificationChannels['Slack Channel'];
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddProviderModalComponent.prototype, "executeFunction", void 0);
    AddProviderModalComponent = __decorate([
        Component({
            templateUrl: './add-provider-modal.component.html',
            styleUrls: [
                './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss',
                './add-provider-modal.component.scss',
            ]
        }),
        __metadata("design:paramtypes", [MatDialogRef,
            ProviderService,
            AlertService,
            AppEventService,
            SlackService,
            GoogleAnalyticsService])
    ], AddProviderModalComponent);
    return AddProviderModalComponent;
}());
export { AddProviderModalComponent };
//# sourceMappingURL=add-provider-modal.component.js.map