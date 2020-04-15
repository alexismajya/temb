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
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { of, Subscription } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { NavMenuService } from '../__services__/nav-menu.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from '../../auth/__services__/ngx-cookie-service.service';
import { ClockService } from '../../auth/__services__/clock.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { MatMenuModule, MatDialog } from '@angular/material';
import { toastrMock } from '../routes/__mocks__/create-route';
import { AlertService } from '../../shared/alert.service';
import { AddCabsModalComponent } from '../cabs/add-cab-modal/add-cab-modal.component';
import { AddProviderModalComponent } from '../providers/add-provider-modal/add-provider-modal.component';
import { AppEventService } from '../../shared/app-events.service';
import { DriverModalComponent } from '../providers/driver-modal/driver-modal.component';
import { FormsModule } from '@angular/forms';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
import { UserRoleModalComponent } from '../users/user-role-modal/user-role-modal.component';
var MockServices = /** @class */ (function () {
    function MockServices() {
        this.events = of(new NavigationEnd(0, '/', null));
    }
    return MockServices;
}());
var mockHbManager = {
    getHomeBase: jest.fn(),
    getHomeBases: jest.fn()
};
describe('HeaderComponent', function () {
    var component;
    var fixture;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var mockMatDialog, mockCabsModalComponent, mockProviderModalComponent, mockUserRoleModalComponent, mockAppEventService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockMatDialog = {
                        open: function () { },
                    };
                    mockCabsModalComponent = {};
                    mockProviderModalComponent = {};
                    mockUserRoleModalComponent = {};
                    mockAppEventService = {
                        subscribe: jest.fn()
                    };
                    return [4 /*yield*/, TestBed.configureTestingModule({
                            declarations: [HeaderComponent, AdminComponent],
                            imports: [
                                FormsModule,
                                AngularMaterialModule,
                                HttpClientModule,
                                RouterTestingModule.withRoutes([{ path: '', component: AdminComponent },
                                    {
                                        path: 'admin/trips/pending',
                                        component: AdminComponent,
                                        data: { title: 'Pending Trips' }
                                    }]),
                                MatMenuModule
                            ],
                            providers: [
                                CookieService,
                                ClockService,
                                { provide: MatDialog, useValue: mockMatDialog },
                                { provide: RouterModule, useClass: MockServices },
                                { provide: AlertService, useValue: toastrMock },
                                { provide: AddCabsModalComponent, useValue: mockCabsModalComponent },
                                { provide: AddProviderModalComponent, useValue: mockProviderModalComponent },
                                { provide: AppEventService, useValue: mockAppEventService },
                                { provide: Subscription, useValue: mockCabsModalComponent },
                                { provide: HomeBaseManager, useValue: mockHbManager },
                                { provide: UserRoleModalComponent, useValue: mockUserRoleModalComponent }
                            ]
                        }).compileComponents()];
                case 1:
                    _a.sent();
                    fixture = TestBed.createComponent(HeaderComponent);
                    component = fixture.componentInstance;
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit()', function () {
        it('should change header title', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest.spyOn(component['appEventService'], 'subscribe');
                        jest.spyOn(component.auth, 'getCurrentUser').mockReturnValue({ locations: [{
                                    id: 4,
                                    name: 'Meshack',
                                    role: 'Admin'
                                }]
                        });
                        component.ngOnInit();
                        expect(component['appEventService'].subscribe).toHaveBeenCalled();
                        return [4 /*yield*/, fixture.ngZone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                                var router;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            router = TestBed.get(Router);
                                            return [4 /*yield*/, router.navigate(['admin/trips/pending'])];
                                        case 1:
                                            _a.sent();
                                            expect(component.headerTitle).toBe('Pending Trips');
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
    // TODO: need to fix issue with mat-menu component
    describe('logout', function () {
        it('should test show logout function', function () {
            try {
                jest.spyOn(component.dialog, 'open').mockResolvedValue({});
                jest.spyOn(component.auth, 'getCurrentUser').mockResolvedValue({ firstName: 'Meshack' });
                component.ngOnInit();
                component.showLogoutModal();
                expect(component.dialog.open).toHaveBeenCalledTimes(1);
            }
            catch (error) { }
        });
        it.skip('should show logout modal on click logout button', fakeAsync(function () {
            // TODO: how to make a call to closed menu;
            // TODO: test open logout modal dialog modal
            var button = fixture.debugElement.nativeElement.querySelector('#drop-down-button');
            button.click();
            tick();
            var logout = fixture.debugElement.nativeElement.querySelector('#logout');
            logout.click();
        }));
        describe('handleAction', function () {
            beforeEach(function () {
                jest.spyOn(component.dialog, 'open');
            });
            it('should open a dialog if action is Adding a new Vehicle', function () {
                component.actionButton = 'Add a New Vehicle';
                component.handleAction();
                expect(component.dialog.open).toHaveBeenCalledWith(AddCabsModalComponent, {
                    'data': { 'providerId': undefined }, 'minHeight': '568px', 'panelClass': 'add-cab-modal-panel-class', 'width': '592px'
                });
            });
            it('should open a dialog if action is Adding Provider', function () {
                component.actionButton = 'Add Provider';
                component.handleAction();
                expect(component.dialog.open).toHaveBeenCalledWith(AddProviderModalComponent, {
                    'maxHeight': '568px', 'panelClass': 'add-cab-modal-panel-class', 'width': '620px',
                });
            });
            it('should open a dialog if action is Adding Driver', function () {
                component.actionButton = 'Add Driver';
                component.handleAction();
                expect(component.dialog.open).toHaveBeenCalledWith(DriverModalComponent, {
                    'minHeight': '568px', 'panelClass': 'add-cab-modal-panel-class', 'width': '592px',
                    data: { providerId: undefined }
                });
            });
            it('should open a dialog if action is Assign User Role', function () {
                component.actionButton = 'Assign User Role';
                component.handleAction();
                expect(component.dialog.open).toHaveBeenCalledWith(UserRoleModalComponent, {
                    'maxHeight': '500px', 'panelClass': 'add-cab-modal-panel-class', 'width': '620px'
                });
            });
        });
    });
});
describe('HeaderComponent on xsmall devices', function () {
    var component;
    var fixture;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var mediaObserverMock, navMenuServiceMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mediaObserverMock = {
                        media$: of({ mqAlias: 'xs', mediaQuery: '' })
                    };
                    navMenuServiceMock = {
                        setSidenav: jest.fn(),
                        open: jest.fn(),
                        close: jest.fn(),
                        toggle: jest.fn()
                    };
                    return [4 /*yield*/, TestBed.configureTestingModule({
                            declarations: [HeaderComponent],
                            imports: [HttpClientModule, RouterTestingModule, AngularMaterialModule, FormsModule],
                            providers: [
                                CookieService,
                                ClockService,
                                { provide: MediaObserver, useValue: mediaObserverMock },
                                { provide: NavMenuService, useValue: navMenuServiceMock },
                                { provide: AlertService, useValue: toastrMock },
                                { provide: HomeBaseManager, useValue: mockHbManager }
                            ]
                        }).compileComponents()];
                case 1:
                    _a.sent();
                    fixture = TestBed.createComponent(HeaderComponent);
                    component = fixture.componentInstance;
                    return [2 /*return*/];
            }
        });
    }); });
    it('should toggle sideNav on click', function () {
        var element = fixture.debugElement.query(By.css('#menuToggle'));
        jest.spyOn(component, 'toggleSideNav');
        element.triggerEventHandler('click', null);
        expect(component.toggleSideNav).toBeCalledTimes(1);
    });
});
//# sourceMappingURL=header.component.spec.js.map