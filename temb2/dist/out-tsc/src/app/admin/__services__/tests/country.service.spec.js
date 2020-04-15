import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CountryService } from '../country.service';
describe('HomebaseService', function () {
    var countryService;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CountryService]
        });
        countryService = TestBed.get(CountryService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        httpMock.verify();
    });
    it('should be created', function () {
        expect(countryService).toBeTruthy();
    });
    it('should call http client get method on get a country list', function () {
        var response = { success: true };
        jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(response));
        countryService.getCountries();
        expect(HttpClient.prototype.get).toHaveBeenCalled();
    });
});
//# sourceMappingURL=country.service.spec.js.map