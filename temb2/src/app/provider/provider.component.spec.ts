import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { TripRequestService } from '../../app/admin/__services__/trip-request.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../shared/alert.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { of, throwError } from 'rxjs';
import { providerConfirmMock, MockError} from './__mocks__/confirm-trip.mocks';

const ActivatedRouteMock = {
  queryParamMap: of( convertToParamMap({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtSWQiOiJUUERLRlI4\
    VEYiLCJ0cmlwSWQiOjg5OCwicHJvdmlkZXJJZCI6NywiaWF0IjoxNTczNzI4MzM3LCJleH\
    AiOjE2NjAzODcwMDB9.TwGwUlAtSkfkYOiBAOTijb3npGTJ4g9wDK2OVTAK3SE'
  }))
};

describe('ProviderComponent', () => {
  let component: ProviderComponent;
  let fixture: ComponentFixture<ProviderComponent>;

  const TripRequestServiceMock = {
    providerConfirm: jest.fn().mockReturnValue(of({})),
  };

  const mockAlert = {
    success: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: TripRequestService, useValue: TripRequestServiceMock },
        { provide: AlertService, useValue: mockAlert },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create provider component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit()', () => {
    it('should call tripRequestService.providerConfirm', () => {
      TripRequestServiceMock.providerConfirm.mockReturnValue(of(providerConfirmMock));
      jest.spyOn(component.alert, 'success').mockReturnValue();
      component.onSubmit();
      expect(component.tripRequestService.providerConfirm).toHaveBeenCalledTimes(1);
      expect(component.alert.success).toHaveBeenCalledTimes(1);
    });

    it('should call alert.error when validation error occured', () => {
      const error = {
          error: { error: 'Validation error occurred' }
      };
      TripRequestServiceMock.providerConfirm.mockReturnValue(throwError(error));
      component.onSubmit();
      expect(component.alert.error).toHaveBeenCalled();
    });

    it('should throw an error if there is an internal server error', () => {
      const error = {
          error: { message: { error: 'Failed to complete trip confirmation, Please try again'} }
      };
      const result = new MockError(500, error.error.message.error);
      TripRequestServiceMock.providerConfirm.mockReturnValue(throwError(result));
      component.onSubmit();
      expect(component.alert.error).toHaveBeenCalled();
    });
  });
});
