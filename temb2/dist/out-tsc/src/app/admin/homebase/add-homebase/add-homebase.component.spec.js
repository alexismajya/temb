import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatSelectModule } from '@angular/material';
import { AddHomebaseComponent } from './add-homebase.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HomeBaseService } from '../../../shared/homebase.service';
import { CountryService } from '../../__services__/country.service';
import { SlackService } from '../../__services__/slack.service';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { AlertService } from '../../../shared/alert.service';
import { homebaseResponseMocks, mockCoordinates } from './__mocks__/add-homebase.mocks';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
describe('AddHomebaseComponent', function () {
    var component;
    var fixture;
    var mockMatDialogRef = {
        close: function () { }
    };
    var mockHomebaseService = {
        createHomebase: jest.fn()
    };
    var mockSlackService = {
        getChannels: jest.fn().mockReturnValue(of({
            success: true,
            data: []
        }))
    };
    var mockCountryService = {
        getCountries: jest.fn().mockReturnValue(of({
            success: true,
            countries: []
        }))
    };
    var mockGoogleMapService = {
        loadGoogleMaps: jest.fn(),
        getLocationCoordinatesFromAddress: jest.fn().mockReturnValue(of({
            lat: 30,
            lng: 30
        }))
    };
    var mockAlertService = {
        success: jest.fn(),
        error: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AddHomebaseComponent],
            imports: [FormsModule, HttpClientModule, MatSelectModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: HomeBaseService, useValue: mockHomebaseService },
                { provide: SlackService, useValue: mockSlackService },
                { provide: CountryService, useValue: mockCountryService },
                { provide: GoogleMapsService, useValue: mockGoogleMapService },
                { provide: AlertService, useValue: mockAlertService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AddHomebaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        component.ngAfterViewInit();
        expect(component).toBeTruthy();
    });
    it('should close the dialog', function () {
        jest.spyOn(component.dialogRef, 'close');
        component.closeDialog();
        expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
    it('should toggleChannel', function () {
        component.homebase.channel = 'GRINGO';
        component.toggleSlackChannel('GRINGO');
        expect(component.homebase.channel).toEqual('GRINGO');
    });
    it('should toggleCountry', function () {
        component.homebase.countryId = 1;
        component.toggleCountry(1);
        expect(component.homebase.countryId).toEqual(1);
    });
    it('should get location coordinates', function () {
        var getCoordiantes = jest.spyOn(component.googleMapsService, 'getLocationCoordinatesFromAddress');
        component.handleAddressFill();
        expect(getCoordiantes).toHaveBeenCalled();
    });
    it('should throw an error when location does not exist', function () {
        var getCoordiantes = jest
            .spyOn(component.googleMapsService, 'getLocationCoordinatesFromAddress')
            .mockRejectedValue('Location not found');
        component.handleAddressFill();
        expect(getCoordiantes).toHaveBeenCalled();
    });
    it('should create a new homebase', function () {
        component.locationCoordinates = mockCoordinates;
        mockHomebaseService.createHomebase.mockReturnValue(of(homebaseResponseMocks));
        jest.spyOn(component.alertService, 'success').mockReturnValue();
        component.addHomebase();
        expect(component.homeBaseService.createHomebase).toBeCalledTimes(1);
        expect(component.alertService.success).toBeCalledTimes(1);
    });
    it('should not create a homebase when no location found', function () {
        var message = 'Could not find the location for provided address';
        jest.spyOn(component.alertService, 'error');
        component.addHomebase();
        expect(component.alertService.error).toHaveBeenCalledWith(message);
    });
    it('should catch validation error', function () {
        component.locationCoordinates = mockCoordinates;
        var message = 'Validation error occurred';
        var error = new MockError(400, message);
        mockHomebaseService.createHomebase.mockReturnValue(throwError(error));
        jest.spyOn(component.alertService, 'error');
        component.addHomebase();
        expect(component.alertService.error).toHaveBeenCalledWith(message);
    });
    it('should catch unknown error', function () {
        component.locationCoordinates = mockCoordinates;
        var message = 'Server Error';
        var error = new MockError(500, message);
        mockHomebaseService.createHomebase.mockReturnValue(throwError(error));
        jest.spyOn(component.alertService, 'error');
        component.addHomebase();
        expect(component.alertService.error).toHaveBeenCalledWith('Something went wrong, please try again');
    });
    it('should catch conflict error', function () {
        component.locationCoordinates = mockCoordinates;
        var message = 'The homebase with name: \'kigali\' already exists"}';
        var error = new MockError(409, message);
        mockHomebaseService.createHomebase.mockReturnValue(throwError(error));
        jest.spyOn(component.alertService, 'error');
        component.addHomebase();
        expect(component.alertService.error).toHaveBeenCalledWith(message);
    });
});
//# sourceMappingURL=add-homebase.component.spec.js.map