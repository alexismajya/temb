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
import { AppEventService } from './../../../shared/app-events.service';
import { UserService } from '../../__services__/user.service';
import { AlertService } from 'src/app/shared/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
var EditUserModalComponent = /** @class */ (function () {
    function EditUserModalComponent(dialogRef, data, toastService, appEventService, EditUserService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastService = toastService;
        this.appEventService = appEventService;
        this.EditUserService = EditUserService;
        this.loading = false;
    }
    EditUserModalComponent.prototype.ngOnInit = function () {
    };
    EditUserModalComponent.prototype.editUser = function (form, email) {
        var _this = this;
        this.loading = true;
        var data = {
            email: email,
            newEmail: form.value.newEmail,
            newName: form.value.newName,
            newPhoneNo: form.value.newPhoneNo,
            slackUrl: form.value.slackUrl,
        };
        this.EditUserService.editUser(data).subscribe(function (response) {
            _this.loading = false;
            if (response.success) {
                _this.closeDialog();
                _this.toastService.success(response.message);
            }
        }, function (error) {
            _this.loading = false;
            var typeErr = ['slackUrl', 'newEmail', 'email', 'newPhoneNo'];
            for (var i = 0; i < typeErr.length; i++) {
                if (error.error.error[typeErr[i]]) {
                    _this.toastService.error(error.error.error[typeErr[i]]);
                }
            }
            if (!error.error.error && error.error.message) {
                _this.toastService.error(error.error.message);
            }
        });
        this.appEventService.broadcast({ name: 'editUserEvent' });
    };
    EditUserModalComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    EditUserModalComponent = __decorate([
        Component({
            selector: 'app-user-inventory',
            templateUrl: './edit-user-modal.component.html',
            styleUrls: ['./edit-user-modal.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss',
                './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
        }),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, AlertService,
            AppEventService,
            UserService])
    ], EditUserModalComponent);
    return EditUserModalComponent;
}());
export { EditUserModalComponent };
//# sourceMappingURL=edit-user-modal.component.js.map