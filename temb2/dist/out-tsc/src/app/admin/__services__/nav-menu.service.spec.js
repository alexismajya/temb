import { TestBed } from '@angular/core/testing';
import { NavMenuService } from './nav-menu.service';
describe('NavMenuService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(NavMenuService);
        expect(service).toBeTruthy();
        var tog = function () { return service.toggle(); };
        expect(tog).toThrowError();
    });
    describe('ProgressBar', function () {
        var service;
        beforeEach(function () {
            service = new NavMenuService();
        });
        it('should show progress bar ', function () {
            var serviceSpy = jest.spyOn(service.progressListener, 'next');
            service.showProgress();
            expect(serviceSpy).toHaveBeenCalled();
            expect(serviceSpy).toHaveBeenCalledWith(true);
        });
        it('should hide progress bar ', function () {
            var serviceSpy = jest.spyOn(service.progressListener, 'next');
            service.stopProgress();
            expect(serviceSpy).toHaveBeenCalled();
            expect(serviceSpy).toHaveBeenCalledWith(false);
        });
    });
});
//# sourceMappingURL=nav-menu.service.spec.js.map