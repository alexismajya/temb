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
import { environment } from '../../../environments/environment';
import { filterDateParameters } from 'src/app/utils/helpers';
var TripsDataService = /** @class */ (function () {
    function TripsDataService(http) {
        this.http = http;
    }
    TripsDataService.prototype.getTripData = function (dateFilter, tripType, departments) {
        if (tripType === void 0) { tripType = ''; }
        var queryParams = tripType ? "?tripType=" + tripType : '';
        var _a = filterDateParameters(dateFilter), startDate = _a.startDate, endDate = _a.endDate;
        var data = { startDate: startDate, endDate: endDate, departments: departments };
        var results = this.http.post(environment.tembeaBackEndUrl + "/api/v1/departments/trips" + queryParams, __assign({}, data));
        return results;
    };
    TripsDataService.prototype.getTravelData = function (dateFilter) {
        var _a = filterDateParameters(dateFilter), startDate = _a.startDate, endDate = _a.endDate;
        var data = { startDate: startDate, endDate: endDate };
        var results = this.http.post(environment.tembeaBackEndUrl + "/api/v1/trips/travel", __assign({}, data));
        return results;
    };
    TripsDataService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], TripsDataService);
    return TripsDataService;
}());
export { TripsDataService };
//# sourceMappingURL=trips-data.service.js.map