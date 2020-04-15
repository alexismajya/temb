import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppEventService } from './../../../shared/app-events.service';
import { UserService } from '../../__services__/user.service';
import { AlertService } from 'src/app/shared/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-user-inventory',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss',
  '../../../auth/login-redirect/login-redirect.component.scss',
  './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any,
    public toastService: AlertService,
    public appEventService: AppEventService,
    public EditUserService: UserService,
  ) { }

  ngOnInit() {
  }

  editUser(form: NgForm, email: string) {
    this.loading = true;
    const data = {
      email,
      newEmail: form.value.newEmail,
      newName: form.value.newName,
      newPhoneNo: form.value.newPhoneNo,
      slackUrl: form.value.slackUrl,
    };
    this.EditUserService.editUser(data).subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.closeDialog();
        this.toastService.success(response.message);
      }
    }, error => {
        this.loading = false;
        const typeErr = ['slackUrl', 'newEmail', 'email', 'newPhoneNo'];
        for ( let i = 0; i < typeErr.length; i++) {
          if (error.error.error[typeErr[i]]) {
            this.toastService.error(error.error.error[typeErr[i]]);
          }
        }
        if (!error.error.error && error.error.message) {
          this.toastService.error(error.error.message);
        }
    });
    this.appEventService.broadcast({ name: 'editUserEvent' });
}

  closeDialog(): void {
    this.dialogRef.close();
  }

}
