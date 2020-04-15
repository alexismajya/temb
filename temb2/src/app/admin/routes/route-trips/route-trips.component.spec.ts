import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { of } from 'rxjs/observable/of';
import { RouteTripsComponent } from './route-trips.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { AlertService } from '../../../shared/alert.service';
import { RouteTripsService } from '../../__services__/route-trips.service';
import routeTripsResponseMock from './__mocks__/routeTrips.mock';
import { MatDialog, MatInputModule } from '@angular/material';
import { ExportComponent } from '../../export-component/export.component';

describe('RouteTripsComponent', () => {
  let component: RouteTripsComponent;
  let fixture: ComponentFixture<RouteTripsComponent>;

  const routeTripsMock = {
    getBatchTripsRecords: () => of(routeTripsResponseMock)
  };

  const mockMatDialog = {
    open: jest.fn(),
  };

  const dumydata = [{
    batch:
    {
      route:
        { name: 'kinshasa' },
      batch: '1'
    }
  }];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RouteTripsComponent,
        EmptyPageComponent,
        AppPaginationComponent,
        ExportComponent
      ],
      providers: [
        { provide: AlertService, useValue: alert },
        { provide: RouteTripsService, useValue: routeTripsMock },
        { provide: MatDialog, useValue: mockMatDialog }
      ],
      imports: [AngularMaterialModule, HttpClientTestingModule, MatInputModule, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RouteTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create route-trips component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load page and fetch route trip records', (() => {
      jest.spyOn(component, 'getRouteTrips');
      jest.spyOn(component, 'setPage');

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.isLoading).toBe(false);
      expect(component.routeTrips).toEqual(routeTripsResponseMock.data);
      expect(component.totalItems).toEqual(routeTripsResponseMock.pageMeta.totalItems);
      expect(component.setPage).toHaveBeenCalled();
      expect(component.getRouteTrips).toHaveBeenCalled();
    }));
  });

  describe('setPage', () => {
    it('should update and load page', (() => {
      jest.spyOn(component, 'getRouteTrips');

      expect(component.page).toEqual(1);

      component.setPage(2);
      fixture.detectChanges();
      expect(component.page).toEqual(2);
      expect(component.getRouteTrips).toHaveBeenCalled();
    }));
  });

  describe('filterData function', () => {
    it('should filter the data based on a string value provided', () => {
      expect(component.getSuggestions('kin', dumydata, true)).toEqual(dumydata);
    });
    it('should filter the data based on a string value provided', () => {
      expect(component.getSuggestions('1', dumydata, false)).toEqual(dumydata);
    });
    it('should return an empty array if the string provided doesn\'t exist', () => {
      expect(component.getSuggestions('', dumydata, false)).toEqual([]);
    });
    it('Should get back filtered data', () => {
      const response = jest.spyOn(component, 'filterTableData');
      component.filterTableData('tree');
      expect(response).toHaveBeenCalled();
    });
  });
});
