import { newUserResponseMock, newUserInfoMock } from './../__mocks__/index';
import { async, TestBed } from '@angular/core/testing';
import { AlertService } from '../../../shared/alert.service';
import { AddUserModalComponent } from './add-user-modal.component';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../__services__/user.service';
describe('AddUserModalComponent', function () {
    var component;
    var fixture;
    var mockUserService = {
        addUser: jest.fn()
    };
    var mockMatDialogRef = {
        close: function () { },
    };
    var mockAlert = {
        success: jest.fn(),
        error: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AddUserModalComponent],
            imports: [FormsModule, HttpClientModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: AlertService, useValue: mockAlert },
                { provide: UserService, useValue: mockUserService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AddUserModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    describe('closeDialog', function () {
        it('should close the dialog', function () {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
    describe('Add New User', function () {
        it('should call userService.addUser', function () {
            mockUserService.addUser.mockReturnValue(of(newUserResponseMock));
            jest.spyOn(component.alert, 'success').mockReturnValue();
            component.addUser(newUserInfoMock);
            expect(component.userService.addUser).toHaveBeenCalledTimes(1);
            expect(component.alert.success).toHaveBeenCalledTimes(1);
        });
        it('should call alert.error when error has a error status', function () {
            var message = 'User doenot exist';
            var error = new MockError(400, message);
            mockUserService.addUser.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addUser(newUserInfoMock);
            expect(component.alert.error).toHaveBeenCalledWith('User\'s email not on slack');
        });
        it('should call alert.error when error has a error status of 500', function () {
            var message = 'Server Error';
            var error = new MockError(500, message);
            mockUserService.addUser.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addUser(newUserInfoMock);
            expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
        });
        it('should call alert.error when error has no status', function () {
            var message = 'server Error';
            var error = new Error(message);
            mockUserService.addUser.mockReturnValue(throwError(error));
            component.addUser(newUserInfoMock);
            jest.spyOn(component.alert, 'error');
            expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
        });
    });
});
//# sourceMappingURL=add-user-modal.component.spec.js.map