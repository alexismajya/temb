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
import { MatDialog } from '@angular/material';
import { RouteRequestService } from '../../__services__/route-request.service';
import { AuthService } from '../../../auth/__services__/auth.service';
import { RouteApproveDeclineModalComponent } from '../route-approve-decline-modal/route-approve-decline-modal.component';
import { AisService } from '../../__services__/ais.service';
import { AppEventService } from '../../../shared/app-events.service';
var RouteRequestsComponent = /** @class */ (function () {
    function RouteRequestsComponent(routeService, dialog, authService, appEventService, userData) {
        var _this = this;
        this.routeService = routeService;
        this.dialog = dialog;
        this.authService = authService;
        this.appEventService = appEventService;
        this.userData = userData;
        this.routes = [];
        this.onClickRouteBox = function (index, route) {
            _this.activeRouteIndex = index;
            _this.activeRouteRequest = route;
            if (route) {
                _this.getRequesterData(route.engagement.fellow.email);
            }
        };
        this.handleResponse = function (val) {
            _this.routes = val;
            var routeRequest;
            routeRequest = _this.routes[0];
            _this.onClickRouteBox(0, _this.routes[0]);
            if (routeRequest) {
                _this.getRequesterData(routeRequest.engagement.fellow.email);
            }
            _this.appEventService.broadcast({
                name: 'updateHeaderTitle',
                content: { badgeSize: val.length, headerTitle: 'Route Requests' }
            });
        };
        this.user = this.authService.getCurrentUser();
    }
    RouteRequestsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadAllRequest();
        this.routesSubscription = this.appEventService
            .subscribe('updateRouteRequestStatus', function () {
            _this.loadAllRequest();
        });
    };
    RouteRequestsComponent.prototype.loadAllRequest = function () {
        this.routeService.getAllRequests().subscribe(this.handleResponse);
    };
    RouteRequestsComponent.prototype.ngOnDestroy = function () {
        if (this.routesSubscription) {
            this.routesSubscription.unsubscribe();
        }
    };
    RouteRequestsComponent.prototype.isRouteActive = function (idx) {
        return this.activeRouteIndex === idx;
    };
    RouteRequestsComponent.prototype.getCurrentRoute = function () {
        return this.activeRouteRequest;
    };
    RouteRequestsComponent.prototype.decline = function () {
        this.openDialogModal(true);
    };
    RouteRequestsComponent.prototype.approve = function () {
        this.openDialogModal();
    };
    RouteRequestsComponent.prototype.getRequesterData = function (email) {
        var _this = this;
        this.userData.getResponse(email)
            .subscribe(function (data) {
            _this.requesterData = data;
        });
    };
    RouteRequestsComponent.prototype.openDialogModal = function (decline) {
        var routesRequests = this.activeRouteRequest;
        var data = {
            status: (decline) ? 1 : 0,
            requesterFirstName: routesRequests.engagement.fellow.name,
            routeRequestId: routesRequests.id
        };
        this.approvalDeclineDialog = this.dialog.open(RouteApproveDeclineModalComponent, {
            width: '592px',
            backdropClass: 'modal-backdrop',
            panelClass: 'route-decline-modal-panel-class',
            data: data
        });
    };
    RouteRequestsComponent = __decorate([
        Component({
            selector: 'app-route-requests',
            templateUrl: './route-requests.component.html',
            styleUrls: ['./route-requests.component.scss']
        }),
        __metadata("design:paramtypes", [RouteRequestService,
            MatDialog,
            AuthService,
            AppEventService,
            AisService])
    ], RouteRequestsComponent);
    return RouteRequestsComponent;
}());
export { RouteRequestsComponent };
//# sourceMappingURL=route-requests.component.js.map