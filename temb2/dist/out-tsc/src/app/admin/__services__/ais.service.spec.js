import { TestBed } from '@angular/core/testing';
import { AisService } from './ais.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import AISUserMock from '../../__mocks__/AISUser.mock';
describe('AisService', function () {
    var service;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.get(AisService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(function () {
        httpMock.verify();
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    it('getResponse(): should return user data from AIS', function (done) {
        var userData;
        service.getResponse('test.user@test.com').subscribe(function (value) {
            userData = value;
            expect(userData).toEqual(AISUserMock);
        });
        var request = httpMock.expectOne(service.baseUrl + "?email=test.user@test.com");
        expect(request.request.method).toEqual('GET');
        request.flush(AISUserMock);
        done();
    });
});
//# sourceMappingURL=ais.service.spec.js.map