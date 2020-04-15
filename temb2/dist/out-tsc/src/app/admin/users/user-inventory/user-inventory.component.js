var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { UserService } from '../../__services__/user.service';
import { RoleService as UserRoleService } from '../../__services__/roles.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { AlertService } from 'src/app/shared/alert.service';
var UserInventoryComponent = /** @class */ (function () {
    function UserInventoryComponent(userService, userRoleService, appEventsService, alert, dialog) {
        var _this = this;
        this.userService = userService;
        this.userRoleService = userRoleService;
        this.appEventsService = appEventsService;
        this.alert = alert;
        this.dialog = dialog;
        this.users = [];
        this.showOptions = new EventEmitter();
        this.getUsersData = function (filter) {
            if (!filter || filter.length >= 1) {
                _this.isLoading = true;
                _this.userRoleService.getUsers(filter).subscribe(function (usersData) {
                    var users = usersData.users;
                    _this.users = users;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].roles.length !== 0 && users[i].roles[0].name === 'Super Admin') {
                            _this.users.splice(i, 1);
                            i--;
                        }
                    }
                    var total = parseInt(users.length, 10);
                    _this.totalItems = total;
                    _this.appEventsService.broadcast({
                        name: 'updateHeaderTitle', content: { badgeSize: _this.totalItems, actionButton: 'Add User' }
                    });
                    _this.isLoading = false;
                }, function () {
                    _this.isLoading = false;
                    _this.users = [];
                    _this.displayText = 'Something went wrong !';
                    return _this.alert.error('No user found');
                });
            }
        };
        this.pageNo = 1;
        this.pageSize = ITEMS_PER_PAGE;
        this.isLoading = true;
        this.filter = '';
        this.email = '';
        this.getUsersData(this.filter);
    }
    UserInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userSubscription = this.appEventsService
            .subscribe('userEvent', function () { return _this.getUsersData(_this.filter); });
        this.updateSubscription = this.appEventsService
            .subscribe('editUserEvent', function () { return _this.getUsersData(_this.filter); });
    };
    UserInventoryComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getUsersData(this.filter);
    };
    UserInventoryComponent.prototype.deleteUser = function (email) {
        var _this = this;
        this.userService.deleteUser(email).subscribe(function (response) {
            var success = response.success, message = response.message;
            if (success) {
                _this.alert.success(message);
                return _this.getUsersData(_this.filter);
            }
        }, function (error) {
            if (error) {
                return _this.alert.error('😞Sorry! user could not be deleted ');
            }
        });
    };
    UserInventoryComponent.prototype.showDeleteModal = function (userEmail) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '592px',
            data: {
                confirmText: 'Yes',
                displayText: 'delete this user'
            }
        });
        dialogRef.componentInstance.executeFunction.subscribe(function () {
            _this.deleteUser(userEmail);
        });
    };
    UserInventoryComponent.prototype.openEditUserModal = function (userData) {
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
    };
    UserInventoryComponent.prototype.ngOnDestroy = function () {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], UserInventoryComponent.prototype, "showOptions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UserInventoryComponent.prototype, "email", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UserInventoryComponent.prototype, "slackUrl", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UserInventoryComponent.prototype, "newEmail", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UserInventoryComponent.prototype, "newName", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UserInventoryComponent.prototype, "newPhoneNo", void 0);
    UserInventoryComponent = __decorate([
        Component({
            templateUrl: './user-inventory.component.html',
            styleUrls: ['../../routes/routes-inventory/routes-inventory.component.scss',
                './user-inventory.component.scss',
                '../../cabs/cab-inventory/cab-card/cab-card.component.scss']
        }),
        __metadata("design:paramtypes", [UserService,
            UserRoleService,
            AppEventService,
            AlertService,
            MatDialog])
    ], UserInventoryComponent);
    return UserInventoryComponent;
}());
export { UserInventoryComponent };
//# sourceMappingURL=user-inventory.component.js.map