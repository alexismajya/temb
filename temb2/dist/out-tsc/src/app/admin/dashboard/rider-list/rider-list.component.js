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
var RiderListComponent = /** @class */ (function () {
    function RiderListComponent() {
    }
    RiderListComponent.prototype.ngOnInit = function () { };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], RiderListComponent.prototype, "title", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], RiderListComponent.prototype, "riders$", void 0);
    RiderListComponent = __decorate([
        Component({
            selector: 'app-rider-list',
            templateUrl: './rider-list.component.html',
            styleUrls: ['./rider-list.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], RiderListComponent);
    return RiderListComponent;
}());
export { RiderListComponent };
//# sourceMappingURL=rider-list.component.js.map