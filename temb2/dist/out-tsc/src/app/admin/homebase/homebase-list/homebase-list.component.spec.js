var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { async, TestBed } from '@angular/core/testing';
import { HomebaseListComponent } from './homebase-list.component';
import { throwError, of } from 'rxjs';
import { AppEventService } from 'src/app/shared/app-events.service';
import { HomeBaseService } from './../../../shared/homebase.service';
import { homebaseServiceResult } from '../../../__mocks__/homebase.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestModule } from 'src/app/__tests__/testing.module';
describe('HomebaseListComponent', function () {
    var component;
    var fixture;
    var appEventService;
    var homebaseService;
    var injector;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [HomebaseListComponent],
            imports: [AppTestModule],
            providers: [HomeBaseService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
        fixture = TestBed.createComponent(HomebaseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        injector = fixture.debugElement.injector;
        homebaseService = injector.get(HomeBaseService);
        appEventService = injector.get(AppEventService);
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(HomebaseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('getListOfHomebases', function () {
        it('should fetch the list of homebase', function () {
            jest.spyOn(homebaseService, 'getAllHomebases').mockReturnValue(of(__assign({}, homebaseServiceResult.data)));
            jest.spyOn(appEventService, 'broadcast').mockImplementation();
            component.getListOfHomebases();
            expect(homebaseService.getAllHomebases).toHaveBeenCalledTimes(1);
            expect(component.totalItems).toEqual(1);
            expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
        });
        it('should return errors if the app fails to get data', function () {
            spyOn(homebaseService, 'getAllHomebases')
                .and.returnValue(throwError('error'));
            component.getListOfHomebases();
            fixture.detectChanges();
            expect(component.displayText).toEqual("Oops! We're having connection problems.");
        });
        it('should render 1 page on homebases on search', function () {
            component.getSearchResults('');
            expect(component.pageNo).toBe(1);
        });
    });
    describe('ngOnInit', function () {
        it('should call the getListOfHomebases method', function () {
            jest.spyOn(component, 'getListOfHomebases').mockImplementation();
            component.ngOnInit();
            expect(component.getListOfHomebases).toBeCalledTimes(1);
        });
        it('should set pagination', function () {
            jest.spyOn(component, 'getListOfHomebases').mockImplementation();
            component.setPage(2);
            expect(component.pageNo).toEqual(2);
            expect(component.getListOfHomebases).toBeCalled();
        });
        it('should show options', function () {
            component.currentOptions = 1;
            component.showOptions(-1);
            expect(component.currentOptions).toEqual(-1);
        });
        it('should unsubscribe updateSubscription on ngOnDestroy', function () {
            component.updateSubscription = {
                unsubscribe: jest.fn()
            };
            component.ngOnDestroy();
            expect(component.updateSubscription.unsubscribe).toHaveBeenCalled();
        });
        it('should unsubscribe deleteSubscription on ngOnDestroy', function () {
            component.deleteSubscription = {
                unsubscribe: jest.fn()
            };
            component.ngOnDestroy();
            expect(component.deleteSubscription.unsubscribe).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=homebase-list.component.spec.js.map