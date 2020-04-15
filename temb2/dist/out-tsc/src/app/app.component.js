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
import { fromEvent } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { AlertService } from './shared/alert.service';
import { GoogleAnalyticsService } from './admin/__services__/google-analytics.service';
import { SocketioService } from './shared/socketio.service';
import notificationHelper from './utils/notificationHelper';
import { AuthService } from './auth/__services__/auth.service';
import { environment } from 'src/environments/environment';
var AppComponent = /** @class */ (function () {
    function AppComponent(toastr, analytics, socketService, swPush, authService) {
        this.toastr = toastr;
        this.analytics = analytics;
        this.socketService = socketService;
        this.swPush = swPush;
        this.authService = authService;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.offlineEvent = fromEvent(window, 'offline');
        this.offlineSubscription = this.offlineEvent.subscribe(function () {
            _this.toastr.error('You seem to be offline.');
        });
        this.analytics.init();
        if (this.swPush.isEnabled) {
            this.swPush
                .requestSubscription({
                serverPublicKey: environment.VAPID_PUBLIC_KEY
            });
            // tslint:disable-next-line: no-unused-expression
            new notificationHelper(this.socketService, this.swPush, this.authService);
        }
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.offlineSubscription.unsubscribe();
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styles: [
                "\n      div {\n        height: 100%;\n        width: 100%;\n      }\n    "
            ]
        }),
        __metadata("design:paramtypes", [AlertService,
            GoogleAnalyticsService,
            SocketioService,
            SwPush,
            AuthService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map