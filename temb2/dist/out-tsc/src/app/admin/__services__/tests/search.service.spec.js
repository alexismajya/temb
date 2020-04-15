import { getTestBed, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import getRoutesResponseMock from '../../routes/routes-inventory/__mocks__/get-routes-response.mock';
import { SearchService } from '../search.service';
import { CookieService } from '../../../auth/__services__/ngx-cookie-service.service';
import { ClockService } from '../../../auth/__services__/clock.service';
import { Router } from '@angular/router';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { AlertService } from '../../../shared/alert.service';
import { mockToastr } from '../../../shared/__mocks__/mockData';
import { RouteInventoryModel } from '../../../shared/models/route-inventory.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
describe('SearchService', function () {
    var searchService;
    var httpTestingController;
    var injector;
    var mockRouter;
    var mockClockService;
    var mockCookieService;
    var getRoutesResponse = new RouteInventoryModel().deserialize(getRoutesResponseMock);
    var hbManagerMock = {
        getHomebaseId: jest.fn().mockReturnValue(4)
    };
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CookieService, useValue: new SpyObject(CookieService) },
                { provide: ClockService, useValue: new SpyObject(ClockService) },
                { provide: Router, useValue: new SpyObject(Router) },
                { provide: AlertService, useValue: mockToastr },
                { provide: MatDialog, useValue: { closeAll: jest.fn() } },
                { provide: HomeBaseManager, useValue: hbManagerMock }
            ]
        });
        injector = getTestBed();
        searchService = injector.get(SearchService);
        httpTestingController = TestBed.get(HttpTestingController);
    });
    beforeEach(function () {
        mockClockService = injector.get(ClockService);
        mockRouter = injector.get(Router);
        mockCookieService = injector.get(CookieService);
        mockCookieService.delete.mockReturnValue({});
        mockClockService.getClock.mockReturnValue(of(6000000000));
        mockRouter.navigate.mockResolvedValue({});
    });
    afterEach(function () {
        httpTestingController.verify();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should be created', function () {
        expect(searchService).toBeTruthy();
    });
    it('should return filtered routes if route name provided', function (done) {
        var routeName = 'anyRoute';
        jest.spyOn(searchService, 'searchData').mockReturnValue(of(getRoutesResponse));
        searchService.searchData(of(routeName), 'routes').subscribe(function (value) {
            expect(value).toHaveProperty('routes');
            expect(value.routes).toEqual(getRoutesResponseMock.routes);
            done();
        });
    });
    it('should trigger searchItems()', function (done) {
        var routeName = 'anyRoute';
        jest.spyOn(searchService, 'searchItems').mockReturnValue(of(getRoutesResponseMock));
        searchService.searchData(of(routeName), 'routes').subscribe(function (value) {
            expect(searchService.searchItems).toHaveBeenCalled();
            done();
        });
    });
    it('searchItems should make http request to get list of routes batches', function (done) {
        var httpSpy = jest.spyOn(HttpClient.prototype, 'get');
        httpSpy.mockReturnValue(of(getRoutesResponseMock));
        var endpointUrl = environment.tembeaBackEndUrl + "/api/v2/routes?name";
        var searchTerm = 'hello';
        var result = searchService.searchItems(endpointUrl, searchTerm);
        result.subscribe(function (data) {
            expect(data).toEqual(getRoutesResponseMock);
            done();
        });
    });
    it('should return an array of search query and trimmed term', function (done) {
        var _a = searchService.getQueryAndTerm('routes', 'term'), routesQuery = _a[0], searchTerm = _a[1];
        expect(routesQuery).toEqual('routes?name=');
        expect(searchTerm).toEqual('term');
        done();
    });
    it('should return an array of search query and default term', function (done) {
        var defaultTerm = 'sort=name,asc,batch,asc&size=20&page=1';
        var _a = searchService.getQueryAndTerm('routes', ' ', defaultTerm), routesQuery = _a[0], searchTerm = _a[1];
        expect(routesQuery).toEqual('routes?');
        expect(searchTerm).toEqual(defaultTerm);
        done();
    });
});
//# sourceMappingURL=search.service.spec.js.map