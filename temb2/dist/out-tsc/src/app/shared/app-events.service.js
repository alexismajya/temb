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
import { Observable } from 'rxjs';
import { filter, share, first } from 'rxjs/operators';
var AppEventService = /** @class */ (function () {
    function AppEventService() {
        var _this = this;
        this.observable = Observable.create(function (observer) {
            _this.observer = observer;
        }).pipe(share());
    }
    AppEventService.prototype.broadcast = function (event) {
        if (this.observer != null) {
            this.observer.next(event);
        }
    };
    AppEventService.prototype.subscribe = function (eventName, callback, firstOne) {
        if (firstOne) {
            return this.observable
                .pipe(filter(function (event) {
                return event.name === eventName;
            }), first())
                .subscribe(callback);
        }
        return this.observable
            .pipe(filter(function (event) {
            return event.name === eventName;
        }))
            .subscribe(callback);
    };
    AppEventService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], AppEventService);
    return AppEventService;
}());
export { AppEventService };
//# sourceMappingURL=app-events.service.js.map