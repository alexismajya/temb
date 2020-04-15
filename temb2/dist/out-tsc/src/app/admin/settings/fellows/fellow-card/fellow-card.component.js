var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteFellowModalComponent } from 'src/app/admin/settings/fellows/delete-fellow-dialog/delete-dialog.component';
var FellowCardComponent = /** @class */ (function () {
    function FellowCardComponent(dialog) {
        this.dialog = dialog;
        this.removeFellow = new EventEmitter();
    }
    FellowCardComponent.prototype.ngOnInit = function () { };
    FellowCardComponent.prototype.showFellowDeleteModal = function () {
        var _this = this;
        var dialofRef = this.dialog.open(DeleteFellowModalComponent, {
            data: {
                fellow: {
                    name: this.name,
                    image: this.image,
                    partner: this.partner,
                    tripsTaken: this.tripsTaken,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    id: this.userId
                }
            }
        });
        dialofRef.componentInstance.removeUser.subscribe(function () {
            _this.removeFellow.emit();
        });
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], FellowCardComponent.prototype, "removeFellow", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FellowCardComponent.prototype, "name", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FellowCardComponent.prototype, "image", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FellowCardComponent.prototype, "partner", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FellowCardComponent.prototype, "tripsTaken", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FellowCardComponent.prototype, "startDate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FellowCardComponent.prototype, "endDate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FellowCardComponent.prototype, "showRemoveIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FellowCardComponent.prototype, "showAddIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], FellowCardComponent.prototype, "userId", void 0);
    FellowCardComponent = __decorate([
        Component({
            selector: 'app-fellow-card',
            templateUrl: './fellow-card.component.html',
            styleUrls: ['./fellow-card.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog])
    ], FellowCardComponent);
    return FellowCardComponent;
}());
export { FellowCardComponent };
//# sourceMappingURL=fellow-card.component.js.map