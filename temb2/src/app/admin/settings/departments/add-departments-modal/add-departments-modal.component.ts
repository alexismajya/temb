import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDepartmentsModel, IDepartmentResponse } from 'src/app/shared/models/departments.model';
import { DepartmentsService } from 'src/app/admin/__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { GoogleAnalyticsService } from '../../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../../utils/analytics-helper';

@Component({
  templateUrl: './add-departments-modal.component.html',
  styleUrls: ['./add-departments-modal.component.scss']
})
export class AddDepartmentsModalComponent implements OnInit {
  model: IDepartmentsModel;
  loading: boolean;
  departmentName: string;
  constructor(
    public dialogRef: MatDialogRef<AddDepartmentsModalComponent>,
    public departmentService: DepartmentsService,
    public alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: IDepartmentsModel,
    private appEventService: AppEventService,
    private analytics: GoogleAnalyticsService
  ) {
    this.model = this.data;
    this.departmentName = this.data.name;
  }

  ngOnInit() {
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error) {
    if (error && error.status === 404) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
  }
  refereshDepartment(message, eventMessage: string) {
    this.alert.success(message);
    this.appEventService.broadcast({ name: 'newDepartment' });
    this.loading = false;
    this.analytics.sendEvent(eventsModel.Departments, eventMessage);
    this.dialogRef.close();
  }

  updateDepartment(department: IDepartmentsModel) {
    const { id, name, email } = department;
    this.departmentService.update(id, name, email).subscribe((res: IDepartmentResponse) => {
      if (res.success) {
        this.refereshDepartment(res.message, modelActions.UPDATE);
      }
    },
      (error) => {
        this.logError(error);
        this.loading = false;
    });
  }

  addDepartment(): void {
    this.loading = true;
    if (this.model.id) {
      return this.updateDepartment(this.model);
    }
    this.departmentService.add(this.model)
    .subscribe(
      (res) => {
        if (res.success) {
          this.refereshDepartment(res.message, modelActions.CREATE);
        }
      },
      (error) => {
        this.logError(error);
        this.loading = false;
      }
    );
  }
}
