import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AngularMaterialModule } from '../../../angular-material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AlertService } from '../../../shared/alert.service';
import { TOASTR_TOKEN } from '../../../shared/toastr.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { UpdateTripProviderModalComponent } from './update-trip-provider-modal.component';
describe('UpdateTripProviderModalComponent', function () {
    var component;
    var fixture;
    var matDialogRefMock = {
        id: 'mat-dialog-0',
        afterClosed: function () {
            return of('dialog has been closed');
        },
        close: function (value) {
            matDialogRefMock.afterClosed().subscribe(function (msg) { });
            return value;
        }
    };
    var tripRequestServiceMock = {
        updateTrip: jest.fn(),
        confirmRequest: jest.fn()
    };
    var analyticsMock = {
        sendEvent: jest.fn()
    };
    beforeEach(async(function () {
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
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should close the dialog', function () {
        component.closeDialog();
        expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
    it('should update the trip\'s provider', function () {
        var updateTripMockResponse = {
            success: true,
            message: 'trip confirmed'
        };
        tripRequestServiceMock.confirmRequest.mockReturnValue(of(updateTripMockResponse));
        component.updateTripProvider();
        expect(component.tripRequestService.confirmRequest).toHaveBeenCalled();
    });
    it('should close the dialog after updating the provider', function () {
        jest.spyOn(component.dialogRef, 'close');
        var updateTripMockResponse = {
            success: true,
            message: 'trip confirmed'
        };
        tripRequestServiceMock.confirmRequest.mockReturnValue(of(updateTripMockResponse));
        component.updateTripProvider();
        expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=update-trip-provider-modal.component.spec.js.map