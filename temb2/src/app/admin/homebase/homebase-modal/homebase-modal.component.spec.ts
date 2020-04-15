import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectModule } from '@angular/material';
import { AlertService } from '../../../shared/alert.service';
import { HomebaseModalComponent } from './homebase-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HomeBaseService } from '../../../shared/homebase.service';
import { CountryService } from '../../__services__/country.service';
import { SlackService } from '../../__services__/slack.service';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { AddressService } from '../../__services__/address.service';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';

describe('HomeBaseModalComponent', () => {
  let component: HomebaseModalComponent;
  let fixture: ComponentFixture<HomebaseModalComponent>;
  let form;

  const mockMatDialogRef = {
    close: () => { },
  };

  const mockHomebaseService = {
    updateHomebase: jest.fn()
  };

  const mockSlackService = {
    getChannels: jest.fn().mockReturnValue(
      of({
        success: true,
        data: []
      })
    )
  };

  const mockCountryService = {
    getCountries: jest.fn().mockReturnValue(
      of({
        success: true,
        countries: [{
          id: 1,
          name: 'Kenya',
          status: 'Active',
          createdAt: '2020-01-24T06:50:21.236Z',
          updatedAt: '2020-01-24T06:50:21.236Z'
        }]
      })
    )
  };

  const mockAddressService = {
    getAddressById: jest.fn().mockReturnValue(of({
      address: 'Andela Nairobi',
      location: {
        latitude: -1.219539,
        longitude: 36.886215
      }
    }))
  };

  const mockGoogleMapService = {
    loadGoogleMaps: jest.fn(),
    getLocationCoordinatesFromAddress: jest.fn().mockReturnValue(
      of({
        lat: 30,
        lng: 30
      })
    )
  };

  const mockToastService = {
    success: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomebaseModalComponent],
      imports: [FormsModule, HttpClientModule, MatSelectModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {country: 'Kenya'} },
        { provide: AlertService, useValue: mockToastService },
        { provide: HomeBaseService, useValue: mockHomebaseService },
        { provide: SlackService, useValue: mockSlackService },
        { provide: CountryService, useValue: mockCountryService },
        { provide: GoogleMapsService, useValue: mockGoogleMapService },
        { provide: AddressService, useValue: mockAddressService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomebaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = new NgForm([], []);
  });

  it('should create Homebase Modal Component', () => {
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });

  it('Should close the edit dialog', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toBeCalled();
  });

  it('should get location coordinates', () => {
    const getCoordiantes = jest.spyOn(
      component.googleMapsService,
      'getLocationCoordinatesFromAddress'
    );
    component.getHomebaseCoordinates();
    expect(getCoordiantes).toHaveBeenCalled();
  });

  it('should throw an error when location does not exist', () => {
    const getCoordiantes = jest
      .spyOn(component.googleMapsService, 'getLocationCoordinatesFromAddress')
      .mockRejectedValue('Location not found');
    component.getHomebaseCoordinates();
    expect(getCoordiantes).toHaveBeenCalled();
  });

  it('should call update homebase service', () => {
    mockHomebaseService.updateHomebase.mockReturnValue(of({ success: true }));
    jest.spyOn(component.toastService, 'success').mockReturnValue();
    component.editHomebase(form, null);
    expect(mockHomebaseService.updateHomebase).toBeCalledTimes(1);
    expect(component.toastService.success).toBeCalledTimes(1);
  });

  it('should throw an error', () => {
    const message = 'Server Error';
    const error = new MockError(500, message);
    mockHomebaseService.updateHomebase.mockReturnValue(throwError(error));
    jest.spyOn(component.toastService, 'error');
    component.editHomebase(form, null);
    expect(component.toastService.error).toHaveBeenCalledWith('Server Error');
  });
});
