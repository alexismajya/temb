import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TripsDataService } from './trips-data.service';
import { HttpClient } from '@angular/common/http';
import { travelMock } from 'src/app/__mocks__/trips.mock';

const datePickerObject = {
  startDate: { from: '2018-10-12' },
  endDate: { to: '2018-12-24' }
};
describe('TripRatingsService', () => {
  let injector: TestBed;
  let service: TripsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    injector = getTestBed();
    service = injector.get(TripsDataService);

  });

  it('should call the get the Trip Data', () => {
    jest.spyOn(HttpClient.prototype, 'post');
    service.getTripData(datePickerObject);
    expect(HttpClient.prototype.post).toHaveBeenCalled();
  });

  it('should call the get the Travel Data', () => {
    jest.spyOn(HttpClient.prototype, 'post');
    service.getTravelData(datePickerObject);
    expect(HttpClient.prototype.post).toHaveBeenCalled();
  });

  it('should fetch a completed travel trips by department', () => {
    const httpSpy = jest.spyOn(HttpClient.prototype, 'post');
    httpSpy.mockReturnValue(of(travelMock));
    const dateFilter = {
      startDate: { from: '' },
      endDate: { to: '' },
    };

    const result = service.getTravelData(dateFilter, ['TDD']);
    expect(httpSpy).toHaveBeenCalled();
    result.subscribe(data => {
      expect(data).toEqual(travelMock);
    });
  });

});
