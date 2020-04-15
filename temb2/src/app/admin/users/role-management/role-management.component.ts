import { Component, OnInit } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { RoleService } from '../../__services__/roles.service';
import { AlertService } from 'src/app/shared/alert.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { IUsers } from 'src/app/shared/models/roles.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: [
    './role-management.component.scss',
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ]
})
export class RoleManagementComponent implements OnInit {
  isLoading: boolean;
  totalItems: number;
  userRoleSubscription: Subscription;
  displayText: string;
  pageNo: number;
  pageSize: number;
  users: IUsers[] = [];
  filter: string;

  constructor(
    public roleService: RoleService,
    public dialog: MatDialog,
    private alert: AlertService,
    public appEventsService: AppEventService
  ) {
    this.pageNo = 1;
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
  }

  ngOnInit() {
    this.getUsersData(this.filter);
    this.userRoleSubscription = this.appEventsService.subscribe(
      'userRoleEvent',
      () => this.getUsersData(this.filter)
    );
  }

  getUsersData = filter => {
    if (!filter || filter.length > 0) {
      this.isLoading = true;
      this.roleService.getUsers(filter).subscribe(
        usersData => {
          const { users } = usersData;
          this.users = users;
          let total = 0;
          users.forEach(user => {
            if (user.roles.length > 0) {
              total += parseInt(user.roles.length, 10);
            }
          });
          this.totalItems = total;
          this.appEventsService.broadcast({
            name: 'updateHeaderTitle',
            content: {
              badgeSize: this.totalItems,
              actionButton: 'Assign User Role'
            }
          });
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.displayText = `Oops! We're having connection problems.`;
          return;
        }
      );
    }
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getUsersData(this.filter);
  }

  deleteUserRole(userRoleId: number) {
    this.roleService.deleteUserRole(userRoleId).subscribe(
      response => {
        const { success, message } = response;
        if (success) {
          this.alert.success(message);
          return this.getUsersData(this.filter);
        }
      },
      error => {
        if (error) {
          return this.alert.error('😞Sorry! user role could not be deleted ');
        }
      }
    );
  }

  showDeleteModal(userRoleId: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      data: {
        confirmText: 'Yes',
        displayText: 'delete this user role'
      }
    });
    dialogRef.componentInstance.executeFunction.subscribe(() => {
      this.deleteUserRole(userRoleId);
    });
  }
}
