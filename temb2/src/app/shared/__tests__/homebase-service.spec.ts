import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HomeBaseService } from '../homebase.service';

describe('HomebaseService', () => {
  let homebaseService: HomeBaseService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeBaseService]
    });
    homebaseService = TestBed.get(HomeBaseService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(homebaseService).toBeTruthy();
  });

  it('should call http client post method on create new homebase', () => {
    const response = { success: true };
    jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
    homebaseService.createHomebase({});
    expect(HttpClient.prototype.post).toHaveBeenCalled();
  });

  it('should call http client get method on get a list of homebase', () => {
    const response = { success: true };
    jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(response));
    homebaseService.getAllHomebases();
    expect(HttpClient.prototype.get).toHaveBeenCalled();
  });

  it('should call http client get method on get a specific homebase', () => {
    const response = { success: true };
    jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(response));
    homebaseService.getByName('Andela kigali');
    expect(HttpClient.prototype.get).toHaveBeenCalled();
  });

  it('should call http client put method on updating a homebase', () => {
    const response = { success: true };
    jest.spyOn(HttpClient.prototype, 'put').mockReturnValue(of(response));
    homebaseService.updateHomebase(null, null);
    expect(HttpClient.prototype.put).toHaveBeenCalled();
  });
});

