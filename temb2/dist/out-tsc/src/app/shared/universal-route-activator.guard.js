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
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HomeBaseManager } from './homebase.manager';
var UniversalRouteActivatorGuard = /** @class */ (function () {
    function UniversalRouteActivatorGuard(authService, router, cookieService, hbManager) {
        this.authService = authService;
        this.router = router;
        this.cookieService = cookieService;
        this.hbManager = hbManager;
    }
    UniversalRouteActivatorGuard.prototype.canActivate = function (next, state) {
        return this.checkLogin();
    };
    UniversalRouteActivatorGuard.prototype.checkLogin = function () {
        var isAuthenticated = this.authService.isAuthenticated;
        var token = this.cookieService.get('tembea_token');
        var helper = new JwtHelperService();
        var isTokenExpired = helper.isTokenExpired(token);
        if (!isAuthenticated && token && !isTokenExpired) {
            try {
                var userInfo = void 0;
                (userInfo = helper.decodeToken(token).userInfo);
                this.authService.setCurrentUser(userInfo);
                this.authService.tembeaToken = token;
                this.authService.setupClock();
                this.authService.isAuthenticated = true;
                this.authService.isAuthorized = true;
                this.hbManager.setHomebase(userInfo.locations[0].name);
            }
            catch (err) {
                return this.redirectHome();
            }
        }
        this.deleteTokenIfExpired(isTokenExpired);
        return this.authService.isAuthenticated && !isTokenExpired
            ? true
            : this.redirectHome();
    };
    UniversalRouteActivatorGuard.prototype.deleteTokenIfExpired = function (isTokenExpired) {
        if (isTokenExpired) {
            this.cookieService.delete('tembea_token');
        }
    };
    UniversalRouteActivatorGuard.prototype.redirectHome = function () {
        this.router.navigate(['/']);
        return false;
    };
    UniversalRouteActivatorGuard = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [AuthService,
            Router,
            CookieService,
            HomeBaseManager])
    ], UniversalRouteActivatorGuard);
    return UniversalRouteActivatorGuard;
}());
export { UniversalRouteActivatorGuard };
//# sourceMappingURL=universal-route-activator.guard.js.map