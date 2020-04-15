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
import { SearchComponent } from './../../../shared/search/search.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { RoleManagementComponent } from './role-management.component';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from 'src/app/shared/alert.service';
import { RoleService } from '../../__services__/roles.service';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { userRolesMock } from '../__mocks__';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { ExportComponent } from '../../export-component/export.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
describe('RoleManagementComponent', function () {
    var component;
    var fixture;
    var mockAlert = {
        success: jest.fn(),
        error: jest.fn()
    };
    var mockAppEventService = {
        broadcast: jest.fn(),
        subscribe: jest.fn()
    };
    var mockMatDialogRef = {
        close: function () { },
        open: function () { },
    };
    var deleteUserRole = jest.fn();
    var mockMatDialog = {
        open: jest.fn().mockReturnValue({
            componentInstance: {
                executeFunction: {
                    subscribe: function () { return deleteUserRole(); }
                }
            },
            afterClosed: function () { return of(); }
        })
    };
    var mockRoleService = {
        getUsers: jest.fn().mockReturnValue(of({
            success: true,
            message: '',
            users: [userRolesMock]
        })),
        deleteUserRole: jest.fn().mockReturnValue(of({
            success: true,
            message: 'uer role deleted successfully'
        })),
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RoleManagementComponent, AppPaginationComponent, ConfirmModalComponent, SearchComponent,
                EmptyPageComponent, ExportComponent],
            imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, AngularMaterialModule,
                BrowserAnimationsModule, FormsModule],
            providers: [
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: AppEventService, useValue: mockAppEventService },
                { provide: AlertService, useValue: mockAlert },
                { provide: RoleService, useValue: mockRoleService },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [ConfirmModalComponent]
            }
        }).compileComponents();
        fixture = TestBed.createComponent(RoleManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    afterEach(function () {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('initial load', function () {
        it('should create component', function () {
            expect(component).toBeDefined();
        });
    });
    describe('getUsersData', function () {
        var event = {
            name: 'userRoleEvent',
            content: {}
        };
        it('should subscribe to events ', (function () {
            jest.spyOn(component, 'getUsersData');
            jest.spyOn(mockAppEventService, 'subscribe');
            component.ngOnInit();
            expect(mockAppEventService.subscribe).toBeCalled();
        }));
        it('should call getUserData', function () {
            jest.spyOn(component, 'getUsersData').mockImplementation();
            jest.spyOn(mockAppEventService, 'subscribe');
            component.setPage(1);
            mockAppEventService.broadcast(event);
            expect(mockAppEventService.subscribe).toBeCalled();
            expect(component.pageNo).toEqual(1);
            expect(component.getUsersData).toBeCalled();
            expect(component.users).toEqual([userRolesMock]);
        });
        it('should display an error message if error occured - "GET"', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                jest.spyOn(component, 'getUsersData');
                jest.spyOn(mockRoleService, 'getUsers').mockReturnValue(throwError(new Error()));
                component.getUsersData('');
                fixture.detectChanges();
                expect(component.displayText).toEqual("Oops! We're having connection problems.");
                jest.restoreAllMocks();
                return [2 /*return*/];
            });
        }); });
    });
    describe('showDeleteModal', function () {
        it('should open delete modal when delete icon is clicked', function () {
            component.showDeleteModal(1);
            expect(mockMatDialog.open).toBeCalledTimes(1);
            expect(deleteUserRole).toBeCalledTimes(1);
        });
    });
    describe('deleteUserRole', function () {
        it('should delete user role success response from http call', function () {
            var userRoleSpy = jest.spyOn(component, 'getUsersData');
            var deleteSpy = jest.spyOn(mockRoleService, 'deleteUserRole');
            component.getUsersData('');
            fixture.detectChanges();
            component.deleteUserRole(1);
            expect(deleteSpy).toHaveBeenCalled();
            expect(mockAlert.success).toBeCalledTimes(1);
            expect(userRoleSpy).toHaveBeenCalled();
        });
        it('should display an error message if deleteUserRole is unsuccessful', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                jest.spyOn(mockRoleService, 'deleteUserRole').mockReturnValue(throwError(new Error()));
                component.getUsersData('');
                fixture.detectChanges();
                component.deleteUserRole(1);
                expect(mockAlert.error).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=role-management.component.spec.js.map