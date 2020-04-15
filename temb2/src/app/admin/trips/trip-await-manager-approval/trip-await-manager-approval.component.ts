import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';

@Component({
  selector: 'app-trip-await-manager-approval',
  templateUrl: './trip-await-manager-approval.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../trips/trip-itinerary/trip-itinerary.component.scss',
    '../../travel/airport-transfers/airport-transfers.component.scss'
  ]
})
export class TripAwaitManagerApprovalComponent extends TripItineraryComponent {

}
