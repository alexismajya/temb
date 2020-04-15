import { Component } from '@angular/core';
import { TripNavComponent } from '../../trips/trip-nav/trip-nav.component';

@Component({
  selector: 'app-embassy-visits',
  templateUrl: './embassy-visits.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../trips/trip-itinerary/trip-itinerary.component.scss',
    '../airport-transfers/airport-transfers.component.scss'
  ]
})
export class EmbassyVisitsComponent extends TripNavComponent {
}
