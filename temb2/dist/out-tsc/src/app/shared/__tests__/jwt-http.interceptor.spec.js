import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/__services__/auth.service';
import { mockAuthService } from '../../auth/__mocks__/authService.mock';
import { mockRouter, mockToastr } from '../__mocks__/mockData';
import { JwtHttpInterceptor } from '../jwt-http.interceptor';
import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { AlertService } from '../alert.service';
import { HomeBaseManager } from '../homebase.manager';
describe('JWTHttpInterceptor', function () {
    var interceptor;
    var authService;
    var router;
    var mockHbManager = {
        getHomebaseId: jest.fn(function () { }),
    };
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [
                JwtHttpInterceptor,
                { provide: Router, useValue: mockRouter },
                { provide: AuthService, useValue: mockAuthService },
                { provide: AlertService, useValue: mockToastr },
                { provide: HomeBaseManager, useValue: mockHbManager }
            ]
        });
        interceptor = TestBed.get(JwtHttpInterceptor);
        authService = TestBed.get(AuthService);
        router = TestBed.get(Router);
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create interceptor', function () {
        expect(interceptor).toBeTruthy();
    });
    describe('Intercept method', function () {
        it('should next method without setting Authorization token', function () {
            authService.tembeaToken = 'token';
            var url = '/auth/verify';
            var reqMock = new HttpRequest('GET', url);
            var next = {
                handle: jest.fn(function () { })
            };
            interceptor.intercept(reqMock, next);
            expect(next.handle).toHaveBeenCalledWith(reqMock);
        });
        it('should next method and set Authorization token', function () {
            authService.tembeaToken = 'token';
            var url = '/auth/go';
            var reqMock = new HttpRequest('GET', url);
            var next = {
                handle: jest.fn(function () { return of({}); })
            };
            jest.spyOn(reqMock, 'clone').mockReturnValue('cloned');
            interceptor.intercept(reqMock, next);
            expect(next.handle).toHaveBeenCalledWith('cloned');
        });
    });
});
//# sourceMappingURL=jwt-http.interceptor.spec.js.map