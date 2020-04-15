import { AppEventService } from './../../../shared/app-events.service';
import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AlertService } from 'src/app/shared/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { HomeBaseService } from '../../../shared/homebase.service';
import { SlackService } from '../../__services__/slack.service';
import { AddressService } from '../../__services__/address.service';
import { CountryService } from '../../__services__/country.service';
import { IChannel } from 'src/app/shared/models/channel.model';
import { NgForm } from '@angular/forms';
import { Location } from '../../../shared/location.model';
import { ICountry } from 'src/app/shared/models/country.model';
import { HomebaseHelper } from '../homebase-helper/homebase.helper';

@Component({
  selector: 'app-homebase-modal',
  templateUrl: './homebase-modal.component.html',
  styleUrls: ['./homebase-modal.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss',
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
})
export class HomebaseModalComponent implements OnInit, AfterViewInit {
  loading = false;
  lat: number;
  lng: number;
  slackChannels: IChannel[] = [];
  countryList: ICountry[] = [];
  locationCoordinates: Location = { lat: this.lat, lng: this.lng };
  countryId: number;

  @ViewChild('homebaseForm') homebaseForm: NgForm;
  @ViewChild('addressNameFormInput') addressNameInputElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<HomebaseModalComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any,
    public toastService: AlertService,
    public appEventService: AppEventService,
    public homebaseService: HomeBaseService,
    public slackService: SlackService,
    public googleMapsService: GoogleMapsService,
    public addressService: AddressService,
    public countryService: CountryService,
    public homebaseHelper: HomebaseHelper
  ) { }

  ngOnInit() {
    this.loadDefaultData();
    this.getAddress();
  }

  ngAfterViewInit() {
    this.googleMapsService
      .loadGoogleMaps(this.addressNameInputElement.nativeElement);
  }

  async loadDefaultData() {
    this.slackChannels = await this.homebaseHelper.loadDefaultProps(this.slackService.getChannels(), 'data');
    this.countryList = await this.homebaseHelper.loadDefaultProps(this.countryService.getCountries(), 'countries');
    this.getCountryId();
  }

  getCountryId() {
    const currentCountry = this.countryList.find(country => country.name === this.data.country);
    this.countryId = currentCountry.id;
    delete this.data.country;
    this.data.countryId = this.countryId;
  }

  async getAddress() {
    const response = await this.addressService.getAddressById(this.data.addressId).toPromise();
    const { address, location: { latitude, longitude } } = response;
    this.locationCoordinates = {
      lat: latitude,
      lng: longitude
    };
    this.data.address = address;
  }

  async getHomebaseCoordinates() {
    try {
      const addressInput = this.addressNameInputElement.nativeElement.value;
      const coordinates = await this.googleMapsService
        .getLocationCoordinatesFromAddress(addressInput);
      this.locationCoordinates = coordinates;
      this.data.address = addressInput;
    } catch (error) {
      this.toastService.error(error);
    }
  }

  editHomebase(form: NgForm, id: number) {
    this.loading = true;
    const updateHomebaseData = this.homebaseHelper.formatNewhomebaseObject(form.value, this.locationCoordinates);
    this.homebaseService.updateHomebase(updateHomebaseData, id).subscribe(response => {
      if (response.success) {
        this.toastService.success(response.message);
        this.appEventService.broadcast({ name: 'updateHomebaseEvent' });
        this.loading = false;
        this.closeDialog();
      }
    }, error => {
        this.loading = false;
        this.toastService.error(error.error.message);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
