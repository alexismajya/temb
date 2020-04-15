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
var AverageTripRatingsComponent = /** @class */ (function () {
    function AverageTripRatingsComponent() {
        this.title = 'Average Trip Rating';
    }
    AverageTripRatingsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AverageTripRatingsComponent.prototype, "avgRatings", void 0);
    AverageTripRatingsComponent = __decorate([
        Component({
            selector: 'app-average-trip-ratings',
            templateUrl: './average-trip-ratings.component.html',
            styleUrls: ['./average-trip-ratings.component.scss']
        })
    ], AverageTripRatingsComponent);
    return AverageTripRatingsComponent;
}());
export { AverageTripRatingsComponent };
//# sourceMappingURL=average-trip-ratings.component.js.map