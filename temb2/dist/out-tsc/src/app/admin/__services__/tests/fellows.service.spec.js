import { FellowsService } from '../fellows.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { FellowsModel } from 'src/app/shared/models/fellows.model';
import { fellowsMockResponse } from '../__mocks__/fellows.mock';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
describe('FellowsService', function () {
    var service;
    var httpMock;
    var getFellowsOnRouteMockResponse = new FellowsModel().deserialize(fellowsMockResponse);
    var getFellowsNotOnRouteMockResponse = new FellowsModel().deserialize(fellowsMockResponse);
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        var testBed = getTestBed();
        service = testBed.get(FellowsService);
        httpMock = testBed.get(HttpTestingController);
    });
    afterEach(jest.resetAllMocks);
    afterAll(jest.restoreAllMocks);
    it('should make http request to get fellows on route', function () {
        var res;
        jest
            .spyOn(service, 'getFellows')
            .mockReturnValue(of(getFellowsOnRouteMockResponse));
        service.getFellows(true, 9, 1).subscribe(function (data) {
            res = data;
        });
        expect(res.fellows).toEqual(getFellowsOnRouteMockResponse.fellows);
    });
    it('should make http request to get fellows not on route', function () {
        var res;
        jest
            .spyOn(service, 'getFellows')
            .mockReturnValue(of(getFellowsNotOnRouteMockResponse));
        service.getFellows(false, 9, 1).subscribe(function (data) {
            res = data;
        });
        expect(res.fellows).toEqual(getFellowsNotOnRouteMockResponse.fellows);
    });
    describe('removeFellowFromRoute', function () {
        it('should make a delete http call to API', function () {
            var spy = jest.spyOn(HttpClient.prototype, 'delete');
            var url = environment.tembeaBackEndUrl + "/api/v1/routes/fellows/10/";
            service.removeFellowFromRoute(10);
            expect(spy.mock.calls[0][0]).toEqual(url);
        });
    });
});
//# sourceMappingURL=fellows.service.spec.js.map