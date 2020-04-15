var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClockService } from './auth/__services__/clock.service';
import { ActiveTimeDirective } from './active-time.directive';
import { HomeComponent } from './home/home.component';
import { TOASTR_TOKEN } from './shared/toastr.service';
import { CookieService } from './auth/__services__/ngx-cookie-service.service';
import { UnauthorizedLoginComponent } from './auth/unauthorized-login/unauthorized-login.component';
import { LoginRedirectComponent } from './auth/login-redirect/login-redirect.component';
import { AuthService } from './auth/__services__/auth.service';
import { AngularMaterialModule } from './angular-material.module';
import { JwtHttpInterceptor } from './shared/jwt-http.interceptor';
import { ChartsModule } from 'ng2-charts';
import { AlertService } from './shared/alert.service';
import { errorHandlerFactory } from './shared/bugsnag.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeBaseService } from './shared/homebase.service';
import { HomeBaseManager } from './shared/homebase.manager';
import { ProviderComponent } from './provider/provider.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ProviderVerifyComponent } from './admin/providers/provider-verify/provider-verify.component';
import { SocketioService } from './shared/socketio.service';
var toastr = window['toastr'];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                ActiveTimeDirective,
                AppComponent,
                HomeComponent,
                UnauthorizedLoginComponent,
                LoginRedirectComponent,
                ProviderVerifyComponent,
                PageNotFoundComponent,
                ProviderComponent,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                AppRoutingModule,
                BrowserModule,
                BrowserAnimationsModule,
                HttpClientModule,
                AngularMaterialModule,
                ChartsModule,
                ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
            ],
            providers: [
                AuthService,
                AlertService,
                CookieService,
                ClockService,
                HomeBaseService,
                HomeBaseManager,
                { provide: TOASTR_TOKEN, useValue: toastr },
                { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
                { provide: ErrorHandler, useFactory: errorHandlerFactory },
                { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
                JwtHelperService,
                SocketioService
            ],
            entryComponents: [
                UnauthorizedLoginComponent,
            ],
            bootstrap: [AppComponent],
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map