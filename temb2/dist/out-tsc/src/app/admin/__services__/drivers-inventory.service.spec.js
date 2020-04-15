import { DriversInventoryService } from './drivers-inventory.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import getDriversResponseMock from '../../__mocks__/drivers.mock';
describe('DriverInventoryService', function () {
    var injector;
    var service;
    var getDriversResponse = getDriversResponseMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        injector = getTestBed();
        service = injector.get(DriversInventoryService);
    });
    describe('getCabs', function () {
        it('should get all Drivers', function () {
            var httpSpy = jest.spyOn(HttpClient.prototype, 'get');
            httpSpy.mockReturnValue(of(getDriversResponse));
            var drivers;
            var result = service.get(2, 2, 'name,asc,batch,asc', 1);
            result.subscribe(function (value) {
                drivers = value;
                expect(drivers).toEqual(getDriversResponseMock.drivers);
            });
        });
        it('should edit a driver', function () {
            var dummyDriver = {
                driverName: 'james',
                driverPhoneNo: 213213213,
                driverNumber: 678923,
                email: 'james@andla.com'
            };
            var updateHttpSpy = jest.spyOn(HttpClient.prototype, 'put');
            updateHttpSpy.mockReturnValue(of(dummyDriver));
            var res = service.updateDriver(dummyDriver, 1, 1);
            res.subscribe(function (value) {
                expect(value).toEqual(dummyDriver);
            });
        });
    });
    describe('deleteCab', function () {
        it('should delete a driver', function () {
            var responseMock = {
                success: true,
                message: 'Driver successfully deleted',
            };
            var httpSpy = jest.spyOn(HttpClient.prototype, 'delete');
            httpSpy.mockReturnValue(of(responseMock));
            var result = service.deleteDriver(1, 1);
            result.subscribe(function (response) {
                expect(response).toEqual(responseMock);
            });
        });
    });
});
//# sourceMappingURL=drivers-inventory.service.spec.js.map