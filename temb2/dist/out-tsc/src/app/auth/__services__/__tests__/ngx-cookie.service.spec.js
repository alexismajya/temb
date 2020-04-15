/* tslint:disable max-line-length */
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from '../ngx-cookie-service.service';
import { DOCUMENT } from '@angular/common';
describe('Service Tests', function () {
    describe('Cookie Service', function () {
        var injector;
        var service;
        beforeEach(function () {
            var document = {
                cookie: 'test1=AAAA;test2=BBBB'
            };
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [CookieService, { provide: DOCUMENT, useValue: document }]
            });
            injector = getTestBed();
            service = injector.get(CookieService);
        });
        it('should initialize cookie service', function () {
            expect(service).toBeTruthy();
        });
        it('should check if cookie exists', function () {
            expect(service.check('tex')).toBeFalsy();
            expect(service.check('test1')).toBeTruthy();
        });
        it('should get cookies by name', function () {
            expect(service.get('test')).toBeFalsy();
            expect(service.get('test1')).toBeTruthy();
            expect(service.get('test2')).toEqual('BBBB');
        });
        it('should get all cookie in dom', function () {
            var result = service.getAll();
            expect(result).toEqual({ 'test1': 'AAAA', 'test2': 'BBBB' });
        });
        it('should set cookie', function () {
            service.set('test3', 'CCCC', 0.123, '/', 'localhost', true, 'Lax');
            expect(service.get('test3')).toEqual('CCCC');
            // @ts-ignore
            var document = service.document;
            expect(document.cookie).toContain('expires');
            expect(document.cookie).toContain('path=/');
        });
        describe('delete', function () {
            it('should delete', function () {
                service.delete('test1', '/', 'localhost');
                // @ts-ignore
                expect(service.document.cookie).toEqual('test1=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=localhost;');
            });
        });
        describe('deleteAll', function () {
            it('should deleteAll', function () {
                service.set('test3', 'CCCC', 0, '/', 'localhost', true, 'Lax');
                service.deleteAll('/', 'localhost');
                // @ts-ignore
                expect(service.document.cookie).toEqual('=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=localhost;');
            });
        });
    });
});
//# sourceMappingURL=ngx-cookie.service.spec.js.map