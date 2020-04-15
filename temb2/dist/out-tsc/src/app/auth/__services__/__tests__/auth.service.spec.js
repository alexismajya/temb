import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { CookieService } from '../ngx-cookie-service.service';
import { ClockService } from '../clock.service';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../shared/alert.service';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { mockToastr } from '../../../shared/__mocks__/mockData';
import { MatDialog } from '@angular/material';
import { HomeBaseManager } from 'src/app/shared/homebase.manager';
describe('AuthService', function () {
    var authService;
    var httpTestingController;
    var injector;
    var mockRouter;
    var mockClockService;
    var mockCookieService;
    var response = { id: '121', name: 'james' };
    var tembeaBackEndUrl = environment.tembeaBackEndUrl;
    var hbManagerMock = {
        storeHomebase: jest.fn()
    };
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CookieService, useValue: new SpyObject(CookieService) },
                { provide: ClockService, useValue: new SpyObject(ClockService) },
                { provide: Router, useValue: new SpyObject(Router) },
                { provide: AlertService, useValue: mockToastr },
                { provide: MatDialog, useValue: { closeAll: jest.fn() } },
                { provide: HomeBaseManager, useValue: hbManagerMock }
            ]
        });
        injector = getTestBed();
        authService = injector.get(AuthService);
        httpTestingController = TestBed.get(HttpTestingController);
    });
    beforeEach(function () {
        mockClockService = injector.get(ClockService);
        mockRouter = injector.get(Router);
        mockCookieService = injector.get(CookieService);
        mockCookieService.delete.mockReturnValue({});
        mockClockService.getClock.mockReturnValue(of(6000000000));
        mockRouter.navigate.mockResolvedValue({});
    });
    afterEach(function () {
        httpTestingController.verify();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should be created', function () {
        var service = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });
    it('should not get current user', function () {
        var service = TestBed.get(AuthService);
        var user = service.getCurrentUser();
        expect(user).toBeNull();
    });
    it('should set and get current user', function () {
        var service = TestBed.get(AuthService);
        service.setCurrentUser({
            id: '1',
            firstName: 'John',
            first_name: 'John',
            lastName: 'Papa',
            last_name: 'Papa',
            email: 'john.papa@angular.ng',
            name: 'John Papa',
            picture: 'string',
            roles: [],
            locations: []
        });
        var user = service.getCurrentUser();
        expect(user.id).toBe('1');
        expect(user.firstName).toBe('John');
    });
    it('should log user out', function () {
        var service = TestBed.get(AuthService);
        service.clockSubscription = new Subscription();
        service.logout();
        expect(service.cookieService.delete).toHaveBeenCalledTimes(2);
        expect(service.isAuthenticated).toEqual(false);
    });
    it('should init the clock', function () {
        var service = TestBed.get(AuthService);
        AuthService.lastActiveTime = 1000000000;
        jest.spyOn(service, 'logout');
        service.initClock();
        expect(service.logout).toHaveBeenCalledTimes(1);
    });
    it('should GET login info', function () {
        authService.login().subscribe(function (data) {
            expect(data).toEqual(response);
        });
        var loginRequest = httpTestingController.expectOne(tembeaBackEndUrl + "/api/v1/auth/verify");
        expect(loginRequest.request.method).toEqual('GET');
        loginRequest.flush(response);
    });
    it('should test authorize user method', function () {
        var token = 'token';
        var res = { userInfo: { firstName: 'boy', locations: ['Nairobi'] }, token: token };
        var toastrSpy = authService.toastr.success;
        var cookieSpy = authService.cookieService.set;
        authService.authorizeUser(res);
        expect(authService.isAuthorized).toEqual(true);
        expect(authService.isAuthenticated).toEqual(true);
        expect(authService.tembeaToken).toEqual(token);
        expect(toastrSpy).toHaveBeenCalledTimes(1);
        expect(toastrSpy).toHaveBeenCalledWith('Login Successful');
        expect(cookieSpy).toHaveBeenCalledTimes(1);
        expect(cookieSpy).toHaveBeenCalledWith('tembea_token', token, 0.125, '/');
    });
    it('should authorize a user', function () {
        var token = 'token';
        var res = { userInfo: { firstName: 'boy', locations: ['Nairobi'] }, token: token };
        var toastrSpy = authService.toastr.success;
        var cookieSpy = authService.cookieService.set;
        var initClockSpy = jest
            .spyOn(authService, 'initClock')
            .mockImplementation(function () {
        });
        authService.authorizeUser(res);
        expect(authService.isAuthorized).toEqual(true);
        expect(authService.isAuthenticated).toEqual(true);
        expect(authService.tembeaToken).toEqual(token);
        expect(toastrSpy).toHaveBeenCalledTimes(1);
        expect(toastrSpy).toHaveBeenCalledWith('Login Successful');
        expect(cookieSpy).toHaveBeenCalledTimes(1);
        expect(cookieSpy).toHaveBeenCalledWith('tembea_token', token, 0.125, '/');
        expect(initClockSpy).toHaveBeenCalledTimes(1);
    });
    it('should set the user as unAuthorized', function () {
        authService.unAuthorizeUser();
        expect(authService.isAuthorized).toEqual(false);
    });
});
//# sourceMappingURL=auth.service.spec.js.map