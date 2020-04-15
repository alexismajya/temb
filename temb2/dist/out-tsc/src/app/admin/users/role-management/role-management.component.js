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
import { AppEventService } from 'src/app/shared/app-events.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { RoleService } from '../../__services__/roles.service';
import { AlertService } from 'src/app/shared/alert.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
var RoleManagementComponent = /** @class */ (function () {
    function RoleManagementComponent(roleService, dialog, alert, appEventsService) {
        var _this = this;
        this.roleService = roleService;
        this.dialog = dialog;
        this.alert = alert;
        this.appEventsService = appEventsService;
        this.users = [];
        this.getUsersData = function (filter) {
            if (!filter || filter.length > 0) {
                _this.isLoading = true;
                _this.roleService.getUsers(filter).subscribe(function (usersData) {
                    var users = usersData.users;
                    _this.users = users;
                    var total = 0;
                    users.forEach(function (user) {
                        if (user.roles.length > 0) {
                            total += parseInt(user.roles.length, 10);
                        }
                    });
                    _this.totalItems = total;
                    _this.appEventsService.broadcast({
                        name: 'updateHeaderTitle',
                        content: {
                            badgeSize: _this.totalItems,
                            actionButton: 'Assign User Role'
                        }
                    });
                    _this.isLoading = false;
                }, function () {
                    _this.isLoading = false;
                    _this.displayText = "Oops! We're having connection problems.";
                    return;
                });
            }
        };
        this.pageNo = 1;
        this.pageSize = ITEMS_PER_PAGE;
        this.isLoading = true;
    }
    RoleManagementComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getUsersData(this.filter);
        this.userRoleSubscription = this.appEventsService.subscribe('userRoleEvent', function () { return _this.getUsersData(_this.filter); });
    };
    RoleManagementComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getUsersData(this.filter);
    };
    RoleManagementComponent.prototype.deleteUserRole = function (userRoleId) {
        var _this = this;
        this.roleService.deleteUserRole(userRoleId).subscribe(function (response) {
            var success = response.success, message = response.message;
            if (success) {
                _this.alert.success(message);
                return _this.getUsersData(_this.filter);
            }
        }, function (error) {
            if (error) {
                return _this.alert.error('😞Sorry! user role could not be deleted ');
            }
        });
    };
    RoleManagementComponent.prototype.showDeleteModal = function (userRoleId) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '592px',
            data: {
                confirmText: 'Yes',
                displayText: 'delete this user role'
            }
        });
        dialogRef.componentInstance.executeFunction.subscribe(function () {
            _this.deleteUserRole(userRoleId);
        });
    };
    RoleManagementComponent = __decorate([
        Component({
            selector: 'app-role-management',
            templateUrl: './role-management.component.html',
            styleUrls: [
                './role-management.component.scss',
                '../../routes/routes-inventory/routes-inventory.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ]
        }),
        __metadata("design:paramtypes", [RoleService,
            MatDialog,
            AlertService,
            AppEventService])
    ], RoleManagementComponent);
    return RoleManagementComponent;
}());
export { RoleManagementComponent };
//# sourceMappingURL=role-management.component.js.map