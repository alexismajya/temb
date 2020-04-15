import { async, TestBed } from '@angular/core/testing';
import { AlertService } from '../../../shared/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { EditUserModalComponent } from './edit-user-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '../../__services__/user.service';
import { AppEventService } from './../../../shared/app-events.service';
import { of, throwError } from 'rxjs';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
var appEventService = new AppEventService();
export var mockUserService = {
    editUser: jest.fn()
};
export var mockMatDialogRef = {
    close: function () { },
    open: function () { },
};
export var mockAppEventService = {
    broadcast: jest.fn(),
    subscribe: jest.fn()
};
export var toastService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
};
export var mockSuccess = {
    success: true
};
export var mockError = {
    success: false
};
describe('EditUserModalComponent', function () {
    var component;
    var fixture;
    var form;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [EditUserModalComponent],
            imports: [FormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: AppEventService, useValue: mockAppEventService },
                { provide: UserService, useValue: mockUserService },
                { provide: AlertService, useValue: toastService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(EditUserModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        form = new NgForm([], []);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create edit user modal', function () {
        expect(component).toBeTruthy();
    });
    describe('closeDialog', function () {
        it('should close edit the dialog', function () {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
        it('should edit user and give a toast message on success', function () {
            mockUserService.editUser.mockReturnValue(of(mockSuccess));
            jest.spyOn(component.toastService, 'success');
            jest.spyOn(component.dialogRef, 'close');
            jest.spyOn(AppEventService.prototype, 'broadcast');
            component.editUser(form, '');
            var data = {
                email: '',
                newEmail: form.value.newEmail,
                newName: form.value.newName,
                newPhoneNo: form.value.phoneNo,
                slackUrl: form.value.slackUrl
            };
            expect(mockUserService.editUser).toHaveBeenCalledWith(data);
            expect(component.toastService.success).toBeCalled();
            expect(mockAppEventService.broadcast).toBeCalled();
            expect(mockAppEventService.broadcast).toBeCalledWith({ name: 'editUserEvent' });
        });
        it('should throw an error of not successfully updated user record', function () {
            jest.spyOn(component.dialogRef, 'close');
            mockUserService.editUser.mockReturnValue(throwError(new MockError(404, 'Provide a valid phone number')));
            jest.spyOn(component.toastService, 'error');
            component.editUser(form, null);
            expect(component.loading).toBeFalsy();
            expect(component.dialogRef.close).not.toBeCalled();
        });
    });
});
//# sourceMappingURL=edit-user-modal.component.spec.js.map