import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '../../../shared/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { EditUserModalComponent } from './edit-user-modal.component';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '../../__services__/user.service';
import { AppEventService } from './../../../shared/app-events.service';
import { of, throwError } from 'rxjs';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';

const appEventService = new AppEventService();
  export const mockUserService = {
    editUser: jest.fn()
  };

  export const mockMatDialogRef = {
    close: () => { },
    open: () => { },
    };

  export const mockAppEventService = {
    broadcast: jest.fn(),
    subscribe: jest.fn()
   };

  export const toastService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  export const mockSuccess = {
    success: true
  };

  export const mockError = {
  success: false
  };

describe('EditUserModalComponent', () => {
  let component: EditUserModalComponent;
  let fixture: ComponentFixture<EditUserModalComponent>;
  let form;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserModalComponent ],
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

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = new NgForm([], []);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create edit user modal', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should close edit the dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should edit user and give a toast message on success', () => {
      mockUserService.editUser.mockReturnValue(of(mockSuccess));
      jest.spyOn(component.toastService, 'success');
      jest.spyOn(component.dialogRef, 'close');
      jest.spyOn(AppEventService.prototype, 'broadcast');
      component.editUser( form, '');
      const data = {
        email: '',
        newEmail: form.value.newEmail,
        newName: form.value.newName,
        newPhoneNo: form.value.phoneNo,
        slackUrl: form.value.slackUrl
      };
      expect(mockUserService.editUser).toHaveBeenCalledWith(data);
      expect(component.toastService.success).toBeCalled();
      expect(mockAppEventService.broadcast).toBeCalled();
      expect(mockAppEventService.broadcast).toBeCalledWith({name: 'editUserEvent'});
    });

    it('should throw an error of not successfully updated user record', () => {
      jest.spyOn(component.dialogRef, 'close');
      mockUserService.editUser.mockReturnValue(throwError(new MockError(404, 'Provide a valid phone number')));
      jest.spyOn(component.toastService, 'error');
      component.editUser(form, null);
      expect(component.loading).toBeFalsy();
      expect(component.dialogRef.close).not.toBeCalled();
    });
  });
});
