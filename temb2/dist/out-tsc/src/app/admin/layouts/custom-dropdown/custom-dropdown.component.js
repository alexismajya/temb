var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
var CustomDropdownComponent = /** @class */ (function () {
    function CustomDropdownComponent() {
        this.selectedValue = 'None';
        this.handleSelected = new EventEmitter();
    }
    CustomDropdownComponent.prototype.ngOnInit = function () {
    };
    CustomDropdownComponent.prototype.handleDropdown = function () {
        this.handleSelected.emit(this.selectedValue);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CustomDropdownComponent.prototype, "dropdownItems", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CustomDropdownComponent.prototype, "handleSelected", void 0);
    CustomDropdownComponent = __decorate([
        Component({
            selector: 'app-custom-dropdown',
            templateUrl: './custom-dropdown.component.html',
            styleUrls: ['./custom-dropdown.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], CustomDropdownComponent);
    return CustomDropdownComponent;
}());
export { CustomDropdownComponent };
//# sourceMappingURL=custom-dropdown.component.js.map