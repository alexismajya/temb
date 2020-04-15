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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
var RoutesInventoryService = /** @class */ (function () {
    function RoutesInventoryService(http) {
        this.http = http;
        this.routesUrl = environment.tembeaBackEndUrl + "/api/v1/routes";
        this.routesV2Url = environment.tembeaBackEndUrl + "/api/v2/routes";
        this.teamUrl = environment.teamUrl;
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: { teamUrl: environment.teamUrl }
        };
    }
    RoutesInventoryService.prototype.getRoutes = function (size, page, sort) {
        return this.http.get(this.routesV2Url + "?sort=" + sort + "&size=" + size + "&page=" + page);
    };
    RoutesInventoryService.prototype.changeRouteStatus = function (id, data) {
        return this.http.put(this.routesUrl + "/" + id, __assign({}, data, { teamUrl: this.teamUrl }));
    };
    RoutesInventoryService.prototype.deleteRouteBatch = function (id) {
        return this.http.delete(environment.tembeaBackEndUrl + "/api/v1/routes/" + id, this.httpOptions);
    };
    RoutesInventoryService.prototype.createRoute = function (data, duplicate) {
        if (duplicate === void 0) { duplicate = false; }
        var queryParams = "" + (duplicate ? "?batchId=" + data + "&action=duplicate" : '');
        var body = duplicate ? {} : data;
        return this.http
            .post("" + this.routesUrl + queryParams, __assign({}, body, { teamUrl: this.teamUrl }), this.httpOptions)
            .toPromise();
    };
    RoutesInventoryService = __decorate([
        Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], RoutesInventoryService);
    return RoutesInventoryService;
}());
export { RoutesInventoryService };
//# sourceMappingURL=routes-inventory.service.js.map