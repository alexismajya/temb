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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { throwError, of } from 'rxjs';
import { ProviderInventoryComponent } from './provider-inventory.component';
import { SearchService } from '../../__services__/search.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import providersMock from '../../../__mocks__/providers.mock';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ProviderService } from '../../__services__/providers.service';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
describe('ProvidersComponent', function () {
    var component;
    var fixture;
    var injector;
    var searchService;
    var appEventService;
    var providerService;
    var mockHbManager = {
        getHomebaseId: jest.fn().mockReturnValue(4),
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProviderInventoryComponent],
            imports: [AppTestModule],
            providers: [
                { provide: HomeBaseManager, useValue: mockHbManager }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
        fixture = TestBed.createComponent(ProviderInventoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        injector = fixture.debugElement.injector;
        searchService = injector.get(SearchService);
        appEventService = injector.get(AppEventService);
        providerService = injector.get(ProviderService);
    }));
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('should create', function () {
        it('should create', function () {
            expect(component).toBeTruthy();
        });
    });
    describe('getSearchResults', function () {
        it('should return search results', function () {
            jest.spyOn(searchService, 'searchData').mockReturnValue(of(__assign({}, providersMock.data)));
            jest.spyOn(appEventService, 'broadcast').mockImplementation();
            component.getSearchResults('Ronald');
            expect(component.providers).toEqual([]);
            expect(component.totalItems).toEqual(undefined);
        });
        it('should return errors if wrong search name is given', function () {
            spyOn(SearchService.prototype, 'searchData')
                .and.returnValue(throwError('error'));
            component.getSearchResults('Ronald');
            fixture.detectChanges();
            expect(component.displayText).toEqual(undefined);
        });
    });
    describe('ngOnInit', function () {
        it('should call the getProvidersData method', function () {
            jest.spyOn(component, 'getProvidersData').mockImplementation();
            component.ngOnInit();
            expect(component.getProvidersData).toBeCalledTimes(1);
        });
        it('should set pagination', function () {
            jest.spyOn(component, 'getProvidersData').mockImplementation();
            component.setPage(2);
            expect(component.pageNo).toEqual(2);
            expect(component.getProvidersData).toBeCalled();
            expect(component.providers).toEqual([]);
        });
        it('should show options', function () {
            component.currentOptions = 1;
            component.showOptions(-1);
            expect(component.currentOptions).toEqual(-1);
        });
    });
    describe('getProvidersData', function () {
        it('should return providers\' data', function () {
            jest.spyOn(providerService, 'getProviders').mockReturnValue(of(providersMock));
            component.getProvidersData();
            expect(providerService.getProviders).toHaveBeenCalledTimes(1);
            expect(component.providers).toEqual([{
                    'id': 1,
                    'name': 'Ronald',
                    'providerUserId': 15,
                    'user': {
                        'name': 'Ronald Okello',
                        'phoneNo': null,
                        'email': 'ronald.okello@andela.com'
                    }
                }]);
            expect(component.totalItems).toEqual(1);
        });
        it('should return errors if the app fails to get data', function () {
            spyOn(providerService, 'getProviders')
                .and.returnValue(throwError('error'));
            component.getProvidersData();
            fixture.detectChanges();
            expect(component.displayText).toEqual("Oops! We're having connection problems.");
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
//# sourceMappingURL=provider-inventory.component.spec.js.map