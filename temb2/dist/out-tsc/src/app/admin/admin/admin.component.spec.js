var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { of } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { NavMenuService } from '../__services__/nav-menu.service';
import { CookieService } from '../../auth/__services__/ngx-cookie-service.service';
import { ClockService } from '../../auth/__services__/clock.service';
import { toastrMock } from '../routes/__mocks__/create-route';
import { AlertService } from '../../shared/alert.service';
import { HeaderComponent } from '../header/header.component';
import { AppEventService } from 'src/app/shared/app-events.service';
import { FormsModule } from '@angular/forms';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
import { SpyObject } from 'src/app/__mocks__/SpyObject';
import { AuthService } from 'src/app/auth/__services__/auth.service';
var sideNavMock = new NavMenuService();
var appEventsMock = {
    broadcast: jest.fn()
};
var hbManagerMock = {};
var authServiceMock = {
    getCurrentUser: function () { return ({
        roles: [
            'Super Admin'
        ]
    }); }
};
describe('SideBarComponent', function () {
    var component;
    var fixture;
    var routerMock = {
        events: of(new NavigationEnd(0, '/', null))
    };
    var router;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AdminComponent],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                AngularMaterialModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: AdminComponent },
                    { path: 'admin/trips/pending', component: AdminComponent },
                ]),
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: CookieService, useValue: new SpyObject(CookieService) },
                { provide: ClockService, useValue: new SpyObject(ClockService) },
                { provide: RouterModule, useValue: routerMock },
                { provide: NavMenuService, useValue: sideNavMock },
                { provide: AlertService, useValue: toastrMock },
                { provide: HomeBaseManager, useValue: hbManagerMock },
                { provide: AuthService, useValue: authServiceMock }
            ]
        });
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        fixture.detectChanges();
    }));
    beforeEach(function () {
        jest.setTimeout(10000);
    });
    it('should create sideNav Component', function () {
        expect(component).toBeTruthy();
    });
    it('should click menu and open trips request', function () { return __awaiter(_this, void 0, void 0, function () {
        var prop;
        return __generator(this, function (_a) {
            prop = fixture.debugElement.query(By.css('#trips a'));
            jest.spyOn(component, 'menuClicked');
            prop.triggerEventHandler('click', {});
            expect(component.menuClicked).toHaveBeenCalledTimes(1);
            return [2 /*return*/];
        });
    }); });
    describe('menuClicked on a large screen device', function () {
        it('should not call sideNav.close when clicked', function () {
            // test
            jest.spyOn(sideNavMock, 'close');
            component.menuClicked(true);
            // assert
            expect(sideNavMock.close).toBeCalledTimes(0);
        });
    });
    describe('ngOnInit', function () {
        it('should call addSubscriber', function () {
            jest.spyOn(sideNavMock, 'addSubscriber');
            component.ngOnInit();
            sideNavMock.showProgress();
            expect(sideNavMock.addSubscriber).toHaveBeenCalled();
        });
        it('should set loading to true', function () {
            jest.spyOn(sideNavMock, 'addSubscriber');
            component.ngOnInit();
            sideNavMock.showProgress();
            expect(component.loading).toBeTruthy();
        });
        it('should set loading to false', function () {
            jest.spyOn(sideNavMock, 'addSubscriber');
            component.ngOnInit();
            sideNavMock.stopProgress();
            expect(component.loading).toBeFalsy();
        });
    });
    describe('activeRoute', function () {
        it('should change active route', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fixture.ngZone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        expect(component.activeRoute).toEqual('');
                                        return [4 /*yield*/, router.navigate(['admin/trips/pending'])];
                                    case 1:
                                        _a.sent();
                                        expect(component.activeRoute).toContain('trips/pending');
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('SideBarComponent on small devices', function () {
    var component;
    var fixture;
    beforeEach(function () {
        // create mock
        var mediaObserverMock = {
            media$: of({ mqAlias: 'xs', mediaQuery: '' })
        };
        // setup component
        TestBed.configureTestingModule({
            declarations: [AdminComponent, HeaderComponent],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                AngularMaterialModule,
                HttpClientModule,
                RouterTestingModule
            ],
            providers: [
                CookieService,
                ClockService,
                { provide: AlertService, useValue: toastrMock },
                { provide: MediaObserver, useValue: mediaObserverMock },
                { provide: NavMenuService, useValue: sideNavMock },
                { provide: AppEventService, useValue: appEventsMock },
                { provide: HomeBaseManager, useValue: hbManagerMock },
                { provide: AuthService, useValue: authServiceMock }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
    });
    it('should change menu orientation if screen size is small', function () {
        // assert
        expect(component.position).toEqual('side');
    });
    describe('logout model on small screen devices', function () {
        it('should call header.showLogoutModal', function () {
            jest.spyOn(component.header, 'showLogoutModal');
            component.responsiveLogout();
            expect(appEventsMock.broadcast).toHaveBeenCalledWith({
                name: 'SHOW_LOGOUT_MODAL'
            });
        });
    });
    describe('menuClicked on a small screen device', function () {
        it('should call sideNav.close when clicked', function () {
            component.position = 'over';
            component.menuClicked(true);
            expect(component.sidenav.opened).toBeFalsy();
        });
    });
});
//# sourceMappingURL=admin.component.spec.js.map