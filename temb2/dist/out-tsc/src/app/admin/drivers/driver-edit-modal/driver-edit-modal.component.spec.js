import { async, TestBed } from '@angular/core/testing';
import { DriverEditModalComponent } from './driver-edit-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from '../../../shared/alert.service';
import { of, throwError } from 'rxjs';
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';
import { successMock } from '../../providers/provider-modal/provider-modal.component.spec';
import { AppEventService } from '../../../shared/app-events.service';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
var matDialogMock = {
    open: jest.fn().mockReturnValue({
        componentInstance: {
            executeFunction: {
                subscribe: function () { return of(); }
            }
        },
        afterClosed: function () { return of(); }
    }),
};
export var mockDriverService = {
    updateDriver: jest.fn()
};
var mockMatDialogRef = {
    close: function () { },
};
var alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
};
var mockMatDialogData = {
    data: {
        displayText: 'display data',
        confirmText: 'yes'
    }
};
var appEventService = new AppEventService();
describe('DriverEditModalComponent', function () {
    var component;
    var form;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DriverEditModalComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [FormsModule, HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
            providers: [{ provide: MatDialog, useValue: matDialogMock },
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
                { provide: AlertService, useValue: alert },
                { provide: AppEventService, useValue: appEventService },
                { provide: DriversInventoryService, useValue: mockDriverService }
            ],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(DriverEditModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        form = new NgForm([], []);
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should close dialog', function () {
        jest.spyOn(component.dialogRef, 'close');
        component.closeDialog();
        expect(component.dialogRef.close).toBeCalled();
    });
    it('should edit driver and give a toast message on success', function () {
        mockDriverService.updateDriver.mockReturnValue(of(successMock));
        jest.spyOn(component.toastService, 'success');
        jest.spyOn(component.dialogRef, 'close');
        jest.spyOn(AppEventService.prototype, 'broadcast');
        component.editDriver(form, null, null);
        expect(mockDriverService.updateDriver).toBeCalled();
        expect(component.toastService.success).toBeCalled();
        expect(component.loading).toBeFalsy();
        expect(component.dialogRef.close).toBeCalled();
        expect(appEventService.broadcast).toBeCalled();
        expect(appEventService.broadcast).toBeCalledWith({ name: 'updatedDriversEvent' });
    });
    it('should throw an error of not successfully updated', function () {
        mockDriverService.updateDriver.mockReturnValue(throwError(new MockError(404, 'Driver not found')));
        jest.spyOn(component.toastService, 'error');
        component.editDriver(form, null, null);
        expect(component.loading).toBeFalsy();
        expect(component.toastService.error).toBeCalled();
        expect(component.toastService.error).toBeCalledWith('Driver not found');
    });
});
//# sourceMappingURL=driver-edit-modal.component.spec.js.map