import { async, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from '../../../../angular-material.module';
import { of } from 'rxjs';
import { ProviderSelectorComponent } from './provider-selector.component';
import { MediaObserver } from '@angular/flex-layout';
import { ProviderService } from '../../../__services__/providers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ProviderSelectorComponent', function () {
    var component;
    var fixture;
    var injector;
    var providerService;
    var providersFilterMock = [
        {
            id: 1, name: 'Taxify', user: 'Taxify User', email: 'taxifyuser@gmail.com'
        },
        {
            id: 1, name: 'Uba', user: 'Uba User', email: 'ubauser@gmail.com'
        }
    ];
    beforeEach(async(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        var mediaObserverMock = {
            media$: of({ mqAlias: 'xs', mediaQuery: '' })
        };
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, HttpClientTestingModule],
            declarations: [ProviderSelectorComponent],
            providers: [
                { provide: MediaObserver, useValue: mediaObserverMock },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProviderSelectorComponent);
        component = fixture.componentInstance;
        injector = fixture.debugElement.injector;
        providerService = injector.get(ProviderService);
        fixture.detectChanges();
    });
    it('should create component', function () {
        expect(component).toBeTruthy();
    });
    describe('click', function () {
        it('should emit the clicked provider option', function () {
            var value = { providerName: '' };
            component.clickedProviders.emit = jest.fn();
            component.click(value);
            expect(component.clickedProviders.emit).toBeCalled();
        });
    });
    describe('setOption', function () {
        it('should return provider name when provider object is passed', function () {
            component.optionValue = 'name';
            var option = {
                id: 1, name: 'Taxify', user: 'Taxify User', email: 'taxifyuser@gmail.com'
            };
            component.setOption(option);
            expect(option[component.optionValue]).toEqual('Taxify');
        });
    });
    describe('_filter', function () {
        it('should return an array when the search term matches the available models', function () {
            component.providers = providersFilterMock;
            var result = component._filter('Ta');
            expect(result).toEqual([{
                    id: 1, name: 'Taxify', user: 'Taxify User', email: 'taxifyuser@gmail.com'
                }]);
        });
        it('should return an empty array when the search term does not match any model', function () {
            component.providers = providersFilterMock;
            var result = component._filter('Zoom');
            expect(result).toEqual([]);
        });
    });
    describe('MediaObserver with xs', function () {
        it('should change cols, colspan and rowHeight when the screen is xs', function () {
            expect(component.cols).toEqual(2);
            expect(component.colspan).toEqual(2);
            expect(component.rowHeight).toEqual('5:1');
        });
    });
    describe('keyWordFilter', function () {
        it('should filter providers list when provider name exists', function () {
            component.approveForm = { controls: 'control', valueChanges: 'aaa' };
            jest.spyOn(component, '_filter').mockReturnValue([]);
            var value = { providerName: 'Sub' };
            component.keyWordFilter(value);
            expect(component._filter).toBeCalledTimes(1);
        });
        it('should filter when provider name entered exists', function () {
            jest.spyOn(component, '_filter').mockReturnValue([]);
            component.providers = [{ name: 'Sub' }];
            var value = { providerName: 'Sub' };
            component.keyWordFilter(value);
            expect(component._filter).toBeCalledTimes(1);
        });
        it('should patch form inputs when providerName is empty', function () {
            var value = { providerName: '' };
            component.keyWordFilter(value);
            expect(component.disableOtherInput).toBe(false);
        });
        it('should emit an event if provider doesnt exist', function () {
            jest.spyOn(component.invalidProviderClicked, 'emit');
            component.providers = [{ name: 'Motors' }, { name: 'Motors' }];
            component.keyWordFilter({ providerName: 'Invalid' });
            expect(component.invalidProviderClicked.emit).toHaveBeenCalled();
        });
    });
});
describe('getProvidersInventory', function () {
    var component;
    var fixture;
    var injector;
    var providerService;
    beforeEach(async(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        var mediaObserverMock = {
            media$: of({ mqAlias: 'sm', mediaQuery: '' })
        };
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, HttpClientTestingModule],
            declarations: [ProviderSelectorComponent],
            providers: [
                { provide: MediaObserver, useValue: mediaObserverMock },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProviderSelectorComponent);
        component = fixture.componentInstance;
        injector = fixture.debugElement.injector;
        providerService = injector.get(ProviderService);
        fixture.detectChanges();
    });
    afterEach(function () {
        jest.restoreAllMocks();
    });
    it('should return all providers data', function () {
        var providerDetails = { data: [{ id: 1, name: 'police', providerUserId: 1, user: { id: 1, name: 'Ada' } }] };
        jest.spyOn(providerService, 'getViableProviders').mockReturnValue(of(providerDetails));
        jest.spyOn(component, 'startFiltering');
        component.getProvidersInventory();
        expect(providerService.getViableProviders).toHaveBeenCalledTimes(1);
        expect(component.providers).toEqual(providerDetails.data);
    });
});
//# sourceMappingURL=provider-selector.component.spec.js.map