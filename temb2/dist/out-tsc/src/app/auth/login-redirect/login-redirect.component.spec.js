import { async, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoginRedirectComponent } from './login-redirect.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { mockAuthService } from '../__mocks__/authService.mock';
import { mockActivatedRoute, mockRouter, mockToastr } from 'src/app/shared/__mocks__/mockData';
import { AlertService } from 'src/app/shared/alert.service';
describe('LoginRedirectComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [LoginRedirectComponent],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                { provide: AlertService, useValue: mockToastr }
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(LoginRedirectComponent);
        component = fixture.componentInstance;
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create component', function () {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
    describe('Login Method', function () {
        it('should get token from queryParam', function () {
            var route = TestBed.get(ActivatedRoute);
            fixture.detectChanges();
            expect(route.snapshot.queryParams.token).toEqual('authToken');
        });
        it('should call unauthorizeUser method when token is falsely', function () {
            var route = TestBed.get(ActivatedRoute);
            var service = TestBed.get(AuthService);
            jest.spyOn(service, 'unAuthorizeUser');
            jest.spyOn(service, 'setAisToken');
            route.snapshot.queryParams.token = false;
            fixture.detectChanges();
            expect(route.snapshot.queryParams.token).toEqual(false);
            expect(service.unAuthorizeUser).toHaveBeenCalledTimes(1);
            expect(service.setAisToken).toHaveBeenCalled();
        });
        it('should call the login method when a token exists', function () {
            var service = TestBed.get(AuthService);
            var loginDataMock = { data: { isAuthorized: false } };
            jest.spyOn(service, 'unAuthorizeUser');
            jest.spyOn(service, 'login').mockReturnValue(of(loginDataMock));
            jest.spyOn(service, 'authorizeUser');
            jest.spyOn(service, 'setAisToken');
            fixture.detectChanges();
            expect(service.unAuthorizeUser).toHaveBeenCalledTimes(1);
            expect(service.login).toHaveBeenCalledTimes(1);
            expect(service.authorizeUser).toHaveBeenCalledTimes(0);
        });
        it('should call login method and handleError', function () {
            var service = TestBed.get(AuthService);
            var errorMock = new Error('Login failed');
            jest.spyOn(service, 'unAuthorizeUser');
            jest.spyOn(service, 'login').mockReturnValue(throwError(errorMock));
            jest.spyOn(service, 'authorizeUser');
            jest.spyOn(service, 'setAisToken');
            jest.spyOn(component, 'handleEventError');
            fixture.detectChanges();
            expect(service.unAuthorizeUser).toHaveBeenCalledTimes(1);
            expect(service.login).toHaveBeenCalledTimes(1);
            expect(service.authorizeUser).toHaveBeenCalledTimes(0);
        });
    });
    describe('handleEventError', function () {
        it('should call unAuthorizeUser method', function () {
            var service = TestBed.get(AuthService);
            var router = TestBed.get(Router);
            var toastr = TestBed.get(AlertService);
            var errorMock = new HttpErrorResponse({
                error: 'Server Error',
                headers: null,
                status: 401
            });
            jest.spyOn(service, 'unAuthorizeUser');
            jest.spyOn(router, 'navigate');
            component.handleEventError(errorMock);
            expect(service.unAuthorizeUser).toHaveBeenCalledTimes(1);
            expect(toastr.error).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalled();
        });
        it('should call the toastr and navigate method', function () {
            var service = TestBed.get(AuthService);
            var router = TestBed.get(Router);
            var toastr = TestBed.get(AlertService);
            var errorMock = new Error('Login failed');
            jest.spyOn(service, 'unAuthorizeUser');
            jest.spyOn(router, 'navigate');
            jest.spyOn(toastr, 'error');
            component.handleEventError(errorMock);
            expect(service.unAuthorizeUser).toHaveBeenCalledTimes(0);
            expect(toastr.error).toHaveBeenCalledTimes(1);
            expect(toastr.error).toHaveBeenCalledWith('Something went wrong! try again');
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });
    });
});
//# sourceMappingURL=login-redirect.component.spec.js.map