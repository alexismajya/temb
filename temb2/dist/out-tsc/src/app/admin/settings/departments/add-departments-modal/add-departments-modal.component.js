var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepartmentsService } from 'src/app/admin/__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { GoogleAnalyticsService } from '../../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../../utils/analytics-helper';
var AddDepartmentsModalComponent = /** @class */ (function () {
    function AddDepartmentsModalComponent(dialogRef, departmentService, alert, data, appEventService, analytics) {
        this.dialogRef = dialogRef;
        this.departmentService = departmentService;
        this.alert = alert;
        this.data = data;
        this.appEventService = appEventService;
        this.analytics = analytics;
        this.model = this.data;
        this.departmentName = this.data.name;
    }
    AddDepartmentsModalComponent.prototype.ngOnInit = function () {
        this.loading = false;
    };
    AddDepartmentsModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddDepartmentsModalComponent.prototype.logError = function (error) {
        if (error && error.status === 404) {
            var message = error.error.message;
            this.alert.error(message);
        }
        else if (error && error.status === 409) {
            var message = error.error.message;
            this.alert.error(message);
        }
        else {
            this.alert.error('Something went wrong, please try again');
        }
    };
    AddDepartmentsModalComponent.prototype.refereshDepartment = function (message, eventMessage) {
        this.alert.success(message);
        this.appEventService.broadcast({ name: 'newDepartment' });
        this.loading = false;
        this.analytics.sendEvent(eventsModel.Departments, eventMessage);
        this.dialogRef.close();
    };
    AddDepartmentsModalComponent.prototype.updateDepartment = function (department) {
        var _this = this;
        var id = department.id, name = department.name, email = department.email;
        this.departmentService.update(id, name, email).subscribe(function (res) {
            if (res.success) {
                _this.refereshDepartment(res.message, modelActions.UPDATE);
            }
        }, function (error) {
            _this.logError(error);
            _this.loading = false;
        });
    };
    AddDepartmentsModalComponent.prototype.addDepartment = function () {
        var _this = this;
        this.loading = true;
        if (this.model.id) {
            return this.updateDepartment(this.model);
        }
        this.departmentService.add(this.model)
            .subscribe(function (res) {
            if (res.success) {
                _this.refereshDepartment(res.message, modelActions.CREATE);
            }
        }, function (error) {
            _this.logError(error);
            _this.loading = false;
        });
    };
    AddDepartmentsModalComponent = __decorate([
        Component({
            templateUrl: './add-departments-modal.component.html',
            styleUrls: ['./add-departments-modal.component.scss']
        }),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            DepartmentsService,
            AlertService, Object, AppEventService,
            GoogleAnalyticsService])
    ], AddDepartmentsModalComponent);
    return AddDepartmentsModalComponent;
}());
export { AddDepartmentsModalComponent };
//# sourceMappingURL=add-departments-modal.component.js.map