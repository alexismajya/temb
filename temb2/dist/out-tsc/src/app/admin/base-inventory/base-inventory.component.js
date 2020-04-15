var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
var BaseInventoryComponent = /** @class */ (function () {
    function BaseInventoryComponent(appEventsService, activatedRoute, dialog) {
        this.appEventsService = appEventsService;
        this.activatedRoute = activatedRoute;
        this.dialog = dialog;
        this.currentOptions = -1;
        this.pageNo = 1;
        this.sort = 'name,asc,batch,asc';
        this.pageSize = ITEMS_PER_PAGE;
        this.isLoading = true;
    }
    BaseInventoryComponent.prototype.ngOnInit = function () {
    };
    BaseInventoryComponent.prototype.getInventory = function () {
        this.isLoading = false;
        this.currentOptions = -1;
        this.loadData(this.pageSize, this.pageNo, this.sort, this.providerId);
    };
    BaseInventoryComponent.prototype.updateInventory = function (data) {
        var providerName = data.providerName, providerId = data.providerId;
        this.providerName = providerName;
        this.providerId = providerId;
        if (!this.providerId) {
            return;
        }
        this.loadData(this.pageSize, this.pageNo, this.sort, this.providerId);
    };
    BaseInventoryComponent.prototype.loadData = function (size, page, sort, providerId) {
        throw new Error('Not implemented');
    };
    BaseInventoryComponent.prototype.emitData = function (emitter) {
        emitter.emit({
            totalItems: this.totalItems,
            providerName: this.providerName,
            actionButton: this.createText,
            providerTabRequestType: this.providerTabRequestType
        });
    };
    BaseInventoryComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getInventory();
    };
    BaseInventoryComponent.prototype.showOptions = function (cabId) {
        this.currentOptions = this.currentOptions === cabId ? -1 : cabId;
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], BaseInventoryComponent.prototype, "providerTabRequestType", void 0);
    BaseInventoryComponent = __decorate([
        Component({
            selector: 'app-base-inventory',
            templateUrl: './base-inventory.component.html',
            styleUrls: ['./base-inventory.component.scss']
        }),
        __metadata("design:paramtypes", [AppEventService,
            ActivatedRoute,
            MatDialog])
    ], BaseInventoryComponent);
    return BaseInventoryComponent;
}());
export { BaseInventoryComponent };
//# sourceMappingURL=base-inventory.component.js.map