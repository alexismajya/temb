var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MatDialog } from '@angular/material';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import SubscriptionHelper from 'src/app/utils/unsubscriptionHelper';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { HomebaseModalComponent } from '../homebase-modal/homebase-modal.component';
var HomebaseCardComponent = /** @class */ (function () {
    function HomebaseCardComponent(appEventService, matDialog) {
        this.appEventService = appEventService;
        this.matDialog = matDialog;
        this.showOptions = new EventEmitter();
    }
    HomebaseCardComponent.prototype.ngOnInit = function () { };
    HomebaseCardComponent.prototype.openEditModal = function () {
        var _this = this;
        var dialogRef = this.matDialog.open(HomebaseModalComponent, {
            maxHeight: '568px', width: '620px', panelClass: 'add-cab-modal-panel-class',
            data: {
                homebaseName: this.homebaseName,
                country: this.country,
                id: this.homebaseId,
                currency: this.currency,
                addressId: this.addressId,
                channel: this.channel,
                opsEmail: this.opsEmail,
                travelEmail: this.travelEmail
            }
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.hidden = !_this.hidden;
        });
    };
    HomebaseCardComponent.prototype.showDeleteModal = function () {
        var _this = this;
        this.matDialog.open(ConfirmModalComponent, {
            data: { displayText: "delete " + this.homebaseName + " homebase", confirmText: 'Yes' }
        });
        this.closeDialogSubscription = this.appEventService.subscribe('closeConfirmationDialog', function () {
            return _this.hidden = !_this.hidden;
        });
    };
    HomebaseCardComponent.prototype.showMoreOptions = function () {
        this.hidden = !this.hidden;
        this.showOptions.emit();
    };
    HomebaseCardComponent.prototype.ngOnDestroy = function () {
        SubscriptionHelper.unsubscribeHelper([this.closeDialogSubscription, this.confirmDeleteSubscription]);
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], HomebaseCardComponent.prototype, "showOptions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], HomebaseCardComponent.prototype, "homebaseName", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], HomebaseCardComponent.prototype, "country", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], HomebaseCardComponent.prototype, "currency", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], HomebaseCardComponent.prototype, "showMoreIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], HomebaseCardComponent.prototype, "hidden", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], HomebaseCardComponent.prototype, "homebaseId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], HomebaseCardComponent.prototype, "addressId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], HomebaseCardComponent.prototype, "channel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], HomebaseCardComponent.prototype, "opsEmail", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], HomebaseCardComponent.prototype, "travelEmail", void 0);
    HomebaseCardComponent = __decorate([
        Component({
            selector: 'app-homebase-card',
            templateUrl: './homebase-card.component.html',
            styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss']
        }),
        __metadata("design:paramtypes", [AppEventService,
            MatDialog])
    ], HomebaseCardComponent);
    return HomebaseCardComponent;
}());
export { HomebaseCardComponent };
//# sourceMappingURL=homebase-card.component.js.map