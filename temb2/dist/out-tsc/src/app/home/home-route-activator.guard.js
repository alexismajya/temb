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
import { Router } from '@angular/router';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { AuthService } from '../auth/__services__/auth.service';
import { MatDialog } from '@angular/material';
import { UnauthorizedLoginComponent } from '../auth/unauthorized-login/unauthorized-login.component';
var HomeRouteActivatorGuard = /** @class */ (function () {
    function HomeRouteActivatorGuard(cookieService, router, authService, dialog) {
        this.cookieService = cookieService;
        this.router = router;
        this.authService = authService;
        this.dialog = dialog;
    }
    HomeRouteActivatorGuard.prototype.canActivate = function (next, state) {
        var _a = this.authService, isAuthorized = _a.isAuthorized, isAuthenticated = _a.isAuthenticated;
        if (!isAuthorized) {
            this.dialog.open(UnauthorizedLoginComponent, { panelClass: 'tembea-modal', backdropClass: 'tembea-backdrop' });
        }
        var andelaToken = this.cookieService.get('jwt_token');
        var tembeaToken = this.cookieService.get('tembea_token');
        if (tembeaToken) {
            this.router.navigate(['/admin']);
            return true;
        }
        if (!isAuthenticated && isAuthorized && andelaToken) {
            this.router.navigate(["/login/redirect"], { queryParams: { token: andelaToken } });
            return false;
        }
        return true;
    };
    HomeRouteActivatorGuard = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [CookieService,
            Router,
            AuthService,
            MatDialog])
    ], HomeRouteActivatorGuard);
    return HomeRouteActivatorGuard;
}());
export { HomeRouteActivatorGuard };
//# sourceMappingURL=home-route-activator.guard.js.map