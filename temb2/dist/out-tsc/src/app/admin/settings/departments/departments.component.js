var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { DepartmentsService } from '../../__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { MatDialog } from '@angular/material';
import { AddDepartmentsModalComponent } from './add-departments-modal/add-departments-modal.component';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var DepartmentsComponent = /** @class */ (function () {
    function DepartmentsComponent(departmentService, dialog, alert, appEventService, analytics) {
        var _this = this;
        this.departmentService = departmentService;
        this.dialog = dialog;
        this.alert = alert;
        this.appEventService = appEventService;
        this.analytics = analytics;
        this.departments = [];
        this.displayText = 'No Departments Created';
        this.getDepartments = function () {
            _this.isLoading = true;
            _this.departmentService.get(_this.pageSize, _this.pageNo).subscribe(function (departmentData) {
                var departments = departmentData.departments, pageMeta = departmentData.pageMeta;
                _this.departments = departments;
                _this.totalItems = pageMeta.totalResults;
                _this.appEventService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: _this.totalItems } });
                _this.isLoading = false;
            }, function (error) {
                if (error) {
                    _this.isLoading = false;
                    _this.displayText =
                        error.status === 404
                            ? _this.displayText : "Ooops! We're having connection problems.";
                    return;
                }
            });
        };
        this.pageNo = 1;
        this.pageSize = ITEMS_PER_PAGE;
        this.isLoading = true;
    }
    DepartmentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getDepartments();
        this.updateSubscription = this.appEventService.subscribe('newDepartment', function () { return _this.getDepartments(); });
    };
    DepartmentsComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getDepartments();
    };
    DepartmentsComponent.prototype.addDepartment = function () {
        this.dialog.open(AddDepartmentsModalComponent, {
            data: {}
        });
    };
    DepartmentsComponent.prototype.editDepartment = function (department, name) {
        var departmentDetail = __assign({}, department);
        departmentDetail.email = department['head.email'];
        departmentDetail.name = name;
        this.dialog.open(AddDepartmentsModalComponent, {
            data: departmentDetail,
        });
    };
    DepartmentsComponent.prototype.deleteDepartment = function (departmentId, departmentName) {
        var _this = this;
        this.departmentService.delete(departmentId)
            .subscribe(function (response) {
            var success = response.success, message = response.message;
            if (success) {
                _this.analytics.sendEvent(eventsModel.Departments, modelActions.DELETE);
                _this.alert.success(departmentName + " was Successfully Deleted");
                return _this.getDepartments();
            }
        }, function (error) {
            if (error) {
                return _this.alert.error("\uD83D\uDE1ESorry! " + departmentName + " could not be deleted");
            }
        });
    };
    DepartmentsComponent.prototype.showDeleteModal = function (departmentId, departmentName) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '592px',
            backdropClass: 'modal-backdrop',
            panelClass: 'small-modal-panel-class',
            data: {
                confirmText: 'Yes',
                displayText: 'delete this department'
            }
        });
        dialogRef.componentInstance.executeFunction.subscribe(function () {
            _this.deleteDepartment(departmentId, departmentName);
        });
    };
    DepartmentsComponent = __decorate([
        Component({
            selector: 'app-view-department',
            templateUrl: './departments.component.html',
            styleUrls: [
                '../../routes/routes-inventory/routes-inventory.component.scss',
                './departments.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ],
        }),
        __metadata("design:paramtypes", [DepartmentsService,
            MatDialog,
            AlertService,
            AppEventService,
            GoogleAnalyticsService])
    ], DepartmentsComponent);
    return DepartmentsComponent;
}());
export { DepartmentsComponent };
//# sourceMappingURL=departments.component.js.map