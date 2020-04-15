import { newUserResponseMock, newUserInfoMock } from './../__mocks__/index';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '../../../shared/alert.service';
import { AddUserModalComponent } from './add-user-modal.component';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../__services__/user.service';

describe('AddUserModalComponent', () => {
  let component: AddUserModalComponent;
  let fixture: ComponentFixture<AddUserModalComponent>;

  const mockUserService = {
    addUser: jest.fn()
  };

  const mockMatDialogRef = {
    close: () => { },
  };

  const mockAlert = {
    success: jest.fn(),
    error: jest.fn()
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserModalComponent],
      imports: [FormsModule, HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: AlertService, useValue: mockAlert},
        { provide: UserService, useValue: mockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialog', () => {
    it('should close the dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('Add New User', () => {
    it('should call userService.addUser', () => {
      mockUserService.addUser.mockReturnValue(of(newUserResponseMock));
      jest.spyOn(component.alert, 'success').mockReturnValue();
      component.addUser(newUserInfoMock);
      expect(component.userService.addUser).toHaveBeenCalledTimes(1);
      expect(component.alert.success).toHaveBeenCalledTimes(1);
    });

    it('should call alert.error when error has a error status', () => {
      const message = 'User doenot exist';
      const error = new MockError(400, message);
      mockUserService.addUser.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');
      component.addUser(newUserInfoMock);
      expect(component.alert.error).toHaveBeenCalledWith('User\'s email not on slack');
    });

    it('should call alert.error when error has a error status of 500', () => {
      const message = 'Server Error';
      const error = new MockError(500, message);
      mockUserService.addUser.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');
      component.addUser(newUserInfoMock);
      expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
    });

    it('should call alert.error when error has no status', () => {
      const message = 'server Error';
      const error = new Error(message);
      mockUserService.addUser.mockReturnValue(throwError(error));
      component.addUser(newUserInfoMock);
      jest.spyOn(component.alert, 'error');
      expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
    });
  });
});
