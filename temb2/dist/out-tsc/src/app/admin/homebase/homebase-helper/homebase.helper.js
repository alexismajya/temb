var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
var HomebaseHelper = /** @class */ (function () {
    function HomebaseHelper() {
    }
    HomebaseHelper.prototype.formatNewhomebaseObject = function (formValues, coordinates) {
        var requestObject = __assign({}, formValues);
        var latitude = coordinates.lat, longitude = coordinates.lng;
        requestObject.address = {
            address: requestObject.address,
            location: { latitude: latitude, longitude: longitude }
        };
        return requestObject;
    };
    HomebaseHelper.prototype.loadDefaultProps = function (method, result) {
        return new Promise(function (resolve, reject) {
            method.subscribe(function (response) {
                if (response.success) {
                    resolve(response["" + result]);
                }
                else {
                    reject('No data found');
                }
            });
        });
    };
    HomebaseHelper = __decorate([
        Injectable({ providedIn: 'root' })
    ], HomebaseHelper);
    return HomebaseHelper;
}());
export { HomebaseHelper };
//# sourceMappingURL=homebase.helper.js.map