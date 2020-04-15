import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { SlackService } from '../slack.service';
describe('SlackService', function () {
    var service;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SlackService]
        });
        service = TestBed.get(SlackService);
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
    describe('getChannels', function () {
        var httpSpy;
        beforeEach(function () {
            httpSpy = jest.spyOn(HttpClient.prototype, 'get');
        });
        it('should call HttpClient.getProviders', function () {
            service.getChannels();
            expect(httpSpy).toBeCalled();
        });
        it('return all the providers', function () {
            var mockChannel = {
                id: 'XXXXXXX',
                name: 'success-ops',
                description: 'some description',
            };
            httpSpy.mockReturnValue(of([mockChannel]));
            var result = service.getChannels();
            result.subscribe(function (data) {
                expect(data).toEqual([mockChannel]);
            });
        });
    });
});
//# sourceMappingURL=slack.service.spec.js.map