var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../__services__/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/shared/alert.service';
var LoginRedirectComponent = /** @class */ (function () {
    function LoginRedirectComponent(route, authService, router, toastr) {
        this.route = route;
        this.authService = authService;
        this.router = router;
        this.toastr = toastr;
    }
    LoginRedirectComponent.prototype.ngOnInit = function () {
        var _this = this;
        var token = this.route.snapshot.queryParams.token;
        var loggedIn = this.authService.setAisToken(token);
        if (!loggedIn) {
            this.authService.unAuthorizeUser();
            this.navigateTo('/');
        }
        this.authService.login()
            .subscribe(function (data) {
            var response = data.data;
            if (response.isAuthorized) {
                _this.authService.authorizeUser(response);
                _this.navigateTo('/admin');
            }
        }, function (err) { return _this.handleEventError(err); });
    };
    LoginRedirectComponent.prototype.handleEventError = function (err) {
        if (err instanceof HttpErrorResponse && err.status === 401 || err.status === 500) {
            this.authService.unAuthorizeUser();
        }
        this.toastr.error('Something went wrong! try again');
        this.navigateTo('/');
    };
    LoginRedirectComponent.prototype.navigateTo = function (route) {
        this.router.navigate([route]);
    };
    LoginRedirectComponent = __decorate([
        Component({
            selector: 'app-login-redirect',
            templateUrl: './login-redirect.component.html',
            styleUrls: ['./login-redirect.component.scss']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            AuthService,
            Router,
            AlertService])
    ], LoginRedirectComponent);
    return LoginRedirectComponent;
}());
export { LoginRedirectComponent };
//# sourceMappingURL=login-redirect.component.js.map