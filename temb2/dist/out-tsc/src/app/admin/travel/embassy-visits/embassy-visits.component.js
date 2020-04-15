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
import { Component } from '@angular/core';
import { TripNavComponent } from '../../trips/trip-nav/trip-nav.component';
var EmbassyVisitsComponent = /** @class */ (function (_super) {
    __extends(EmbassyVisitsComponent, _super);
    function EmbassyVisitsComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmbassyVisitsComponent = __decorate([
        Component({
            selector: 'app-embassy-visits',
            templateUrl: './embassy-visits.component.html',
            styleUrls: [
                '../../routes/routes-inventory/routes-inventory.component.scss',
                '../../trips/trip-itinerary/trip-itinerary.component.scss',
                '../airport-transfers/airport-transfers.component.scss'
            ]
        })
    ], EmbassyVisitsComponent);
    return EmbassyVisitsComponent;
}(TripNavComponent));
export { EmbassyVisitsComponent };
//# sourceMappingURL=embassy-visits.component.js.map