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
import { getTestBed, TestBed } from '@angular/core/testing';
import { RouteRequestService } from './route-request.service';
import { HttpTestingController } from '@angular/common/http/testing';
import getAllResponseMock from '../routes/route-requests/__mocks__/get-all-response.mock';
import { AppTestModule } from '../../__tests__/testing.module';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../shared/alert.service';
describe('RoutesService', function () {
    var service;
    var httpMock;
    var toastr;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [AppTestModule],
            providers: []
        });
        var injector = getTestBed();
        service = injector.get(RouteRequestService);
        httpMock = injector.get(HttpTestingController);
        toastr = injector.get(AlertService);
    });
    afterEach(function () {
        httpMock.verify();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    it('getAllRequests(): should return all pending routes', function (done) {
        service.getAllRequests().subscribe(function (result) {
            expect(result).toEqual(getAllResponseMock.routes);
            done();
        });
        var request = httpMock.expectOne(service.routesUrl + "/requests");
        expect(request.request.method).toEqual('GET');
        request.flush(getAllResponseMock);
    });
    describe('declineRequest', function () {
        it('should tap and handle decline request', function (done) {
            jest.spyOn(service, 'handleResponse').mockImplementation();
            var comment = 'some comment';
            var teamUrl = environment.teamUrl;
            var mockResponse = {
                success: true,
                message: 'This route request has been updated',
                data: { id: 1 }
            };
            service.declineRequest(1, comment)
                .subscribe(function (result) {
                expect(result).toEqual(mockResponse);
                expect(service.handleResponse).toHaveBeenCalledTimes(1);
                expect(service.handleResponse).toHaveBeenCalledWith(mockResponse, 'decline');
                done();
            });
            var request = httpMock.expectOne(service.routesUrl + "/requests/status/1");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual({ comment: comment, newOpsStatus: 'decline', teamUrl: teamUrl });
            request.flush(mockResponse);
        });
        it('should tap and decline request error', function (done) {
            var comment = 'some comment';
            var teamUrl = environment.teamUrl;
            service.declineRequest(1, comment)
                .subscribe(null, function (result) {
                expect(result.status).toEqual(400);
                expect(result.statusText).toEqual('Bad Request');
                expect(toastr.error).toHaveBeenCalledTimes(1);
                done();
            });
            var request = httpMock.expectOne(service.routesUrl + "/requests/status/1");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual({ comment: comment, newOpsStatus: 'decline', teamUrl: teamUrl });
            request.flush('Server error', {
                status: 400,
                statusText: 'Bad Request'
            });
        });
    });
    describe('approveRouteRequest', function () {
        var routeDetails = {};
        var comment = 'some comment';
        var teamUrl = environment.teamUrl;
        var provider = { id: 1, name: 'Andela Kenya', providerUserId: 15 };
        var updatedRouteDetails = {
            comment: 'some comment',
            newOpsStatus: 'approve',
            provider: { id: 1, name: 'Andela Kenya', providerUserId: 15 },
            routeName: 'Some route name',
            takeOff: '2:30',
            teamUrl: 'andela-tembea.slack.com'
        };
        var mockResponse;
        beforeEach(function () {
            jest.spyOn(service, 'handleResponse').mockImplementation();
            routeDetails['routeName'] = 'Some route name';
            routeDetails['takeOff'] = '2:30';
            routeDetails['providerName'] = 'Rides';
            mockResponse = {
                success: true,
                message: 'This route request has been updated',
                data: { id: 1 }
            };
        });
        it('should call handleApproveRouteResponse', function (done) {
            service.approveRouteRequest(1, comment, routeDetails, provider)
                .subscribe(function (result) {
                expect(service.handleResponse).toHaveBeenCalledTimes(1);
                expect(result.provider).toHaveBeenCalledWith(result, 'approve');
                done();
            });
            var request = httpMock.expectOne(service.routesUrl + "/requests/status/1");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(__assign({}, updatedRouteDetails, { comment: comment, teamUrl: teamUrl, newOpsStatus: 'approve' }));
            request.flush(mockResponse);
            jest.restoreAllMocks();
            done();
        });
        it('should tap and approve request error', function (done) {
            service.approveRouteRequest(1, comment, routeDetails, provider)
                .subscribe(null, function (result) {
                expect(result.status).toEqual(400);
                expect(result.statusText).toEqual('Bad Request');
                expect(toastr.error).toHaveBeenCalledTimes(1);
                done();
            });
            var request = httpMock.expectOne(service.routesUrl + "/requests/status/1");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(__assign({}, updatedRouteDetails, { comment: comment, teamUrl: teamUrl, newOpsStatus: 'approve' }));
            request.flush('Server error', {
                status: 400,
                statusText: 'Bad Request'
            });
        });
    });
    describe('handleResponse', function () {
        it('should create the route request', function () {
            service.handleResponse({ success: true }, 'approve');
            expect(toastr.success).toHaveBeenCalledTimes(1);
            expect(toastr.success).toHaveBeenCalledWith('Route request approved!');
        });
        it('should create the route request', function () {
            service.handleResponse({ success: false }, 'decline');
            expect(toastr.error).toHaveBeenCalledTimes(1);
            expect(toastr.error).toHaveBeenCalledWith('Could not decline request');
        });
    });
});
//# sourceMappingURL=route-request.service.spec.js.map