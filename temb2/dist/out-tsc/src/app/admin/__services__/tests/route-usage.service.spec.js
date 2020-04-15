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
import { RouteUsageService } from '../route-usage.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import routeUsageMock from '../__mocks__/routeUsageMock';
describe('RouteUsageService', function () {
    var service;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RouteUsageService]
        });
        httpMock = TestBed.get(HttpTestingController);
        service = TestBed.get(RouteUsageService);
    });
    afterEach(function () {
        httpMock.verify();
    });
    describe('getRouteUsage', function () {
        it('should be created', function () {
            expect(service).toBeTruthy();
        });
        it('should make http request to get most used and least used routes', function () {
            service.getRouteUsage({
                from: { startDate: '2019-05-03' }, to: { endDate: '2019-05-06' }
            }).subscribe(function (usageData) {
                expect(usageData.mostUsedBatch).toBeDefined();
                expect(usageData.leastUsedBatch).toBeDefined();
            });
            var req = httpMock.expectOne('http://localhost:5000/api/v1/routes/status/usage?from=2019-05-03&to=2019-05-06');
            req.flush({ data: __assign({}, routeUsageMock) });
        });
    });
});
//# sourceMappingURL=route-usage.service.spec.js.map