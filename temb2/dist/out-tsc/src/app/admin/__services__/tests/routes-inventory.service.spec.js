import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { RoutesInventoryService } from '../routes-inventory.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import getRoutesResponseMock from '../../routes/routes-inventory/__mocks__/get-routes-response.mock';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
describe('RoutesInventoryService', function () {
    var service;
    var httpMock;
    var tembeaBackEndUrl = environment.tembeaBackEndUrl;
    var deleteResponseMock = {
        success: true,
        message: 'route batch deleted successfully'
    };
    var mockData = {
        someProp: 'someValue'
    };
    beforeEach(function () {
        return TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RoutesInventoryService],
        });
    });
    beforeEach(inject([RoutesInventoryService, HttpTestingController], function (_service, _httpMock) {
        service = _service;
        httpMock = _httpMock;
    }));
    afterEach(function () {
        httpMock.verify();
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    it('getAll(): should return all routes', function (done) {
        jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
        service.getRoutes(2, 2, 'name,asc').subscribe(function (value) {
            expect(value).toHaveProperty('routes');
            expect(value.routes.length).toBe(5);
            done();
        });
    });
    it('should make http request to change the route status', function () {
        var response = { success: true };
        service.changeRouteStatus(1, { status: 'Active' }).subscribe(function (data) {
            expect(data).toEqual(response);
        });
        var changeStatusRequest = httpMock.expectOne(tembeaBackEndUrl + "/api/v1/routes/1");
        expect(changeStatusRequest.request.method).toEqual('PUT');
        changeStatusRequest.flush(response);
    });
    it('should make http request to delete route batch by Id', function () {
        var spy = jest.spyOn(HttpClient.prototype, 'delete');
        spy.mockReturnValue(of(deleteResponseMock));
        var result = service.deleteRouteBatch(1);
        result.subscribe(function (data) {
            expect(data).toEqual(deleteResponseMock);
        });
        expect(JSON.stringify(result)).toEqual(JSON.stringify(of(deleteResponseMock)));
    });
    it('should call post method', function () {
        var toPromise = { toPromise: function () { } };
        var postMethod = jest.spyOn(service.http, 'post').mockReturnValue(toPromise);
        service.createRoute(mockData);
        expect(postMethod).toBeCalled();
    });
});
//# sourceMappingURL=routes-inventory.service.spec.js.map