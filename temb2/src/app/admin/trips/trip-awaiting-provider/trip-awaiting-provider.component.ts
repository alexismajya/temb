import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UpdateTripProviderModalComponent } from '../update-trip-provider-modal/update-trip-provider-modal.component';
import { TripRequest } from 'src/app/shared/models/trip-request.model';
import { IProviderInventory } from 'src/app/shared/models/provider.model';
import { BaseTableComponent } from '../../base-table/base-table.component';



@Component({
  selector: 'app-trip-awaiting-provider',
  templateUrl: './trip-awaiting-provider.component.html',
  styleUrls: [
    './trip-awaiting-provider.component.scss',
  ]
})
export class TripAwaitingProviderComponent extends TripItineraryComponent implements OnInit, OnDestroy {
  @Input() tripRequestType: string;
  private updateProviderDialog: MatDialogRef<UpdateTripProviderModalComponent>;
  tripProviders: IProviderInventory[] = [];
  updateTripSubscription: Subscription;

  tripTableActionButtons = ['edit-icon', 'decline-icon'];

  ngOnInit() {
    super.ngOnInit();
    this.providerService.getViableProviders()
      .subscribe(({ data }) => {
        this.tripProviders = data;
      });
    this.updateTripSubscription = this.appEventService.subscribe('updateTripInventory', () => {
      this.getTrips();
    });
  }

  getProvidersNotAssignedToThisTrip(trip: TripRequest): IProviderInventory[] {
    return this.tripProviders.filter(provider => provider.name !== trip.provider.name);
  }

  openUpdateProviderModal(trip: TripRequest) {
    const providersNotAssignedToThisTrip = this.getProvidersNotAssignedToThisTrip(trip);
    this.updateProviderDialog = this.dialog.open(UpdateTripProviderModalComponent, {
      width: '492px',
      maxHeight: '600px',
      backdropClass: 'modal-backdrop',
      data: {
        tripProviderDetails: {
          trips: this.tripRequests,
          providers: providersNotAssignedToThisTrip,
          activeTripId: trip.id
        }
      }
    });
  }

  isActionButton(elem: HTMLElement) {
    for (let i = 0; i < this.tripTableActionButtons.length; i++) {
      const btnClass = this.tripTableActionButtons[i];
      if (elem.classList.contains(btnClass)) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.updateTripSubscription.unsubscribe();
  }
}
