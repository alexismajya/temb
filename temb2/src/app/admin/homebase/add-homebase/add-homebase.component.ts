import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { HomeBaseService } from '../../../shared/homebase.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { HomebaseModel } from '../../../shared/models/homebase.model';
import { MatDialogRef } from '@angular/material';
import { IChannel } from 'src/app/shared/models/channel.model';
import { SlackService } from '../../__services__/slack.service';
import { NgForm } from '@angular/forms';
import { Location } from '../../../shared/location.model';
import { CountryService } from '../../__services__/country.service';
import { ICountry } from 'src/app/shared/models/country.model';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { HomebaseHelper } from '../homebase-helper/homebase.helper';

@Component({
  selector: 'app-add-homebase',
  templateUrl: './add-homebase.component.html',
  styleUrls: [
    './add-homebase.component.scss',
    '../../cabs/add-cab-modal/add-cab-modal.component.scss'
  ]
})
export class AddHomebaseComponent implements OnInit, AfterViewInit {
  homebase: HomebaseModel;
  lat: number;
  lng: number;
  locationCoordinates: Location = { lat: this.lat, lng: this.lng };
  loading: boolean;
  slackChannels: IChannel[] = [];
  countryList: ICountry[] = [];

  @ViewChild('addHomebaseForm') addHomebaseForm: NgForm;
  @ViewChild('addressNameFormInput') addressNameInputElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AddHomebaseComponent>,
    public homeBaseService: HomeBaseService,
    public slackService: SlackService,
    public googleMapsService: GoogleMapsService,
    public countryService: CountryService,
    private appEventService: AppEventService,
    public alertService: AlertService,
    public homebaseHelper: HomebaseHelper
  ) {
    this.homebase = new HomebaseModel();
  }

  ngOnInit() {
    this.loadDefaultData();
  }

  ngAfterViewInit() {
    this.googleMapsService.loadGoogleMaps(
      this.addressNameInputElement.nativeElement
    );
  }

  async loadDefaultData() {
    this.slackChannels = await this.homebaseHelper.loadDefaultProps(this.slackService.getChannels(), 'data');
    this.countryList = await this.homebaseHelper.loadDefaultProps(this.countryService.getCountries(), 'countries');
  }

  toggleSlackChannel(value: string) {
    this.homebase.channel = value;
  }

  toggleCountry(value: number) {
    this.homebase.countryId = value;
  }

  async handleAddressFill() {
    try {
      const addressInput = this.addressNameInputElement.nativeElement.value;
      const coordinates = await this.googleMapsService.getLocationCoordinatesFromAddress(
        addressInput
      );
      this.homebase.address = addressInput;
      this.locationCoordinates = coordinates;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  addHomebase() {
    if (!this.locationCoordinates.lat) {
      return this.alertService.error('Could not find the location for provided address');
    }
    this.loading = true;
    const newHomebaseData = this.homebaseHelper.formatNewhomebaseObject(
      this.homebase,
      this.locationCoordinates
    );
    this.homeBaseService.createHomebase(newHomebaseData).subscribe(
      response => {
        if (response.success) {
          this.alertService.success(response.message);
          this.appEventService.broadcast({ name: 'newHomebase' });
          this.dialogRef.close();
          this.loading = false;
        }
      },
      error => {
        this.logError(error);
        this.loading = false;
      }
    );
  }

  logError(error: any) {
    if (error.status === 400) {
      this.alertService.error('Validation error occurred');
    } else if (error.status === 409) {
      this.alertService.error(error.error.message);
    } else {
      this.alertService.error('Something went wrong, please try again');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
