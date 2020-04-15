import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { RouteTripsService } from './route-trips.service';
import { AlertService } from 'src/app/shared/alert.service';
import { environment } from '../../../environments/environment';
import { AppTestModule } from '../../__tests__/testing.module';
import routeTripsResponseMock from '../routes/route-trips/__mocks__/routeTrips.mock';

describe('RouteTripsService', () => {
  let injector: TestBed;
  let service: RouteTripsService;
  let httpMock: HttpTestingController;
  let toastr: AlertService;
  const serviceResponse = { ...routeTripsResponseMock };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule]
    });

    injector = getTestBed();
    service = injector.get(RouteTripsService);
    httpMock = injector.get(HttpTestingController);
    toastr = injector.get(AlertService);
  });

  afterEach(() => {
    httpMock.verify();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    service = TestBed.get(RouteTripsService);
    expect(service).toBeTruthy();
  });

  describe('service methods', async () => {
    it('should return route trips records', (done) => {
      service.getBatchTripsRecords({ page: 1, pageSize: 10 })
      .subscribe(result => {
        expect(result).toEqual(serviceResponse);
        done();
      });

    const routeTripsUrl = `${environment.tembeaBackEndUrl}/api/v2/trips/routetrips?page=1&size=10`;
    const req = httpMock.expectOne(routeTripsUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(serviceResponse);
    });

    it('should display error message', () => {
      service.handleError({ message: 'server error' });
      expect(toastr.error).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', (done) => {
      jest.spyOn(service, 'handleError');
      service.getBatchTripsRecords({ page: 1, pageSize: 10 })
      .subscribe(() => {}, err => {
        expect(service.handleError).toHaveBeenCalled();
        expect(err)
          .toEqual('Http failure response for http://localhost:5000/api/v2/trips/routetrips?page=1&size=10: 500 server error');
        done();
      });

    const routeTripsUrl = `${environment.tembeaBackEndUrl}/api/v2/trips/routetrips?page=1&size=10`;
    const req = httpMock.expectOne(routeTripsUrl);
    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('server error'), { status: 500, statusText: 'server error' });
    });
  });
});
