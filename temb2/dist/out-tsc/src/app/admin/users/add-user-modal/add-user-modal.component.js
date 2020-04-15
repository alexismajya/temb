var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { environment } from './../../../../environments/environment';
import { AppEventService } from 'src/app/shared/app-events.service';
import { UserInfo } from './../../../shared/models/user.model';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../__services__/user.service';
import { AlertService } from '../../../shared/alert.service';
var AddUserModalComponent = /** @class */ (function () {
    function AddUserModalComponent(dialogRef, userService, appEventsService, alert) {
        this.dialogRef = dialogRef;
        this.userService = userService;
        this.appEventsService = appEventsService;
        this.alert = alert;
    }
    AddUserModalComponent.prototype.ngOnInit = function () {
        this.userInfo = new UserInfo();
    };
    AddUserModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddUserModalComponent.prototype.logError = function (error) {
        var message = !error.status || error.status === 500 ? 'Something went wrong, please try again' : 'User\'s email not on slack';
        this.alert.error(message);
    };
    AddUserModalComponent.prototype.addUser = function (data) {
        var _this = this;
        this.isLoading = true;
        data.slackUrl = environment.teamUrl;
        this.userService.addUser(data).subscribe({
            next: function (response) {
                _this.alert.success(response.message);
                _this.isLoading = false;
                _this.closeDialog();
            },
            error: function (err) {
                _this.logError(err);
                _this.isLoading = false;
            }
        });
        this.appEventsService.broadcast({ name: 'userEvent' });
    };
    AddUserModalComponent = __decorate([
        Component({ selector: 'app-user-role-modal',
            templateUrl: './add-user-modal.component.html',
            styleUrls: ['../../cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialogRef,
            UserService,
            AppEventService,
            AlertService])
    ], AddUserModalComponent);
    return AddUserModalComponent;
}());
export { AddUserModalComponent };
//# sourceMappingURL=add-user-modal.component.js.map