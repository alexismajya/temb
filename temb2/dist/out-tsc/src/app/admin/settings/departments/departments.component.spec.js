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
import { EmptyPageComponent } from './../../empty-page/empty-page.component';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { throwError } from 'rxjs';
import { DepartmentsComponent } from './departments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import getdepartmentsServiceMock from './__mocks__/getDepartments.response.mock';
import { DepartmentsService } from '../../__services__/departments.service';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { AlertService } from 'src/app/shared/alert.service';
import { ExportComponent } from '../../export-component/export.component';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AddDepartmentsModalComponent } from './add-departments-modal/add-departments-modal.component';
import { FormsModule } from '@angular/forms';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
describe('DepartmentsComponent', function () {
    var departmentComponent;
    var fixture;
    var alertMockData = {
        error: jest.fn(),
        success: jest.fn(),
        info: jest.fn()
    };
    var departmentsServiceMock = {
        get: function (size, pageNo) {
            return of(getdepartmentsServiceMock);
        },
        delete: jest.fn().mockReturnValue(of({
            success: true,
            message: 'department deleted successfully'
        })),
        add: jest.fn().mockReturnValue(of({ success: true })),
    };
    var mockMatDialogRef = {
        close: function () {
        },
    };
    var analyticsMock = {
        sendEvent: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DepartmentsComponent, EmptyPageComponent,
                AppPaginationComponent, ExportComponent, AddDepartmentsModalComponent,
                ConfirmModalComponent],
            imports: [HttpClientTestingModule, AngularMaterialModule,
                BrowserAnimationsModule, FormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: DepartmentsService, useValue: departmentsServiceMock },
                { provide: AlertService, useValue: alertMockData },
                {
                    provide: MAT_DIALOG_DATA, useValue: {
                        data: {
                            confirmText: 'Yes',
                            displayText: 'delete this department'
                        }
                    }
                },
                { provide: GoogleAnalyticsService, useValue: analyticsMock }
            ],
        })
            .overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [ConfirmModalComponent, AddDepartmentsModalComponent]
            }
        }).compileComponents();
        fixture = TestBed.createComponent(DepartmentsComponent);
        departmentComponent = fixture.componentInstance;
    }));
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('should Exist - DepartmentsComponent', async(function () {
        expect(departmentComponent).toBeTruthy();
    }));
    it('should set departments correctly from the service', async(function () {
        jest.spyOn(departmentsServiceMock, 'get');
        fixture.detectChanges();
        expect(fixture.componentInstance.departments.length).toBe(4);
    }));
    it('should render actions button', async(function () {
        departmentComponent.getDepartments();
        fixture.detectChanges();
        var button = fixture.debugElement.queryAll(By.css('.actions-icon'));
        expect(button.length).toEqual(1);
    }));
    it('should create one active button for each department', async(function () {
        jest.spyOn(departmentsServiceMock, 'get');
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.active-status-button')).length).toBe(4);
    }));
    it('should update and load page', (function () {
        jest.spyOn(departmentComponent, 'getDepartments');
        expect(departmentComponent.pageNo).toEqual(1);
        departmentComponent.setPage(2);
        fixture.detectChanges();
        expect(departmentComponent.pageNo).toEqual(2);
        expect(departmentComponent.getDepartments).toHaveBeenCalled();
        expect(fixture.componentInstance.isLoading).toBe(false);
    }));
    it('should display an error message if error occured - "GET"', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            jest.spyOn(departmentComponent, 'getDepartments');
            jest.spyOn(departmentsServiceMock, 'get').mockReturnValue(throwError(new Error()));
            departmentComponent.getDepartments();
            fixture.detectChanges();
            expect(departmentComponent.displayText).toEqual("Ooops! We're having connection problems.");
            jest.restoreAllMocks();
            return [2 /*return*/];
        });
    }); });
    describe('editDepartment', function () {
        it('should prepopulate modal with the department info', function () {
            var dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
            jest.spyOn(departmentComponent, 'getDepartments');
            departmentComponent.getDepartments();
            fixture.detectChanges();
            var buttons = fixture.debugElement.queryAll(By.css('.edit-icon'));
            buttons[0].triggerEventHandler('click', null);
            expect(dialogSpy).toBeCalledTimes(1);
        });
    });
    describe('addDepartment', function () {
        it('should open modal when add button is clicked', function () {
            var dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
            jest.spyOn(departmentComponent, 'getDepartments');
            departmentComponent.getDepartments();
            fixture.detectChanges();
            var buttons = fixture.debugElement.queryAll(By.css('.fab'));
            buttons[0].triggerEventHandler('click', null);
            expect(dialogSpy).toBeCalledTimes(1);
        });
    });
    describe('showDeleteModal', function () {
        it('should open delete modal when delete icon is clicked', function () {
            var dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
            departmentComponent.getDepartments();
            fixture.detectChanges();
            var buttons = fixture.debugElement.queryAll(By.css('.decline-icon'));
            buttons[0].triggerEventHandler('click', null);
            expect(dialogSpy).toBeCalledTimes(1);
        });
    });
    describe('deleteDepartment', function () {
        it('should delete a department success response from http call', function () {
            var departmentSpy = jest.spyOn(departmentComponent, 'getDepartments');
            var deleteSpy = jest.spyOn(departmentsServiceMock, 'delete');
            departmentComponent.getDepartments();
            fixture.detectChanges();
            departmentComponent.deleteDepartment(1, 'Launchpad');
            expect(deleteSpy).toHaveBeenCalled();
            expect(alertMockData.success).toBeCalledWith('Launchpad was Successfully Deleted');
            expect(departmentSpy).toHaveBeenCalled();
        });
        it('should display an error message if department delete is unsuccessful', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                jest.spyOn(departmentsServiceMock, 'delete').mockReturnValue(throwError(new Error()));
                departmentComponent.getDepartments();
                fixture.detectChanges();
                departmentComponent.deleteDepartment(1, 'Launchpad');
                expect(alertMockData.error).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=departments.component.spec.js.map