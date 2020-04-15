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
import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { TripRequestService } from '../../__services__/trip-request.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { MatDialog } from '@angular/material';
import { ProviderService } from '../../__services__/providers.service';
import { getStartAndEndDate } from '../../../utils/helpers';
import { BaseTableComponent } from '../../base-table/base-table.component';
var TripItineraryComponent = /** @class */ (function (_super) {
    __extends(TripItineraryComponent, _super);
    function TripItineraryComponent(tripRequestService, appEventService, alertService, providerService, dialog) {
        var _this = _super.call(this, dialog) || this;
        _this.tripRequestService = tripRequestService;
        _this.appEventService = appEventService;
        _this.alertService = alertService;
        _this.providerService = providerService;
        _this.dialog = dialog;
        _this.tripRequests = [];
        _this.departmentsRequest = [];
        _this.dateFilters = {
            requestedOn: {},
            departureTime: {},
        };
        _this.status = 'Confirmed';
        _this.passedParams = {};
        _this.state = 'Approved/Confirmed';
        _this.tripTotalEventEmitter = new EventEmitter();
        _this.noCab = false;
        _this.pageSize = ITEMS_PER_PAGE;
        _this.page = 1;
        _this.rowType = 'Regular Trip';
        return _this;
    }
    TripItineraryComponent.prototype.ngOnInit = function () {
        switch (this.tripRequestType) {
            case 'declinedTrips':
                this.state = 'Declined';
                this.status = 'DeclinedByOps';
                break;
            case 'pastTrips':
                this.status = null;
                break;
            case 'pending':
                this.status = 'Pending';
                break;
            case 'awaitingProvider':
                this.noCab = true;
                this.status = null;
                this.rowType = 'Regular Trip';
                break;
            case 'all':
                this.status = null;
                break;
            case 'awaitingApproval':
                this.status = 'Pending';
                break;
            default:
                this.status = 'Confirmed';
                break;
        }
        // populate date picker
        var _a = getStartAndEndDate(), startDate = _a[0], endDate = _a[1];
        this.startInitialDate = startDate;
        this.endInitialDate = endDate;
        this.startDateMax = moment().format('YYYY-MM-DD');
        this.endDateMax = moment().format('YYYY-MM-DD');
        this.getTrips(this.status);
        this.getDepartments();
    };
    TripItineraryComponent.prototype.getDepartments = function () {
        var _this = this;
        this.tripRequestService.getDepartments()
            .subscribe(function (departmentsData) { return _this.departmentsRequest = departmentsData; });
    };
    TripItineraryComponent.prototype.getPastTrips = function (trips) {
        var removeStatus = ['Cancelled', 'DeclinedByOps', 'DeclinedByManager'];
        return trips.filter(function (trip) {
            return ((moment(trip.departureTime) < moment()) && !removeStatus.some(function (v) { return v === trip.status; })) || (trip.status === 'Completed');
        });
    };
    TripItineraryComponent.prototype.getTrips = function (status) {
        var _this = this;
        if (status === void 0) { status = 'Confirmed'; }
        this.loading = true;
        var tripStatus = this.tripRequestType === 'pastTrips' ? null : status;
        var _a = this, page = _a.page, size = _a.pageSize, department = _a.departmentName, dateFilters = _a.dateFilters;
        this.tripRequestService.query({ page: page, size: size, status: tripStatus, department: department, type: this.rowType, dateFilters: dateFilters, noCab: this.noCab })
            .subscribe(function (tripData) {
            var pageInfo = tripData.pageInfo, trips = tripData.trips;
            var newTrips = trips;
            if (_this.tripRequestType === 'pastTrips') {
                newTrips = _this.getPastTrips(trips);
            }
            _this.tripRequests = newTrips;
            _this.totalItems = newTrips.length;
            if (_this.tripRequestType === 'all' || _this.tripRequestType === 'confirmed') {
                _this.appEventService.broadcast({
                    name: 'updateHeaderTitle',
                    content: { badgeSize: pageInfo.totalResults, tooltipTitle: 'All Trips' }
                });
            }
            _this.tripTotalEventEmitter.emit({ totalItems: _this.totalItems, tripRequestType: _this.tripRequestType });
            _this.loading = false;
        }, function () {
            _this.alertService.error('Error occured while retrieving data');
        });
    };
    TripItineraryComponent.prototype.updatePage = function (page) {
        this.page = page;
        this.getTrips(this.status);
    };
    TripItineraryComponent.prototype.setDateFilter = function (field, range, date) {
        var _a;
        var currentDate = moment().format('YYYY-MM-DD');
        var fieldObject = this.dateFilters[field] || {};
        this.dateFilters[field] = __assign({}, fieldObject, (_a = {}, _a[range] = date, _a));
        var timeOfDeparture = moment(date).format('YYYY-MM-DD');
        if (this.tripRequestType === 'upcomingTrips' && timeOfDeparture < currentDate) {
            this.dateFilters = {
                requestedOn: {},
                departureTime: {},
            };
        }
        this.getTrips(this.status);
    };
    TripItineraryComponent.prototype.departmentSelected = function ($event) {
        this.departmentName = $event;
        this.getTrips(this.status);
    };
    TripItineraryComponent.prototype.setFilterParams = function () {
        var _a = this, dateFilters = _a.dateFilters, departmentName = _a.departmentName;
        this.filterParams = {
            dateFilters: dateFilters, department: departmentName
        };
    };
    TripItineraryComponent.prototype.checkTripRequestType = function (tripRequestType) {
        return this.tripRequestType === tripRequestType;
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], TripItineraryComponent.prototype, "tripRequestType", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], TripItineraryComponent.prototype, "tripTotalEventEmitter", void 0);
    TripItineraryComponent = __decorate([
        Component({
            selector: 'app-trip-itinerary',
            templateUrl: './trip-itinerary.component.html',
            styleUrls: [
                '../../routes/routes-inventory/routes-inventory.component.scss',
                './trip-itinerary.component.scss',
                '../../travel/airport-transfers/airport-transfers.component.scss'
            ],
        }),
        __metadata("design:paramtypes", [TripRequestService,
            AppEventService,
            AlertService,
            ProviderService,
            MatDialog])
    ], TripItineraryComponent);
    return TripItineraryComponent;
}(BaseTableComponent));
export { TripItineraryComponent };
//# sourceMappingURL=trip-itinerary.component.js.map