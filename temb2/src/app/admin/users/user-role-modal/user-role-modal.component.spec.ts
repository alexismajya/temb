import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatSelectModule } from '@angular/material';
import { AlertService } from '../../../shared/alert.service';
import { RoleService } from '../../__services__/roles.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { UserRoleModalComponent } from './user-role-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { roleResponseMock } from '../__mocks__';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { AppEventService } from 'src/app/shared/app-events.service';
import { HomeBaseService } from 'src/app/shared/homebase.service';

describe('UserRoleModalComponent', () => {
  let component: UserRoleModalComponent;
  let fixture: ComponentFixture<UserRoleModalComponent>;

  const mockRoleService = {
    assignRoleToUser: jest.fn(),
    getRoles: jest.fn().mockReturnValue(of({
      success: true,
      data: []
    }))
  };

  const mockMatDialogRef = {
    close: () => { },
    open: () => { },
    };

 const mockAppEventService = {
   broadcast: jest.fn(),
   subscribe: jest.fn()
  };

  const mockAlert = {
    success: jest.fn(),
    error: jest.fn()
  };

 const mockHomebaseService = {
    getAllHomebases: jest.fn().mockReturnValue(of({
      success: true,
      homebases: []
    }))
  };

  const mockAnalytics = {
    sendEvent: jest.fn()
  };

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [UserRoleModalComponent],
      imports: [FormsModule, HttpClientModule, MatSelectModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: AppEventService, useValue: mockAppEventService },
        { provide: AlertService, useValue: mockAlert},
        { provide: RoleService, useValue: mockRoleService },
        { provide: HomeBaseService, useValue: mockHomebaseService},
        { provide: GoogleAnalyticsService, useValue: mockAnalytics }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

    beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('AssignRoleToUser', () => {
    it('should call roleService.assignRoleToUser', () => {
      mockRoleService.assignRoleToUser.mockReturnValue(of(roleResponseMock));
      jest.spyOn(component.alert, 'success').mockReturnValue();
      component.assignUserRole(roleResponseMock.roles);
      expect(component.roleService.assignRoleToUser).toHaveBeenCalledTimes(1);
      expect(component.alert.success).toHaveBeenCalledTimes(1);
    });

    it('should call alert.error when request fails with 404', () => {
      const message = 'user not found';
      const error = new MockError(404, message);
      mockRoleService.assignRoleToUser.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');

      component.assignUserRole(roleResponseMock.roles);
      expect(component.alert.error).toHaveBeenCalledWith('User email entered does not exist');
    });

    it('should call alert.error when request fails with 409 conflict', () => {
      const message = 'User with that name or email already exists';
      const error = new MockError(409, message);
      component.logError(error);
      jest.spyOn(component.alert, 'error');
    });

    it('should call alert.error when request fails with 409 conflict', () => {
      const message = 'Something went wrong, please try again';
      const error = new MockError(400, message);
      component.logError(error);
      jest.spyOn(component.alert, 'error');
    });
  });
});
