import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { UserService, UserObject } from './user.service';
import { newUserResponseMock, newUserInfoMock } from '../users/__mocks__';


describe('RoleService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.get(UserService);
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

  describe('Add New User', () => {
    it('should assign add new user', () => {
      let newUser: UserObject;
      jest.spyOn(service, 'addUser').mockReturnValue(of(newUserResponseMock));
      service.addUser(newUserInfoMock).subscribe(response => {
        newUser = response;
      });
      expect(newUser).toEqual(newUserResponseMock);
    });
    it('should call http client post method on add new user', () => {
        const response = {success: true};
        jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
        service.addUser({});
        expect(HttpClient.prototype.post).toHaveBeenCalled();
      });
  });
});
