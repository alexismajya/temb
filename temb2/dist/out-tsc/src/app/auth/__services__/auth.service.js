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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { CookieService } from './ngx-cookie-service.service';
import { ClockService } from './clock.service';
import { AlertService } from '../../shared/alert.service';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
var AuthService = /** @class */ (function () {
    function AuthService(http, cookieService, clock, router, toastr, dialog, hbManager) {
        this.http = http;
        this.cookieService = cookieService;
        this.clock = clock;
        this.router = router;
        this.toastr = toastr;
        this.dialog = dialog;
        this.hbManager = hbManager;
        this.authUrl = environment.tembeaBackEndUrl + "/api/v1/auth/verify";
        this.isAuthenticated = false;
        this.isAuthorized = true;
    }
    AuthService_1 = AuthService;
    AuthService.prototype.getCurrentUser = function () {
        if (this.currentUser) {
            return __assign({}, this.currentUser);
        }
        return null;
    };
    AuthService.prototype.setCurrentUser = function (user) {
        this.currentUser = __assign({}, user);
    };
    AuthService.prototype.initClock = function () {
        var _this = this;
        this.clockSubscription = this.clock.getClock().subscribe(function (data) {
            var elapsedTime = (data - AuthService_1.lastActiveTime) / (1000 * 60);
            if (elapsedTime >= 30) {
                _this.logout();
                _this.router.navigate(['/']);
            }
        });
    };
    AuthService.prototype.login = function () {
        var setHeaders = new HttpHeaders({
            Authorization: this.andelaAuthServiceToken
        });
        return this.http.get(this.authUrl, { headers: setHeaders });
    };
    AuthService.prototype.logout = function () {
        this.cookieService.delete('jwt_token', '/');
        this.cookieService.delete('tembea_token', '/');
        localStorage.removeItem('HOMEBASE_ID');
        localStorage.removeItem('HOMEBASE_NAME');
        this.isAuthenticated = false;
        this.clockSubscription.unsubscribe();
        this.dialog.closeAll();
    };
    AuthService.prototype.authorizeUser = function (response) {
        var token = response.token, userInfo = response.userInfo;
        this.isAuthorized = true;
        this.isAuthenticated = true;
        this.tembeaToken = token;
        this.setCurrentUser(userInfo);
        this.toastr.success('Login Successful');
        this.cookieService.set('tembea_token', "" + token, 0.125, '/');
        this.hbManager.storeHomebase(userInfo.locations[0]);
        this.setupClock();
    };
    AuthService.prototype.setAisToken = function (token) {
        this.andelaAuthServiceToken = token || this.cookieService.get('jwt-token');
        if (this.andelaAuthServiceToken) {
            return true;
        }
    };
    AuthService.prototype.setupClock = function () {
        AuthService_1.lastActiveTime = Date.now();
        this.initClock();
    };
    AuthService.prototype.unAuthorizeUser = function () {
        this.isAuthorized = false;
    };
    var AuthService_1;
    AuthService = AuthService_1 = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient,
            CookieService,
            ClockService,
            Router,
            AlertService,
            MatDialog,
            HomeBaseManager])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map