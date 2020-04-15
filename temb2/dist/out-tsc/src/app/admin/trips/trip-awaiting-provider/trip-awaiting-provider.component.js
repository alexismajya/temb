var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';
import { UpdateTripProviderModalComponent } from '../update-trip-provider-modal/update-trip-provider-modal.component';
var TripAwaitingProviderComponent = /** @class */ (function (_super) {
    __extends(TripAwaitingProviderComponent, _super);
    function TripAwaitingProviderComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tripProviders = [];
        _this.tripTableActionButtons = ['edit-icon', 'decline-icon'];
        return _this;
    }
    TripAwaitingProviderComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.providerService.getViableProviders()
            .subscribe(function (_a) {
            var data = _a.data;
            _this.tripProviders = data;
        });
        this.updateTripSubscription = this.appEventService.subscribe('updateTripInventory', function () {
            _this.getTrips();
        });
    };
    TripAwaitingProviderComponent.prototype.getProvidersNotAssignedToThisTrip = function (trip) {
        return this.tripProviders.filter(function (provider) { return provider.name !== trip.provider.name; });
    };
    TripAwaitingProviderComponent.prototype.openUpdateProviderModal = function (trip) {
        var providersNotAssignedToThisTrip = this.getProvidersNotAssignedToThisTrip(trip);
        this.updateProviderDialog = this.dialog.open(UpdateTripProviderModalComponent, {
            width: '492px',
            maxHeight: '600px',
            backdropClass: 'modal-backdrop',
            data: {
                tripProviderDetails: {
                    trips: this.tripRequests,
                    providers: providersNotAssignedToThisTrip,
                    activeTripId: trip.id
                }
            }
        });
    };
    TripAwaitingProviderComponent.prototype.isActionButton = function (elem) {
        for (var i = 0; i < this.tripTableActionButtons.length; i++) {
            var btnClass = this.tripTableActionButtons[i];
            if (elem.classList.contains(btnClass)) {
                return true;
            }
        }
        return false;
    };
    TripAwaitingProviderComponent.prototype.ngOnDestroy = function () {
        this.updateTripSubscription.unsubscribe();
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], TripAwaitingProviderComponent.prototype, "tripRequestType", void 0);
    TripAwaitingProviderComponent = __decorate([
        Component({
            selector: 'app-trip-awaiting-provider',
            templateUrl: './trip-awaiting-provider.component.html',
            styleUrls: [
                './trip-awaiting-provider.component.scss',
            ]
        })
    ], TripAwaitingProviderComponent);
    return TripAwaitingProviderComponent;
}(TripItineraryComponent));
export { TripAwaitingProviderComponent };
//# sourceMappingURL=trip-awaiting-provider.component.js.map