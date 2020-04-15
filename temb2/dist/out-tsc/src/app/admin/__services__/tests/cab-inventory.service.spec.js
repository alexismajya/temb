import { CabsInventoryService } from '../cabs-inventory.service';
import { responseMock, getCabsMock, createCabMock, updateCabMock, updateResponse } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CabInventoryModel } from 'src/app/shared/models/cab-inventory.model';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
describe('CabInventoryService', function () {
    var injector;
    var service;
    var httpMock;
    var getCabsResponse = new CabInventoryModel().deserialize(getCabsMock);
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        injector = getTestBed();
        service = injector.get(CabsInventoryService);
        httpMock = injector.get(HttpClientTestingModule);
    });
    describe('getCabs', function () {
        it('should get all Cabs', function () {
            var httpSpy = jest.spyOn(HttpClient.prototype, 'get');
            httpSpy.mockReturnValue(of(getCabsResponse));
            var cabs;
            var result = service.get(2, 2, 'name,asc,batch,asc', 1);
            result.subscribe(function (value) {
                cabs = value;
                expect(cabs).toEqual(getCabsMock.cabs);
            });
        });
    });
    describe('addCab', function () {
        it('should add a new cab', function () {
            var httpSpy = jest.spyOn(HttpClient.prototype, 'post');
            httpSpy.mockReturnValue(of(responseMock));
            var cab;
            var result = service.add(createCabMock);
            result.subscribe(function (value) {
                cab = value;
                expect(cab).toEqual(responseMock);
            });
        });
    });
    describe('updateCab', function () {
        it('should add a new cab', function () {
            var httpSpy = jest.spyOn(HttpClient.prototype, 'put');
            httpSpy.mockReturnValue(of(responseMock));
            var cab;
            var id = updateCabMock.id;
            var result = service.update(updateCabMock, id);
            result.subscribe(function (value) {
                cab = value;
                expect(cab).toEqual(updateResponse);
            });
        });
    });
    describe('deleteCab', function () {
        it('should delete a cab', function () {
            var httpSpy = jest.spyOn(HttpClient.prototype, 'delete');
            httpSpy.mockReturnValue(of(responseMock));
            var cab;
            var result = service.delete(1);
            result.subscribe(function (value) {
                cab = value;
                expect(cab).toEqual(responseMock);
            });
        });
    });
});
//# sourceMappingURL=cab-inventory.service.spec.js.map