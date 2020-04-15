import { async, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../../shared/alert.service';
import { ProviderModalComponent } from './provider-modal.component';
import { ProviderService } from '../../__services__/providers.service';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { AppEventService } from '../../../shared/app-events.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
var appEventService = new AppEventService();
export var toastService = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
};
export var mockMatDialogRef = {
    close: function () { },
};
export var mockProviderService = {
    editProvider: jest.fn(),
    addDriver: jest.fn()
};
export var successMock = {
    success: true
};
var analyticsMock = {
    sendEvent: jest.fn()
};
describe('ProviderModalComponent', function () {
    var component;
    var fixture;
    var form;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProviderModalComponent],
            imports: [FormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: AlertService, useValue: toastService },
                { provide: ProviderService, useValue: mockProviderService },
                { provide: AppEventService, useValue: appEventService },
                { provide: GoogleAnalyticsService, useValue: analyticsMock }
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProviderModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        form = new NgForm([], []);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create Provider Modal Component', function () {
        expect(component).toBeTruthy();
        expect(component.loading).toBeFalsy();
    });
    it('Should close the edit dialog', function () {
        jest.spyOn(component.dialogRef, 'close');
        component.closeDialog();
        expect(component.dialogRef.close).toBeCalled();
    });
    it('should call edit provider service', function () {
        mockProviderService.editProvider.mockReturnValue(of(successMock));
        component.editProvider(form, null);
        expect(mockProviderService.editProvider).toBeCalled();
    });
    it('should alert success on successful provider update', function () {
        mockProviderService.editProvider.mockReturnValue(of(successMock));
        jest.spyOn(component.toastService, 'success');
        jest.spyOn(component.dialogRef, 'close');
        jest.spyOn(AppEventService.prototype, 'broadcast');
        component.editProvider(form, null);
        expect(component.toastService.success).toBeCalled();
        expect(component.dialogRef.close).toBeCalled();
        expect(appEventService.broadcast).toBeCalled();
        expect(appEventService.broadcast).toBeCalledWith({ name: 'updatedProvidersEvent' });
    });
    it('should alert error on  provider update fail and not close modal', function () {
        jest.spyOn(component.dialogRef, 'close');
        mockProviderService.editProvider.mockReturnValue(throwError(new MockError(404, 'User not found')));
        jest.spyOn(component.toastService, 'error');
        component.editProvider(form, null);
        expect(component.toastService.error).toBeCalled();
        expect(component.toastService.error).toBeCalledWith('User not found');
        expect(component.dialogRef.close).not.toBeCalled();
    });
    it('should set loading to false on edit provider', function () {
        mockProviderService.editProvider.mockReturnValue(of(successMock));
        component.editProvider(form, null);
        expect(component.loading).toBeFalsy();
    });
});
//# sourceMappingURL=provider-modal.component.spec.js.map