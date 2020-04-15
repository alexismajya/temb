import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeBaseService } from '../../../shared/homebase.service';
import { LocationService } from '../../../shared/locations.service';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { Location } from '../../../shared/location.model';
import { CreateRouteHelper } from './create-route.helper';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { NavMenuService } from '../../__services__/nav-menu.service';
import { NgForm } from '@angular/forms';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';

class RouteModel {
  constructor(public routeName?: string,
    public takeOffTime?: string,
    public capacity?: number,
    public marker?: string,
    public provider?: any,
    public destinationInputField?: string) { }

}

@Component({
  selector: 'app-create',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements AfterViewInit, OnInit {
  lat: number;
  lng: number;
  zoom = 14;
  destinationIsDojo = true;
  origin = { lat: this.lat, lng: this.lng };
  destination: Location = { lat: this.lat, lng: this.lng };
  destinationCoordinates: Location;
  providers: any;
  providerName: string;
  selectedProvider: string;
  model: RouteModel;
  auto = null;

  @ViewChild('createRouteForm') createRouteForm: NgForm;
  @ViewChild('destinationFormInput') destinationInputElement: ElementRef;

  mouseoverCreateButton;
  constructor(
    public googleMapsService: GoogleMapsService,
    public homebaseService: HomeBaseService,
    public locationService: LocationService,
    private routeService: RoutesInventoryService,
    public createRouteHelper: CreateRouteHelper,
    private router: Router,
    private navMenuService: NavMenuService,
    private analytics: GoogleAnalyticsService

  ) {
    this.model = new RouteModel();
    this.model.capacity = 1;
  }

  async ngOnInit() {
    const locationId = await this.getHomebaseLocationId(localStorage.getItem('HOMEBASE_NAME'));
    const location = await this.getLocation(locationId);
    const { latitude, longitude } = location;
    this.lat = latitude;
    this.lng = longitude;
  }


  async getHomebaseLocationId (homebaseName) {
    const response = await this.homebaseService.getByName(homebaseName).toPromise();
    const { locationId } = response.homebase[0];
    return locationId;
  }

  async getLocation (id) {
    const response = await this.locationService.getById(id).toPromise();
    const { location } = response;
    return location;
  }

  ngAfterViewInit() {
    this.googleMapsService
      .loadGoogleMaps(this.destinationInputElement.nativeElement);
  }

  getSelected(provider) {
    this.selectedProvider = provider;
  }

  setAuto(event) {
    this.auto = event;
  }

  async showRouteDirectionOnClick() {
    try {
      const addressInput = this.destinationInputElement.nativeElement.value;

      const coordinates = await this.googleMapsService
      .getLocationCoordinatesFromAddress(addressInput);
      this.updateRouteDisplay(coordinates);

    } catch (error) {
      this.createRouteHelper.notifyUser(['Location not found']);
    }
  }

  async updateDestinationFieldOnMarkerDrag(marker, $event) {

    const locationAddress = await this.googleMapsService
      .getLocationAddressFromCoordinates($event.coords);
    this.model.destinationInputField = locationAddress;
    this.updateRouteDisplay($event.coords);
  }

  clearDestinationCoordinates() {
    this.destinationCoordinates = null;
  }

  updateRouteDisplay(coordinates) {
    this.destination = coordinates; // update map marker
    this.destinationCoordinates = coordinates;
    this.toggleMapDisplay();
  }

  toggleMapDisplay() {
    this.destinationIsDojo = true;
    this.destinationIsDojo = false;
  }
  changeCapacityValue(methodToCall: string) {
    this.model.capacity = this.createRouteHelper[methodToCall](this.model.capacity);
  }

  async createRoute() {
    if (!this.destinationCoordinates) {
      return this.createRouteHelper.notifyUser(
        ['Click the search icon to confirm destination']
      );
    }
    const routeRequest = this.createRouteHelper.createNewRouteRequestObject(
      this.model, this.model.destinationInputField, this.destinationCoordinates, this.selectedProvider
    );

    const errors = this.createRouteHelper.validateFormEntries(routeRequest);
    if (errors.length) {
      return this.createRouteHelper.notifyUser(errors);
    }
    return this.sendRequestToServer(routeRequest);
  }

  async sendRequestToServer(data) {
    try {
      this.navMenuService.showProgress();
      data.provider.isDirectMessage = Number(data.provider.notificationChannel) === 0;
      const { provider: { email, phoneNo, notificationChannel, verified, ...newProvider } } = data;
      data.provider = newProvider;
      const response = await this.routeService.createRoute(data);
      this.navMenuService.stopProgress();
      this.createRouteHelper.notifyUser([response.message], 'success');
      this.model = null;
      this.analytics.sendEvent(eventsModel.Routes, modelActions.CREATE);
      this.router.navigate(['/admin/routes/inventory']);
    } catch (e) {
      this.navMenuService.stopProgress();
      this.createRouteHelper.notifyUser([e.error.message || 'An error occurred.']);
    }
  }
}
