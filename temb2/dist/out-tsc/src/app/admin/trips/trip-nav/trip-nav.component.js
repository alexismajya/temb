var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
var TripNavComponent = /** @class */ (function () {
    function TripNavComponent(appEventService) {
        this.appEventService = appEventService;
        this.data = {};
    }
    TripNavComponent.prototype.ngOnInit = function () {
    };
    TripNavComponent.prototype.getSelectedTab = function (event) {
        var broadcastPayload = {};
        switch (event.tab.textLabel) {
            case 'Past Trips':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.pastTrips.totalItems };
                break;
            case 'Declined Trips':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.declinedTrips.totalItems };
                break;
            case 'Upcoming Trips':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.upcomingTrips.totalItems };
                break;
            case 'Awaiting Provider':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.awaitingProvider.totalItems };
                break;
            case 'Confirmed':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.confirmed.totalItems };
                break;
            case 'Awaiting Approval':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.awaitingApproval.totalItems };
                break;
            case 'Pending':
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.pending.totalItems };
                break;
            default:
                broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.all.totalItems };
                break;
        }
        this.appEventService.broadcast({ name: 'updateHeaderTitle', content: broadcastPayload });
    };
    TripNavComponent.prototype.tripsTotal = function (event) {
        this.data[event.tripRequestType] = event;
    };
    TripNavComponent = __decorate([
        Component({
            selector: 'app-trip-nav',
            templateUrl: './trip-nav.component.html',
            styleUrls: ['./trip-nav.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [AppEventService])
    ], TripNavComponent);
    return TripNavComponent;
}());
export { TripNavComponent };
//# sourceMappingURL=trip-nav.component.js.map