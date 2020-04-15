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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { AppEventService } from './../../../shared/app-events.service';
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { AlertService } from 'src/app/shared/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { HomeBaseService } from '../../../shared/homebase.service';
import { SlackService } from '../../__services__/slack.service';
import { AddressService } from '../../__services__/address.service';
import { CountryService } from '../../__services__/country.service';
import { NgForm } from '@angular/forms';
import { HomebaseHelper } from '../homebase-helper/homebase.helper';
var HomebaseModalComponent = /** @class */ (function () {
    function HomebaseModalComponent(dialogRef, data, toastService, appEventService, homebaseService, slackService, googleMapsService, addressService, countryService, homebaseHelper) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastService = toastService;
        this.appEventService = appEventService;
        this.homebaseService = homebaseService;
        this.slackService = slackService;
        this.googleMapsService = googleMapsService;
        this.addressService = addressService;
        this.countryService = countryService;
        this.homebaseHelper = homebaseHelper;
        this.loading = false;
        this.slackChannels = [];
        this.countryList = [];
        this.locationCoordinates = { lat: this.lat, lng: this.lng };
    }
    HomebaseModalComponent.prototype.ngOnInit = function () {
        this.loadDefaultData();
        this.getAddress();
    };
    HomebaseModalComponent.prototype.ngAfterViewInit = function () {
        this.googleMapsService
            .loadGoogleMaps(this.addressNameInputElement.nativeElement);
    };
    HomebaseModalComponent.prototype.loadDefaultData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.homebaseHelper.loadDefaultProps(this.slackService.getChannels(), 'data')];
                    case 1:
                        _a.slackChannels = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.homebaseHelper.loadDefaultProps(this.countryService.getCountries(), 'countries')];
                    case 2:
                        _b.countryList = _c.sent();
                        this.getCountryId();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomebaseModalComponent.prototype.getCountryId = function () {
        var _this = this;
        var currentCountry = this.countryList.find(function (country) { return country.name === _this.data.country; });
        this.countryId = currentCountry.id;
        delete this.data.country;
        this.data.countryId = this.countryId;
    };
    HomebaseModalComponent.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, address, _a, latitude, longitude;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.addressService.getAddressById(this.data.addressId).toPromise()];
                    case 1:
                        response = _b.sent();
                        address = response.address, _a = response.location, latitude = _a.latitude, longitude = _a.longitude;
                        this.locationCoordinates = {
                            lat: latitude,
                            lng: longitude
                        };
                        this.data.address = address;
                        return [2 /*return*/];
                }
            });
        });
    };
    HomebaseModalComponent.prototype.getHomebaseCoordinates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addressInput, coordinates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        addressInput = this.addressNameInputElement.nativeElement.value;
                        return [4 /*yield*/, this.googleMapsService
                                .getLocationCoordinatesFromAddress(addressInput)];
                    case 1:
                        coordinates = _a.sent();
                        this.locationCoordinates = coordinates;
                        this.data.address = addressInput;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.toastService.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HomebaseModalComponent.prototype.editHomebase = function (form, id) {
        var _this = this;
        this.loading = true;
        var updateHomebaseData = this.homebaseHelper.formatNewhomebaseObject(form.value, this.locationCoordinates);
        this.homebaseService.updateHomebase(updateHomebaseData, id).subscribe(function (response) {
            if (response.success) {
                _this.toastService.success(response.message);
                _this.appEventService.broadcast({ name: 'updateHomebaseEvent' });
                _this.loading = false;
                _this.closeDialog();
            }
        }, function (error) {
            _this.loading = false;
            _this.toastService.error(error.error.message);
        });
    };
    HomebaseModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    __decorate([
        ViewChild('homebaseForm'),
        __metadata("design:type", NgForm)
    ], HomebaseModalComponent.prototype, "homebaseForm", void 0);
    __decorate([
        ViewChild('addressNameFormInput'),
        __metadata("design:type", ElementRef)
    ], HomebaseModalComponent.prototype, "addressNameInputElement", void 0);
    HomebaseModalComponent = __decorate([
        Component({
            selector: 'app-homebase-modal',
            templateUrl: './homebase-modal.component.html',
            styleUrls: ['./homebase-modal.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss',
                './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, AlertService,
            AppEventService,
            HomeBaseService,
            SlackService,
            GoogleMapsService,
            AddressService,
            CountryService,
            HomebaseHelper])
    ], HomebaseModalComponent);
    return HomebaseModalComponent;
}());
export { HomebaseModalComponent };
//# sourceMappingURL=homebase-modal.component.js.map