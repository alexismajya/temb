var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import * as moment from 'moment';
import { RouteUsageService } from '../__services__/route-usage.service';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { TripsDataService } from '../__services__/trips-data.service';
import { RiderService } from './rider-list/rider.service';
import { DepartmentsService } from '../__services__/departments.service';
import { HomeBaseManager } from '../../shared/homebase.manager';
import { getStartAndEndDate } from '../../utils/helpers';
import { getRiderList } from 'src/app/utils/helpers';
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(routeUsageService, ratingsService, tripService, riderService, departmentsService, hbManager) {
        this.routeUsageService = routeUsageService;
        this.ratingsService = ratingsService;
        this.tripService = tripService;
        this.riderService = riderService;
        this.departmentsService = departmentsService;
        this.hbManager = hbManager;
        this.dateFilters = null;
        this.mostRatedRoutes = [];
        this.leastRatedRoutes = [];
        this.maxDate = new Date();
        this.averageRatings = 0;
        this.tripsData = [];
        this.departments = [];
        this.numOfTrips = [];
        this.departmentNames = [];
        this.tripsDataSet = {
            labels: [],
            travel: [
                {
                    data: [],
                    label: 'Airport Transfers',
                    tripsCost: [],
                },
                {
                    data: [],
                    label: 'Embassy Visits',
                    tripsCost: [],
                },
            ],
        };
        this.tripData = {
            trip: [
                { label: 'Line Dataset', data: [], type: 'line' },
                { data: [], label: 'Trips', type: 'bar' },
            ],
            tripsCost: [],
            departmentNames: []
        };
        this.mostFrequentRiders = [];
        this.leastFrequentRiders = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _a = getStartAndEndDate(), startDate = _a[0], endDate = _a[1];
        this.dateFilters = { startDate: startDate, endDate: endDate };
        this.startInitialDate = startDate;
        this.endInitialDate = endDate;
        this.startDateMax = moment().format('YYYY-MM-DD');
        this.endDateMax = moment().format('YYYY-MM-DD');
        this.homebaseId = this.hbManager.getHomebaseId();
        if (this.dateFilters) {
            this.getDepartments();
        }
    };
    DashboardComponent.prototype.setDateFilter = function (field, date) {
        if (field === 'startDate') {
            this.minDate = date;
            if (moment(date).diff(moment(this.dateFilters.endDate), 'days') > 0) {
                return;
            }
        }
        this.dateFilters[field] = moment(date).format('YYYY-MM-DD');
        this.getDepartments();
    };
    DashboardComponent.prototype.updateDateFilters = function () {
        this.filter1 = {
            startDate: { from: this.dateFilters.startDate },
            endDate: { to: this.dateFilters.endDate },
        };
        this.filter2 = {
            from: { startDate: this.dateFilters.startDate },
            to: { endDate: this.dateFilters.endDate },
        };
    };
    DashboardComponent.prototype.loadComponents = function () {
        this.updateDateFilters();
        this.getRoutesUsage();
        this.getRouteRatings();
        this.getTripsData();
        this.getAirportTransfers();
        this.getEmbassyVisits();
        this.getTripsAnalysis();
        this.getFrequentRiders();
    };
    DashboardComponent.prototype.getRoutesUsage = function () {
        var _this = this;
        this.routeUsageService.getRouteUsage(this.filter2).subscribe(function (routeUsageData) {
            var mostUsedBatch = routeUsageData.mostUsedBatch, leastUsedBatch = routeUsageData.leastUsedBatch;
            _this.mostUsedRoute = mostUsedBatch;
            _this.leastUsedRoute = leastUsedBatch;
        });
    };
    DashboardComponent.prototype.getRouteRatings = function () {
        var _this = this;
        this.ratingsService.getRouteAverages(this.filter1).subscribe(function (res) {
            var data = res.data;
            _this.mostRatedRoutes = data.slice(0, 3);
            _this.leastRatedRoutes = data.sort(function (a, b) { return a.Average - b.Average; }).slice(0, 3);
        });
    };
    DashboardComponent.prototype.callTripService = function (tripType) {
        if (tripType === void 0) { tripType = ''; }
        return this.tripService.getTripData(this.filter1, tripType, this.tripData.departmentNames);
    };
    DashboardComponent.prototype.totalTripsCount = function (tripsData) {
        var totalVisits = tripsData.reduce(function (prev, next) { return prev + Number(next.totalTrips); }, 0);
        return totalVisits;
    };
    DashboardComponent.prototype.getTripsData = function () {
        var _this = this;
        this.callTripService('Regular Trip').subscribe(function (res) {
            var _a = res.data, trips = _a.trips, finalCost = _a.finalCost, finalAverageRating = _a.finalAverageRating, count = _a.count;
            _this.tripsData = trips;
            _this.totalCost = finalCost || 0;
            _this.averageRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
            _this.plotBarChart(trips);
        });
    };
    DashboardComponent.prototype.getAirportTransfers = function () {
        var _this = this;
        this.callTripService('Airport Transfer').subscribe(function (res) {
            var _a = res.data, finalAverageRating = _a.finalAverageRating, trips = _a.trips;
            _this.airportRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
            _this.totalAirportTrips = _this.totalTripsCount(trips);
            _this.plotTravelTripsAnalytics(trips, 0);
        });
    };
    DashboardComponent.prototype.getEmbassyVisits = function () {
        var _this = this;
        this.tripService.getTripData(this.filter1, 'Embassy Visit', this.tripData.departmentNames).subscribe(function (res) {
            var _a = res.data, trips = _a.trips, finalAverageRating = _a.finalAverageRating;
            _this.averageEmbassyRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
            _this.EmbassyVisits = _this.totalTripsCount(trips);
            _this.plotTravelTripsAnalytics(trips, 1);
        });
    };
    DashboardComponent.prototype.getTripsAnalysis = function () {
        var _this = this;
        this.tripService.getTravelData(this.filter1).subscribe(function (res) {
            var trips = res.data.trips;
            _this.travelTripCount = _this.totalTripsCount(trips);
        });
        this.tripService.getTripData(this.filter1, 'Regular Trip', this.tripData.departmentNames).subscribe(function (res) {
            var trips = res.data.trips;
            _this.normalTripCount = _this.totalTripsCount(trips);
        });
    };
    DashboardComponent.prototype.getDepartments = function () {
        var _this = this;
        this.departmentsService.get(5, 1).subscribe(function (res) {
            var weekOfMonth = _this.getWeekOfMonth(_this.dateFilters.startDate);
            var departments = res.departments.map(function (department) { return department.name; });
            _this.tripsDataSet.labels = [weekOfMonth].concat(departments);
            _this.tripData.departmentNames = departments.slice();
            _this.loadComponents();
            _this.tripsDataSet.travel[0].data[0] = 0;
            _this.tripsDataSet.travel[0].tripsCost[0] = 0;
            _this.tripsDataSet.travel[1].data[0] = 0;
            _this.tripsDataSet.travel[1].tripsCost[0] = 0;
        });
    };
    DashboardComponent.prototype.getWeekOfMonth = function (date) {
        var selectedDate = moment(date);
        var weekOfMonth = "Week " + Math.ceil(selectedDate.date() / 7);
        return weekOfMonth;
    };
    DashboardComponent.prototype.plotTravelTripsAnalytics = function (trips, dataIndex) {
        var _this = this;
        var onlyUnique = function (value, index, self) { return self.indexOf(value) === index; };
        var labels = this.tripsDataSet.labels.slice();
        trips.map(function (trip) {
            if (labels.indexOf(trip.departmentName) === -1) {
                _this.departments.push(trip.departmentName);
                var weekOfMonth = labels[0], dataLabels = labels.slice(1);
                labels = [weekOfMonth].concat(_this.departments, dataLabels).filter(onlyUnique);
            }
            var index = labels.indexOf(trip.departmentName);
            var newTravelData = _this.tripsDataSet.travel[dataIndex].data.slice();
            var newTravelCost = _this.tripsDataSet.travel[dataIndex].tripsCost.slice();
            newTravelData[index] = parseInt(trip.totalTrips, 0);
            newTravelCost[index] = parseInt(trip.totalCost || 0, 0);
            _this.tripsDataSet.travel[dataIndex].data = newTravelData.slice();
            _this.tripsDataSet.travel[dataIndex].tripsCost = newTravelCost.slice();
        });
        if (labels.length > 6) {
            labels.length = 6;
        }
        this.tripsDataSet.labels = labels;
    };
    DashboardComponent.prototype.plotBarChart = function (tripData) {
        var _this = this;
        var newTotalCost = [];
        var newTotalTrip = [];
        var onlyUnique = function (value, index, self) { return self.indexOf(value) === index; };
        var labels = this.tripData.departmentNames.slice();
        tripData.map(function (tripInfo) {
            if (labels.indexOf(tripInfo.departmentName) === -1) {
                _this.departments.push(tripInfo.departmentName);
                var dataLabels = labels.slice(0);
                labels = _this.departments.concat(dataLabels).filter(onlyUnique);
            }
            newTotalCost.push(+tripInfo.totalCost);
            newTotalTrip.push(+tripInfo.totalTrips);
        });
        this.tripData.trip[1].data = newTotalTrip;
        this.tripData.tripsCost = this.tripData.trip[0].data = newTotalCost;
        if (labels.length > 5) {
            labels.length = 5;
        }
        this.tripData.departmentNames = labels;
    };
    DashboardComponent.prototype.getFrequentRiders = function () {
        var _this = this;
        this.riderService.getRiders(this.filter1).subscribe(function (res) {
            var _a = res.data, firstFiveMostFrequentRiders = _a.firstFiveMostFrequentRiders, leastFiveFrequentRiders = _a.leastFiveFrequentRiders;
            _this.mostFrequentRiders = getRiderList(firstFiveMostFrequentRiders);
            _this.leastFrequentRiders = getRiderList(leastFiveFrequentRiders);
        });
    };
    DashboardComponent = __decorate([
        Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss'],
        }),
        __metadata("design:paramtypes", [RouteUsageService,
            RouteRatingsService,
            TripsDataService,
            RiderService,
            DepartmentsService,
            HomeBaseManager])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map