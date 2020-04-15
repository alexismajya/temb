import { SearchComponent } from './../../../shared/search/search.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { RoleManagementComponent } from './role-management.component';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from 'src/app/shared/alert.service';
import { RoleService } from '../../__services__/roles.service';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { userRolesMock } from '../__mocks__';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { ExportComponent } from '../../export-component/export.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';


describe('RoleManagementComponent', () => {
  let component: RoleManagementComponent;
  let fixture: ComponentFixture<RoleManagementComponent>;

 const mockAlert = {
    success: jest.fn(),
    error: jest.fn()
 };

  const mockAppEventService = {
   broadcast: jest.fn(),
   subscribe: jest.fn()
   };

  const mockMatDialogRef = {
    close: () => { },
    open: () => { },
  };

    const deleteUserRole = jest.fn();
    const mockMatDialog = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        executeFunction: {
          subscribe: () => deleteUserRole()
        }
      },
      afterClosed: () => of()
    })
    };

  const mockRoleService = {
    getUsers: jest.fn().mockReturnValue(of({
      success: true,
      message: '',
      users: [userRolesMock]
    })),
    deleteUserRole: jest.fn().mockReturnValue(of({
      success: true,
      message: 'uer role deleted successfully'
     })),
  };

    beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoleManagementComponent, AppPaginationComponent, ConfirmModalComponent, SearchComponent
        , EmptyPageComponent, ExportComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, AngularMaterialModule,
        BrowserAnimationsModule, FormsModule],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: AppEventService, useValue: mockAppEventService },
        { provide: AlertService, useValue: mockAlert},
        { provide: RoleService, useValue: mockRoleService },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ConfirmModalComponent]
      }
    }).compileComponents();
     fixture = TestBed.createComponent(RoleManagementComponent);
     component = fixture.componentInstance;
      fixture.detectChanges();
    }));

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  describe('initial load', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });
  });

  describe('getUsersData', () => {
      const event = {
        name: 'userRoleEvent',
        content: {}
      };
    it('should subscribe to events ', ( () => {
      jest.spyOn(component, 'getUsersData');
      jest.spyOn(mockAppEventService, 'subscribe');
      component.ngOnInit();
      expect(mockAppEventService.subscribe).toBeCalled();
    }));
    it('should call getUserData', () => {
      jest.spyOn(component, 'getUsersData').mockImplementation();
      jest.spyOn(mockAppEventService, 'subscribe');
      component.setPage(1);
      mockAppEventService.broadcast(event);
      expect(mockAppEventService.subscribe).toBeCalled();
      expect(component.pageNo).toEqual(1);
      expect(component.getUsersData).toBeCalled();
      expect(component.users).toEqual([userRolesMock]);
    });

  it('should display an error message if error occured - "GET"', async () => {
    jest.spyOn(component, 'getUsersData');
    jest.spyOn(mockRoleService, 'getUsers').mockReturnValue(throwError(new Error()));

    component.getUsersData('');
    fixture.detectChanges();
    expect(component.displayText).toEqual(`Oops! We're having connection problems.`);
    jest.restoreAllMocks();
  });
  });

  describe('showDeleteModal', () => {
    it('should open delete modal when delete icon is clicked', () => {
      component.showDeleteModal(1);
      expect(mockMatDialog.open).toBeCalledTimes(1);
      expect(deleteUserRole).toBeCalledTimes(1);
    });
  });

  describe('deleteUserRole', () => {
    it('should delete user role success response from http call', () => {
      const userRoleSpy = jest.spyOn(component, 'getUsersData');
      const deleteSpy = jest.spyOn(mockRoleService, 'deleteUserRole');
      component.getUsersData('');
      fixture.detectChanges();
      component.deleteUserRole(1);
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockAlert.success).toBeCalledTimes(1);
      expect(userRoleSpy).toHaveBeenCalled();
    });

    it('should display an error message if deleteUserRole is unsuccessful', async () => {
      jest.spyOn(mockRoleService, 'deleteUserRole').mockReturnValue(throwError(new Error()));
      component.getUsersData('');
      fixture.detectChanges();
      component.deleteUserRole(1);
      expect(mockAlert.error).toHaveBeenCalledTimes(1);
    });
  });
  });

