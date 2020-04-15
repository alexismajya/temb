import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AngularMaterialModule } from '../../../angular-material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AlertService } from '../../../shared/alert.service';
import { TOASTR_TOKEN } from '../../../shared/toastr.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';

import { UpdateTripProviderModalComponent } from './update-trip-provider-modal.component';

describe('UpdateTripProviderModalComponent', () => {
  let component: UpdateTripProviderModalComponent;
  let fixture: ComponentFixture<UpdateTripProviderModalComponent>;

  const matDialogRefMock = {
    id: 'mat-dialog-0',
    afterClosed(): Observable<string> {
      return of('dialog has been closed');
    },
    close(value?) {
      matDialogRefMock.afterClosed().subscribe((msg) => { });
      return value;
    }
  };

  const tripRequestServiceMock = {
    updateTrip: jest.fn(),
    confirmRequest: jest.fn()
  };

  const analyticsMock = {
    sendEvent: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTripProviderModalComponent],
      imports: [
        HttpClientModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        AlertService,
        { provide: MatDialog, useValue: {} },
        { provide: TripRequestService, useValue: tripRequestServiceMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TOASTR_TOKEN, useValue: {} },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            tripProviderDetails: {
              trip: [],
              providers: [{
                id: 1,
                name: 'Uber',
                email: 'uber@email.com',
                providerUserId: 1,
              }],
              activeTripId: 1
            }
          }
        },
        { provide: GoogleAnalyticsService, useValue: analyticsMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTripProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(component.dialogRef, 'close');
  }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('should update the trip\'s provider', () => {
    const updateTripMockResponse = {
      success: true,
      message: 'trip confirmed'
    };
    tripRequestServiceMock.confirmRequest.mockReturnValue(of(updateTripMockResponse));
    component.updateTripProvider();
    expect(component.tripRequestService.confirmRequest).toHaveBeenCalled();
  });

  it('should close the dialog after updating the provider', () => {
    jest.spyOn(component.dialogRef, 'close');
    const updateTripMockResponse = {
      success: true,
      message: 'trip confirmed'
    };
    tripRequestServiceMock.confirmRequest.mockReturnValue(of(updateTripMockResponse));
    component.updateTripProvider();
    expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
  });
});
