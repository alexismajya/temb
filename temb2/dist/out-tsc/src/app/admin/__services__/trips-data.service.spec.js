import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TripsDataService } from './trips-data.service';
import { HttpClient } from '@angular/common/http';
import { travelMock } from 'src/app/__mocks__/trips.mock';
var datePickerObject = {
    startDate: { from: '2018-10-12' },
    endDate: { to: '2018-12-24' }
};
describe('TripRatingsService', function () {
    var injector;
    var service;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        injector = getTestBed();
        service = injector.get(TripsDataService);
    });
    it('should call the get the Trip Data', function () {
        jest.spyOn(HttpClient.prototype, 'post');
        service.getTripData(datePickerObject);
        expect(HttpClient.prototype.post).toHaveBeenCalled();
    });
    it('should call the get the Travel Data', function () {
        jest.spyOn(HttpClient.prototype, 'post');
        service.getTravelData(datePickerObject);
        expect(HttpClient.prototype.post).toHaveBeenCalled();
    });
    it('should fetch a completed travel trips by department', function () {
        var httpSpy = jest.spyOn(HttpClient.prototype, 'post');
        httpSpy.mockReturnValue(of(travelMock));
        var dateFilter = {
            startDate: { from: '' },
            endDate: { to: '' },
        };
        var result = service.getTravelData(dateFilter, ['TDD']);
        expect(httpSpy).toHaveBeenCalled();
        result.subscribe(function (data) {
            expect(data).toEqual(travelMock);
        });
    });
});
//# sourceMappingURL=trips-data.service.spec.js.map