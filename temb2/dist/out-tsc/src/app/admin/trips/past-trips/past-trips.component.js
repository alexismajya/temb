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
var PastTripsComponent = /** @class */ (function (_super) {
    __extends(PastTripsComponent, _super);
    function PastTripsComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tripType = 'Regular Trip';
        return _this;
    }
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], PastTripsComponent.prototype, "tripRequestType", void 0);
    PastTripsComponent = __decorate([
        Component({
            selector: 'app-past-trips',
            templateUrl: './past-trips.component.html',
            styleUrls: [
                '../../routes/routes-inventory/routes-inventory.component.scss',
                '../../trips/trip-itinerary/trip-itinerary.component.scss',
                '../../travel/airport-transfers/airport-transfers.component.scss'
            ],
        })
    ], PastTripsComponent);
    return PastTripsComponent;
}(TripItineraryComponent));
export { PastTripsComponent };
//# sourceMappingURL=past-trips.component.js.map