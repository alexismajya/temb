import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { RoleService } from './roles.service';
import { roleResponseMock } from '../users/__mocks__';


describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService]
    });
    service = TestBed.get(RoleService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserRoles', () => {
    let httpSpy: any;
    beforeEach(() => {
      httpSpy = jest.spyOn(HttpClient.prototype, 'get');
    });

    it('should call HttpClient.getUserRoles', () => {
      service.getRoles();
      expect(httpSpy).toBeCalled();
    });
    it('return all the roles', () => {
      const mockRole = {
        email: 'patrick.ngabonziza@andela.com',
        homebaseId: '1',
        name: 'Admin',
      };
      httpSpy.mockReturnValue(of([mockRole]));
      const result = service.getRoles();
      result.subscribe(data => {
        expect(data).toEqual([mockRole]);
      });
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role to a user', () => {
      let role = null;
      jest.spyOn(service, 'assignRoleToUser').mockReturnValue(of(roleResponseMock));
      service.assignRoleToUser(roleResponseMock.roles).subscribe(value => {
        role = value;
      });
      expect(role).toEqual(roleResponseMock);
    });
    it('should call http client post method on assign user role', () => {
        const response = {success: true};
        jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
        service.assignRoleToUser({});
        expect(HttpClient.prototype.post).toHaveBeenCalled();
      });
  });

    describe('getUsers', () => {
    beforeEach(() => {
      jest.spyOn(HttpClient.prototype, 'get');
    });
    it('should call HttpClient.getUsers', () => {
      service.getUsers();
      expect(HttpClient.prototype.get).toBeCalled();
    });
    it('return all the Users', () => {
      jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
      const result = service.getUsers();
      result.subscribe(data => {
        expect(data).toEqual({});
      });
    });
    });

  describe('deleteUserRole', () => {
    beforeEach(() => {
      jest.spyOn(HttpClient.prototype, 'delete');
    });
    it('should call Http client to delete user role', () => {
      service.deleteUserRole(1);
      expect(HttpClient.prototype.delete).toHaveBeenCalled();
    });

    it('should delete a provider successfully', () => {
      jest.spyOn(HttpClient.prototype, 'delete').mockReturnValue(of({}));
      service.deleteUserRole(1).subscribe(data => {
        expect(data).toEqual({});
      });
    });

  });
});
