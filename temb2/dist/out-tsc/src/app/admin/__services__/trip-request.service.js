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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { map, retry, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createRequestOption } from 'src/app/utils/request-util';
import { AlertService } from '../../shared/alert.service';
var TripRequestService = /** @class */ (function () {
    function TripRequestService(http, toastr) {
        var _this = this;
        this.http = http;
        this.toastr = toastr;
        this.tripUrl = environment.tembeaBackEndUrl + "/api/v1/trips";
        this.departmentsUrl = environment.tembeaBackEndUrl + "/api/v1/departments";
        this.providerConfirmUrl = environment.tembeaBackEndUrl + "/api/v2/provider/confirm";
        this.handleError = function () {
            _this.toastr.error('Something did not work right there.');
        };
        this.handleResponse = function (data, status) {
            if (data.success) {
                _this.toastr.success("Trip request " + status + (status === 'confirm' ? 'ed' : 'd') + "!");
            }
            else {
                _this.toastr.error("Could not " + status + " request");
            }
        };
    }
    TripRequestService_1 = TripRequestService;
    TripRequestService.flattenDateFilter = function (req) {
        var dateFilters = req.dateFilters, result = __rest(req, ["dateFilters"]);
        var flat = {};
        if (dateFilters) {
            var entries = Object.entries(dateFilters).map(function (entry) {
                var key = entry[0], value = entry[1];
                var modValue = Object.entries(value).map(function (item) { return item[0] + ":" + item[1]; }).join(';');
                return [key, modValue];
            }).filter(function (_a) {
                var val = _a[1];
                return val.length;
            });
            flat = entries.reduce(function (obj, _a) {
                var key = _a[0], val = _a[1];
                var _b;
                return Object.assign(obj, (_b = {}, _b[key] = val, _b));
            }, {});
        }
        return __assign({}, result, flat);
    };
    TripRequestService.prototype.query = function (req) {
        var reqDate = TripRequestService_1.flattenDateFilter(req);
        var params = createRequestOption(reqDate);
        return this.http.get("" + this.tripUrl, { params: params, observe: 'response' })
            .pipe(retry(2), map(function (res) {
            var _a = res.body.data, trips = _a.trips, pageInfo = _a.pageMeta;
            trips.forEach(function (trip) {
                trip.requestedOn = moment(trip.requestedOn);
                trip.departureTime = moment(trip.departureTime);
            });
            return { trips: trips, pageInfo: pageInfo };
        }));
    };
    TripRequestService.prototype.getDepartments = function () {
        return this.http.get("" + this.departmentsUrl)
            .pipe(retry(3), map(function (res) {
            var departments = res.departments;
            return departments;
        }));
    };
    TripRequestService.prototype.confirmRequest = function (tripId, values) {
        var _this = this;
        var queryParam = 'confirm';
        var slackUrl = environment.teamUrl;
        var comment = values.comment, providerId = values.providerId;
        return this.http.put(this.tripUrl + "/" + tripId + "?action=" + queryParam, {
            comment: comment, slackUrl: slackUrl, providerId: providerId
        })
            .pipe(tap(function (data) { return _this.handleResponse(data, 'confirm'); }, this.handleError));
    };
    TripRequestService.prototype.declineRequest = function (tripId, comment) {
        var _this = this;
        var queryParam = 'decline';
        var slackUrl = environment.teamUrl;
        return this.http.put(this.tripUrl + "/" + tripId + "?action=" + queryParam, {
            comment: comment, slackUrl: slackUrl
        })
            .pipe(tap(function (data) { return _this.handleResponse(data, 'decline'); }, this.handleError));
    };
    TripRequestService.prototype.providerConfirm = function (confirmData) {
        return this.http.post(this.providerConfirmUrl, confirmData);
    };
    var TripRequestService_1;
    TripRequestService = TripRequestService_1 = __decorate([
        Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [HttpClient, AlertService])
    ], TripRequestService);
    return TripRequestService;
}());
export { TripRequestService };
//# sourceMappingURL=trip-request.service.js.map