import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { RoleService } from '../../__services__/roles.service';
import { IUserRoleModal, UserRoleModal, IUserRole } from 'src/app/shared/models/roles.model';
import { IHomeBase } from 'src/app/shared/models/homebase.model';
import { HomeBaseService } from 'src/app/shared/homebase.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
@Component({
  selector: 'app-user-role-modal',
  templateUrl: './user-role-modal.component.html',
  styleUrls: ['./../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
})

export class UserRoleModalComponent implements OnInit {
  roles: UserRoleModal;
  isLoading: boolean;
  homebases: IHomeBase[] = [];
  userRoles: IUserRole[] = [];
  @Output() executeFunction = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<UserRoleModalComponent>,
    public appEventsService: AppEventService,
    public alert: AlertService,
    public roleService: RoleService,
    public homebaseService: HomeBaseService,
    private analytics: GoogleAnalyticsService,
  ) {
    this.roles = new UserRoleModal();
  }
  ngOnInit() {
    this.loadRoles();
    this.loadHomebases();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

    logError(error) {
    if (error && error.status === 404) {
      this.alert.error('User email entered does not exist');
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
    }

  assignUserRole(data: IUserRoleModal) {
    this.isLoading = true;
    this.roleService.assignRoleToUser(data).subscribe((response) => {
      if (response.success) {
        this.alert.success(response.message);
        this.appEventsService.broadcast({ name: 'userRoleEvent' });
        this.analytics.sendEvent(eventsModel.Roles, modelActions.CREATE);
        this.dialogRef.close();
        this.isLoading = false;
      }
    },
      (error) => {
        this.logError(error);
        this.isLoading = false;
      });
  }
  loadRoles() {
  this.roleService.getRoles().subscribe((response) => {
      if (response.success) {
        this.userRoles = response.data;
      }
    });
  }

  loadHomebases() {
    this.homebaseService.getAllHomebases().subscribe((response) => {
      if (response.success) {
        this.homebases = response.homebases;
      }
    });
  }
}
