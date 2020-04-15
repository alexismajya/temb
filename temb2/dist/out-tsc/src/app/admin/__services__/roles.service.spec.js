import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RoleService } from './roles.service';
import { roleResponseMock } from '../users/__mocks__';
describe('RoleService', function () {
    var service;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RoleService]
        });
        service = TestBed.get(RoleService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        httpMock.verify();
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    describe('getUserRoles', function () {
        var httpSpy;
        beforeEach(function () {
            httpSpy = jest.spyOn(HttpClient.prototype, 'get');
        });
        it('should call HttpClient.getUserRoles', function () {
            service.getRoles();
            expect(httpSpy).toBeCalled();
        });
        it('return all the roles', function () {
            var mockRole = {
                email: 'patrick.ngabonziza@andela.com',
                homebaseId: '1',
                name: 'Admin',
            };
            httpSpy.mockReturnValue(of([mockRole]));
            var result = service.getRoles();
            result.subscribe(function (data) {
                expect(data).toEqual([mockRole]);
            });
        });
    });
    describe('assignRoleToUser', function () {
        it('should assign role to a user', function () {
            var role = null;
            jest.spyOn(service, 'assignRoleToUser').mockReturnValue(of(roleResponseMock));
            service.assignRoleToUser(roleResponseMock.roles).subscribe(function (value) {
                role = value;
            });
            expect(role).toEqual(roleResponseMock);
        });
        it('should call http client post method on assign user role', function () {
            var response = { success: true };
            jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
            service.assignRoleToUser({});
            expect(HttpClient.prototype.post).toHaveBeenCalled();
        });
    });
    describe('getUsers', function () {
        beforeEach(function () {
            jest.spyOn(HttpClient.prototype, 'get');
        });
        it('should call HttpClient.getUsers', function () {
            service.getUsers();
            expect(HttpClient.prototype.get).toBeCalled();
        });
        it('return all the Users', function () {
            jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
            var result = service.getUsers();
            result.subscribe(function (data) {
                expect(data).toEqual({});
            });
        });
    });
    describe('deleteUserRole', function () {
        beforeEach(function () {
            jest.spyOn(HttpClient.prototype, 'delete');
        });
        it('should call Http client to delete user role', function () {
            service.deleteUserRole(1);
            expect(HttpClient.prototype.delete).toHaveBeenCalled();
        });
        it('should delete a provider successfully', function () {
            jest.spyOn(HttpClient.prototype, 'delete').mockReturnValue(of({}));
            service.deleteUserRole(1).subscribe(function (data) {
                expect(data).toEqual({});
            });
        });
    });
});
//# sourceMappingURL=roles.service.spec.js.map