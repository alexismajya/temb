import { homebaseServiceMock } from './../../routes/__mocks__/create-route';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomebaseListComponent } from './homebase-list.component';
import { Injector } from '@angular/core';
import { throwError, of } from 'rxjs';
import { AppEventService } from 'src/app/shared/app-events.service';
import { HomeBaseService } from './../../../shared/homebase.service';
import { homebaseServiceResult } from '../../../__mocks__/homebase.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestModule } from 'src/app/__tests__/testing.module';

describe('HomebaseListComponent', () => {
  let component: HomebaseListComponent;
  let fixture: ComponentFixture<HomebaseListComponent>;
  let appEventService: any;
  let homebaseService: any;
  let injector: Injector;

  beforeEach(async(() => {
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

  beforeEach(() => {
    fixture = TestBed.createComponent(HomebaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getListOfHomebases', () => {
    it('should fetch the list of homebase', () => {
      jest.spyOn(homebaseService, 'getAllHomebases').mockReturnValue(of({ ...homebaseServiceResult.data }));
      jest.spyOn(appEventService, 'broadcast').mockImplementation();
      component.getListOfHomebases();
      expect(homebaseService.getAllHomebases).toHaveBeenCalledTimes(1);
      expect(component.totalItems).toEqual(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
    it('should return errors if the app fails to get data', () => {
      spyOn(homebaseService, 'getAllHomebases')
        .and.returnValue(throwError('error'));
      component.getListOfHomebases();
      fixture.detectChanges();
      expect(component.displayText).toEqual(`Oops! We're having connection problems.`);
    });

    it('should render 1 page on homebases on search', () => {
      component.getSearchResults('');
      expect(component.pageNo).toBe(1);
    });
  });

  describe('ngOnInit', () => {
    it('should call the getListOfHomebases method', () => {
      jest.spyOn(component, 'getListOfHomebases').mockImplementation();
      component.ngOnInit();
      expect(component.getListOfHomebases).toBeCalledTimes(1);
    });

    it('should set pagination', () => {
      jest.spyOn(component, 'getListOfHomebases').mockImplementation();
      component.setPage(2);
      expect(component.pageNo).toEqual(2);
      expect(component.getListOfHomebases).toBeCalled();
    });

    it('should show options', () => {
      component.currentOptions = 1;
      component.showOptions(-1);
      expect(component.currentOptions).toEqual(-1);
    });
    it('should unsubscribe updateSubscription on ngOnDestroy', () => {
      component.updateSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.updateSubscription.unsubscribe).toHaveBeenCalled();
    });
    it('should unsubscribe deleteSubscription on ngOnDestroy', () => {
      component.deleteSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.deleteSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});


