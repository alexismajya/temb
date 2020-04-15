import { TestBed, async } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { TripItineraryComponent } from './trip-itinerary.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TripRequestService } from '../../__services__/trip-request.service';
import { tripRequestMock } from '../../../shared/__mocks__/trip-request.mock';
import { pastTripMock } from '../../../shared/__mocks__/trip-request.mock';
import { department } from '../../../shared/__mocks__/department.mock';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
var mockMatDialog = {
    open: jest.fn(),
};
describe('TripItineraryComponent', function () {
    var appEventsMock = {
        broadcast: jest.fn()
    };
    var component;
    var tripRequestService;
    var fixture;
    var tripInfo = {
        distance: '12 km',
        requester: {
            name: 'sdfe'
        },
        rider: {
            name: 'sfdddsa'
        },
        pickup: 'asd',
        destination: 'afsd',
        department: 'safd'
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TripItineraryComponent, ShortenNamePipe, EmptyPageComponent, ShortenTextPipe],
            imports: [HttpClientTestingModule, AppTestModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {
                    provide: MatDialog, useValue: mockMatDialog
                },
                { provide: AppEventService, useValue: appEventsMock },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TripItineraryComponent);
        component = fixture.componentInstance;
        tripRequestService = fixture.debugElement.injector.get(TripRequestService);
        component.tripRequestType = 'all';
        fixture.detectChanges();
    });
    beforeEach(function () {
        var trips = Object.assign({}, tripRequestMock);
        var pageInfo = {
            totalResults: 12,
        };
        jest.spyOn(tripRequestService, 'getDepartments').mockReturnValue(of(department));
        jest.spyOn(tripRequestService, 'query')
            .mockReturnValue(of({ trips: [trips], pageInfo: pageInfo }));
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create TripItineraryComponent', function () {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', function () {
        it('should get trips and department', function () {
            component.tripRequestType = 'all';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
            expect(tripRequestService.getDepartments).toHaveBeenCalled();
            expect(component.status).toEqual(null);
        });
        it('should broadcast an event in all', function () {
            component.tripRequestType = 'all';
            component.ngOnInit();
            expect(appEventsMock.broadcast).toHaveBeenCalledWith({
                name: 'updateHeaderTitle',
                content: { 'badgeSize': 12, 'tooltipTitle': 'All Trips' }
            });
        });
        it('should broadcast an event in past trips', function () {
            component.tripRequestType = 'all';
            component.ngOnInit();
            expect(appEventsMock.broadcast).toHaveBeenCalledWith({
                name: 'updateHeaderTitle',
                content: { 'badgeSize': 12, 'tooltipTitle': 'All Trips' }
            });
        });
    });
    describe('declinedTrips', function () {
        it('should get declinedTrips and department', function () {
            component.tripRequestType = 'declinedTrips';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
            expect(tripRequestService.getDepartments).toHaveBeenCalled();
        });
    });
    describe('pastTrips', function () {
        it('should get pastTrips and department', function () {
            component.tripRequestType = 'pastTrips';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
            expect(tripRequestService.getDepartments).toHaveBeenCalled();
        });
    });
    describe('Pending', function () {
        it('should get Pending and department', function () {
            component.tripRequestType = 'pending';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
            expect(tripRequestService.getDepartments).toHaveBeenCalled();
        });
    });
    describe('updatePage', function () {
        it('should get trips and department', function () {
            jest.spyOn(component, 'getTrips');
            var page = 3;
            component.updatePage(page);
            expect(component.getTrips).toHaveBeenCalled();
        });
    });
    describe('setDateFilter', function () {
        it('should set date filters and call getTrips()', function () {
            var getTripsSpy = jest.spyOn(component, 'getTrips')
                .mockImplementation(jest.fn());
            component.setDateFilter('requestedOn', 'before', '2019-03-03');
            expect(getTripsSpy).toBeCalledTimes(1);
            expect(component.dateFilters.requestedOn).toEqual({ before: '2019-03-03' });
        });
        it('should return empty date if date is lower than current date', function () {
            component.tripRequestType = 'upcomingTrips';
            var getTripsSpy = jest.spyOn(component, 'getTrips')
                .mockImplementation(jest.fn());
            component.setDateFilter('requestedOn', 'before', '2018-03-03');
            expect(getTripsSpy).toBeCalledTimes(1);
            expect(component.dateFilters.requestedOn).toEqual({});
        });
    });
    describe('setFilterParams', function () {
        it('should set filter parameters for exporting tables', function () {
            component.departmentName = 'routes';
            component.dateFilters = {
                requestedOn: '2022-12-21',
                departureTime: '2023-12-21'
            };
            component.setFilterParams();
            expect(component.filterParams).toEqual({
                department: 'routes',
                dateFilters: {
                    requestedOn: '2022-12-21', departureTime: '2023-12-21'
                }
            });
        });
    });
    describe('checkTripRequestType', function () {
        it('should check trip\'s request type', function () {
            component.tripRequestType = 'declinedTrips';
            var isDeclinedTrips = component.checkTripRequestType('declinedTrips');
            expect(isDeclinedTrips).toBe(true);
        });
    });
    describe('departmentSelected', function () {
        it('fires event when department is selected', function () {
            var getTripsSpy = jest.spyOn(component, 'getTrips');
            component.departmentSelected('(click)');
            expect(component.departmentName).toEqual('(click)');
            expect(getTripsSpy).toHaveBeenCalled();
        });
    });
    describe('Up Coming Trips', function () {
        it('should get upcomingTrips and department', function () {
            component.tripRequestType = 'upcomingTrips';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
            expect(tripRequestService.getDepartments).toHaveBeenCalled();
        });
    });
    describe('Awaiting Provider drivers and cabs Trips', function () {
        it('should get trips awaiting provider drivers and cabs', function () {
            component.tripRequestType = 'awaitingProvider';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
        });
    });
    describe('Awaiting manager approval trips', function () {
        it('should get trips awaiting for manager approval', function () {
            component.tripRequestType = 'awaitingApproval';
            component.ngOnInit();
            expect(tripRequestService.query).toHaveBeenCalled();
        });
    });
    describe('Get Past Trips', function () {
        it('return only valid past trips', function () {
            var pastTrips = component.getPastTrips(pastTripMock);
            expect(pastTrips.length).toEqual(2);
        });
    });
});
//# sourceMappingURL=trip-itinerary.component.spec.js.map