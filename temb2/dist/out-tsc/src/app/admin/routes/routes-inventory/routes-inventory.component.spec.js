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
import { ConvertNullValue } from './../../__pipes__/convert-nullValue.pipe';
import { async, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { throwError, Subscription } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutesInventoryComponent } from './routes-inventory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { CreateRouteHelper } from '../create-route/create-route.helper';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import getRoutesResponseMock from './__mocks__/get-routes-response.mock';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AlertService } from '../../../shared/alert.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { ExportComponent } from '../../export-component/export.component';
import { SearchService } from '../../__services__/search.service';
import { CookieService } from '../../../auth/__services__/ngx-cookie-service.service';
import { mockCookieService } from '../../../shared/__mocks__/mockData';
import { ClockService } from '../../../auth/__services__/clock.service';
import { AppEventService } from '../../../shared/app-events.service';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { DisplayTripModalComponent } from '../../trips/display-trip-modal/display-trip-modal.component';
import { CustomTitlecasePipe } from '../../__pipes__/custom-titlecase.pipe';
describe('RoutesInventoryComponent', function () {
    var component;
    var fixture;
    var routeObject = {
        id: 1,
        destination: 'EPIC Tower',
        capacity: 1,
        name: 'Yaba',
        regNumber: 'JKD 839',
        takeOff: '12:00'
    };
    var createRouteHelperMock = {
        notifyUser: jest.fn()
    };
    var routesInventoryMock = {
        createRoute: jest.fn().mockResolvedValue({ message: 'Successfully created' }),
        getRoutes: function () { return of({ data: getRoutesResponseMock }); },
        changeRouteStatus: jest.fn().mockReturnValue(of({})),
        deleteRouteBatch: jest.fn().mockReturnValue(of({
            success: true,
            message: 'batch deleted successfully'
        }))
    };
    var searchServiceMock = {
        searchData: function () { return of({ data: getRoutesResponseMock }); },
        searchItems: jest.fn().mockReturnValue(of(getRoutesResponseMock)),
    };
    var clockServiceMock = {
        getClock: jest.fn().mockReturnValue(of(6000000000)),
    };
    var router = {
        navigate: jest.fn(),
        events: of({})
    };
    var alert = {
        success: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn()
    };
    var mockMatDialogRef = {
        open: jest.fn(),
        close: function () {
        },
    };
    var hbManagerMock = {
        getHomebaseId: jest.fn().mockReturnValue(4),
    };
    var analyticsMock = {
        sendEvent: jest.fn()
    };
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            TestBed.configureTestingModule({
                declarations: [
                    RoutesInventoryComponent,
                    EmptyPageComponent,
                    ConfirmModalComponent,
                    AppPaginationComponent,
                    DisplayTripModalComponent,
                    ExportComponent,
                    ShortenNamePipe,
                    ConvertNullValue,
                    CustomTitlecasePipe,
                ],
                providers: [
                    { provide: MatDialogRef, useValue: mockMatDialogRef },
                    { provide: AlertService, useValue: alert },
                    { provide: CreateRouteHelper, useValue: createRouteHelperMock },
                    { provide: RoutesInventoryService, useValue: routesInventoryMock },
                    { provide: SearchService, useValue: searchServiceMock },
                    { provide: CookieService, useValue: mockCookieService },
                    { provide: ClockService, useValue: clockServiceMock },
                    { provide: HomeBaseManager, useValue: hbManagerMock },
                    {
                        provide: MAT_DIALOG_DATA, useValue: {
                            data: {
                                displayText: 'display data',
                                confirmText: 'yes'
                            }
                        }
                    },
                    { provide: Router, useValue: router },
                    { provide: GoogleAnalyticsService, useValue: analyticsMock }
                ],
                imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
            })
                .overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [ConfirmModalComponent, DisplayTripModalComponent]
                }
            }).compileComponents();
            fixture = TestBed.createComponent(RoutesInventoryComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            jest.spyOn(routesInventoryMock, 'getRoutes');
            jest.spyOn(searchServiceMock, 'searchData');
            return [2 /*return*/];
        });
    }); });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create RouteInventoryComponent', function () {
        expect(component).toBeTruthy();
    });
    it('should create component and render routes', async(function () {
        component.getRoutesInventory();
        fixture.detectChanges();
        var button = fixture.debugElement.queryAll(By.css('.actions-icon'));
        expect(button.length).toEqual(1);
        expect(component.isLoading).toBe(false);
    }));
    it('should call getRoutes and return list of routes', async(function () {
        component.getRoutesInventory();
        fixture.detectChanges();
        expect(component.routes).toEqual(getRoutesResponseMock.routes);
        var button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
        expect(button.length).toEqual(2);
    }));
    describe('ngOnInit', function () {
        it('should update and load page', (function () {
            jest.spyOn(component, 'getRoutesInventory');
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.routes).toEqual(getRoutesResponseMock.routes);
            expect(component.getRoutesInventory).toHaveBeenCalled();
        }));
    });
    describe('setPage', function () {
        it('should update and load page', (function () {
            jest.spyOn(component, 'getRoutesInventory');
            expect(component.pageNo).toEqual(1);
            component.setPage(20);
            fixture.detectChanges();
            expect(component.pageNo).toEqual(20);
            expect(component.getRoutesInventory).toHaveBeenCalled();
        }));
    });
    describe('showCopyConfirmModal', function () {
        it('should open copy modal when copy icon is clicked', function () {
            var dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
            component.getRoutesInventory();
            fixture.detectChanges();
            var buttons = fixture.debugElement.queryAll(By.css('.duplicate-icon'));
            buttons[0].triggerEventHandler('click', null);
            expect(dialogSpy).toBeCalledTimes(1);
        });
    });
    describe('Copy Route', function () {
        it('should duplicate a route when copy is successful', function () {
            var sendRequestToServer = jest.spyOn(component, 'sendRequestToServer');
            component.copyRouteBatch(routeObject.id);
            expect(sendRequestToServer).toHaveBeenCalledWith(routeObject.id);
        });
    });
    describe('Send Request to Server', function () {
        beforeEach(function () {
            jest.spyOn(routesInventoryMock, 'createRoute').mockResolvedValue({ message: 'Successfully duplicated Yaba route' });
        });
        it('should display a success message if copy request is successful', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, component.sendRequestToServer(routeObject.id)];
                    case 1:
                        _a.sent();
                        expect(routesInventoryMock.createRoute).toHaveBeenCalledWith(routeObject.id, true);
                        expect(createRouteHelperMock.notifyUser).toHaveBeenCalledWith(['Successfully duplicated Yaba route'], 'success');
                        expect(router.navigate).toHaveBeenCalledWith(['/admin/routes/inventory']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should display an error message if request is unsuccessful', function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = { error: { message: 'some server error' } };
                        jest.spyOn(routesInventoryMock, 'createRoute')
                            .mockRejectedValue(response);
                        return [4 /*yield*/, component.sendRequestToServer(routeObject.id)];
                    case 1:
                        _a.sent();
                        expect(routesInventoryMock.createRoute).toHaveBeenCalledWith(routeObject.id, true);
                        expect(createRouteHelperMock.notifyUser).toHaveBeenCalledWith([response.error.message]);
                        expect(router.navigate).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Change Route Status', function () {
        afterEach(function () {
            jest.resetAllMocks();
        });
        it('should call the method to update routes data', function () {
            jest.spyOn(routesInventoryMock, 'changeRouteStatus').mockReturnValue(of({ success: true }));
            jest.spyOn(component, 'updateRoutesData').mockImplementation();
            component.changeRouteStatus(1, 'Active');
            expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledTimes(1);
            expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
            expect(component.updateRoutesData).toHaveBeenCalledTimes(1);
            expect(component.updateRoutesData).toHaveBeenCalledWith(1, 'Active');
        });
        it('should call the method to update routes data and catch all errors', function () {
            jest.spyOn(component, 'updateRoutesData').mockImplementation();
            jest.spyOn(routesInventoryMock, 'changeRouteStatus').mockReturnValue(throwError(new Error()));
            component.changeRouteStatus(1, 'Active');
            expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledTimes(1);
            expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
            expect(alert.error).toHaveBeenCalledTimes(1);
        });
    });
    describe('update routes data', function () {
        it('should return the updated routes ', function () {
            component.routes = getRoutesResponseMock.routes;
            component.updateRoutesData(1, 'Active');
            expect(component.routes).not.toEqual(getRoutesResponseMock.routes);
            expect(component.routes[0].status).toEqual('Active');
        });
    });
    describe('showDeleteModal', function () {
        it('should open delete modal when delete icon is clicked', function () {
            var dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
            component.getRoutesInventory();
            fixture.detectChanges();
            var buttons = fixture.debugElement.queryAll(By.css('.decline-icon'));
            buttons[0].triggerEventHandler('click', null);
            expect(dialogSpy).toBeCalledTimes(1);
        });
    });
    describe('deleteRoute', function () {
        beforeEach(function () {
            jest.spyOn(routesInventoryMock, 'deleteRouteBatch');
        });
        afterEach(function () {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should delete a route batch on success response from http call', function () {
            var spy = jest.spyOn(component, 'getRoutesInventory');
            jest.spyOn(routesInventoryMock, 'deleteRouteBatch').mockReturnValue(of({
                success: true,
                message: 'batch deleted successfully'
            }));
            component.getRoutesInventory();
            fixture.detectChanges();
            component.deleteRoute(1);
            expect(routesInventoryMock.deleteRouteBatch).toHaveBeenCalled();
            expect(alert.success).toBeCalledWith('batch deleted successfully');
            expect(spy).toBeCalled();
        });
        it('should show error alert route batch on failed response from http call', function () {
            jest.spyOn(routesInventoryMock, 'deleteRouteBatch').mockReturnValue(of({
                success: false,
                message: 'something went wrong'
            }));
            component.getRoutesInventory();
            fixture.detectChanges();
            component.deleteRoute(1);
            expect(routesInventoryMock.deleteRouteBatch).toHaveBeenCalled();
            expect(alert.error).toBeCalledWith('something went wrong');
            expect(component.routes.length).toBe(5);
        });
    });
    describe('Search Routes', function () {
        afterEach(function () {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should return list of all routes when no name is provided', async(function () {
            component.getSearchResults();
            fixture.detectChanges();
            expect(component.routes).toEqual(getRoutesResponseMock.routes);
            var button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
            expect(button.length).toEqual(2);
        }));
        it('should throw error when routes not loaded successfully', async(function () {
            spyOn(SearchService.prototype, 'searchData')
                .and.returnValue(throwError('error'));
            component.getSearchResults();
            fixture.detectChanges();
            expect(component.displayText).toEqual("Oops! We're having connection problems.");
        }));
        it('should return list of filtered routes when name is provided', async(function () {
            jest.spyOn(component, 'getSearchResults');
            jest.spyOn(SearchService.prototype, 'searchData').mockReturnValue(of(getRoutesResponseMock));
            var appServiceSpy = jest.spyOn(AppEventService.prototype, 'broadcast');
            component.getRoutesInventory();
            fixture.detectChanges();
            component.getSearchResults();
            fixture.detectChanges();
            expect(component.getSearchResults).toHaveBeenCalled();
            expect(appServiceSpy).toHaveBeenCalled();
            expect(component.routes).toEqual(getRoutesResponseMock.routes);
        }));
    });
    describe('viewRouteDescription', function () {
        it('should open modal to view route details', (function () { return __awaiter(_this, void 0, void 0, function () {
            var dialogSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
                        return [4 /*yield*/, component.viewRowDescription(1)];
                    case 1:
                        _a.sent();
                        fixture.detectChanges();
                        expect(dialogSpy).toBeCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('ngOnDestroy', function () {
        it('should unsubscribe from subscriptions on ngOnDestroy', function () {
            var testSub = new Subscription();
            jest.spyOn(testSub, 'unsubscribe');
            component.subscriptions.push(testSub);
            component.ngOnDestroy();
            expect(testSub.unsubscribe).toBeCalledTimes(1);
        });
    });
});
//# sourceMappingURL=routes-inventory.component.spec.js.map