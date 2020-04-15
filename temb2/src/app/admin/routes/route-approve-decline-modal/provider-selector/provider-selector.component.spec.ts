import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AngularMaterialModule} from '../../../../angular-material.module';
import {of} from 'rxjs';
import {ProviderSelectorComponent} from './provider-selector.component';
import {MediaObserver} from '@angular/flex-layout';
import {Injector} from '@angular/core';
import {ProviderService} from '../../../__services__/providers.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import providerMock from '../../../../__mocks__/providers.mock';

describe('ProviderSelectorComponent', () => {
  let component: ProviderSelectorComponent;
  let fixture: ComponentFixture<ProviderSelectorComponent>;
  let injector: Injector;
  let providerService: any;

  const providersFilterMock = [
    {
      id: 1, name: 'Taxify', user: 'Taxify User', email: 'taxifyuser@gmail.com'
    },
    {
      id: 1, name: 'Uba', user: 'Uba User', email: 'ubauser@gmail.com'
    }];

  beforeEach(async(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    const mediaObserverMock = {
      media$: of({mqAlias: 'xs', mediaQuery: ''})
    };
    TestBed.configureTestingModule({
      imports: [AngularMaterialModule, HttpClientTestingModule],
      declarations: [ProviderSelectorComponent],
      providers: [
        {provide: MediaObserver, useValue: mediaObserverMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSelectorComponent);
    component = fixture.componentInstance;
    injector = fixture.debugElement.injector;
    providerService = injector.get(ProviderService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('click', () => {
    it('should emit the clicked provider option', () => {
      const value = {providerName: ''};
      component.clickedProviders.emit = jest.fn();
      component.click(value);
      expect(component.clickedProviders.emit).toBeCalled();
    });
  });

  describe('setOption', () => {
    it('should return provider name when provider object is passed', () => {
      component.optionValue = 'name';
      const option = {
        id: 1, name: 'Taxify', user: 'Taxify User', email: 'taxifyuser@gmail.com'
      };
      component.setOption(option);
      expect(option[component.optionValue]).toEqual('Taxify');
    });
  });

  describe('_filter', () => {
    it('should return an array when the search term matches the available models', () => {
      component.providers = providersFilterMock;
      const result = component._filter('Ta');
      expect(result).toEqual([{
        id: 1, name: 'Taxify', user: 'Taxify User', email: 'taxifyuser@gmail.com'
      }]);
    });
    it('should return an empty array when the search term does not match any model', () => {
      component.providers = providersFilterMock;
      const result = component._filter('Zoom');
      expect(result).toEqual([]);
    });
  });

  describe('MediaObserver with xs', () => {
    it('should change cols, colspan and rowHeight when the screen is xs', () => {
      expect(component.cols).toEqual(2);
      expect(component.colspan).toEqual(2);
      expect(component.rowHeight).toEqual('5:1');
    });
  });

  describe('keyWordFilter', () => {
    it('should filter providers list when provider name exists', () => {
      component.approveForm = {controls: 'control', valueChanges: 'aaa'};
      jest.spyOn(component, '_filter').mockReturnValue([]);
      const value = {providerName: 'Sub'};
      component.keyWordFilter(value);
      expect(component._filter).toBeCalledTimes(1);
    });
    it('should filter when provider name entered exists', () => {
      jest.spyOn(component, '_filter').mockReturnValue([]);
      component.providers = [{name: 'Sub'}];
      const value = {providerName: 'Sub'};
      component.keyWordFilter(value);
      expect(component._filter).toBeCalledTimes(1);
    });
    it('should patch form inputs when providerName is empty', () => {
      const value = {providerName: ''};
      component.keyWordFilter(value);
      expect(component.disableOtherInput).toBe(false);
    });
    it('should emit an event if provider doesnt exist', () => {
      jest.spyOn(component.invalidProviderClicked, 'emit');
      component.providers = [{name: 'Motors'}, {name: 'Motors'}];
      component.keyWordFilter({providerName: 'Invalid' });
      expect(component.invalidProviderClicked.emit).toHaveBeenCalled();
    });
  });
});

describe('getProvidersInventory', () => {
  let component: ProviderSelectorComponent;
  let fixture: ComponentFixture<ProviderSelectorComponent>;
  let injector: Injector;
  let providerService: any;

  beforeEach(async(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    const mediaObserverMock = {
      media$: of({mqAlias: 'sm', mediaQuery: ''})
    };
    TestBed.configureTestingModule({
      imports: [AngularMaterialModule, HttpClientTestingModule],
      declarations: [ProviderSelectorComponent],
      providers: [
        {provide: MediaObserver, useValue: mediaObserverMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSelectorComponent);
    component = fixture.componentInstance;
    injector = fixture.debugElement.injector;
    providerService = injector.get(ProviderService);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should return all providers data', () => {
    const providerDetails = { data: [{ id: 1, name: 'police', providerUserId: 1, user: { id: 1, name: 'Ada' } }] };
    jest.spyOn(providerService, 'getViableProviders').mockReturnValue(of(providerDetails));
    jest.spyOn(component, 'startFiltering');
    component.getProvidersInventory();
    expect(providerService.getViableProviders).toHaveBeenCalledTimes(1);
    expect(component.providers).toEqual(providerDetails.data);
  });
});
