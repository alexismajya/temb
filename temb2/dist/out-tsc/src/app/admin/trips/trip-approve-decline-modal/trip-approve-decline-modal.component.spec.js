import { TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { TripApproveDeclineModalComponent } from './trip-approve-decline-modal.component';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ProviderSelectorComponent } from '../../routes/route-approve-decline-modal/provider-selector/provider-selector.component';
import { AlertService } from '../../../shared/alert.service';
describe('TripApproveDeclineModalComponent', function () {
    var component;
    var fixture;
    var injector;
    var authService;
    var tripRequestService;
    var mockMatDialogData = {};
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, AppTestModule, AngularMaterialModule],
            declarations: [TripApproveDeclineModalComponent, ProviderSelectorComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
                AlertService
            ]
        })
            .compileComponents();
    });
    beforeEach(function () {
        fixture = TestBed.createComponent(TripApproveDeclineModalComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        injector = fixture.debugElement.injector;
        tripRequestService = injector.get(TripRequestService);
        authService = injector.get(AuthService);
    });
    beforeEach(function () {
        injector = fixture.debugElement.injector;
        var mockMatDialogRef = injector.get(MatDialogRef);
        var appEventService = injector.get(AppEventService);
        mockMatDialogRef.close.mockReturnValue({});
        jest.spyOn(tripRequestService, 'confirmRequest').mockReturnValue(of({}));
        jest.spyOn(authService, 'getCurrentUser').mockReturnValue({ email: '', firstName: '' });
        jest.spyOn(tripRequestService, 'declineRequest').mockReturnValue(of({}));
        jest.spyOn(appEventService, 'broadcast').mockImplementation();
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('Initial load', function () {
        it('should create', function () {
            expect(component).toBeTruthy();
        });
    });
    describe('closeDialog', function () {
        it('should call dialogRef.close()', function () {
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
    describe('Confirm', function () {
        it('should change loading to true', function () {
            // @ts-ignore
            var values = {
                driverName: 'Jack',
                driverPhoneNo: '0908377848383',
                regNumber: 'HJD 345',
                comment: 'This trip is acceptable'
            };
            var appEventService = injector.get(AppEventService);
            component.confirm(values);
            expect(component.loading).toBe(true);
            expect(tripRequestService.confirmRequest).toHaveBeenCalledTimes(1);
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
            expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
        });
    });
    describe('decline', function () {
        it('should change loading to true', function () {
            // @ts-ignore
            component.account = { email: 'AAA.BBB@CCC.DDD', firstName: 'Vic' };
            var appEventService = injector.get(AppEventService);
            component.decline({ comment: 'This trip is not acceptable' });
            expect(component.loading).toBe(true);
            expect(tripRequestService.declineRequest).toHaveBeenCalledTimes(1);
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
            expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
        });
    });
    describe('clearFields', function () {
        beforeEach(function () {
            component.approveForm = new NgForm([], []);
            jest.spyOn(component.approveForm.form, 'patchValue');
        });
        it('should not disable other inputs and patch form value', function () {
            var event = {
                target: {
                    value: ''
                }
            };
            component.clearFields(event);
            expect(component.disableOtherInput).toBeFalsy();
            expect(component.approveForm.form.patchValue).toHaveBeenCalled();
        });
    });
    describe('clickedProviders', function () {
        it('should disable inputs, set providerId and patch form value ', function () {
            var event = { providerUserId: 1 };
            component.approveForm = new NgForm([], []);
            component.clickedProviders(event);
            expect(component.providerId).toEqual(event.providerUserId);
            expect(component.disableOtherInput).toEqual(true);
            expect(component.disableOtherInput).toBeTruthy();
        });
        it('should toast error if select provider doesnt exist', function () {
            jest.spyOn(AlertService.prototype, 'error');
            component.handleInvalidProvider();
            expect(AlertService.prototype.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=trip-approve-decline-modal.component.spec.js.map