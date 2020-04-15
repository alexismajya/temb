var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var NavMenuService = /** @class */ (function () {
    function NavMenuService() {
        this.progressListener = new Subject();
    }
    NavMenuService.prototype.setSidenav = function (sidenav) {
        this.sidenav = sidenav;
    };
    NavMenuService.prototype.showProgress = function () {
        return this.progressListener.next(true);
    };
    NavMenuService.prototype.stopProgress = function () {
        return this.progressListener.next(false);
    };
    NavMenuService.prototype.open = function () {
        return this.sidenav.open();
    };
    NavMenuService.prototype.close = function () {
        return this.sidenav.close();
    };
    NavMenuService.prototype.toggle = function () {
        this.sidenav.toggle();
    };
    NavMenuService.prototype.addSubscriber = function (subscriber) {
        return this.progressListener.subscribe(subscriber);
    };
    NavMenuService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], NavMenuService);
    return NavMenuService;
}());
export { NavMenuService };
//# sourceMappingURL=nav-menu.service.js.map