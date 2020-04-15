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
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../shared/alert.service';
var RouteTripsService = /** @class */ (function () {
    function RouteTripsService(http, toastr) {
        this.http = http;
        this.toastr = toastr;
        this.routeTripsUrl = environment.tembeaBackEndUrl + "/api/v1/trips/routetrips";
        this.routeTripsV2Url = environment.tembeaBackEndUrl + "/api/v2/trips/routetrips";
    }
    RouteTripsService.prototype.getBatchTripsRecords = function (_a) {
        var _this = this;
        var page = _a.page, pageSize = _a.pageSize;
        return this.http.get(this.routeTripsV2Url + "?page=" + page + "&size=" + pageSize)
            .pipe(map(function (res) { return res; }), catchError(function (err) { return _this.handleError(err); }));
    };
    RouteTripsService.prototype.handleError = function (err) {
        this.toastr.error('There was an error while getting route trips.');
        return throwError(err.message);
    };
    RouteTripsService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient, AlertService])
    ], RouteTripsService);
    return RouteTripsService;
}());
export { RouteTripsService };
//# sourceMappingURL=route-trips.service.js.map