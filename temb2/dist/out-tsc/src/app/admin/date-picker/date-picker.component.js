var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
var DatePickerComponent = /** @class */ (function () {
    function DatePickerComponent() {
        this.dateFormat = 'YYYY-MM-DD';
        this.placeholder = 'Select Date';
        this.selectedDateChange = new EventEmitter();
        this.model = { selectedDate: null };
    }
    DatePickerComponent.prototype.ngOnInit = function () {
        this.model.selectedDate = this.initialDate || new Date(Date.now()).toISOString();
        this.selectedDateChange.emit(moment(this.model.selectedDate).format('YYYY-MM-DD'));
    };
    DatePickerComponent.prototype.update = function (event) {
        var date = moment(event.value.toISOString());
        this.model.selectedDate = date.format('YYYY-MM-DD');
        this.selectedDateChange.emit(date.format(this.dateFormat));
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], DatePickerComponent.prototype, "dateFormat", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], DatePickerComponent.prototype, "placeholder", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], DatePickerComponent.prototype, "selectedDateChange", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], DatePickerComponent.prototype, "maxDate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], DatePickerComponent.prototype, "minDate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], DatePickerComponent.prototype, "previous", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DatePickerComponent.prototype, "type", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], DatePickerComponent.prototype, "initialDate", void 0);
    DatePickerComponent = __decorate([
        Component({
            selector: 'app-date-picker',
            templateUrl: './date-picker.component.html',
            styleUrls: ['./date-picker.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [])
    ], DatePickerComponent);
    return DatePickerComponent;
}());
export { DatePickerComponent };
//# sourceMappingURL=date-picker.component.js.map