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
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
var RouteUsageService = /** @class */ (function () {
    function RouteUsageService(http) {
        this.http = http;
        this.routeUsageUrl = environment.tembeaBackEndUrl + "/api/v1/routes/status/usage";
    }
    RouteUsageService.prototype.getRouteUsage = function (dateFilter) {
        var startDate = dateFilter.from.startDate, endDate = dateFilter.to.endDate;
        var fromStr = startDate ? "from=" + startDate : 'from=';
        var toStr = endDate ? "to=" + endDate : 'to=';
        return this.http.get(this.routeUsageUrl + "?" + fromStr + "&" + toStr).map(function (usage) {
            var _a = usage.data, mostUsedBatch = _a.mostUsedBatch, leastUsedBatch = _a.leastUsedBatch;
            return { mostUsedBatch: mostUsedBatch, leastUsedBatch: leastUsedBatch };
        });
    };
    RouteUsageService = __decorate([
        Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], RouteUsageService);
    return RouteUsageService;
}());
export { RouteUsageService };
//# sourceMappingURL=route-usage.service.js.map