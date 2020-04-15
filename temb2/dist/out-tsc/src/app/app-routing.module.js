var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginRedirectComponent } from './auth/login-redirect/login-redirect.component';
import { HomeRouteActivatorGuard } from './home/home-route-activator.guard';
import { UniversalRouteActivatorGuard } from './shared/universal-route-activator.guard';
import { ProviderVerifyComponent } from './admin/providers/provider-verify/provider-verify.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProviderComponent } from './provider/provider.component';
var routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [HomeRouteActivatorGuard]
    },
    { path: 'login/:redirect', component: LoginRedirectComponent },
    { path: 'admin', pathMatch: 'full', redirectTo: '/admin/dashboard' },
    {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule',
        canActivate: [UniversalRouteActivatorGuard]
    },
    { path: 'trips/confirm', component: ProviderComponent },
    {
        path: 'provider/:token',
        component: ProviderVerifyComponent
    },
    { path: '**', component: PageNotFoundComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map