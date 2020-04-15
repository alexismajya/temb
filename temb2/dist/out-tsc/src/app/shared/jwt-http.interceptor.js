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
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/__services__/auth.service';
import { AlertService } from './alert.service';
import { HomeBaseManager } from './homebase.manager';
import { environment } from 'src/environments/environment';
var JwtHttpInterceptor = /** @class */ (function () {
    function JwtHttpInterceptor(authService, router, toastr, hbManager) {
        this.authService = authService;
        this.router = router;
        this.toastr = toastr;
        this.hbManager = hbManager;
    }
    JwtHttpInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        var tembeaToken = this.authService.tembeaToken;
        if (!request.url.includes('/auth/verify') && tembeaToken) {
            var homebaseid = this.hbManager.getHomebaseId();
            var authReq = request.clone({ setHeaders: {
                    Authorization: tembeaToken, homebaseid: homebaseid, teamurl: environment.teamUrl
                } });
            return next.handle(authReq).pipe(catchError(function (error) {
                if (error.status === 401) {
                    _this.toastr.error('Unauthorized access');
                }
                else if (error.status === 500) {
                    _this.toastr.error('Something went wrong. Maybe try again?');
                }
                return throwError(error);
            }));
        }
        return next.handle(request);
    };
    JwtHttpInterceptor = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthService,
            Router,
            AlertService,
            HomeBaseManager])
    ], JwtHttpInterceptor);
    return JwtHttpInterceptor;
}());
export { JwtHttpInterceptor };
//# sourceMappingURL=jwt-http.interceptor.js.map