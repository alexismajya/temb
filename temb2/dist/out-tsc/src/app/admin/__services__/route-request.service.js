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
import { RouteRequest } from '../../shared/models/route-request.model';
import { environment } from '../../../environments/environment';
import { map, retry, tap } from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';
import { AlertService } from '../../shared/alert.service';
var RouteRequestService = /** @class */ (function () {
    function RouteRequestService(http, toastr) {
        var _this = this;
        this.http = http;
        this.toastr = toastr;
        this.routesUrl = environment.tembeaBackEndUrl + "/api/v1/routes";
        this.handleError = function () {
            _this.toastr.error('Something did not work right there.');
        };
        this.handleResponse = function (data, status) {
            if (data.success) {
                _this.toastr.success("Route request " + status + "d!");
            }
            else {
                _this.toastr.error("Could not " + status + " request");
            }
        };
    }
    RouteRequestService.prototype.getAllRequests = function () {
        return this.http.get(this.routesUrl + "/requests")
            .pipe(retry(3), map(function (data) { return data.routes.map(function (value) { return new RouteRequest().deserialize(value); }); }));
    };
    RouteRequestService.prototype.declineRequest = function (id, comment) {
        var _this = this;
        var newOpsStatus = 'decline';
        var teamUrl = environment.teamUrl;
        return this.http.put(this.routesUrl + "/requests/status/" + id, {
            comment: comment, newOpsStatus: newOpsStatus, teamUrl: teamUrl,
        })
            .pipe(tap(function (data) { return _this.handleResponse(data, 'decline'); }, this.handleError));
    };
    RouteRequestService.prototype.approveRouteRequest = function (id, comment, routeDetails, provider) {
        var _this = this;
        return this.http.put(this.routesUrl + "/requests/status/" + id, {
            newOpsStatus: 'approve',
            comment: comment,
            teamUrl: environment.teamUrl,
            routeName: routeDetails.routeName,
            takeOff: routeDetails.takeOff,
            provider: provider,
        })
            .pipe(tap(function (data) { return _this.handleResponse(data, 'approve'); }, this.handleError));
    };
    RouteRequestService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient, AlertService])
    ], RouteRequestService);
    return RouteRequestService;
}());
export { RouteRequestService };
//# sourceMappingURL=route-request.service.js.map