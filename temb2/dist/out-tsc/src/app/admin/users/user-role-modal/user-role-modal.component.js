var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { RoleService } from '../../__services__/roles.service';
import { UserRoleModal } from 'src/app/shared/models/roles.model';
import { HomeBaseService } from 'src/app/shared/homebase.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var UserRoleModalComponent = /** @class */ (function () {
    function UserRoleModalComponent(dialogRef, appEventsService, alert, roleService, homebaseService, analytics) {
        this.dialogRef = dialogRef;
        this.appEventsService = appEventsService;
        this.alert = alert;
        this.roleService = roleService;
        this.homebaseService = homebaseService;
        this.analytics = analytics;
        this.homebases = [];
        this.userRoles = [];
        this.executeFunction = new EventEmitter();
        this.roles = new UserRoleModal();
    }
    UserRoleModalComponent.prototype.ngOnInit = function () {
        this.loadRoles();
        this.loadHomebases();
    };
    UserRoleModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    UserRoleModalComponent.prototype.logError = function (error) {
        if (error && error.status === 404) {
            this.alert.error('User email entered does not exist');
        }
        else if (error && error.status === 409) {
            var message = error.error.message;
            this.alert.error(message);
        }
        else {
            this.alert.error('Something went wrong, please try again');
        }
    };
    UserRoleModalComponent.prototype.assignUserRole = function (data) {
        var _this = this;
        this.isLoading = true;
        this.roleService.assignRoleToUser(data).subscribe(function (response) {
            if (response.success) {
                _this.alert.success(response.message);
                _this.appEventsService.broadcast({ name: 'userRoleEvent' });
                _this.analytics.sendEvent(eventsModel.Roles, modelActions.CREATE);
                _this.dialogRef.close();
                _this.isLoading = false;
            }
        }, function (error) {
            _this.logError(error);
            _this.isLoading = false;
        });
    };
    UserRoleModalComponent.prototype.loadRoles = function () {
        var _this = this;
        this.roleService.getRoles().subscribe(function (response) {
            if (response.success) {
                _this.userRoles = response.data;
            }
        });
    };
    UserRoleModalComponent.prototype.loadHomebases = function () {
        var _this = this;
        this.homebaseService.getAllHomebases().subscribe(function (response) {
            if (response.success) {
                _this.homebases = response.homebases;
            }
        });
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], UserRoleModalComponent.prototype, "executeFunction", void 0);
    UserRoleModalComponent = __decorate([
        Component({
            selector: 'app-user-role-modal',
            templateUrl: './user-role-modal.component.html',
            styleUrls: ['./../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialogRef,
            AppEventService,
            AlertService,
            RoleService,
            HomeBaseService,
            GoogleAnalyticsService])
    ], UserRoleModalComponent);
    return UserRoleModalComponent;
}());
export { UserRoleModalComponent };
//# sourceMappingURL=user-role-modal.component.js.map