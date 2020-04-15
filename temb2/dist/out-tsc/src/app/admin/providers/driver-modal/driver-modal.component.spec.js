import { async, TestBed } from '@angular/core/testing';
import { DriverModalComponent } from './driver-modal.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AlertService } from '../../../shared/alert.service';
import { ProviderService } from '../../__services__/providers.service';
import { AppEventService } from '../../../shared/app-events.service';
import { mockMatDialogRef, mockProviderService, successMock, toastService } from '../provider-modal/provider-modal.component.spec';
import { of, throwError } from 'rxjs';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
var appEventService = new AppEventService();
describe('DriverModalComponent', function () {
    var component;
    var fixture;
    var form;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DriverModalComponent],
            imports: [FormsModule],
            providers: [{ provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: AlertService, useValue: toastService },
                { provide: ProviderService, useValue: mockProviderService },
                { provide: AppEventService, useValue: appEventService }]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(DriverModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        form = new NgForm([], []);
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should close the add driver modal', function () {
        jest.spyOn(component.dialogRef, 'close');
        component.closeDialog();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });
    it('should close the add driver modal', function () {
        mockProviderService.addDriver.mockReturnValue(of({}));
        component.addDriver(form);
        expect(mockProviderService.addDriver).toHaveBeenCalled();
    });
    it('should alert success on successful driver creation', function () {
        mockProviderService.addDriver.mockReturnValue(of(successMock));
        jest.spyOn(component.toastService, 'success');
        component.addDriver(form);
        expect(component.toastService.success).toHaveBeenCalled();
    });
    it('should alert error failure of driver creation', function () {
        mockProviderService.addDriver.mockReturnValue(throwError(new MockError(400, 'driverName must be unique')));
        jest.spyOn(component.toastService, 'error');
        component.addDriver(form);
        expect(component.toastService.error).toHaveBeenCalled();
    });
    it('should create driver object ', function () {
        var expected = { providerId: undefined,
            driverName: 'Test User',
            driverPhoneNo: '067546646',
            driverNumber: '245364' };
        var data = {
            value: {
                email: '',
                driverName: 'Test User',
                driverNumber: '245364',
                driverPhoneNo: '067546646'
            }
        };
        var results = DriverModalComponent.createDriverObject(data);
        expect(results).toEqual(expected);
    });
});
//# sourceMappingURL=driver-modal.component.spec.js.map