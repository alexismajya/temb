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
import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MatSelectModule } from '@angular/material';
import { AlertService } from '../../../shared/alert.service';
import { RoleService } from '../../__services__/roles.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { UserRoleModalComponent } from './user-role-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { roleResponseMock } from '../__mocks__';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { AppEventService } from 'src/app/shared/app-events.service';
import { HomeBaseService } from 'src/app/shared/homebase.service';
describe('UserRoleModalComponent', function () {
    var component;
    var fixture;
    var mockRoleService = {
        assignRoleToUser: jest.fn(),
        getRoles: jest.fn().mockReturnValue(of({
            success: true,
            data: []
        }))
    };
    var mockMatDialogRef = {
        close: function () { },
        open: function () { },
    };
    var mockAppEventService = {
        broadcast: jest.fn(),
        subscribe: jest.fn()
    };
    var mockAlert = {
        success: jest.fn(),
        error: jest.fn()
    };
    var mockHomebaseService = {
        getAllHomebases: jest.fn().mockReturnValue(of({
            success: true,
            homebases: []
        }))
    };
    var mockAnalytics = {
        sendEvent: jest.fn()
    };
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            TestBed.configureTestingModule({
                declarations: [UserRoleModalComponent],
                imports: [FormsModule, HttpClientModule, MatSelectModule],
                providers: [
                    { provide: MatDialogRef, useValue: mockMatDialogRef },
                    { provide: AppEventService, useValue: mockAppEventService },
                    { provide: AlertService, useValue: mockAlert },
                    { provide: RoleService, useValue: mockRoleService },
                    { provide: HomeBaseService, useValue: mockHomebaseService },
                    { provide: GoogleAnalyticsService, useValue: mockAnalytics }
                ],
                schemas: [NO_ERRORS_SCHEMA]
            }).compileComponents();
            return [2 /*return*/];
        });
    }); });
    beforeEach(function () {
        fixture = TestBed.createComponent(UserRoleModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    describe('closeDialog', function () {
        it('should close the dialog', function () {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
    describe('AssignRoleToUser', function () {
        it('should call roleService.assignRoleToUser', function () {
            mockRoleService.assignRoleToUser.mockReturnValue(of(roleResponseMock));
            jest.spyOn(component.alert, 'success').mockReturnValue();
            component.assignUserRole(roleResponseMock.roles);
            expect(component.roleService.assignRoleToUser).toHaveBeenCalledTimes(1);
            expect(component.alert.success).toHaveBeenCalledTimes(1);
        });
        it('should call alert.error when request fails with 404', function () {
            var message = 'user not found';
            var error = new MockError(404, message);
            mockRoleService.assignRoleToUser.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.assignUserRole(roleResponseMock.roles);
            expect(component.alert.error).toHaveBeenCalledWith('User email entered does not exist');
        });
        it('should call alert.error when request fails with 409 conflict', function () {
            var message = 'User with that name or email already exists';
            var error = new MockError(409, message);
            component.logError(error);
            jest.spyOn(component.alert, 'error');
        });
        it('should call alert.error when request fails with 409 conflict', function () {
            var message = 'Something went wrong, please try again';
            var error = new MockError(400, message);
            component.logError(error);
            jest.spyOn(component.alert, 'error');
        });
    });
});
//# sourceMappingURL=user-role-modal.component.spec.js.map