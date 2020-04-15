import { TestBed } from '@angular/core/testing';
import { GoogleAnalyticsService } from './google-analytics.service';
describe('GoogleAnalyticsService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({});
        window.ga = jest.fn();
    });
    afterEach(function () { return window.ga = undefined; });
    it('should be created', function () {
        var service = TestBed.get(GoogleAnalyticsService);
        expect(service).toBeTruthy();
    });
    describe('send command', function () {
        var service;
        beforeEach(function () {
            service = new GoogleAnalyticsService();
        });
        it('should send page view command to google analytics', function () {
            service.sendPageView('tembea.andela.com');
            expect(window.ga).toHaveBeenCalledTimes(2);
        });
        it('should send event command to google analytics', function () {
            service.sendEvent('routes', 'create-route');
            expect(window.ga).toHaveBeenCalled();
            expect(window.ga).toHaveBeenCalledWith('send', 'event', 'routes', 'create-route');
        });
    });
});
//# sourceMappingURL=google-analytics.service.spec.js.map