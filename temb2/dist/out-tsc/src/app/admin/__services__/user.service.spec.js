import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { newUserResponseMock, newUserInfoMock } from '../users/__mocks__';
describe('RoleService', function () {
    var service;
    var httpMock;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });
        service = TestBed.get(UserService);
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
    describe('Add New User', function () {
        it('should assign add new user', function () {
            var newUser;
            jest.spyOn(service, 'addUser').mockReturnValue(of(newUserResponseMock));
            service.addUser(newUserInfoMock).subscribe(function (response) {
                newUser = response;
            });
            expect(newUser).toEqual(newUserResponseMock);
        });
        it('should call http client post method on add new user', function () {
            var response = { success: true };
            jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
            service.addUser({});
            expect(HttpClient.prototype.post).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map