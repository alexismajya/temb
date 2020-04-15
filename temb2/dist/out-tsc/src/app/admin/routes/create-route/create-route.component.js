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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeBaseService } from '../../../shared/homebase.service';
import { LocationService } from '../../../shared/locations.service';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { CreateRouteHelper } from './create-route.helper';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { NavMenuService } from '../../__services__/nav-menu.service';
import { NgForm } from '@angular/forms';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var RouteModel = /** @class */ (function () {
    function RouteModel(routeName, takeOffTime, capacity, marker, provider, destinationInputField) {
        this.routeName = routeName;
        this.takeOffTime = takeOffTime;
        this.capacity = capacity;
        this.marker = marker;
        this.provider = provider;
        this.destinationInputField = destinationInputField;
    }
    return RouteModel;
}());
var CreateRouteComponent = /** @class */ (function () {
    function CreateRouteComponent(googleMapsService, homebaseService, locationService, routeService, createRouteHelper, router, navMenuService, analytics) {
        this.googleMapsService = googleMapsService;
        this.homebaseService = homebaseService;
        this.locationService = locationService;
        this.routeService = routeService;
        this.createRouteHelper = createRouteHelper;
        this.router = router;
        this.navMenuService = navMenuService;
        this.analytics = analytics;
        this.zoom = 14;
        this.destinationIsDojo = true;
        this.origin = { lat: this.lat, lng: this.lng };
        this.destination = { lat: this.lat, lng: this.lng };
        this.auto = null;
        this.model = new RouteModel();
        this.model.capacity = 1;
    }
    CreateRouteComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locationId, location, latitude, longitude;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHomebaseLocationId(localStorage.getItem('HOMEBASE_NAME'))];
                    case 1:
                        locationId = _a.sent();
                        return [4 /*yield*/, this.getLocation(locationId)];
                    case 2:
                        location = _a.sent();
                        latitude = location.latitude, longitude = location.longitude;
                        this.lat = latitude;
                        this.lng = longitude;
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateRouteComponent.prototype.getHomebaseLocationId = function (homebaseName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, locationId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homebaseService.getByName(homebaseName).toPromise()];
                    case 1:
                        response = _a.sent();
                        locationId = response.homebase[0].locationId;
                        return [2 /*return*/, locationId];
                }
            });
        });
    };
    CreateRouteComponent.prototype.getLocation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locationService.getById(id).toPromise()];
                    case 1:
                        response = _a.sent();
                        location = response.location;
                        return [2 /*return*/, location];
                }
            });
        });
    };
    CreateRouteComponent.prototype.ngAfterViewInit = function () {
        this.googleMapsService
            .loadGoogleMaps(this.destinationInputElement.nativeElement);
    };
    CreateRouteComponent.prototype.getSelected = function (provider) {
        this.selectedProvider = provider;
    };
    CreateRouteComponent.prototype.setAuto = function (event) {
        this.auto = event;
    };
    CreateRouteComponent.prototype.showRouteDirectionOnClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addressInput, coordinates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        addressInput = this.destinationInputElement.nativeElement.value;
                        return [4 /*yield*/, this.googleMapsService
                                .getLocationCoordinatesFromAddress(addressInput)];
                    case 1:
                        coordinates = _a.sent();
                        this.updateRouteDisplay(coordinates);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.createRouteHelper.notifyUser(['Location not found']);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateRouteComponent.prototype.updateDestinationFieldOnMarkerDrag = function (marker, $event) {
        return __awaiter(this, void 0, void 0, function () {
            var locationAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.googleMapsService
                            .getLocationAddressFromCoordinates($event.coords)];
                    case 1:
                        locationAddress = _a.sent();
                        this.model.destinationInputField = locationAddress;
                        this.updateRouteDisplay($event.coords);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateRouteComponent.prototype.clearDestinationCoordinates = function () {
        this.destinationCoordinates = null;
    };
    CreateRouteComponent.prototype.updateRouteDisplay = function (coordinates) {
        this.destination = coordinates; // update map marker
        this.destinationCoordinates = coordinates;
        this.toggleMapDisplay();
    };
    CreateRouteComponent.prototype.toggleMapDisplay = function () {
        this.destinationIsDojo = true;
        this.destinationIsDojo = false;
    };
    CreateRouteComponent.prototype.changeCapacityValue = function (methodToCall) {
        this.model.capacity = this.createRouteHelper[methodToCall](this.model.capacity);
    };
    CreateRouteComponent.prototype.createRoute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routeRequest, errors;
            return __generator(this, function (_a) {
                if (!this.destinationCoordinates) {
                    return [2 /*return*/, this.createRouteHelper.notifyUser(['Click the search icon to confirm destination'])];
                }
                routeRequest = this.createRouteHelper.createNewRouteRequestObject(this.model, this.model.destinationInputField, this.destinationCoordinates, this.selectedProvider);
                errors = this.createRouteHelper.validateFormEntries(routeRequest);
                if (errors.length) {
                    return [2 /*return*/, this.createRouteHelper.notifyUser(errors)];
                }
                return [2 /*return*/, this.sendRequestToServer(routeRequest)];
            });
        });
    };
    CreateRouteComponent.prototype.sendRequestToServer = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, phoneNo, notificationChannel, verified, newProvider, response, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.navMenuService.showProgress();
                        data.provider.isDirectMessage = Number(data.provider.notificationChannel) === 0;
                        _a = data.provider, email = _a.email, phoneNo = _a.phoneNo, notificationChannel = _a.notificationChannel, verified = _a.verified, newProvider = __rest(_a, ["email", "phoneNo", "notificationChannel", "verified"]);
                        data.provider = newProvider;
                        return [4 /*yield*/, this.routeService.createRoute(data)];
                    case 1:
                        response = _b.sent();
                        this.navMenuService.stopProgress();
                        this.createRouteHelper.notifyUser([response.message], 'success');
                        this.model = null;
                        this.analytics.sendEvent(eventsModel.Routes, modelActions.CREATE);
                        this.router.navigate(['/admin/routes/inventory']);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        this.navMenuService.stopProgress();
                        this.createRouteHelper.notifyUser([e_1.error.message || 'An error occurred.']);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        ViewChild('createRouteForm'),
        __metadata("design:type", NgForm)
    ], CreateRouteComponent.prototype, "createRouteForm", void 0);
    __decorate([
        ViewChild('destinationFormInput'),
        __metadata("design:type", ElementRef)
    ], CreateRouteComponent.prototype, "destinationInputElement", void 0);
    CreateRouteComponent = __decorate([
        Component({
            selector: 'app-create',
            templateUrl: './create-route.component.html',
            styleUrls: ['./create-route.component.scss']
        }),
        __metadata("design:paramtypes", [GoogleMapsService,
            HomeBaseService,
            LocationService,
            RoutesInventoryService,
            CreateRouteHelper,
            Router,
            NavMenuService,
            GoogleAnalyticsService])
    ], CreateRouteComponent);
    return CreateRouteComponent;
}());
export { CreateRouteComponent };
//# sourceMappingURL=create-route.component.js.map