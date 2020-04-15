import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { UserService } from '../../__services__/user.service';
import { RoleService as UserRoleService } from '../../__services__/roles.service';
import { IUsers } from 'src/app/shared/models/roles.model';
import { Subscription, Subject } from 'rxjs';
import { MatDialog, _MatAutocompleteMixinBase } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  templateUrl: './user-inventory.component.html',
  styleUrls: ['../../routes/routes-inventory/routes-inventory.component.scss',
  './user-inventory.component.scss',
  '../../cabs/cab-inventory/cab-card/cab-card.component.scss']
})
export class UserInventoryComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  totalItems: number;
  userSubscription: any;
  updateSubscription: any;
  displayText: string;
  pageNo: number;
  pageSize: number;
  users: IUsers[] = [];
  filter: string;
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() email: string;
  @Input() slackUrl: string;
  @Input() newEmail: string;
  @Input() newName: string;
  @Input() newPhoneNo: string;

  constructor(
    public userService: UserService,
    public userRoleService: UserRoleService,
    public appEventsService: AppEventService,
    private alert: AlertService,
    public dialog: MatDialog,
  ) {
    this.pageNo = 1;
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
    this.filter = '';
    this.email = '';
    this.getUsersData(this.filter);
  }

  ngOnInit() {
    this.userSubscription = this.appEventsService
      .subscribe('userEvent', () => this.getUsersData(this.filter));

    this.updateSubscription = this.appEventsService
      .subscribe('editUserEvent', () => this.getUsersData(this.filter));
  }

  getUsersData = (filter) => {
    if (!filter || filter.length >= 1) {
      this.isLoading = true;
      this.userRoleService.getUsers(filter).subscribe(usersData => {
        const { users } = usersData;
        this.users = users;
        for ( let i = 0; i < users.length; i++) {
          if ( users[i].roles.length !== 0 && users[i].roles[0].name === 'Super Admin') {
            this.users.splice(i, 1);
            i--;
          }
        }
        const total = parseInt(users.length, 10);
        this.totalItems = total;
        this.appEventsService.broadcast({
          name: 'updateHeaderTitle', content:
            { badgeSize: this.totalItems, actionButton: 'Add User' }
        });
        this.isLoading = false;
      },
        () => {
          this.isLoading = false;
            this.users = [];
            this.displayText = 'Something went wrong !';
            return this.alert.error('No user found');
          }
      );
    }
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getUsersData(this.filter);
  }

  deleteUser(email: string) {
    this.userService.deleteUser(email).subscribe((response) => {
      const { success, message } = response;
      if (success) {
        this.alert.success(message);
        return this.getUsersData(this.filter);
      }
    },
      (error) => {
        if (error) {
          return this.alert.error('😞Sorry! user could not be deleted ');
        }
      });
  }

  showDeleteModal(userEmail: any): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      data: {
        confirmText: 'Yes',
        displayText: 'delete this user'
      }
    });
    dialogRef.componentInstance.executeFunction.subscribe(() => {
     this.deleteUser(userEmail);
    });
  }

  openEditUserModal(userData) {
    this.getUsersData.call(this);
    this.dialog.open(EditUserModalComponent, {
      maxHeight: '500px', width: '620px', panelClass: 'add-cab-modal-panel-class',
      data: {
        email: userData.email,
        newEmail: userData.email,
        newName: userData.name,
        newPhoneNo: userData.phoneNo,
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
