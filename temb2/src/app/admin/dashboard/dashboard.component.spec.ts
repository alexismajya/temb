import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { RouteUsageService } from '../__services__/route-usage.service';
import routeUsageMock from '../__services__/__mocks__/routeUsageMock';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { TripsDataService } from '../__services__/trips-data.service';
import { RouteRatingsOverviewComponent } from './route-ratings-overview/route-ratings-overview.component';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { mockRouteRatings } from './route-ratings-overview/ratingsMockData';
import { DashboardComponent } from './dashboard.component';
import { RoutesOverviewComponent } from './routes-overview/routes-overview.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { AverageTripRatingsComponent } from './average-trip-ratings/average-trip-ratings.component';
import { tripsMock, travelMock, departmentsMock } from 'src/app/__mocks__/trips.mock';
import { TotalCostViewComponent } from './total-cost-view/total-cost-view.component';
import { riders } from './rider-list/mock.data';
import { RiderService } from './rider-list/rider.service';
import { RiderListComponent } from './rider-list/rider-list.component';
import { TripPieChartComponent } from './trip-pie-chart/trip-pie-chart.component';
import { DepartmentsService } from '../__services__/departments.service';
import { RiderCardComponent } from './rider-list/rider-card/rider-card.component';
import { TripBarChartComponent } from './trip-bar-chart/trip-bar-chart.component';
import { ShortenTextPipe } from '../__pipes__/shorten-text.pipe';

import { HomeBaseManager } from 'src/app/shared/homebase.manager';


export const routeRatingServiceMock = {
  getRouteAverages: jest.fn().mockReturnValue(of(tripsMock)),
};

export const averageTripRatingServiceMock = {
  getTripData: jest.fn().mockReturnValue(of(tripsMock)),
};

export const riderServiceMock = {
  getRiders: jest.fn().mockReturnValue(of(riders))
};


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const service = {
    getRouteUsage: jest.fn().mockReturnValue(of(routeUsageMock)),
  };
  const tripDataService = {
    getTripData: jest.fn().mockReturnValue(of(tripsMock)),
    getTravelData: jest.fn().mockReturnValue(of(tripsMock))
  };
  const departmentServiceMock = {
    get: jest.fn().mockReturnValue(of(departmentsMock)),
  };

  const homebaseManagerMock = {
    getHomebaseId: jest.fn()
  };


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        RoutesOverviewComponent,
        DatePickerComponent,
        RouteRatingsOverviewComponent,
        RatingStarsComponent,
        AverageTripRatingsComponent,
        TotalCostViewComponent,
        RiderListComponent,
        RiderCardComponent,
        AverageTripRatingsComponent,
        TotalCostViewComponent,
        TripPieChartComponent,
        TripBarChartComponent,
        ShortenTextPipe
      ],
      imports: [
        HttpClientTestingModule,
        AngularMaterialModule,
        FormsModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: RouteUsageService, useValue: service },
        { provide: RouteRatingsService, useValue: routeRatingServiceMock },
        { provide: TripsDataService, useValue: tripDataService },
        { provide: DepartmentsService, useValue: departmentServiceMock },
        { provide: RiderService, useValue: riderServiceMock },
        { provide: HomeBaseManager, useValue: homebaseManagerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return an object containing both mostUsedBatch and leastUsedBatch', () => {
    service.getRouteUsage.mockReturnValue(of(routeUsageMock));

    component.getRoutesUsage();
    expect(component.mostUsedRoute).toEqual({
      Route: 'Pangani',
      RouteBatch: 'A',
      percentageUsage: 100
    });
  });

  it('should set date filters and call getRoutesUsage()', () => {

    const routesUsage = jest.spyOn(component, 'getRoutesUsage')
      .mockImplementation(jest.fn());
    jest.spyOn(component, 'getRouteRatings').mockImplementationOnce(jest.fn);

   component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
    component.setDateFilter('startDate', '2019-05-03');
    expect(routesUsage).toBeCalledTimes(1);
    expect(component.dateFilters.startDate).toEqual('2019-05-03');
  });

  describe('getRouteRatings', () => {
    let getRouteRatingsSpy;
    beforeEach(() => {
      getRouteRatingsSpy = jest.spyOn(component, 'getRouteRatings');
    });

    it('should call getRouteRating on ngOnInit', () => {
      getRouteRatingsSpy.mockImplementationOnce(() => jest.fn());
      jest.spyOn(component, 'getDepartments');
      component.ngOnInit();
      expect(component.getRouteRatings).toHaveBeenCalled();
      expect(component.getDepartments).toHaveBeenCalled();
    });

    it('should call getRouteRatings on setDateFilter', () => {
      getRouteRatingsSpy.mockImplementationOnce(() => jest.fn());
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      component.setDateFilter('startDate', '2019-05-03');
      expect(component.getRouteRatings).toHaveBeenCalled();
    });

    it('should call routeRating service and set route ratings', () => {
      const res = {
        success: true,
        message: 'Ratings fetched successfully',
        data: mockRouteRatings
      };
      jest.spyOn(routeRatingServiceMock, 'getRouteAverages').mockReturnValue(of(res));
      component.getRouteRatings();
      expect(routeRatingServiceMock.getRouteAverages).toHaveBeenCalled();
      expect(component.mostRatedRoutes).toEqual(res.data.slice(0, 3));
      expect(component.leastRatedRoutes).toEqual(res.data.slice(0, 3));
    });
  });

  describe('get trip data', () => {
    it('should call getTripsData on ngOnInit', () => {
      jest.spyOn(component, 'getTripsData');
      component.ngOnInit();
      expect(component.getTripsData).toHaveBeenCalled();
    });

    it('should call getTripsData on setDateFilter', () => {
      jest.spyOn(component, 'getTripsData');
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      component.setDateFilter('startDate', '2019-05-03');
      expect(component.getTripsData).toHaveBeenCalled();
    });
  });

  describe('Airport Transfers', () => {
    it('should call getAirportTransfers on ngOnInit', () => {
      jest.spyOn(component, 'getAirportTransfers');
      component.ngOnInit();
      expect(component.getAirportTransfers).toHaveBeenCalled();
    });

    it('should call getTripsData on setDateFilter', () => {
      jest.spyOn(component, 'getAirportTransfers');
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      component.setDateFilter('startDate', '2019-05-03');
      expect(component.getAirportTransfers).toHaveBeenCalled();
    });
  });

  describe('Embassy Visits', () => {
    it('should call getEmbassyVisits on ngOnInit', () => {
      jest.spyOn(component, 'getEmbassyVisits');
      component.ngOnInit();
      expect(component.getEmbassyVisits).toHaveBeenCalled();
    });

    it('should call getTripsData on setDateFilter', () => {
      jest.spyOn(component, 'getEmbassyVisits');
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      component.setDateFilter('startDate', '2019-05-03');
      expect(component.getEmbassyVisits).toHaveBeenCalled();
    });
  });

  describe('Get Travel Data', () => {
    it('should call getTripsAnalysis on ngOnInit', () => {
      jest.spyOn(component, 'getTripsAnalysis');
      component.ngOnInit();
      expect(component.getTripsAnalysis).toHaveBeenCalled();
    });

    it('should set travelTripCount and normalTripCount to number of returned trips', () => {
      component.getTripsAnalysis();
      expect(component.travelTripCount).toEqual(6);
      expect(component.normalTripCount).toEqual(6);
    });
  });

  describe('Travel Analytics', () => {
    it('should load initial data/departments when component is initialized', () => {
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      jest.spyOn(component, 'getWeekOfMonth').mockReturnValue('Week 1');
      component.getDepartments();
      expect(component.tripsDataSet.labels).toEqual(['Week 1', undefined, 'TDD', 'People', 'Finance']);
      expect(component.tripsDataSet.travel[0].data).toEqual([0, 1]);
      expect(component.tripsDataSet.travel[0].tripsCost).toEqual([0, 100]);
    });
    it('should get the week of the month', () => {
      expect(component.getWeekOfMonth('2019-08-14')).toEqual('Week 2');
    });
    it('should populate chartData with travel trips', () => {
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      component.tripsDataSet.travel[0].data = [0, 0, 0];
      component.tripsDataSet.travel[0].tripsCost = [0, 0, 0];
      component.tripsDataSet.labels = ['Week 1', 'People', 'Finance'];

      component.plotTravelTripsAnalytics(travelMock.data, 0);
      expect(component.tripsDataSet.travel[0].data).toEqual([0, 2, 0]);
      expect(component.tripsDataSet.travel[0].tripsCost).toEqual([0, 80, 0]);
    });
    it('should limit chart labels to 6', () => {
      component.dateFilters = {startDate: '2019-05-03', endDate: '2019-05-06' };
      component.tripsDataSet.travel[0].data = [0, 0, 0];
      component.tripsDataSet.travel[0].tripsCost = [0, 0, 0];
      component.tripsDataSet.labels = [
        'Week 1', 'People', 'Finance', 'Technology', 'Technical', 'Launchpad'
      ];

      component.plotTravelTripsAnalytics(travelMock.data, 0);
      expect(component.tripsDataSet.labels).toEqual([
        'Week 1', 'TDD', 'People', 'Finance', 'Technology', 'Technical'
      ]);
    });
  });



    describe('Trip plot bar chart', () => {
      it('should call plotBarChart', () => {
        component.plotBarChart([{
          averageRating: '2.00',
          departmentId: 1,
          departmentName: 'TDD',
          totalCost: '23',
          totalTrips: '1'
        }]);
        expect(component.tripData.tripsCost).toEqual([23]);
        expect(component.tripData.trip[1].data).toEqual([1]);
      });

      it('should limit chart labels to 6 (Trips)', () => {
        component.tripData.trip[1].data = [0, 0, 0];
        component.tripData.tripsCost = [0, 0, 0];
        component.tripData.departmentNames = [
          'People', 'Finance', 'Technology', 'Technical', 'Launchpad', 'Success', 'Operations'
        ];

        component.plotBarChart(travelMock.data);
        expect(component.tripData.departmentNames).toEqual([
          'TDD', 'People', 'Finance', 'Technology', 'Technical',
        ]);
      });
    });
  });
