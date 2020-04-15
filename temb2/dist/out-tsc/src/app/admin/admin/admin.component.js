var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { Router, NavigationEnd } from '@angular/router';
import { interval } from 'rxjs';
import { NavMenuService } from '../__services__/nav-menu.service';
import * as mainRoutes from './main-routes.json';
import { HeaderComponent } from '../header/header.component';
import { AppEventService } from '../../shared/app-events.service';
import { GoogleAnalyticsService } from '../__services__/google-analytics.service';
import { AuthService } from '../../auth/__services__/auth.service';
var AdminComponent = /** @class */ (function () {
    function AdminComponent(events, analytics, iconRegistry, sanitizer, media, router, navMenuService, cd, authService) {
        var _this = this;
        this.events = events;
        this.analytics = analytics;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.media = media;
        this.router = router;
        this.navMenuService = navMenuService;
        this.cd = cd;
        this.authService = authService;
        this.position = 'side';
        this.activeRoute = '';
        this.loading = false;
        this.value = 0;
        this.counter = interval(500);
        this.responsiveLogout = function () {
            _this.events.broadcast({
                name: 'SHOW_LOGOUT_MODAL'
            });
        };
        this.registerIcons = function () {
            var logos = [
                { name: 'logo', url: 'assets/logo.svg' },
                { name: 'dashboard', url: 'assets/sidebar-icons/ic_active_dashboard.svg' },
                { name: 'dashboard-inactive', url: 'assets/sidebar-icons/ic_inactive_dashboard.svg' },
                { name: 'routes', url: 'assets/sidebar-icons/ic_active_routes.svg' },
                { name: 'routes-inactive', url: 'assets/sidebar-icons/ic_inactive_routes.svg' },
                { name: 'trips', url: 'assets/sidebar-icons/ic_active_location.svg' },
                { name: 'trips-inactive', url: 'assets/sidebar-icons/ic_inactive_location.svg' },
                { name: 'travel', url: 'assets/sidebar-icons/ic_active_travel.svg' },
                { name: 'travel-inactive', url: 'assets/sidebar-icons/ic_inactive_travel.svg' },
                { name: 'cabs', url: 'assets/sidebar-icons/ic_active_cabs.svg' },
                { name: 'cabs-inactive', url: 'assets/sidebar-icons/ic_inactive_cabs.svg' },
                { name: 'settings', url: 'assets/sidebar-icons/ic_active_settings.svg' },
                { name: 'settings-inactive', url: 'assets/sidebar-icons/ic_inactive_settings.svg' },
                { name: 'users', url: 'assets/sidebar-icons/ic_active_users.svg' },
                { name: 'users-inactive', url: 'assets/sidebar-icons/ic_inactive_users.svg' },
                { name: 'homebases', url: 'assets/sidebar-icons/ic_active_homebases.svg' },
                { name: 'homebases-inactive', url: 'assets/sidebar-icons/ic_inactive_homebases.svg' },
            ];
            logos.forEach(function (item) {
                _this.iconRegistry.addSvgIcon(item.name, _this.sanitizer.bypassSecurityTrustResourceUrl(item.url));
            });
        };
        this.createMediaWatcher = function () {
            _this.watcher = _this.media.asObservable().subscribe(function (changes) {
                changes.map(function (change) {
                    if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
                        _this.navMenuService.close();
                        _this.position = 'over';
                    }
                    else {
                        _this.navMenuService.open();
                        _this.position = 'side';
                    }
                });
            });
        };
        this.menuClicked = function (shouldCloseWhenClicked) {
            if (_this.position === 'over' && shouldCloseWhenClicked) {
                _this.navMenuService.close();
            }
        };
        this.registerIcons();
        this.router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                _this.activeRoute = event.url;
                _this.analytics.sendPageView(_this.activeRoute);
            }
        });
        this.user = this.authService.getCurrentUser();
        this.routes = mainRoutes.routes.filter(function (route) { return _this.canAccess(route.allow); });
    }
    AdminComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.navMenuService.addSubscriber(function (data) {
            _this.loading = data;
            _this.counterSubscription = _this.counter.subscribe(function () {
                _this.value = _this.value + 10;
                if (_this.value === 250) {
                    _this.counterSubscription.unsubscribe();
                }
            });
        });
    };
    AdminComponent.prototype.ngAfterViewInit = function () {
        this.navMenuService.setSidenav(this.sidenav);
        this.createMediaWatcher();
        this.cd.detectChanges();
    };
    AdminComponent.prototype.ngOnDestroy = function () {
        if (this.watcher) {
            this.watcher.unsubscribe();
        }
    };
    AdminComponent.prototype.canAccess = function (roles) {
        return roles ? roles.includes(this.user.roles[0]) : true;
    };
    __decorate([
        ViewChild('sidenav'),
        __metadata("design:type", MatSidenav)
    ], AdminComponent.prototype, "sidenav", void 0);
    __decorate([
        ViewChild(HeaderComponent),
        __metadata("design:type", HeaderComponent)
    ], AdminComponent.prototype, "header", void 0);
    AdminComponent = __decorate([
        Component({
            selector: 'app-admin',
            templateUrl: './admin.component.html',
            styleUrls: ['./admin.component.css']
        }),
        __metadata("design:paramtypes", [AppEventService,
            GoogleAnalyticsService,
            MatIconRegistry,
            DomSanitizer,
            MediaObserver,
            Router,
            NavMenuService,
            ChangeDetectorRef,
            AuthService])
    ], AdminComponent);
    return AdminComponent;
}());
export { AdminComponent };
//# sourceMappingURL=admin.component.js.map