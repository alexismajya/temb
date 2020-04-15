import { Component } from '@angular/core';
import { TripNavComponent } from '../../trips/trip-nav/trip-nav.component';

@Component({
  selector: 'app-airport-transfers',
  templateUrl: './airport-transfers.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../trips/trip-itinerary/trip-itinerary.component.scss',
    './airport-transfers.component.scss'
  ]
})
export class AirportTransfersComponent extends TripNavComponent {
}
