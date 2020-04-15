import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RouteUsageService } from '../__services__/route-usage.service';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { TripsDataService } from '../__services__/trips-data.service';
import { ITripsDataModel } from '../../shared/models/trips-data.model';
import { RiderService } from './rider-list/rider.service';
import { DepartmentsService } from '../__services__/departments.service';
import { HomeBaseManager } from '../../shared/homebase.manager';
import { getStartAndEndDate } from '../../utils/helpers';
import { getRiderList } from 'src/app/utils/helpers';
import { IRouteUsageModel } from 'src/app/shared/models/route-ratings.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dateFilters = null;
  mostUsedRoute: IRouteUsageModel;
  leastUsedRoute: IRouteUsageModel;
  mostRatedRoutes = [];
  leastRatedRoutes = [];
  maxDate: string | Date = new Date();
  averageRatings = 0;
  minDate: any;
  startingDate: any;
  tripsData: Array<ITripsDataModel> = [];
  totalCost: number;
  airportRatings: number;
  totalAirportTrips: number;
  averageEmbassyRatings: any;
  EmbassyVisits: number;
  normalTripCount: number;
  travelTripCount: number;
  departments: string[] = [];
  numOfTrips: Array<number> = [];
  departmentNames: Array<string> = [];
  totalCostPerDept: any[];
  tripsDataSet: { labels: string[], travel: any[] } = {
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
      }, ],
  };
  tripData: { trip: any[], tripsCost: number[], departmentNames: string[] } = {
    trip: [
      { label: 'Line Dataset', data: [], type: 'line' },
      { data: [], label: 'Trips', type: 'bar' },
    ],
    tripsCost: [],
    departmentNames: []
  };
  homebaseId: string;
  startInitialDate: string;
  endInitialDate: string;
  startDateMax: string;
  endDateMax: string;
  mostFrequentRiders = [];
  leastFrequentRiders = [];
  filter1: { startDate: { from: any; }; endDate: { to: any; }; };
  filter2: { from: { startDate: any; }; to: { endDate: any; }; };

  constructor(
    private routeUsageService: RouteUsageService,
    private ratingsService: RouteRatingsService,
    private tripService: TripsDataService,
    private riderService: RiderService,
    private departmentsService: DepartmentsService,
    private readonly hbManager: HomeBaseManager
  ) { }

  ngOnInit() {
    const [startDate, endDate] = getStartAndEndDate();
    this.dateFilters = { startDate, endDate };
    this.startInitialDate = startDate;
    this.endInitialDate = endDate;
    this.startDateMax = moment().format('YYYY-MM-DD');
    this.endDateMax = moment().format('YYYY-MM-DD');
    this.homebaseId = this.hbManager.getHomebaseId();
    if (this.dateFilters) {
      this.getDepartments();
    }
  }

  setDateFilter(field: string, date: string) {
    if (field === 'startDate') {
      this.minDate = date;
      if (moment(date).diff(moment(this.dateFilters.endDate), 'days') > 0) { return; }
    }
    this.dateFilters[field] = moment(date).format('YYYY-MM-DD');
    this.getDepartments();
  }

  updateDateFilters() {
    this.filter1 = {
      startDate: { from: this.dateFilters.startDate },
      endDate: { to: this.dateFilters.endDate },
    };

    this.filter2 = {
      from: { startDate: this.dateFilters.startDate },
      to: { endDate: this.dateFilters.endDate },
    };
  }

  loadComponents() {
    this.updateDateFilters();
    this.getRoutesUsage();
    this.getRouteRatings();
    this.getTripsData();
    this.getAirportTransfers();
    this.getEmbassyVisits();
    this.getTripsAnalysis();
    this.getFrequentRiders();
  }

  getRoutesUsage() {
    this.routeUsageService.getRouteUsage(this.filter2).subscribe(routeUsageData => {
      const { mostUsedBatch, leastUsedBatch } = routeUsageData;
      this.mostUsedRoute = mostUsedBatch;
      this.leastUsedRoute = leastUsedBatch;
    });
  }

  getRouteRatings() {
    this.ratingsService.getRouteAverages(this.filter1).subscribe(res => {
      const { data } = res;
      this.mostRatedRoutes = data.slice(0, 3);
      this.leastRatedRoutes = data.sort((a, b) => a.Average - b.Average).slice(0, 3);
    });
  }

  callTripService(tripType = '') {
    return this.tripService.getTripData(this.filter1, tripType, this.tripData.departmentNames);
  }

  totalTripsCount(tripsData: Array<ITripsDataModel>): number {
    const totalVisits = tripsData.reduce((prev, next) => prev + Number(next.totalTrips), 0);
    return totalVisits;
  }

  getTripsData() {
    this.callTripService('Regular Trip').subscribe(res => {
      const { data: { trips, finalCost, finalAverageRating, count } } = res;
      this.tripsData = trips;
      this.totalCost = finalCost || 0;
      this.averageRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
      this.plotBarChart(trips);
    });
  }

  getAirportTransfers() {
    this.callTripService('Airport Transfer').subscribe(res => {
      const { data: { finalAverageRating, trips } } = res;
      this.airportRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
      this.totalAirportTrips = this.totalTripsCount(trips);
      this.plotTravelTripsAnalytics(trips, 0);
    });
  }

  getEmbassyVisits() {
    this.tripService.getTripData(this.filter1, 'Embassy Visit', this.tripData.departmentNames).subscribe(res => {
      const { data: { trips, finalAverageRating } } = res;
      this.averageEmbassyRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
      this.EmbassyVisits = this.totalTripsCount(trips);
      this.plotTravelTripsAnalytics(trips, 1);
    });
  }

  getTripsAnalysis() {
    this.tripService.getTravelData(this.filter1).subscribe(res => {
      const { data: { trips } } = res;
      this.travelTripCount = this.totalTripsCount(trips);
    });
    this.tripService.getTripData(this.filter1, 'Regular Trip', this.tripData.departmentNames).subscribe(res => {
      const { data: { trips } } = res;
      this.normalTripCount = this.totalTripsCount(trips);
    });
  }

  getDepartments() {
    this.departmentsService.get(5, 1).subscribe(res => {
      const weekOfMonth = this.getWeekOfMonth(this.dateFilters.startDate);
      const departments = res.departments.map(department => department.name);

      this.tripsDataSet.labels = [weekOfMonth, ...departments];
      this.tripData.departmentNames = [...departments];
      this.loadComponents();
      this.tripsDataSet.travel[0].data[0] = 0;
      this.tripsDataSet.travel[0].tripsCost[0] = 0;
      this.tripsDataSet.travel[1].data[0] = 0;
      this.tripsDataSet.travel[1].tripsCost[0] = 0;
    });
  }

  getWeekOfMonth(date: string) {
    const selectedDate = moment(date);
    const weekOfMonth = `Week ${Math.ceil(selectedDate.date() / 7)}`;
    return weekOfMonth;
  }

  plotTravelTripsAnalytics(trips, dataIndex: number) {
    const onlyUnique = (value, index, self) => self.indexOf(value) === index;
    let labels = [...this.tripsDataSet.labels];
    trips.map(trip => {
      if (labels.indexOf(trip.departmentName) === -1) {
        this.departments.push(trip.departmentName);
        const [weekOfMonth, ...dataLabels] = labels;
        labels = [weekOfMonth, ...this.departments, ...dataLabels].filter(onlyUnique);
      }

      const index = labels.indexOf(trip.departmentName);
      const newTravelData = [...this.tripsDataSet.travel[dataIndex].data];
      const newTravelCost = [...this.tripsDataSet.travel[dataIndex].tripsCost];

      newTravelData[index] = parseInt(trip.totalTrips, 0);
      newTravelCost[index] = parseInt(trip.totalCost || 0, 0);
      this.tripsDataSet.travel[dataIndex].data = [...newTravelData];
      this.tripsDataSet.travel[dataIndex].tripsCost = [...newTravelCost];
    });

    if (labels.length > 6) {
      labels.length = 6;
    }
    this.tripsDataSet.labels = labels;
  }

  plotBarChart(tripData): any {
    const newTotalCost = [];
    const newTotalTrip = [];

    const onlyUnique = (value, index, self) => self.indexOf(value) === index;

    let labels = [...this.tripData.departmentNames];
    tripData.map(tripInfo => {
      if (labels.indexOf(tripInfo.departmentName) === -1) {
        this.departments.push(tripInfo.departmentName);
        const [...dataLabels] = labels;
        labels = [...this.departments, ...dataLabels].filter(onlyUnique);
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
  }

  getFrequentRiders() {
    this.riderService.getRiders(this.filter1).subscribe(res => {
      const { firstFiveMostFrequentRiders, leastFiveFrequentRiders } = res.data;
      this.mostFrequentRiders = getRiderList(firstFiveMostFrequentRiders);
      this.leastFrequentRiders = getRiderList(leastFiveFrequentRiders);
    });
  }
}
