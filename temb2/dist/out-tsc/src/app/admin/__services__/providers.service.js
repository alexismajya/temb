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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
var ProviderService = /** @class */ (function () {
    function ProviderService(http) {
        this.http = http;
        this.providersUrl = environment.tembeaBackEndUrl + "/api/v1/providers";
    }
    ProviderService.prototype.getProviders = function (size, page) {
        var getProvidersUrl = this.providersUrl;
        if (size && page) {
            getProvidersUrl = getProvidersUrl + "?size=" + size + "&page=" + page;
        }
        return this.http.get(getProvidersUrl);
    };
    ProviderService.prototype.getViableProviders = function () {
        return this.http.get(this.providersUrl + "/viableOptions");
    };
    ProviderService.prototype.editProvider = function (provider, id) {
        return this.http.patch(this.providersUrl + "/" + id, provider);
    };
    ProviderService.prototype.deleteProvider = function (id) {
        return this.http.delete(this.providersUrl + "/" + id);
    };
    ProviderService.prototype.add = function (data) {
        return this.http.post(this.providersUrl, __assign({}, data));
    };
    ProviderService.prototype.addDriver = function (data) {
        var results = this.http.post(this.providersUrl + "/drivers", data);
        return results;
    };
    ProviderService.prototype.verify = function (data) {
        return this.http.post(this.providersUrl + "/verify", __assign({}, data));
    };
    ProviderService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ProviderService);
    return ProviderService;
}());
export { ProviderService };
//# sourceMappingURL=providers.service.js.map