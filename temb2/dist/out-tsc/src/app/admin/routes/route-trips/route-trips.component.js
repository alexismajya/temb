var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseTableComponent } from '../../base-table/base-table.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouteTripsService } from '../../__services__/route-trips.service';
import { AppEventService } from 'src/app/shared/app-events.service';
var RouteTripsComponent = /** @class */ (function (_super) {
    __extends(RouteTripsComponent, _super);
    function RouteTripsComponent(routeTripsService, appEventsService, dialog) {
        var _this = _super.call(this, dialog) || this;
        _this.routeTripsService = routeTripsService;
        _this.appEventsService = appEventsService;
        _this.dialog = dialog;
        _this.routeTrips = [];
        _this.dataContainer = [];
        _this.escapeRegexCharacters = function (str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
        _this.getSuggestions = function (value, data, isString) {
            var escapedValue = _this.escapeRegexCharacters(value.trim());
            if (escapedValue === '') {
                return [];
            }
            var regex = new RegExp('^' + escapedValue, 'i');
            var suggestions = data.filter(function (string) {
                if (isString) {
                    return regex.test(string.batch.route.name);
                }
                else {
                    return regex.test(string.batch.batch);
                }
            });
            return suggestions;
        };
        _this.page = 1;
        _this.pageSize = 10;
        _this.rowType = 'routeRecord';
        return _this;
    }
    RouteTripsComponent.prototype.ngOnInit = function () {
        this.setPage(this.page);
    };
    RouteTripsComponent.prototype.getRouteTrips = function () {
        var _this = this;
        this.isLoading = true;
        var _a = this, page = _a.page, pageSize = _a.pageSize;
        this.routeTripsService.getBatchTripsRecords({ page: page, pageSize: pageSize })
            .subscribe(function (data) {
            _this.routeTrips = data.data;
            _this.dataContainer = data.data;
            _this.totalItems = _this.routeTrips.length;
            _this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: _this.totalItems } });
            _this.isLoading = false;
        });
    };
    RouteTripsComponent.prototype.setPage = function (page) {
        this.page = page;
        this.getRouteTrips();
    };
    RouteTripsComponent.prototype.searchForValue = function (value, isString) {
        this.routeTrips = this.getSuggestions(value, this.routeTrips, isString);
        this.totalItems = this.routeTrips.length;
        this.routeTrips.length === 0 ? this.routeTrips = this.dataContainer : this.isLoading = false;
    };
    RouteTripsComponent.prototype.filterTableData = function (value) {
        if (!parseInt(value, 10)) {
            this.searchForValue(value, true);
        }
        else {
            this.searchForValue(value, false);
        }
    };
    RouteTripsComponent = __decorate([
        Component({
            selector: 'app-route-trips',
            templateUrl: './route-trips.component.html',
            styleUrls: ['./route-trips.component.scss']
        }),
        __metadata("design:paramtypes", [RouteTripsService,
            AppEventService,
            MatDialog])
    ], RouteTripsComponent);
    return RouteTripsComponent;
}(BaseTableComponent));
export { RouteTripsComponent };
//# sourceMappingURL=route-trips.component.js.map