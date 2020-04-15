import { environment } from './../../../../environments/environment';
import { AppEventService } from 'src/app/shared/app-events.service';
import { IUserInfo, UserInfo } from './../../../shared/models/user.model';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../__services__/user.service';
import { AlertService } from '../../../shared/alert.service';

@Component({selector: 'app-user-role-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['../../cabs/add-cab-modal/add-cab-modal.component.scss']
})
export class AddUserModalComponent implements OnInit {
  userInfo: IUserInfo;
  isLoading: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    public userService: UserService,
    public appEventsService: AppEventService,
    public alert: AlertService
  ) {}

  ngOnInit() {
    this.userInfo = new UserInfo();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error: any) {
    const message = !error.status || error.status === 500 ? 'Something went wrong, please try again' : 'User\'s email not on slack';
    this.alert.error(message);
  }

  addUser(data: IUserInfo) {
    this.isLoading = true;
    data.slackUrl = environment.teamUrl;
    this.userService.addUser(data).subscribe({
      next: response => {
        this.alert.success(response.message);
        this.isLoading = false;
        this.closeDialog();
      },
      error : err => {
        this.logError(err);
        this.isLoading = false;
      }
    });
    this.appEventsService.broadcast({ name: 'userEvent' });
  }
}
