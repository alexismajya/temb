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
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TripRequestService } from '../../__services__/trip-request.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { TripApproveDeclineModalComponent } from '../trip-approve-decline-modal/trip-approve-decline-modal.component';
import { AppEventService } from 'src/app/shared/app-events.service';
var PendingRequestComponent = /** @class */ (function () {
    function PendingRequestComponent(tripRequestService, activatedRoute, dialog, appEventService) {
        var _this = this;
        this.tripRequestService = tripRequestService;
        this.activatedRoute = activatedRoute;
        this.dialog = dialog;
        this.appEventService = appEventService;
        this.tripRequests = [];
        this.pageSize = ITEMS_PER_PAGE;
        this.page = 1;
        this.routeData = this.activatedRoute.data.subscribe(function (data) {
            var pagingParams = data.pagingParams;
            if (pagingParams) {
                _this.page = pagingParams.page;
                _this.previousPage = pagingParams.page;
            }
        });
    }
    PendingRequestComponent.prototype.loadAll = function () {
        var _this = this;
        var _a = this, page = _a.page, size = _a.pageSize;
        this.tripRequestService.query({ page: page, size: size, status: 'Approved' }).subscribe(function (tripData) {
            _this.tripRequests = tripData.trips;
            _this.totalItems = _this.tripRequests.length;
            _this.appEventService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: _this.totalItems } });
        });
    };
    PendingRequestComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadAll();
        this.routeData = this.appEventService
            .subscribe('reInitializeTripRequest', function () {
            _this.loadAll();
        });
    };
    PendingRequestComponent.prototype.confirm = function (tripRequest) {
        this.openDialogModal(tripRequest);
    };
    PendingRequestComponent.prototype.decline = function (tripRequest) {
        this.openDialogModal(tripRequest, true);
    };
    PendingRequestComponent.prototype.openDialogModal = function (tripRequest, decline) {
        var data = {
            status: (decline) ? 1 : 0,
            requesterFirstName: tripRequest.requester.name,
            tripId: tripRequest.id
        };
        this.approvalDeclineDialog = this.dialog.open(TripApproveDeclineModalComponent, {
            width: '592px',
            maxHeight: '600px',
            backdropClass: 'modal-backdrop',
            panelClass: 'route-decline-modal-panel-class',
            data: data
        });
    };
    PendingRequestComponent.prototype.ngOnDestroy = function () {
        this.routeData.unsubscribe();
    };
    PendingRequestComponent.prototype.updatePage = function (page) {
        this.page = page;
        this.loadAll();
    };
    PendingRequestComponent = __decorate([
        Component({
            selector: 'app-pending-request',
            templateUrl: './pending-request.component.html',
            styleUrls: ['./pending-request.component.scss',
                '../../routes/routes-inventory/routes-inventory.component.scss',
                '../../travel/airport-transfers/airport-transfers.component.scss'
            ],
        }),
        __metadata("design:paramtypes", [TripRequestService,
            ActivatedRoute,
            MatDialog,
            AppEventService])
    ], PendingRequestComponent);
    return PendingRequestComponent;
}());
export { PendingRequestComponent };
//# sourceMappingURL=pending-request.component.js.map