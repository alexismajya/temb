var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { HomeBaseService } from '../../../shared/homebase.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomebaseModel } from '../../../shared/models/homebase.model';
import { MatDialogRef } from '@angular/material';
import { SlackService } from '../../__services__/slack.service';
import { NgForm } from '@angular/forms';
import { CountryService } from '../../__services__/country.service';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { HomebaseHelper } from '../homebase-helper/homebase.helper';
var AddHomebaseComponent = /** @class */ (function () {
    function AddHomebaseComponent(dialogRef, homeBaseService, slackService, googleMapsService, countryService, appEventService, alertService, homebaseHelper) {
        this.dialogRef = dialogRef;
        this.homeBaseService = homeBaseService;
        this.slackService = slackService;
        this.googleMapsService = googleMapsService;
        this.countryService = countryService;
        this.appEventService = appEventService;
        this.alertService = alertService;
        this.homebaseHelper = homebaseHelper;
        this.locationCoordinates = { lat: this.lat, lng: this.lng };
        this.slackChannels = [];
        this.countryList = [];
        this.homebase = new HomebaseModel();
    }
    AddHomebaseComponent.prototype.ngOnInit = function () {
        this.loadDefaultData();
    };
    AddHomebaseComponent.prototype.ngAfterViewInit = function () {
        this.googleMapsService.loadGoogleMaps(this.addressNameInputElement.nativeElement);
    };
    AddHomebaseComponent.prototype.loadDefaultData = function () {
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
                        return [2 /*return*/];
                }
            });
        });
    };
    AddHomebaseComponent.prototype.toggleSlackChannel = function (value) {
        this.homebase.channel = value;
    };
    AddHomebaseComponent.prototype.toggleCountry = function (value) {
        this.homebase.countryId = value;
    };
    AddHomebaseComponent.prototype.handleAddressFill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addressInput, coordinates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        addressInput = this.addressNameInputElement.nativeElement.value;
                        return [4 /*yield*/, this.googleMapsService.getLocationCoordinatesFromAddress(addressInput)];
                    case 1:
                        coordinates = _a.sent();
                        this.homebase.address = addressInput;
                        this.locationCoordinates = coordinates;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.alertService.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddHomebaseComponent.prototype.addHomebase = function () {
        var _this = this;
        if (!this.locationCoordinates.lat) {
            return this.alertService.error('Could not find the location for provided address');
        }
        this.loading = true;
        var newHomebaseData = this.homebaseHelper.formatNewhomebaseObject(this.homebase, this.locationCoordinates);
        this.homeBaseService.createHomebase(newHomebaseData).subscribe(function (response) {
            if (response.success) {
                _this.alertService.success(response.message);
                _this.appEventService.broadcast({ name: 'newHomebase' });
                _this.dialogRef.close();
                _this.loading = false;
            }
        }, function (error) {
            _this.logError(error);
            _this.loading = false;
        });
    };
    AddHomebaseComponent.prototype.logError = function (error) {
        if (error.status === 400) {
            this.alertService.error('Validation error occurred');
        }
        else if (error.status === 409) {
            this.alertService.error(error.error.message);
        }
        else {
            this.alertService.error('Something went wrong, please try again');
        }
    };
    AddHomebaseComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    __decorate([
        ViewChild('addHomebaseForm'),
        __metadata("design:type", NgForm)
    ], AddHomebaseComponent.prototype, "addHomebaseForm", void 0);
    __decorate([
        ViewChild('addressNameFormInput'),
        __metadata("design:type", ElementRef)
    ], AddHomebaseComponent.prototype, "addressNameInputElement", void 0);
    AddHomebaseComponent = __decorate([
        Component({
            selector: 'app-add-homebase',
            templateUrl: './add-homebase.component.html',
            styleUrls: [
                './add-homebase.component.scss',
                '../../cabs/add-cab-modal/add-cab-modal.component.scss'
            ]
        }),
        __metadata("design:paramtypes", [MatDialogRef,
            HomeBaseService,
            SlackService,
            GoogleMapsService,
            CountryService,
            AppEventService,
            AlertService,
            HomebaseHelper])
    ], AddHomebaseComponent);
    return AddHomebaseComponent;
}());
export { AddHomebaseComponent };
//# sourceMappingURL=add-homebase.component.js.map