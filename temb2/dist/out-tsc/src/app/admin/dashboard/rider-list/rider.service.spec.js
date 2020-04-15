import { TestBed, getTestBed } from '@angular/core/testing';
import { RiderService } from './rider.service';
import { riders } from './mock.data';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('RiderService', function () {
    var injector;
    var service;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        injector = getTestBed();
        service = injector.get(RiderService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    it('should return a list of most frequent and least frequent riders', function () {
        var result;
        var dateRange = {
            startDate: '2016-01-01',
            endDate: '2020-01-01',
        };
        jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(riders));
        service.getRiders(dateRange).subscribe(function (data) {
            result = data;
        });
        expect(result).toEqual(riders);
    });
});
//# sourceMappingURL=rider.service.spec.js.map