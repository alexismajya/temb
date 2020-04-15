var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AddHomebaseComponent } from '../homebase/add-homebase/add-homebase.component';
import { Component } from '@angular/core';
import { NavMenuService } from '../__services__/nav-menu.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AppEventService } from '../../shared/app-events.service';
import { AddCabsModalComponent } from '../cabs/add-cab-modal/add-cab-modal.component';
import { AddProviderModalComponent } from '../providers/add-provider-modal/add-provider-modal.component';
import { AddUserModalComponent } from '../users/add-user-modal/add-user-modal.component';
import { DriverModalComponent } from '../providers/driver-modal/driver-modal.component';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
import { UserRoleModalComponent } from '../users/user-role-modal/user-role-modal.component';
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(navItem, dialog, auth, titleService, router, activatedRoute, appEventService, HbManager) {
        var _this = this;
        this.navItem = navItem;
        this.dialog = dialog;
        this.auth = auth;
        this.titleService = titleService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.appEventService = appEventService;
        this.HbManager = HbManager;
        this.badgeSize = 0;
        this.actionButton = '';
        this.toggleSideNav = function () {
            _this.navItem.toggle();
        };
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.auth.getCurrentUser();
        this.locations = this.getLocations(this.user.locations);
        this.homebase = this.HbManager.getHomeBase();
        this.getHeaderTitleFromRouteData();
        this.router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                _this.getHeaderTitleFromRouteData();
            }
        });
        this.updateHeaderSubscription = this.appEventService.subscribe('updateHeaderTitle', function (data) {
            var _a = data.content, headerTitle = _a.headerTitle, badgeSize = _a.badgeSize, actionButton = _a.actionButton, tooltipTitle = _a.tooltipTitle, providerId = _a.providerId;
            _this.headerTitle = headerTitle || _this.headerTitle;
            _this.tooltipTitle = tooltipTitle;
            _this.badgeSize = badgeSize || 0;
            _this.providerId = providerId;
            _this.actionButton = actionButton || _this.actionButton;
        });
        this.logoutModalSub = this.appEventService.subscribe('SHOW_LOGOUT_MODAL', function () { return _this.showLogoutModal.call(_this); });
    };
    HeaderComponent.prototype.getHeaderTitleFromRouteData = function () {
        var _this = this;
        var route = this.activatedRoute.firstChild;
        if (!route) {
            return;
        }
        while (route.firstChild) {
            route = route.firstChild;
        }
        if (route.outlet === 'primary') {
            route.data.subscribe(function (value) {
                _this.headerTitle = value['title'];
                _this.badgeSize = 0;
                _this.actionButton = '';
                _this.titleService.setTitle("Tembea - " + _this.headerTitle);
            });
        }
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        if (this.updateHeaderSubscription) {
            this.updateHeaderSubscription.unsubscribe();
        }
        if (this.logoutModalSub) {
            this.logoutModalSub.unsubscribe();
        }
        if (this.setHomebaseSub) {
            this.setHomebaseSub.unsubscribe();
        }
    };
    HeaderComponent.prototype.logout = function () {
        this.auth.logout();
        this.router.navigate(['/']);
    };
    HeaderComponent.prototype.showLogoutModal = function () {
        var _this = this;
        if (this.user) {
            var firstName = this.user.firstName;
            var dialogRef = this.dialog.open(ConfirmModalComponent, {
                width: '592px',
                backdropClass: 'modal-backdrop',
                panelClass: 'small-modal-panel-class',
                data: {
                    displayText: "logout, " + firstName,
                    confirmText: 'Logout'
                }
            });
            dialogRef.componentInstance.executeFunction.subscribe(function () {
                _this.logout();
            });
        }
    };
    HeaderComponent.prototype.handleAction = function () {
        var _this = this;
        var openModal = function (Modal) {
            _this.dialog.open(Modal, {
                minHeight: '568px', width: '592px', panelClass: 'add-cab-modal-panel-class',
                data: { providerId: _this.providerId }
            });
        };
        switch (this.actionButton) {
            case 'Add Provider':
                this.dialog.open(AddProviderModalComponent, {
                    maxHeight: '568px', width: '620px', panelClass: 'add-cab-modal-panel-class',
                });
                break;
            case 'Add User':
                this.dialog.open(AddUserModalComponent, {
                    maxHeight: '568px', width: '620px', panelClass: 'add-cab-modal-panel-class',
                });
                break;
            case 'Add Homebase':
                this.dialog.open(AddHomebaseComponent, {
                    maxHeight: '568px', width: '620px', panelClass: 'add-cab-modal-panel-class',
                });
                break;
            case 'Add a New Vehicle':
                openModal(AddCabsModalComponent);
                break;
            case 'Add Driver':
                openModal(DriverModalComponent);
                break;
            case 'Assign User Role':
                this.dialog.open(UserRoleModalComponent, {
                    maxHeight: '500px', width: '620px', panelClass: 'add-cab-modal-panel-class',
                });
                break;
        }
    };
    HeaderComponent.prototype.getLocations = function (locationArray) {
        var locations = locationArray.map(function (location) { return location.name; });
        return Array.from(new Set(locations));
    };
    HeaderComponent.prototype.changeHomebase = function (event) {
        var _this = this;
        this.HbManager.setHomebase(event.value);
        this.setHomebaseSub = this.appEventService.subscribe('setHomebase', function () {
            var currentUrl = _this.activatedRoute['_routerState'].snapshot.url;
            _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                _this.router.navigate([currentUrl]);
            });
        }, true);
    };
    HeaderComponent = __decorate([
        Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.scss']
        }),
        __metadata("design:paramtypes", [NavMenuService,
            MatDialog,
            AuthService,
            Title,
            Router,
            ActivatedRoute,
            AppEventService,
            HomeBaseManager])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map