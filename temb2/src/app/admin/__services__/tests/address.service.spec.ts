import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AddressService } from '../address.service';

describe('HomebaseService', () => {
  let addressService: AddressService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService]
    });
    addressService = TestBed.get(AddressService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(addressService).toBeTruthy();
  });

  it('should call http client get method on get a specific address', () => {
    const response = { success: true };
    jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(response));
    addressService.getAddressById(null);
    expect(HttpClient.prototype.get).toHaveBeenCalled();
  });
});
