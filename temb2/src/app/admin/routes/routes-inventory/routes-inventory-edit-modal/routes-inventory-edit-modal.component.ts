import { IEditRouteBatch } from './../../../../shared/models/route-inventory.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RoutesInventoryService } from 'src/app/admin/__services__/routes-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { UpdatePageContentService } from 'src/app/shared/update-page-content.service';
import { ProviderService } from '../../../__services__/providers.service';
import { GoogleAnalyticsService } from '../../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../../utils/analytics-helper';

@Component({
  templateUrl: './routes-inventory-edit-modal.component.html',
  styleUrls: ['./routes-inventory-edit-modal.component.scss']
})
export class RoutesInventoryEditModalComponent implements OnInit {
  public loading: boolean;
  providers: [] = [];

  constructor(
    public dialogRef: MatDialogRef<RoutesInventoryEditModalComponent>,
    public alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: IEditRouteBatch,
    public routeService: RoutesInventoryService,
    private updatePage: UpdatePageContentService,
    private providerService: ProviderService,
    private analytics: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.getProviders();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getProviders() {
    this.providerService.getProviders().subscribe((res) => {
      if (res.success) {
        this.providers = res.data.providers;
      }
    });
  }

  editRoute(data: IEditRouteBatch): void {
    this.loading = true;
    const { id, name, takeOff, capacity, batch, status } = this.data;
    const { providerId } = data;

    const routeDetails: IEditRouteBatch = { name, takeOff, providerId, capacity, batch, status };
    this.routeService.changeRouteStatus(id, routeDetails).subscribe((res) => {
      if (res.success) {
        this.updatePage.triggerSuccessUpdateActions('updateRouteInventory', res.message);
        this.analytics.sendEvent(eventsModel.Routes, modelActions.UPDATE);
        this.dialogRef.close();
      }
    }, (err: any) => {
      this.alert.error('Something went wrong');
      this.dialogRef.close();
    });
  }
}



