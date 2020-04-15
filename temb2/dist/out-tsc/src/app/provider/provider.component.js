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
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TripRequestService } from '../../app/admin/__services__/trip-request.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../shared/alert.service';
var ProviderComponent = /** @class */ (function () {
    function ProviderComponent(fb, activatedRoute, jwtHelperService, tripRequestService, alert) {
        this.fb = fb;
        this.activatedRoute = activatedRoute;
        this.jwtHelperService = jwtHelperService;
        this.tripRequestService = tripRequestService;
        this.alert = alert;
        this.succeeded = null;
        this.tripConfirmationForm = this.fb.group({
            driverName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
            driverPhoneNo: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{6,14}$/)]],
            vehicleModel: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            vehicleRegNo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            vehicleColor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        });
    }
    Object.defineProperty(ProviderComponent.prototype, "driverName", {
        get: function () {
            return this.tripConfirmationForm.get('driverName');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderComponent.prototype, "driverPhoneNo", {
        get: function () {
            return this.tripConfirmationForm.get('driverPhoneNo');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderComponent.prototype, "vehicleModel", {
        get: function () {
            return this.tripConfirmationForm.get('vehicleModel');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderComponent.prototype, "vehicleRegNo", {
        get: function () {
            return this.tripConfirmationForm.get('vehicleRegNo');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderComponent.prototype, "vehicleColor", {
        get: function () {
            return this.tripConfirmationForm.get('vehicleColor');
        },
        enumerable: true,
        configurable: true
    });
    ProviderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParamMap.subscribe(function (params) {
            if (params.has('token')) {
                var tokenParam = params.get('token');
                var decodedToken = _this.jwtHelperService.decodeToken(tokenParam);
                _this.teamId = decodedToken.teamId;
                _this.tripId = decodedToken.tripId;
                _this.providerId = decodedToken.providerId;
            }
        });
    };
    ProviderComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.providerId && this.tripId && this.teamId) {
            this.tripConfirmationForm.value.teamId = this.teamId;
            this.tripConfirmationForm.value.tripId = this.tripId;
            this.tripConfirmationForm.value.providerId = this.providerId;
            this.tripRequestService.providerConfirm(this.tripConfirmationForm.value)
                .subscribe(function (response) {
                _this.alert.success(response.message.message);
                _this.succeeded = true;
            }, function (error) {
                var errorMessage = error.error.error;
                errorMessage
                    ? Object.keys(errorMessage).forEach(function (id) { _this.alert.error(errorMessage[id]); })
                    : _this.alert.error(error.error.message.error);
                _this.succeeded = false;
            });
        }
        else {
            this.alert.error('Invalid token');
            this.succeeded = false;
        }
    };
    ProviderComponent = __decorate([
        Component({
            selector: 'app-provider',
            templateUrl: './provider.component.html',
            styleUrls: ['./provider.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ActivatedRoute,
            JwtHelperService,
            TripRequestService,
            AlertService])
    ], ProviderComponent);
    return ProviderComponent;
}());
export { ProviderComponent };
//# sourceMappingURL=provider.component.js.map