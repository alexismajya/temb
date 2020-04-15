import { SearchComponent } from './../../../shared/search/search.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { UserInventoryComponent } from './user-inventory.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppEventService } from 'src/app/shared/app-events.service';
import { UserService } from '../../__services__/user.service';
import { RoleService } from '../../__services__/roles.service';
import { usersMock } from '../__mocks__';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { ExportComponent } from '../../export-component/export.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { AlertService } from 'src/app/shared/alert.service';

describe('UserInventoryComponent', () => {
  let component: UserInventoryComponent;
  let fixture: ComponentFixture<UserInventoryComponent>;

  const mockAlert = {
    success: jest.fn(),
    error: jest.fn()
 };

  const mockAppEventService = {
   broadcast: jest.fn(),
   subscribe: jest.fn(),
   getUserData: jest.fn(),
   deleteUser: jest.fn(),
   showDeleteModal: jest.fn()
   };

   const mockMatDialogRef = {
    close: () => { },
    open: () => { },
  };

    const deleteUser = jest.fn();
    const mockMatDialog = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        executeFunction: {
          subscribe: () => deleteUser()
        }
      },
      afterClosed: () => of()
    })
    };

   const mockRoleService = {
      getUsers: jest.fn().mockReturnValue(of({
        success: true,
        message: '',
        users: [usersMock]
      })),
  };
  const mockUserService = {
    deleteUser: jest.fn().mockReturnValue(of({
      success: true,
      message: 'user deleted successfully'
     })),
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInventoryComponent, AppPaginationComponent, EmptyPageComponent, ExportComponent, SearchComponent ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, AngularMaterialModule, FormsModule],
      providers: [
        { provide: AppEventService, useValue: mockAppEventService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: UserService, useValue: mockUserService },
        { provide: AlertService, useValue: mockAlert},
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUsersData', () => {
    const event = {
      name: 'userEvent || editUserEvent',
      content: {}
    };
  it('should subscribe to events ', ( () => {
    jest.spyOn(component, 'getUsersData');
    jest.spyOn(mockAppEventService, 'subscribe');
    component.ngOnInit();
    component.getUsersData('');
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
    expect(component.users).toEqual([]);
  });

it('should display an error message if error occured - "GET"', async () => {
  jest.spyOn(component, 'getUsersData');
  jest.spyOn(mockRoleService, 'getUsers').mockReturnValue(throwError(new Error()));

  component.getUsersData('');
  fixture.detectChanges();
  expect(component.displayText).toEqual('Something went wrong !');
  jest.restoreAllMocks();
});
});

describe('showDeleteModal', () => {
  it('should open delete modal when delete icon is clicked', () => {
    jest.spyOn(component, 'showDeleteModal');
    jest.spyOn(mockAppEventService, 'subscribe');
    component.showDeleteModal(1);
    expect(mockMatDialog.open).toBeCalledTimes(1);
    expect(deleteUser).toBeCalledTimes(1);
  });
});

describe('deleteUser', () => {
  it('should delete user success response from http call', () => {
    const userSpy = jest.spyOn(component, 'getUsersData');
    const deleteSpy = jest.spyOn(mockUserService, 'deleteUser');
    component.getUsersData('');
    fixture.detectChanges();
    component.deleteUser('');
    expect(deleteSpy).toHaveBeenCalled();
    expect(mockAlert.success).toBeCalledTimes(1);
    expect(userSpy).toHaveBeenCalled();
  });

  it('should display an error message if deleteUser is unsuccessful', async () => {
    jest.spyOn(mockUserService, 'deleteUser').mockReturnValue(throwError(new Error()));
    component.getUsersData('');
    fixture.detectChanges();
    component.deleteUser('');
    expect(mockAlert.error).toHaveBeenCalledTimes(3);
  });

});
it('should unsubscribe Subscriptions on ngOnDestroy', () => {
  component.updateSubscription = {
    unsubscribe: jest.fn()
  };
  component.userSubscription = {
    unsubscribe: jest.fn()
  };
  component.ngOnDestroy();
  expect(component.updateSubscription.unsubscribe).toHaveBeenCalled();
  expect(component.userSubscription.unsubscribe).toHaveBeenCalled();
});

describe('openEditUserModal', () => {
  it('should open edit modal when edit icon is clicked', () => {
    jest.spyOn(component, 'openEditUserModal');
    component.openEditUserModal({});
    expect(mockMatDialog.open).toBeCalledTimes(1);
  });
});
});
