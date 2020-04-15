import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ProviderService } from './providers.service';
import { createProviderMock, providerResponseMock } from '../providers/add-provider-modal/__mocks__/add-provider.mocks';
describe('ProvidersService', function () {
    var service;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProviderService]
        });
        service = TestBed.get(ProviderService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        httpMock.verify();
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    describe('getAllProviders', function () {
        beforeEach(function () {
            jest.spyOn(HttpClient.prototype, 'get');
        });
        it('should call HttpClient.getProviders', function () {
            service.getProviders(1, 1);
            expect(HttpClient.prototype.get).toBeCalled();
        });
        it('return all the providers', function () {
            jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
            var result = service.getProviders(1, 1);
            result.subscribe(function (data) {
                expect(data).toEqual({});
            });
        });
        it('return all the providers', function () {
            jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
            var result = service.getProviders();
            result.subscribe(function (data) {
                expect(data).toEqual({});
            });
        });
    });
    describe('getViableProviders', function () {
        beforeEach(function () {
            jest.spyOn(HttpClient.prototype, 'get');
        });
        it('should call HttpClient.getProviders', function () {
            service.getViableProviders();
            expect(HttpClient.prototype.get).toBeCalled();
        });
        it('return all the providers', function () {
            jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
            var result = service.getViableProviders();
            result.subscribe(function (data) {
                expect(data).toEqual({});
            });
        });
    });
    describe('Update Provider', function () {
        it('should call http client patch on update provider', function () {
            jest.spyOn(HttpClient.prototype, 'patch').mockReturnValue(of({}));
            service.editProvider({}, 1);
            expect(HttpClient.prototype.patch).toHaveBeenCalled();
        });
        it('should return data on http edit provider', function () {
            var response = { success: true };
            jest.spyOn(HttpClient.prototype, 'patch').mockReturnValue(of(response));
            var results = service.editProvider({}, 1);
            results.subscribe(function (data) {
                expect(data).toEqual(response);
            });
        });
    });
    describe('Delete Provider', function () {
        beforeEach(function () {
            jest.spyOn(HttpClient.prototype, 'delete');
        });
        it('should call Http client to delete Provider', function () {
            service.deleteProvider(1);
            expect(HttpClient.prototype.delete).toHaveBeenCalled();
        });
        it('should delete a provider successfully', function () {
            jest.spyOn(HttpClient.prototype, 'delete').mockReturnValue(of({}));
            service.deleteProvider(1).subscribe(function (data) {
                expect(data).toEqual({});
            });
        });
        describe('addProvider', function () {
            it('should add a new provider', function () {
                var provider = null;
                jest.spyOn(service, 'add').mockReturnValue(of(providerResponseMock));
                service.add(createProviderMock).subscribe(function (value) {
                    provider = value;
                });
                expect(provider).toEqual(providerResponseMock);
            });
            it('should call http client post method on add provider', function () {
                var response = { success: true };
                jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
                service.add({});
                expect(HttpClient.prototype.post).toHaveBeenCalled();
            });
        });
        describe('add Driver', function () {
            var driverObject = {
                driverPhoneNo: 45678,
                driverName: 'Test User',
                driverNumber: '1222333',
                providerId: 1
            };
            var expected = {
                success: true,
                message: 'Driver successfully added',
                data: driverObject
            };
            it('should call http client post', function () {
                jest.spyOn(HttpClient.prototype, 'post').mockImplementation(function () {
                    return of({ expected: expected });
                });
                jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of({ expected: expected }));
                service.addDriver(driverObject);
                expect(HttpClient.prototype.post).toHaveBeenCalled();
            });
            it('should add a driver sucessfully', function () {
                var response = null;
                jest.spyOn(HttpClient.prototype, 'post').mockImplementation(function () {
                    return of(expected);
                });
                jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of({ expected: expected }));
                service.addDriver(driverObject).subscribe(function (data) {
                    response = data;
                });
                expect(response.expected).toEqual(expected);
            });
        });
    });
});
//# sourceMappingURL=providers.service.spec.js.map