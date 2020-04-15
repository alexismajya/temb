import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RouteRatingsService } from '../route-ratings.service';
import { mockRouteRatings } from '../../dashboard/route-ratings-overview/ratingsMockData';
describe('RouteRatingsService', function () {
    var service;
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [RouteRatingsService],
            imports: [HttpClientTestingModule]
        });
        service = TestBed.get(RouteRatingsService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    it('should call http get on getRouteAverages', function () {
        jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
        service.getRouteAverages({ startDate: { from: '2010-10-29' }, endDate: { to: '2010-10-2' } });
        expect(HttpClient.prototype.get).toHaveBeenCalled();
    });
    it('should return route ratings', function () {
        var ratings = null;
        jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(mockRouteRatings));
        service.getRouteAverages({ startDate: { from: '2010-10-29' }, endDate: { to: '2010-10-2' } }).subscribe(function (res) {
            ratings = res;
        });
        expect(ratings).toEqual(mockRouteRatings);
    });
    it('should return empty array route ratings', function () {
        var ratings = null;
        jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(mockRouteRatings));
        service.getRouteAverages({ startDate: { from: '' }, endDate: { to: '' } }).subscribe(function (res) {
            ratings = res;
        });
        expect(ratings).toEqual(mockRouteRatings);
    });
});
//# sourceMappingURL=route-ratings.service.spec.js.map