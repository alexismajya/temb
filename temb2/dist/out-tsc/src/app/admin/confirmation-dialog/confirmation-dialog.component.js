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
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppEventService } from '../../shared/app-events.service';
var ConfirmModalComponent = /** @class */ (function () {
    function ConfirmModalComponent(dialogRef, appEventService, data) {
        this.dialogRef = dialogRef;
        this.appEventService = appEventService;
        this.data = data;
        this.executeFunction = new EventEmitter();
        this.displayText = this.data.displayText;
        this.confirmText = this.data.confirmText;
    }
    ConfirmModalComponent.prototype.closeDialog = function () {
        this.appEventService.broadcast({ name: 'closeConfirmationDialog' });
        this.dialogRef.close();
    };
    ConfirmModalComponent.prototype.confirmDialog = function () {
        this.appEventService.broadcast({ name: 'confirmProviderDelete' });
        this.executeFunction.emit();
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ConfirmModalComponent.prototype, "executeFunction", void 0);
    ConfirmModalComponent = __decorate([
        Component({
            templateUrl: './confirmation-dialog.component.html',
            styleUrls: ['./confirmation-dialog.component.scss']
        }),
        __param(2, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            AppEventService, Object])
    ], ConfirmModalComponent);
    return ConfirmModalComponent;
}());
export { ConfirmModalComponent };
//# sourceMappingURL=confirmation-dialog.component.js.map