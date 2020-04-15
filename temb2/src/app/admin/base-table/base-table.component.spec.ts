import { MatDialog } from '@angular/material';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableComponent } from './base-table.component';
import routeTripsResponseMock from '../routes/route-trips/__mocks__/routeTrips.mock';

describe('TableComponentComponent', () => {
  let component: BaseTableComponent;
  let fixture: ComponentFixture<BaseTableComponent>;

  const mockMatDialog = {
    open: jest.fn(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseTableComponent ],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should open modal to view row information', ( async () => {
    const { data: tripInfo } = routeTripsResponseMock;
    fixture.detectChanges();
    component.viewRowDescription(tripInfo);
    expect(mockMatDialog.open).toBeCalledTimes(1);
  }));
});
