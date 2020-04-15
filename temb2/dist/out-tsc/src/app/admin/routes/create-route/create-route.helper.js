var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { takeOffTimeFormat } from './createRouteUtils';
import { AlertService } from '../../../shared/alert.service';
var CreateRouteHelper = /** @class */ (function () {
    function CreateRouteHelper(toastr) {
        this.toastr = toastr;
    }
    CreateRouteHelper.prototype.incrementCapacity = function (fieldValue) {
        var newValue = parseInt(fieldValue, 10) + 1;
        return newValue;
    };
    CreateRouteHelper.prototype.decrementCapacity = function (fieldValue) {
        var value = parseInt(fieldValue, 10);
        if (value < 2) {
            return 1;
        }
        var newValue = value - 1;
        return newValue;
    };
    CreateRouteHelper.prototype.createNewRouteRequestObject = function (formValues, destinationFormInput, coordinates, provider) {
        var requestObject = __assign({}, formValues);
        requestObject.destination = { address: destinationFormInput, coordinates: coordinates };
        requestObject.provider = provider;
        return requestObject;
    };
    CreateRouteHelper.prototype.validateFormEntries = function (formValues) {
        var takeOffTime = formValues.takeOffTime, capacity = formValues.capacity;
        var errors = [];
        errors.push.apply(errors, this.validateInputFormat(takeOffTime, takeOffTimeFormat, 'Take-off Time'));
        errors.push.apply(errors, this.validateCapacity(capacity, 'Capacity'));
        return errors;
    };
    CreateRouteHelper.prototype.validateInputFormat = function (value, regex, field) {
        if (!regex.test(value)) {
            return [field + " is invalid"];
        }
        return [];
    };
    CreateRouteHelper.prototype.validateCapacity = function (value, field) {
        if (parseInt(value, 10) < 1) {
            return [field + " must be an integer greater than zero"];
        }
        return [];
    };
    CreateRouteHelper.prototype.notifyUser = function (messages, notificationType) {
        var _this = this;
        if (notificationType === void 0) { notificationType = 'error'; }
        messages.forEach(function (message) { return _this.toastr[notificationType](message); });
    };
    CreateRouteHelper = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertService])
    ], CreateRouteHelper);
    return CreateRouteHelper;
}());
export { CreateRouteHelper };
//# sourceMappingURL=create-route.helper.js.map