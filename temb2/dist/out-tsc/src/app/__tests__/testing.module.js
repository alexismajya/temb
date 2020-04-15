var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth/__services__/auth.service';
import { ClockService } from '../auth/__services__/clock.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { TOASTR_TOKEN } from '../shared/toastr.service';
import { mockToastr } from '../shared/__mocks__/mockData';
import { SpyObject } from '../__mocks__/SpyObject';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AisService } from '../admin/__services__/ais.service';
import { AlertService } from '../shared/alert.service';
var AppTestModule = /** @class */ (function () {
    function AppTestModule() {
    }
    AppTestModule = __decorate([
        NgModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: new SpyObject(AuthService)
                },
                {
                    provide: AisService,
                    useValue: new SpyObject(AisService)
                },
                {
                    provide: ClockService,
                    useValue: new SpyObject(ClockService)
                },
                {
                    provide: MatDialogRef,
                    useValue: new SpyObject(MatDialogRef)
                },
                {
                    provide: CookieService,
                    useValue: new SpyObject(CookieService)
                },
                {
                    provide: Router,
                    useValue: new SpyObject(Router)
                },
                {
                    provide: AlertService,
                    useValue: new SpyObject(AlertService)
                },
                {
                    provide: TOASTR_TOKEN,
                    useValue: mockToastr
                },
            ],
            imports: [HttpClientTestingModule]
        })
    ], AppTestModule);
    return AppTestModule;
}());
export { AppTestModule };
//# sourceMappingURL=testing.module.js.map