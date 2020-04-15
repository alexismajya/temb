import { FellowRouteService } from '../fellow-route.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { FellowRoutesModel } from 'src/app/shared/models/fellow-routes.model';
import { fellowsMockResponse } from '../__mocks__/fellows.mock';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
describe('FellowRouteService', function () {
    var service;
    var httpMock;
    var fellowID = 1002;
    var pageSize = 10;
    var pageNo = 1;
    var sort = 'name,asc,batch,asc';
    var getFellowsMockResponse = new FellowRoutesModel().deserialize(fellowsMockResponse);
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        var testBed = getTestBed();
        service = testBed.get(FellowRouteService);
        httpMock = testBed.get(HttpTestingController);
    });
    afterEach(jest.resetAllMocks);
    afterAll(jest.restoreAllMocks);
    it('should make http request to get fellows', function () {
        var res;
        jest
            .spyOn(service, 'getFellowRoutes')
            .mockReturnValue(of(getFellowsMockResponse));
        service.getFellowRoutes(fellowID, pageSize, pageNo, sort).subscribe(function (data) {
            res = data;
        });
        expect(res.data).toEqual(getFellowsMockResponse.data);
    });
    describe('removeFellowFromRoute', function () {
        it('should make a get http call to bvackend API', function () {
            var spy = jest.spyOn(HttpClient.prototype, 'get');
            var url = environment.tembeaBackEndUrl + "/api/v1/fellowActivity?id=" + fellowID + "&size=" + pageSize + "&sort=" + sort + "&page=" + pageNo;
            service.getFellowRoutes(fellowID, pageSize, pageNo, sort);
            expect(spy.mock.calls[0][0]).toEqual(url);
        });
    });
});
//# sourceMappingURL=fellow-routes.service.spec.js.map